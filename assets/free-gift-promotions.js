(function () {
  "use strict";

  // "Spend X, pick a free gift" widget, supporting two promotion types.
  // Config (thresholds, gift variant IDs, etc.) is rendered server-side
  // into a JSON script tag by snippets/free-gift-promotions.liquid
  // (rendered inside sections/cart-template.liquid) - nothing is hardcoded
  // here, so adding/editing promotions is a theme-editor-only change
  // (Vendor promotion / Collection promotion blocks on the Cart section):
  //  - "vendor": vendor's full-price $ subtotal vs. up to 3 tiers.
  //  - "collection": full-price item QUANTITY from a collection vs. a
  //    single threshold (e.g. "Buy 2 Watches, Get 1 Free").
  //
  // This script has two jobs:
  //  1. Atomically swap the cart's gift line when the customer clicks a
  //     different option (remove old, then add new - never both at once).
  //  2. Passively re-sync after ANY cart mutation (quantity change, add,
  //     remove) - both to remove a gift line that fell out of eligibility,
  //     AND to repaint the widget when the eligible pool itself changes
  //     (e.g. a quantity bump crosses a new threshold) even if nothing
  //     needed removing.
  //
  // The widget lives inside cart-template's own .js-cart-content, so the
  // theme's existing cart refresh pipeline (assets/cart-*.js, which listens
  // for the "cart:refresh"/"cart:updated" events emitted below) repaints it
  // automatically - this script doesn't need its own refresh mechanism.

  var isSyncing = false;
  var debouncedSync;
  var originalFetch = window.fetch;

  function getRequest() {
    return originalFetch || window.fetch;
  }

  function getWidgetEl() {
    return document.querySelector(".js-free-gift-promotions");
  }

  function getConfig() {
    var widget = getWidgetEl();

    if (!widget) {
      return null;
    }

    var configEl = widget.querySelector(".js-free-gift-config");

    if (!configEl) {
      return null;
    }

    try {
      return { promotions: JSON.parse(configEl.textContent || "[]") };
    } catch (error) {
      return null;
    }
  }

  function flattenAllVariantIds(promotions) {
    var ids = [];

    for (var i = 0; i < promotions.length; i++) {
      var promotion = promotions[i];

      if (promotion.type === "vendor") {
        var tiers = promotion.tiers || [];

        for (var j = 0; j < tiers.length; j++) {
          ids = ids.concat(tiers[j].variantIds || []);
        }
      } else if (promotion.type === "collection") {
        ids = ids.concat(promotion.variantIds || []);
      }
    }

    return ids;
  }

  function createIdSet(ids) {
    var idSet = {};

    for (var i = 0; i < ids.length; i++) {
      idSet[String(ids[i])] = true;
    }

    return idSet;
  }

  function getVariantId(line) {
    if (!line) {
      return "";
    }

    return String(line.variant_id || line.id || "");
  }

  function getProductId(line) {
    if (!line) {
      return "";
    }

    return String(line.product_id || "");
  }

  function getLineKey(line) {
    if (!line) {
      return "";
    }

    return line.key || line.id || "";
  }

  function isVendorLine(line, vendorName) {
    var lineVendor = line && line.vendor;

    if (!lineVendor && line && line.product) {
      lineVendor = line.product.vendor;
    }

    return Boolean(vendorName && lineVendor && String(lineVendor).toUpperCase() === String(vendorName).toUpperCase());
  }

  function isLineDiscounted(line) {
    if (line.compare_at_price != null && parseFloat(line.compare_at_price) > 0) {
      return true;
    }

    if (line.variant && line.variant.compare_at_price != null && parseFloat(line.variant.compare_at_price) > 0) {
      return true;
    }

    if (line.original_line_price != null && line.final_line_price != null) {
      if (parseFloat(line.original_line_price) > parseFloat(line.final_line_price)) {
        return true;
      }
    }

    return false;
  }

  function calculateVendorFullPriceTotal(cart, vendorName, allGiftVariantIdSet) {
    if (!cart || !Array.isArray(cart.items)) {
      return 0;
    }

    var total = 0;

    for (var i = 0; i < cart.items.length; i++) {
      var line = cart.items[i];

      if (!isVendorLine(line, vendorName) || allGiftVariantIdSet[getVariantId(line)] || isLineDiscounted(line)) {
        continue;
      }

      total += (line.final_line_price || line.line_price || 0) / 100;
    }

    return total;
  }

  function calculateCollectionFullPriceQuantity(cart, qualifyingProductIdSet, allGiftVariantIdSet) {
    if (!cart || !Array.isArray(cart.items)) {
      return 0;
    }

    var quantity = 0;

    for (var i = 0; i < cart.items.length; i++) {
      var line = cart.items[i];

      if (!qualifyingProductIdSet[getProductId(line)] || allGiftVariantIdSet[getVariantId(line)] || isLineDiscounted(line)) {
        continue;
      }

      quantity += line.quantity || 0;
    }

    return quantity;
  }

  function computeEligibleVariantIdSet(cart, config) {
    var allGiftVariantIdSet = createIdSet(flattenAllVariantIds(config.promotions));
    var eligible = {};

    for (var i = 0; i < config.promotions.length; i++) {
      var promotion = config.promotions[i];

      if (promotion.type === "vendor") {
        var total = calculateVendorFullPriceTotal(cart, promotion.name, allGiftVariantIdSet);
        var qualifyingTier = null;
        var tiers = promotion.tiers || [];

        for (var j = 0; j < tiers.length; j++) {
          if (total >= tiers[j].threshold) {
            qualifyingTier = tiers[j];
          }
        }

        if (qualifyingTier) {
          var tierVariantIds = qualifyingTier.variantIds || [];

          for (var k = 0; k < tierVariantIds.length; k++) {
            eligible[String(tierVariantIds[k])] = true;
          }
        }
      } else if (promotion.type === "collection") {
        var qualifyingProductIdSet = createIdSet(promotion.qualifyingProductIds || []);
        var quantity = calculateCollectionFullPriceQuantity(cart, qualifyingProductIdSet, allGiftVariantIdSet);

        if (quantity >= promotion.quantityThreshold) {
          var collectionVariantIds = promotion.variantIds || [];

          for (var m = 0; m < collectionVariantIds.length; m++) {
            eligible[String(collectionVariantIds[m])] = true;
          }
        }
      }
    }

    return eligible;
  }

  async function fetchCart() {
    var response = await getRequest()("/cart.js", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart: " + response.status);
    }

    return response.json();
  }

  async function updateCartLines(updates) {
    if (!updates.length) {
      return null;
    }

    var updatesObject = {};

    for (var i = 0; i < updates.length; i++) {
      updatesObject[updates[i].id] = updates[i].quantity;
    }

    var response = await getRequest()("/cart/update.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        updates: updatesObject
      })
    });

    if (!response.ok) {
      var errorData = await response.json().catch(function () {
        return { message: "Unknown error" };
      });
      throw new Error("Failed to update free gift line(s): " + JSON.stringify(errorData));
    }

    return response.json();
  }

  async function addToCart(variantId, quantity) {
    var response = await getRequest()("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: [{ id: variantId, quantity: quantity }]
      })
    });

    if (!response.ok) {
      var errorData = await response.json().catch(function () {
        return { message: "Unknown error" };
      });
      throw new Error("Failed to add free gift: " + JSON.stringify(errorData));
    }

    return response.json();
  }

  function triggerCartRefresh() {
    if (window.themeCore && window.themeCore.EventBus) {
      window.themeCore.EventBus.emit("cart:refresh");
    }

    window.dispatchEvent(new CustomEvent("free-gift-promotions:synced"));
  }

  async function syncFreeGiftWidget() {
    if (isSyncing) {
      return;
    }

    var config = getConfig();

    if (!config || !config.promotions.length) {
      return;
    }

    isSyncing = true;

    try {
      var allGiftVariantIdSet = createIdSet(flattenAllVariantIds(config.promotions));
      var cart = await fetchCart();
      var eligibleSet = computeEligibleVariantIdSet(cart, config);
      var updates = [];

      for (var i = 0; i < cart.items.length; i++) {
        var line = cart.items[i];
        var variantId = getVariantId(line);
        var lineKey = getLineKey(line);

        if (!lineKey || !allGiftVariantIdSet[variantId] || eligibleSet[variantId]) {
          continue;
        }

        updates.push({ id: lineKey, quantity: 0 });
      }

      if (updates.length) {
        await updateCartLines(updates);
      }

      // Always trigger a refresh: the eligible product pool can change (a
      // vendor crosses a threshold, or drops out of one) even when there's
      // no stale gift line to remove - e.g. bumping a line item's quantity.
      // cart-template's own pipeline (listening for this event) repaints
      // the whole .js-cart-content, including this widget.
      triggerCartRefresh();
    } catch (error) {
      console.error("[Free Gift Promotions] Error syncing widget:", error);
    } finally {
      isSyncing = false;
    }
  }

  async function selectGift(newVariantId) {
    if (isSyncing) {
      return;
    }

    var config = getConfig();

    if (!config) {
      return;
    }

    isSyncing = true;

    try {
      var allGiftVariantIdSet = createIdSet(flattenAllVariantIds(config.promotions));
      var cart = await fetchCart();
      var updates = [];

      for (var i = 0; i < cart.items.length; i++) {
        var line = cart.items[i];
        var variantId = getVariantId(line);
        var lineKey = getLineKey(line);

        if (!lineKey || !allGiftVariantIdSet[variantId] || variantId === String(newVariantId)) {
          continue;
        }

        updates.push({ id: lineKey, quantity: 0 });
      }

      if (updates.length) {
        await updateCartLines(updates);
      }

      await addToCart(newVariantId, 1);
      triggerCartRefresh();
    } catch (error) {
      console.error("[Free Gift Promotions] Error selecting gift:", error);
    } finally {
      isSyncing = false;
    }
  }

  function debounce(func, wait) {
    var timeout;

    return function () {
      var context = this;
      var args = arguments;

      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }

  debouncedSync = debounce(syncFreeGiftWidget, 150);

  function setupSelectClickHandler() {
    document.addEventListener("click", function (event) {
      var button = event.target && event.target.closest(".js-free-gift-select");

      if (!button || button.disabled) {
        return;
      }

      var variantId = button.getAttribute("data-variant-id");

      if (!variantId) {
        return;
      }

      selectGift(variantId);
    });
  }

  function showPaginationPage(optionsEl, page) {
    var totalPages = parseInt(optionsEl.getAttribute("data-total-pages") || "1", 10);
    var clampedPage = Math.max(0, Math.min(page, totalPages - 1));

    optionsEl.setAttribute("data-current-page", String(clampedPage));

    var cards = optionsEl.querySelectorAll("[data-free-gift-page]");

    for (var i = 0; i < cards.length; i++) {
      var cardPage = parseInt(cards[i].getAttribute("data-free-gift-page") || "0", 10);
      cards[i].classList.toggle("is-hidden", cardPage !== clampedPage);
    }

    var widget = optionsEl.closest(".js-free-gift-promotions");

    if (!widget) {
      return;
    }

    var indicator = widget.querySelector(".js-free-gift-page-indicator");

    if (indicator) {
      indicator.textContent = (clampedPage + 1) + " / " + totalPages;
    }

    var prevButton = widget.querySelector(".js-free-gift-prev");
    var nextButton = widget.querySelector(".js-free-gift-next");

    if (prevButton) {
      prevButton.disabled = clampedPage === 0;
    }

    if (nextButton) {
      nextButton.disabled = clampedPage >= totalPages - 1;
    }
  }

  function setupPaginationClickHandler() {
    document.addEventListener("click", function (event) {
      var prevButton = event.target && event.target.closest(".js-free-gift-prev");
      var nextButton = event.target && event.target.closest(".js-free-gift-next");
      var button = prevButton || nextButton;

      if (!button || button.disabled) {
        return;
      }

      var widget = button.closest(".js-free-gift-promotions");
      var optionsEl = widget && widget.querySelector(".free-gift-promotions__options");

      if (!optionsEl) {
        return;
      }

      var currentPage = parseInt(optionsEl.getAttribute("data-current-page") || "0", 10);

      showPaginationPage(optionsEl, prevButton ? currentPage - 1 : currentPage + 1);
    });
  }

  function setupFetchHook() {
    if (!originalFetch) {
      return;
    }

    window.fetch = function () {
      var url = arguments[0];
      var options = arguments[1] || {};

      if (typeof url !== "string") {
        return originalFetch.apply(this, arguments);
      }

      var method = (options.method || "GET").toUpperCase();
      var isCartMutation =
        url.indexOf("/cart/add") !== -1 ||
        url.indexOf("/cart/change") !== -1 ||
        url.indexOf("/cart/update") !== -1 ||
        (url.indexOf("/cart.js") !== -1 && method === "POST");

      var fetchPromise = originalFetch.apply(this, arguments);

      if (isCartMutation) {
        fetchPromise
          .then(function (response) {
            if (response.ok) {
              debouncedSync();
            }
          })
          .catch(function () {
            debouncedSync();
          });
      }

      return fetchPromise;
    };
  }

  function setupEventListeners() {
    if (window.themeCore && window.themeCore.EventBus) {
      window.themeCore.EventBus.on("cart:updated", debouncedSync);
      window.themeCore.EventBus.on("cart:change", debouncedSync);
    }

    window.addEventListener("cart:updated", debouncedSync);
    window.addEventListener("cart:change", debouncedSync);
  }

  function init() {
    setupSelectClickHandler();
    setupPaginationClickHandler();
    setupFetchHook();
    setupEventListeners();

    if (getWidgetEl()) {
      debouncedSync();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.freeGiftPromotionsSync = syncFreeGiftWidget;
})();
