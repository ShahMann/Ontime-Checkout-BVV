(function () {
  "use strict";

  var D1_VENDOR_NAME = "D1 MILANO";
  var D1_TOTAL_THRESHOLD_KD = 120;

  var GIFT_VARIANT_IDS = [
    "54009273483556",
    "54009270436132"
  ];

  var isSyncing = false;
  var debouncedSync;
  var originalFetch = window.fetch;

  function getRequest() {
    return originalFetch || window.fetch;
  }

  function getConfiguredGiftVariantIds() {
    var ids = [];
    var seenIds = {};

    for (var i = 0; i < GIFT_VARIANT_IDS.length; i++) {
      var variantId = String(GIFT_VARIANT_IDS[i] || "").trim();

      if (!variantId || seenIds[variantId]) {
        continue;
      }

      seenIds[variantId] = true;
      ids.push(variantId);
    }

    return ids;
  }

  function getVariantId(line) {
    if (!line) {
      return "";
    }

    return String(line.variant_id || line.id || "");
  }

  function getLineKey(line) {
    if (!line) {
      return "";
    }

    return line.key || line.id || "";
  }

  function isD1MilanoLine(line) {
    var vendor = line && line.vendor;

    if (!vendor && line && line.product) {
      vendor = line.product.vendor;
    }

    return Boolean(vendor && String(vendor).toUpperCase() === D1_VENDOR_NAME);
  }

  function isConfiguredGift(line, giftVariantIdSet) {
    return giftVariantIdSet[getVariantId(line)] === true;
  }

  function createIdSet(ids) {
    var idSet = {};

    for (var i = 0; i < ids.length; i++) {
      idSet[String(ids[i])] = true;
    }

    return idSet;
  }

  function calculateD1MilanoTotal(cart, giftVariantIdSet) {
    if (!cart || !Array.isArray(cart.items)) {
      return 0;
    }

    var total = 0;

    for (var i = 0; i < cart.items.length; i++) {
      var line = cart.items[i];

      if (!isD1MilanoLine(line) || isConfiguredGift(line, giftVariantIdSet)) {
        continue;
      }

      var linePrice = line.final_line_price || line.line_price || 0;
      total += linePrice / 100;
    }

    return total;
  }

  function findConfiguredGiftLines(cart, giftVariantIdSet) {
    var giftLines = [];

    if (!cart || !Array.isArray(cart.items)) {
      return giftLines;
    }

    for (var i = 0; i < cart.items.length; i++) {
      var line = cart.items[i];

      if (isConfiguredGift(line, giftVariantIdSet)) {
        giftLines.push(line);
      }
    }

    return giftLines;
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

  async function addGiftProducts(variantIds) {
    if (!variantIds.length) {
      return null;
    }

    var items = [];

    for (var i = 0; i < variantIds.length; i++) {
      items.push({
        id: variantIds[i],
        quantity: 1
      });
    }

    var response = await getRequest()("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: items
      })
    });

    if (!response.ok) {
      var errorData = await response.json().catch(function () {
        return { message: "Unknown error" };
      });
      throw new Error("Failed to add D1 gift products: " + JSON.stringify(errorData));
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
      throw new Error("Failed to update D1 gift products: " + JSON.stringify(errorData));
    }

    return response.json();
  }

  function updateCartCount(cart) {
    var itemCount = cart && cart.item_count ? cart.item_count : 0;

    if (typeof window.updateCartCount === "function") {
      window.updateCartCount(itemCount);
    }

    var cartCountElements = document.querySelectorAll("[data-cart-count]");

    for (var i = 0; i < cartCountElements.length; i++) {
      cartCountElements[i].textContent = itemCount;
      cartCountElements[i].setAttribute("data-cart-count", itemCount);
    }
  }

  function triggerCartRefresh() {
    if (window.themeCore && window.themeCore.EventBus) {
      window.themeCore.EventBus.emit("cart:refresh");
    }

    window.dispatchEvent(new CustomEvent("d1-free-gift:synced"));
  }

  async function syncFreeGiftWithCart() {
    if (isSyncing) {
      return;
    }

    var giftVariantIds = getConfiguredGiftVariantIds();

    if (!giftVariantIds.length) {
      return;
    }

    var giftVariantIdSet = createIdSet(giftVariantIds);

    isSyncing = true;

    try {
      var cart = await fetchCart();
      var d1TotalKd = calculateD1MilanoTotal(cart, giftVariantIdSet);
      var shouldHaveGifts = d1TotalKd > D1_TOTAL_THRESHOLD_KD;
      var giftLines = findConfiguredGiftLines(cart, giftVariantIdSet);
      var existingGiftVariantIds = {};
      var updates = [];
      var giftsToAdd = [];

      for (var i = 0; i < giftLines.length; i++) {
        var giftLine = giftLines[i];
        var giftVariantId = getVariantId(giftLine);
        var lineKey = getLineKey(giftLine);

        if (!lineKey) {
          continue;
        }

        if (!shouldHaveGifts) {
          updates.push({ id: lineKey, quantity: 0 });
          continue;
        }

        if (existingGiftVariantIds[giftVariantId]) {
          updates.push({ id: lineKey, quantity: 0 });
          continue;
        }

        existingGiftVariantIds[giftVariantId] = true;

        if (parseInt(giftLine.quantity || 1, 10) !== 1) {
          updates.push({ id: lineKey, quantity: 1 });
        }
      }

      if (shouldHaveGifts) {
        for (var giftIndex = 0; giftIndex < giftVariantIds.length; giftIndex++) {
          var configuredVariantId = giftVariantIds[giftIndex];

          if (!existingGiftVariantIds[configuredVariantId]) {
            giftsToAdd.push(configuredVariantId);
          }
        }
      }

      if (updates.length) {
        await updateCartLines(updates);
      }

      if (giftsToAdd.length) {
        await addGiftProducts(giftsToAdd);
      }

      if (updates.length || giftsToAdd.length) {
        cart = await fetchCart();
        updateCartCount(cart);
        triggerCartRefresh();
      }
    } catch (error) {
      console.error("[D1 Free Gift] Error syncing free gift:", error);
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

  debouncedSync = debounce(syncFreeGiftWithCart, 150);

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

  function setupFormHooks() {
    document.addEventListener("submit", function (event) {
      var form = event.target;

      if (!form || form.tagName !== "FORM") {
        return;
      }

      var action = form.action || "";
      var method = (form.method || "POST").toUpperCase();

      if (
        action.indexOf("/cart/add") !== -1 ||
        action.indexOf("cart/add") !== -1 ||
        (method === "POST" && form.querySelector('input[name="id"], select[name="id"]'))
      ) {
        debouncedSync();
      }
    }, true);
  }

  function setupQuantityHooks() {
    document.addEventListener("change", function (event) {
      var target = event.target;

      if (!target || target.tagName !== "INPUT") {
        return;
      }

      var className = target.className || "";

      if (
        (target.type === "number" || target.type === "text") &&
        (target.name === "quantity" || className.indexOf("quantity") !== -1)
      ) {
        debouncedSync();
      }
    }, true);

    document.addEventListener("click", function (event) {
      var button = event.target && event.target.closest("button, a");

      if (!button) {
        return;
      }

      var className = button.className || "";
      var dataAction = button.getAttribute("data-action") || button.getAttribute("data-cart-action") || "";
      var ariaLabel = button.getAttribute("aria-label") || "";

      if (
        className.indexOf("cart-quantity") !== -1 ||
        className.indexOf("quantity-button") !== -1 ||
        dataAction.indexOf("cart") !== -1 ||
        ariaLabel.toLowerCase().indexOf("quantity") !== -1
      ) {
        debouncedSync();
      }
    }, true);
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
    setupFetchHook();
    setupFormHooks();
    setupQuantityHooks();
    setupEventListeners();
    debouncedSync();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.d1FreeGiftSync = syncFreeGiftWithCart;
})();
/**
 * D1 MILANO Free Gift Auto-Add/Remove
 * 
 * Automatically adds or removes free gift products based on the total value
 * of full-price D1 MILANO products in the cart.
 * 
 * Business Rules:
 * - Only counts full-price D1 MILANO items (excludes discounted items)
 * - Tiers: 80-119 KD = Cards, 120-149 KD = Domino, 150-199 KD = Tool Kit, 200+ KD = Backgammon
 * - Below 80 KD = no free gift
 * - Only one free gift at a time, quantity always 1
 */

(function () {
  'use strict';

  // ============================================
  // Configuration
  // ============================================

  const FREE_PRODUCT_IDS = {
    cards: "52025473499428",        // D1-Ramadan Cards (80-119 KD)
    domino: "52025473564964",       // D1-Ramadan Domino (120-149 KD)
    toolkit: "52025473794340",      // D1-Tool Kit (150-199 KD)
    backgammon: "52025473630500"   // D1-RamadanBackgammon (200+ KD)
  };

  // Extra products to add when cart total > 120 KD
  const EXTRA_PRODUCT_IDS = [
    "52025473696036",
    "52025473466660"
  ];

  const VENDOR_NAME_UPPER = "D1 MILANO"; // Pre-computed uppercase for faster comparison
  const MIN_TIER_THRESHOLD = 80; // KD
  const EXTRA_PRODUCTS_THRESHOLD = 120; // KD - Add extra products when total > this
  const EXTRA_PRODUCT_IDS_LENGTH = EXTRA_PRODUCT_IDS.length; // Cache length for faster access
  
  // Cache for last sync state to avoid unnecessary operations
  var lastSyncState = {
    totalKd: null,
    expectedVariantId: null,
    hasExtraProducts: null
  };

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Determine tier based on total KD value
   * OPTIMIZED: Early returns, ordered by frequency (most common first)
   * @param {number} totalKd - Total in KD
   * @returns {string|null} - Tier name or null if below threshold
   */
  function getTierFromTotal(totalKd) {
    // Early exit for below threshold
    if (totalKd < MIN_TIER_THRESHOLD) {
      return null;
    }
    
    // Check from highest to lowest (most restrictive first)
    if (totalKd >= 200) return "backgammon";
    if (totalKd >= 150) return "toolkit";
    if (totalKd >= 120) return "domino";
    if (totalKd >= MIN_TIER_THRESHOLD) return "cards";
    
    return null;
  }

  /**
   * Get free gift variant ID for a given tier
   * @param {string} tier - Tier name
   * @returns {string|null} - Variant ID or null
   */
  function getGiftVariantIdForTier(tier) {
    if (!tier || !FREE_PRODUCT_IDS[tier]) return null;
    return FREE_PRODUCT_IDS[tier];
  }

  /**
   * Check if a line item is discounted (has compare_at_price > 0)
   * OPTIMIZED: Early exits, reduced function calls
   * 
   * NOTE: The Ajax Cart API structure may vary. Common fields:
   * - line.compare_at_price
   * - line.original_line_price vs line.final_line_price
   * - line.variant.compare_at_price
   * 
   * Adjust this function based on your actual cart JSON structure.
   * 
   * @param {Object} line - Cart line item
   * @returns {boolean} - True if item is discounted
   */
  function isLineDiscounted(line) {
    // Fast path: Check line-level compare_at_price first (most common)
    if (line.compare_at_price != null) {
      var compareAtPrice = parseFloat(line.compare_at_price);
      if (compareAtPrice > 0) {
        return true;
      }
    }
    
    // Check variant-level compare_at_price
    if (line.variant && line.variant.compare_at_price != null) {
      var variantCompareAtPrice = parseFloat(line.variant.compare_at_price);
      if (variantCompareAtPrice > 0) {
        return true;
      }
    }
    
    // Check if original_line_price differs from final_line_price (indicates discount)
    if (line.original_line_price != null && line.final_line_price != null) {
      var original = parseFloat(line.original_line_price);
      var final = parseFloat(line.final_line_price);
      if (original > final) {
        return true; // Item is discounted
      }
    }
    
    return false;
  }

  /**
   * Calculate total KD value of full-price D1 MILANO items
   * OPTIMIZED: Early exits, cached vendor check, reduced function calls
   * @param {Object} cart - Cart object from /cart.js
   * @returns {number} - Total in KD
   */
  function calculateD1MilanoFullPriceTotal(cart) {
    if (!cart || !cart.items || !Array.isArray(cart.items)) {
      return 0;
    }

    var total = 0;
    var items = cart.items;
    var itemsLength = items.length;

    // Use for loop for better performance
    for (var i = 0; i < itemsLength; i++) {
      var line = items[i];
      
      // Fast vendor check - try line.vendor first (most common case)
      var vendor = line.vendor;
      if (!vendor && line.product) {
        vendor = line.product.vendor;
      }
      if (!vendor || vendor.toUpperCase() !== VENDOR_NAME_UPPER) {
        continue; // Skip non-D1 MILANO items (fast path)
      }

      // Check if item is discounted (early exit)
      if (isLineDiscounted(line)) {
        continue; // Skip discounted items
      }

      // Add line price to total (in minor units, convert to KD)
      var linePrice = line.final_line_price || line.line_price || line.price || 0;
      total += (linePrice / 100); // Convert from fils/cents to KD
    }

    return total;
  }

  // Pre-compute Sets for O(1) lookups (optimized: direct array building)
  var FREE_PRODUCT_VARIANT_IDS_ARRAY = Object.values(FREE_PRODUCT_IDS);
  var FREE_PRODUCT_VARIANT_IDS_SET = new Set();
  var FREE_PRODUCT_VARIANT_IDS_ARRAY_LENGTH = FREE_PRODUCT_VARIANT_IDS_ARRAY.length;
  for (var freeIdx = 0; freeIdx < FREE_PRODUCT_VARIANT_IDS_ARRAY_LENGTH; freeIdx++) {
    FREE_PRODUCT_VARIANT_IDS_SET.add(String(FREE_PRODUCT_VARIANT_IDS_ARRAY[freeIdx]));
  }
  
  var EXTRA_PRODUCT_VARIANT_IDS_SET = new Set();
  for (var extraIdx = 0; extraIdx < EXTRA_PRODUCT_IDS_LENGTH; extraIdx++) {
    EXTRA_PRODUCT_VARIANT_IDS_SET.add(String(EXTRA_PRODUCT_IDS[extraIdx]));
  }

  /**
   * Find all free gift and extra product lines in a single pass
   * OPTIMIZED: Single iteration instead of two separate passes
   * @param {Object} cart - Cart object
   * @returns {Object} - {giftLines: Array, extraLines: Array}
   */
  function findGiftAndExtraLines(cart) {
    var giftLines = [];
    var extraLines = [];
    
    if (!cart || !cart.items || !Array.isArray(cart.items)) {
      return { giftLines: giftLines, extraLines: extraLines };
    }

    var items = cart.items;
    var itemsLength = items.length;

    // Single pass through items
    for (var i = 0; i < itemsLength; i++) {
      var line = items[i];
      var variantId = line.variant_id || line.id;
      if (!variantId) continue;
      
      var variantIdStr = String(variantId);
      if (FREE_PRODUCT_VARIANT_IDS_SET.has(variantIdStr)) {
        giftLines.push(line);
      } else if (EXTRA_PRODUCT_VARIANT_IDS_SET.has(variantIdStr)) {
        extraLines.push(line);
      }
    }

    return { giftLines: giftLines, extraLines: extraLines };
  }

  /**
   * Find all free gift lines in the cart (backward compatibility)
   * @param {Object} cart - Cart object
   * @returns {Array} - Array of line items that are free gifts
   */
  function findGiftLines(cart) {
    return findGiftAndExtraLines(cart).giftLines;
  }

  /**
   * Find all extra product lines in the cart (backward compatibility)
   * @param {Object} cart - Cart object
   * @returns {Array} - Array of line items that are extra products
   */
  function findExtraProductLines(cart) {
    return findGiftAndExtraLines(cart).extraLines;
  }

  // ============================================
  // Cart API Functions
  // ============================================

  /**
   * Fetch current cart state
   * OPTIMIZED: Supports request cancellation
   * @returns {Promise<Object>} - Cart object
   */
  async function fetchCart() {
    // Cancel previous request if still in flight
    if (currentAbortController) {
      currentAbortController.abort();
    }
    
    // Create new AbortController for this request
    currentAbortController = new AbortController();
    
    try {
      var response = await fetch("/cart.js", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        signal: currentAbortController.signal
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart: " + response.status);
      }

      return await response.json();
    } catch (error) {
      // Don't log abort errors (expected behavior)
      if (error.name !== "AbortError") {
        console.error("[D1 Free Gift] Error fetching cart:", error);
      }
      throw error;
    } finally {
      // Clear controller after request completes
      if (currentAbortController) {
        currentAbortController = null;
      }
    }
  }

  /**
   * Add a free gift variant to cart
   * @param {string} variantId - Variant ID (bare number, not GID)
   * @returns {Promise<Object>} - Response from /cart/add.js
   */
  async function addFreeGift(variantId) {
    try {
      var response = await fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: [{
            id: variantId,
            quantity: 1
          }]
        })
      });

      if (!response.ok) {
        var errorData = await response.json().catch(function () {
          return { message: "Unknown error" };
        });
        throw new Error("Failed to add free gift: " + JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error("[D1 Free Gift] Error adding free gift:", error);
      throw error;
    }
  }

  /**
   * Add multiple products to cart at once
   * OPTIMIZED: Uses for loop instead of map
   * @param {Array<string>} variantIds - Array of variant IDs
   * @returns {Promise<Object>} - Response from /cart/add.js
   */
  async function addMultipleProducts(variantIds) {
    try {
      // Optimized: Build items array with for loop
      var items = [];
      var variantIdsLength = variantIds.length;
      for (var i = 0; i < variantIdsLength; i++) {
        items.push({
          id: variantIds[i],
          quantity: 1
        });
      }

      var response = await fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: items
        })
      });

      if (!response.ok) {
        var errorData = await response.json().catch(function () {
          return { message: "Unknown error" };
        });
        throw new Error("Failed to add products: " + JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error("[D1 Free Gift] Error adding multiple products:", error);
      throw error;
    }
  }

  /**
   * Remove a cart line by its key
   * @param {string} lineKey - Line item key from cart
   * @returns {Promise<Object>} - Response from /cart/change.js
   */
  async function removeLineByKey(lineKey) {
    try {
      var response = await fetch("/cart/change.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: lineKey,
          quantity: 0
        })
      });

      if (!response.ok) {
        var errorData = await response.json().catch(function () {
          return { message: "Unknown error" };
        });
        throw new Error("Failed to remove line: " + JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error("[D1 Free Gift] Error removing line:", error);
      throw error;
    }
  }

  /**
   * Update quantity of a cart line
   * @param {string} lineKey - Line item key
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} - Response from /cart/change.js
   */
  async function updateLineQuantity(lineKey, quantity) {
    try {
      var response = await fetch("/cart/change.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: lineKey,
          quantity: quantity
        })
      });

      if (!response.ok) {
        var errorData = await response.json().catch(function () {
          return { message: "Unknown error" };
        });
        throw new Error("Failed to update line quantity: " + JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error("[D1 Free Gift] Error updating line quantity:", error);
      throw error;
    }
  }

  /**
   * Batch update cart items (remove or update quantities)
   * OPTIMIZED: Faster reduce operation
   * @param {Array<Object>} updates - Array of {id: lineKey, quantity: number}
   * @returns {Promise<Object>} - Response from /cart/update.js
   */
  async function batchUpdateCart(updates) {
    if (!updates || updates.length === 0) {
      return null;
    }

    try {
      // Optimized: Build updates object directly with for loop
      var updatesObj = {};
      var updatesLength = updates.length;
      for (var i = 0; i < updatesLength; i++) {
        var update = updates[i];
        updatesObj[update.id] = update.quantity;
      }

      var response = await fetch("/cart/update.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          updates: updatesObj
        })
      });

      if (!response.ok) {
        var errorData = await response.json().catch(function () {
          return { message: "Unknown error" };
        });
        throw new Error("Failed to batch update cart: " + JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error("[D1 Free Gift] Error batch updating cart:", error);
      throw error;
    }
  }

  // ============================================
  // Main Sync Function
  // ============================================

  /**
   * Main function to sync free gift with cart state
   * This function:
   * 1. Fetches current cart
   * 2. Calculates D1 MILANO full-price total
   * 3. Determines tier
   * 4. Adds/removes/updates free gift as needed
   * 
   * OPTIMIZED: Batches operations, minimizes cart fetches, early exits, prevents concurrent syncs
   */
  async function syncFreeGiftWithCart() {
    // Prevent concurrent syncs
    if (isSyncing) {
      return;
    }
    
    isSyncing = true;
    try {
      // Fetch current cart (only once at start)
      var cart = await fetchCart();

      // Calculate D1 MILANO full-price total
      var totalKd = calculateD1MilanoFullPriceTotal(cart);

      // Determine tier
      var tier = getTierFromTotal(totalKd);
      var expectedVariantId = tier ? getGiftVariantIdForTier(tier) : null;
      var hasExtraProducts = totalKd > EXTRA_PRODUCTS_THRESHOLD;

      // Early exit: Check if state matches last sync (avoid unnecessary operations)
      if (lastSyncState.totalKd === totalKd && 
          lastSyncState.expectedVariantId === expectedVariantId &&
          lastSyncState.hasExtraProducts === hasExtraProducts) {
        // State hasn't changed, but verify cart still matches (optimized: single pass)
        var linesResult = findGiftAndExtraLines(cart);
        var giftLines = linesResult.giftLines;
        var extraProductLines = linesResult.extraLines;
        
        // Quick validation: if expected gift exists and extra products match, skip
        // OPTIMIZED: Cache lengths and optimize checks
        var giftLinesLength = giftLines.length;
        var extraProductLinesLength = extraProductLines.length;
        
        if (expectedVariantId === null) {
          if (giftLinesLength === 0 && 
              (!hasExtraProducts || extraProductLinesLength === EXTRA_PRODUCT_IDS_LENGTH)) {
            isSyncing = false; // Reset flag before early return
            return; // Already in correct state
          }
        } else {
          // Optimized: Only check if exactly one gift line exists
          if (giftLinesLength === 1) {
            var checkLine = giftLines[0];
            var checkVariantId = String(checkLine.variant_id || checkLine.id);
            var expectedVariantIdStr = String(expectedVariantId);
            if (checkVariantId === expectedVariantIdStr && 
                parseInt(checkLine.quantity || 1) === 1 &&
                (!hasExtraProducts || extraProductLinesLength === EXTRA_PRODUCT_IDS_LENGTH)) {
              isSyncing = false; // Reset flag before early return
              return; // Already in correct state
            }
          }
        }
      }

      // Find existing gift lines and extra product lines (optimized: single pass)
      var linesResult = findGiftAndExtraLines(cart);
      var giftLines = linesResult.giftLines;
      var extraProductLines = linesResult.extraLines;

      // Collect all batch updates
      var batchUpdates = [];
      var itemsToAdd = [];
      var needsCartRefresh = false;

      // Handle free gift scenarios
      if (tier === null) {
        // Below 80 KD: Remove all free gifts (batch remove - optimized: for loop)
        var giftLinesLength = giftLines.length;
        if (giftLinesLength > 0) {
          for (var removeIdx = 0; removeIdx < giftLinesLength; removeIdx++) {
            var line = giftLines[removeIdx];
            var lineKey = line.key || line.id;
            if (lineKey) {
              batchUpdates.push({ id: lineKey, quantity: 0 });
            }
          }
        }
      } else {
        // Tier determined: Ensure correct gift is in cart
        var correctGiftLine = null;
        var incorrectGiftLines = [];

        // Categorize gift lines (optimized: cache string conversion)
        var expectedVariantIdStr = String(expectedVariantId);
        var giftLinesLength = giftLines.length;
        for (var giftIdx = 0; giftIdx < giftLinesLength; giftIdx++) {
          var giftLine = giftLines[giftIdx];
          var giftVariantId = String(giftLine.variant_id || giftLine.id || "");
          if (giftVariantId === expectedVariantIdStr) {
            correctGiftLine = giftLine;
          } else {
            incorrectGiftLines.push(giftLine);
          }
        }

        // Batch remove incorrect gift lines (optimized: for loop)
        var incorrectGiftLinesLength = incorrectGiftLines.length;
        for (var incorrectIdx = 0; incorrectIdx < incorrectGiftLinesLength; incorrectIdx++) {
          var incorrectLine = incorrectGiftLines[incorrectIdx];
          var incorrectLineKey = incorrectLine.key || incorrectLine.id;
          if (incorrectLineKey) {
            batchUpdates.push({ id: incorrectLineKey, quantity: 0 });
          }
        }

        // Handle correct gift line
        if (correctGiftLine) {
          // Correct gift exists, ensure quantity is 1
          var currentQuantity = parseInt(correctGiftLine.quantity || 1);
          if (currentQuantity !== 1) {
            var correctLineKey = correctGiftLine.key || correctGiftLine.id;
            if (correctLineKey) {
              batchUpdates.push({ id: correctLineKey, quantity: 1 });
            }
          }
        } else {
          // Correct gift doesn't exist, add it
          itemsToAdd.push({ id: expectedVariantId, quantity: 1 });
        }
      }

      // Handle extra products (add when total > 120 KD)
      if (totalKd > EXTRA_PRODUCTS_THRESHOLD) {
        // Check which extra products are missing using Set for O(1) lookup (optimized)
        var existingExtraVariantIdsSet = new Set();
        var extraProductLinesLength = extraProductLines.length;
        for (var extraIdx = 0; extraIdx < extraProductLinesLength; extraIdx++) {
          var extraLine = extraProductLines[extraIdx];
          var extraVariantId = extraLine.variant_id || extraLine.id;
          if (extraVariantId) {
            existingExtraVariantIdsSet.add(String(extraVariantId));
          }
        }
        
        var missingExtraProducts = [];
        var extraProductIdsLength = EXTRA_PRODUCT_IDS.length;
        for (var missingIdx = 0; missingIdx < extraProductIdsLength; missingIdx++) {
          var variantId = String(EXTRA_PRODUCT_IDS[missingIdx]);
          if (!existingExtraVariantIdsSet.has(variantId)) {
            missingExtraProducts.push(variantId);
          }
        }

        // Add missing extra products (optimized: direct array building)
        if (missingExtraProducts.length > 0) {
          var missingLength = missingExtraProducts.length;
          for (var addIdx = 0; addIdx < missingLength; addIdx++) {
            itemsToAdd.push({ id: missingExtraProducts[addIdx], quantity: 1 });
          }
          needsCartRefresh = true; // Need to refresh to get new line keys
        }

        // Ensure all extra products have quantity 1 (batch update - optimized: for loop)
        var extraProductLinesLength = extraProductLines.length;
        for (var extraUpdateIdx = 0; extraUpdateIdx < extraProductLinesLength; extraUpdateIdx++) {
          var extraLine = extraProductLines[extraUpdateIdx];
          var extraQuantity = parseInt(extraLine.quantity || 1);
          if (extraQuantity !== 1) {
            var extraLineKey = extraLine.key || extraLine.id;
            if (extraLineKey) {
              batchUpdates.push({ id: extraLineKey, quantity: 1 });
            }
          }
        }
      } else {
        // Total <= 120 KD: Remove all extra products (batch remove - optimized: for loop)
        var extraRemoveLength = extraProductLines.length;
        for (var extraRemoveIdx = 0; extraRemoveIdx < extraRemoveLength; extraRemoveIdx++) {
          var extraLineToRemove = extraProductLines[extraRemoveIdx];
          var extraLineToRemoveKey = extraLineToRemove.key || extraLineToRemove.id;
          if (extraLineToRemoveKey) {
            batchUpdates.push({ id: extraLineToRemoveKey, quantity: 0 });
          }
        }
      }

      // Execute batch operations
      if (batchUpdates.length > 0) {
        var updateResponse = await batchUpdateCart(batchUpdates);
        if (updateResponse && updateResponse.items) {
          cart = updateResponse; // Use response instead of fetching again
          needsCartRefresh = false; // Already have updated cart
        } else {
          needsCartRefresh = true;
        }
      }

      // Add items if needed (optimized: extract IDs directly)
      if (itemsToAdd.length > 0) {
        var variantIdsToAdd = [];
        var itemsToAddLength = itemsToAdd.length;
        for (var addItemIdx = 0; addItemIdx < itemsToAddLength; addItemIdx++) {
          variantIdsToAdd.push(itemsToAdd[addItemIdx].id);
        }
        var addResponse = await addMultipleProducts(variantIdsToAdd);
        if (addResponse && addResponse.items) {
          cart = addResponse; // Use response instead of fetching again
          needsCartRefresh = false; // Already have updated cart
        } else {
          needsCartRefresh = true;
        }
      }

      // Only fetch cart if we didn't get valid response from operations
      if (needsCartRefresh && (batchUpdates.length > 0 || itemsToAdd.length > 0)) {
        cart = await fetchCart();
      }

      // Update cache with current state
      lastSyncState.totalKd = totalKd;
      lastSyncState.expectedVariantId = expectedVariantId;
      lastSyncState.hasExtraProducts = hasExtraProducts;

      // Always update cart icon/count after sync
      // Use a small delay to ensure DOM is ready and cart operations are complete
      setTimeout(function () {
        updateCartCount(cart);
      }, 100);

      // Trigger cart update events for theme compatibility
      if (window.themeCore && window.themeCore.EventBus) {
        window.themeCore.EventBus.emit("cart:refresh");
      }

      // Dispatch custom event for other scripts
      if (typeof window.dispatchEvent !== "undefined") {
        window.dispatchEvent(new CustomEvent("d1-free-gift:synced"));
      }
    } catch (error) {
      console.error("[D1 Free Gift] Error syncing free gift:", error);
      // Fail gracefully - don't break the rest of the theme
      // Reset cache on error to force re-sync next time
      lastSyncState.totalKd = null;
      lastSyncState.expectedVariantId = null;
      lastSyncState.hasExtraProducts = null;
    } finally {
      isSyncing = false;
    }
  }

  // ============================================
  // Cart Icon Update
  // ============================================

  /**
   * Update cart count in the UI
   * Exact same implementation as free-collection-product.js
   * OPTIMIZED: Can accept cart object to avoid extra fetch
   * @param {Object} [cart] - Optional cart object to use instead of fetching
   */
  function updateCartCount(cart) {
    // Always fetch fresh cart to ensure accurate count
    // (cart object passed might be stale or missing item_count)
    fetch("/cart.js")
      .then(function (response) {
        return response.json();
      })
      .then(function (cartData) {
        var itemCount = cartData.item_count || 0;
        
        // Call global updateCartCount function if available
        if (typeof window.updateCartCount === "function") {
          window.updateCartCount(itemCount);
        }
        
        // Update cart count in header
        var cartCountElements = document.querySelectorAll("[data-cart-count]");
        var cartCountElementsLength = cartCountElements.length;
        for (var i = 0; i < cartCountElementsLength; i++) {
          var element = cartCountElements[i];
          element.textContent = itemCount;
          element.setAttribute("data-cart-count", itemCount);
        }
      })
      .catch(function (error) {
        console.error("[D1 Free Gift] Error updating cart count:", error);
      });
  }

  // ============================================
  // Cart Change Detection
  // ============================================

  /**
   * Debounce function to prevent too many rapid calls
   */
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

  // Debounced version of sync function (wait 150ms after last call - optimized for speed)
  var debouncedSync = debounce(syncFreeGiftWithCart, 150);
  
  // Flag to prevent concurrent syncs
  var isSyncing = false;
  
  // AbortController for canceling in-flight requests
  var currentAbortController = null;
  
  // Cache cart URL patterns for faster detection
  var CART_ADD_PATTERN = "/cart/add";
  var CART_CHANGE_PATTERN = "/cart/change";
  var CART_UPDATE_PATTERN = "/cart/update";
  var CART_JS_PATTERN = "/cart.js";

  /**
   * Hook into fetch to detect cart API calls
   * OPTIMIZED: Cached patterns, faster URL checking
   */
  var originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = function () {
      var url = arguments[0];
      var options = arguments[1] || {};
      
      // Fast path: skip if not a string
      if (typeof url !== "string") {
        return originalFetch.apply(this, arguments);
      }

      // Optimized: Check patterns directly (faster than multiple indexOf calls)
      var isCartAdd = url.indexOf(CART_ADD_PATTERN) !== -1;
      var isCartChange = url.indexOf(CART_CHANGE_PATTERN) !== -1;
      var isCartUpdate = url.indexOf(CART_UPDATE_PATTERN) !== -1;
      var isCartJs = url.indexOf(CART_JS_PATTERN) !== -1;
      var method = (options.method || "GET").toUpperCase();

      // Detect cart-related API calls
      if (isCartAdd || isCartChange || isCartUpdate || (isCartJs && method === "POST")) {
        // Call original fetch
        var fetchPromise = originalFetch.apply(this, arguments);

        // After cart operation completes, sync free gift
        fetchPromise
          .then(function (response) {
            if (response.ok) {
              // Use microtask for immediate execution after promise resolves
              Promise.resolve().then(function () {
                debouncedSync();
              });
            }
            return response;
          })
          .catch(function (error) {
            // Even on error, try to sync (cart might have changed)
            Promise.resolve().then(function () {
              debouncedSync();
            });
            throw error;
          });

        return fetchPromise;
      }

      // For non-cart requests, just call original fetch
      return originalFetch.apply(this, arguments);
    };
  }

  /**
   * Hook into form submissions (add to cart forms)
   */
  function setupFormHooks() {
    // Listen for form submissions
    document.addEventListener("submit", function (e) {
      var form = e.target;
      if (!form || form.tagName !== "FORM") return;

      // Check if this is an add-to-cart form
      var action = form.action || "";
      var method = (form.method || "POST").toUpperCase();

      if (
        (action.indexOf("/cart/add") !== -1 || action.indexOf("cart/add") !== -1) ||
        (method === "POST" && form.querySelector('input[name="id"], select[name="id"]'))
      ) {
        // This looks like an add-to-cart form - use microtask for faster execution
        Promise.resolve().then(function () {
          debouncedSync();
        });
      }
    }, true); // Use capture phase
  }

  /**
   * Hook into quantity change buttons/inputs
   */
  function setupQuantityHooks() {
    // Listen for clicks on quantity buttons
    document.addEventListener("click", function (e) {
      var target = e.target;
      var button = target.closest("button, a");
      
      if (button) {
        var className = button.className || "";
        var dataAttr = button.getAttribute("data-action") || 
                      button.getAttribute("data-cart-action") ||
                      "";

        // Check if this is a cart quantity button
        if (
          className.indexOf("cart-quantity") !== -1 ||
          className.indexOf("quantity-button") !== -1 ||
          dataAttr.indexOf("cart") !== -1 ||
          button.getAttribute("aria-label") && button.getAttribute("aria-label").toLowerCase().indexOf("quantity") !== -1
        ) {
          // Use microtask for faster execution
          Promise.resolve().then(function () {
            debouncedSync();
          });
        }
      }
    }, true);

    // Listen for quantity input changes
    document.addEventListener("change", function (e) {
      var target = e.target;
      if (target.tagName === "INPUT" && 
          (target.type === "number" || target.type === "text") &&
          (target.name === "quantity" || target.className.indexOf("quantity") !== -1)) {
        var form = target.closest("form");
        if (form && (form.action.indexOf("/cart") !== -1 || form.action.indexOf("cart") !== -1)) {
          // Use microtask for faster execution
          Promise.resolve().then(function () {
            debouncedSync();
          });
        }
      }
    }, true);
  }

  /**
   * Listen for custom cart events (theme-specific)
   */
  function setupEventListeners() {
    // Listen for theme cart events if available
    if (window.themeCore && window.themeCore.EventBus) {
      window.themeCore.EventBus.on("cart:updated", function () {
        debouncedSync();
      });
      window.themeCore.EventBus.on("cart:change", function () {
        debouncedSync();
      });
    }

    // Listen for custom events
    window.addEventListener("cart:updated", function () {
      debouncedSync();
    });
    window.addEventListener("cart:change", function () {
      debouncedSync();
    });
  }

  // ============================================
  // Initialization
  // ============================================

  /**
   * Initialize the free gift system
   */
  function init() {
    // Setup hooks
    setupFormHooks();
    setupQuantityHooks();
    setupEventListeners();

    // Sync on page load if cart exists
    fetchCart()
      .then(function (cart) {
        if (cart && cart.item_count > 0) {
          debouncedSync();
        }
      })
      .catch(function (error) {
        // Silently fail - cart might be empty or API unavailable
        console.log("[D1 Free Gift] No cart found on page load");
      });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose sync function globally for manual triggering if needed
  window.d1FreeGiftSync = syncFreeGiftWithCart;

})();
