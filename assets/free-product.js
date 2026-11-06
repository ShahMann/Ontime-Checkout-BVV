// Submit both the main product and the metafield variant in one request to /cart/add.js
(function () {
  if (typeof document === "undefined") return;

  function buildItemsPayloadFromVariant(variantId, quantity, properties, freeId, shouldAddFree, tags) {
    if (!variantId) return null;
    var data = new FormData();
    data.append("items[0][id]", String(variantId));
    data.append("items[0][quantity]", String(quantity || "1"));
    if (freeId && shouldAddFree) {
      data.append("items[1][id]", String(freeId));
      data.append("items[1][quantity]", "1");
    }
    if (properties) {
      Object.keys(properties).forEach(function (key) {
        if (key && key.indexOf("properties[") === 0) {
          data.append('items[0][' + key + ']', properties[key]);
        }
      });
    }
    if (tags) {
      data.append("items[0][properties[_tags]]", String(tags));
    }
    return data;
  }

  function buildItemsPayload(form, freeId, shouldAddFree, tags) {
    var fd = new FormData(form);
    var mainId = fd.get("id");
    var qty = fd.get("quantity") || "1";
    if (!mainId) return null;
    var data = new FormData();
    data.append("items[0][id]", String(mainId));
    data.append("items[0][quantity]", String(qty));
    if (freeId && shouldAddFree) {
      data.append("items[1][id]", String(freeId));
      data.append("items[1][quantity]", "1");
    }
    fd.forEach(function (val, key) {
      if (key && key.indexOf("properties[") === 0) {
        data.append('items[0][' + key + ']', val);
      }
    });
    if (tags) {
      data.append("items[0][properties[_tags]]", String(tags));
    }
    return data;
  }

  /**
   * Evaluates GWP eligibility from collection-based rules.
   * Rule 1: 1 DICI Watch (tag "Watches") → add GWP once.
   * Rule 2: 2+ non-Watch DICI items (J&A/Bags) in cart (including this add) → add GWP once.
   * Universal: Only 1 GWP ever in cart (checked via checkIfAnyFreeProductInCart).
   */
  function evaluateGWPEligibility(cart, currentProduct) {
    var freeId = currentProduct.freeId || null;
    var vendor = (currentProduct.vendor || "").toUpperCase();
    if (!freeId || vendor !== "DICI") {
      return Promise.resolve({ shouldAddFree: false, freeId: freeId });
    }
    return checkIfAnyFreeProductInCart().then(function (anyFreeInCart) {
      if (anyFreeInCart) {
        return { shouldAddFree: false, freeId: freeId };
      }
      var tags = currentProduct.tags || "";
      var quantity = parseInt(currentProduct.quantity, 10) || 1;
      // Rule 1: DICI Watch (has "Watches" tag) → add GWP
      if (tags.indexOf("Watches") !== -1) {
        return { shouldAddFree: true, freeId: freeId };
      }
      // Rule 2: Non-Watch DICI → need 2+ qualifying items (cart + this add)
      var nonWatchDiciQty = 0;
      if (cart.items && Array.isArray(cart.items)) {
        cart.items.forEach(function (item) {
          if (item.vendor !== "DICI") return;
          var itemTags = (item.properties && item.properties._tags) ? String(item.properties._tags) : "";
          if (itemTags.indexOf("Watches") !== -1) return;
          nonWatchDiciQty += item.quantity || 0;
        });
      }
      var totalAfterAdd = nonWatchDiciQty + quantity;
      return {
        shouldAddFree: totalAfterAdd >= 2,
        freeId: freeId,
      };
    });
  }

  function checkIfFreeItemInCart(freeId) {
    return fetch("/cart.js")
      .then((response) => response.json())
      .then((cart) => {
        if (!cart.items || !Array.isArray(cart.items)) return false;
        return cart.items.some(
          (item) => String(item.variant_id) === String(freeId),
        );
      })
      .catch((error) => {
        console.error("Error checking cart:", error);
        return false;
      });
  }

  function checkIfAnyFreeProductInCart() {
    return fetch("/cart.js")
      .then((response) => response.json())
      .then((cart) => {
        if (!cart.items || !Array.isArray(cart.items)) return false;
        var knownFreeProductIds = [];
        var productSections = document.querySelectorAll("[data-js-product-container]");
        productSections.forEach(function(section) {
          var freeId = section.dataset && section.dataset.freeCollectionProductVariantId;
          if (freeId) knownFreeProductIds.push(String(freeId));
        });
        var productCards = document.querySelectorAll(".product-card[data-free-collection-product-variant-id]");
        productCards.forEach(function(card) {
          var freeId = card.dataset && card.dataset.freeCollectionProductVariantId;
          if (freeId) knownFreeProductIds.push(String(freeId));
        });
        var quickViews = document.querySelectorAll(".js-quick-view[data-free-collection-product-variant-id]");
        quickViews.forEach(function(quickView) {
          var freeId = quickView.dataset && quickView.dataset.freeCollectionProductVariantId;
          if (freeId) knownFreeProductIds.push(String(freeId));
        });
        if (window.freeProductVariantIds && Array.isArray(window.freeProductVariantIds)) {
          knownFreeProductIds = knownFreeProductIds.concat(
            window.freeProductVariantIds.map(function(id) { return String(id); })
          );
        }
        knownFreeProductIds = knownFreeProductIds.filter(function(id, index) {
          return knownFreeProductIds.indexOf(id) === index;
        });
        return cart.items.some(function(item) {
          return knownFreeProductIds.some(function(freeId) {
            return String(item.variant_id) === String(freeId);
          });
        });
      })
      .catch((error) => {
        console.error("[DICI] Error checking for free products in cart:", error);
        return false;
      });
  }

  function submitItems(data) {
    return fetch("/cart/add.js", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    }).then(function (res) {
      if (!res.ok)
        return res.json().then(function (j) { throw j; });
      return res.json();
    });
  }

  function updateCartCount() {
    fetch("/cart.js")
      .then((response) => response.json())
      .then((cart) => {
        if (typeof window.updateCartCount === "function") {
          window.updateCartCount(cart.item_count);
        }
        document.querySelectorAll("[data-cart-count]").forEach((element) => {
          element.textContent = cart.item_count;
          element.setAttribute("data-cart-count", cart.item_count);
        });
      })
      .catch((error) => console.error("Error updating cart count:", error));
  }

  function handleCartSuccess(result) {
    try {
      var params = [];
      var mainId = result && result.items && result.items[0] ? result.items[0].variant_id : result && result.id;
      var mainQty = result && result.items && result.items[0] ? result.items[0].quantity : 1;
      var finalFreeId = result && result.items && result.items[1] ? result.items[1].variant_id : null;
      if (mainId) params.push({ id: Number(mainId), quantity: mainQty });
      if (finalFreeId) params.push({ id: Number(finalFreeId), quantity: 1 });
      var action = window.themeCore && window.themeCore.CartApi && window.themeCore.CartApi.actions
        ? params.length > 1 ? window.themeCore.CartApi.actions.ADD_TO_CART_MANY : window.themeCore.CartApi.actions.ADD_TO_CART
        : "add";
      var items = Array.isArray(result && result.items) ? result.items : result && result.id ? [result] : [];
      if (window.themeCore && window.themeCore.EventBus) {
        window.themeCore.EventBus.emit("cart:updated", { action: action, params: [params], items: items });
        window.themeCore.EventBus.emit("cart:drawer:refresh-and-open");
        window.themeCore.EventBus.emit("cart:refresh");
        updateCartCount();
      }
    } catch (e) {
      console.error("[DICI] Error handling cart success:", e);
    }
  }

  function bind(sectionEl) {
    if (!sectionEl) return;
    var form = sectionEl.querySelector("[data-js-product-form]");
    if (!form) return;
    var freeId = sectionEl && sectionEl.dataset && sectionEl.dataset.freeCollectionProductVariantId;
    var productTags = (sectionEl.dataset && sectionEl.dataset.productTags) || "";
    var vendor = (sectionEl.dataset && sectionEl.dataset.vendor) || "DICI";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      var formQty = (new FormData(form)).get("quantity") || "1";
      fetch("/cart.js")
        .then(function (res) { return res.json(); })
        .then(function (cart) {
          return evaluateGWPEligibility(cart, { vendor: vendor, tags: productTags, quantity: formQty, freeId: freeId });
        })
        .then(function (eligibility) {
          var payload = buildItemsPayload(form, eligibility.freeId, eligibility.shouldAddFree, productTags);
          if (!payload) return null;
          var freeIdParam = payload.get("items[1][id]");
          var checkPromise = freeIdParam ? checkIfFreeItemInCart(freeIdParam) : Promise.resolve(false);
          return checkPromise.then(function (freeItemExists) {
            if (freeItemExists && freeIdParam) {
              var fd = new FormData(form);
              var mainId = fd.get("id");
              var qty = fd.get("quantity") || "1";
              var newPayload = new FormData();
              newPayload.append("items[0][id]", String(mainId));
              newPayload.append("items[0][quantity]", String(qty));
              fd.forEach(function (val, key) {
                if (key && key.indexOf("properties[") === 0) newPayload.append("items[0][" + key + "]", val);
              });
              if (productTags) newPayload.append("items[0][properties[_tags]]", String(productTags));
              return submitItems(newPayload);
            }
            return submitItems(payload);
          });
        })
        .then(function (result) { if (result) handleCartSuccess(result); })
        .catch(function (err) { console && console.warn && console.warn("Add to cart failed", err); });
    });
  }

  function handleQuickViewForm(e) {
    var form = e.target.closest(".js-quick-view-form");
    if (!form) return;
    var quickViewContainer = form.closest(".js-quick-view");
    var vendor = quickViewContainer && quickViewContainer.dataset && quickViewContainer.dataset.vendor;
    if (vendor && vendor.toUpperCase() !== "DICI") return;
    var variantSelect = form.querySelector('select[name="id"], input[name="id"]');
    if (!variantSelect) return;
    var variantId = variantSelect.value;
    if (!variantId) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    var quantityInput = form.querySelector('[name="quantity"], [data-quantity-input]');
    var quantity = quantityInput ? (quantityInput.value || "1") : "1";
    var properties = {};
    var formData = new FormData(form);
    formData.forEach(function (val, key) {
      if (key && key.indexOf("properties[") === 0) properties[key] = val;
    });
    var freeId = quickViewContainer && quickViewContainer.dataset && quickViewContainer.dataset.freeCollectionProductVariantId;
    var productTags = (quickViewContainer && quickViewContainer.dataset && quickViewContainer.dataset.productTags) || "";
    if (!properties["properties[_tags]"]) properties["properties[_tags]"] = productTags;

    fetch("/cart.js")
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        return evaluateGWPEligibility(cart, { vendor: vendor, tags: productTags, quantity: quantity, freeId: freeId });
      })
      .then(function (eligibility) {
        var payload = buildItemsPayloadFromVariant(variantId, quantity, properties, eligibility.freeId, eligibility.shouldAddFree, productTags);
        if (!payload) return null;
        var freeIdParam = payload.get("items[1][id]");
        var checkPromise = freeIdParam ? checkIfFreeItemInCart(freeIdParam) : Promise.resolve(false);
        return checkPromise.then(function (freeItemExists) {
          if (freeItemExists && freeIdParam) {
            payload = buildItemsPayloadFromVariant(variantId, quantity, properties, null, false, productTags);
          }
          return submitItems(payload);
        });
      })
      .then(function (result) {
        if (result) {
          handleCartSuccess(result);
          if (window.themeCore && window.themeCore.EventBus) {
            window.themeCore.EventBus.emit("Toggle:quick-view:close");
            window.themeCore.EventBus.emit("Overlay:quick-view:close");
          }
        }
      })
      .catch(function (err) { console.error("[DICI] Quick view cart error", err); });
  }

  function handleProductCardButton(e) {
    var button = e.target.closest(".js-product-card-quick-view-button");
    if (!button) return;
    var productCard = button.closest(".product-card, [data-product-card]");
    var vendor = productCard && productCard.dataset && productCard.dataset.vendor;
    if (vendor && vendor.toUpperCase() !== "DICI") return;
    var variantId = button.getAttribute("data-variant");
    if (!variantId) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    var productCard2 = button.closest(".product-card, [data-product-card]");
    var minQuantityInput = productCard2 ? productCard2.querySelector(".js-product-card-min-value") : null;
    var quantity = minQuantityInput ? minQuantityInput.value : (button.getAttribute("data-min-quantity") || "1");
    var properties = {};
    if (button.hasAttribute("hide-store-credit")) properties["properties[__cart_type]"] = "web";
    var freeId = (productCard && productCard.dataset && productCard.dataset.freeCollectionProductVariantId) || null;
    var productTags = (productCard && productCard.dataset && productCard.dataset.productTags) || "";
    if (productTags && !properties["properties[_tags]"]) properties["properties[_tags]"] = productTags;

    fetch("/cart.js")
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        return evaluateGWPEligibility(cart, { vendor: vendor, tags: productTags, quantity: quantity, freeId: freeId });
      })
      .then(function (eligibility) {
        var payload = buildItemsPayloadFromVariant(variantId, quantity, properties, eligibility.freeId, eligibility.shouldAddFree, productTags);
        if (!payload) return null;
        var freeIdParam = payload.get("items[1][id]");
        var checkPromise = freeIdParam ? checkIfFreeItemInCart(freeIdParam) : Promise.resolve(false);
        return checkPromise.then(function (freeItemExists) {
          if (freeItemExists && freeIdParam) {
            payload = buildItemsPayloadFromVariant(variantId, quantity, properties, null, false, productTags);
          }
          return submitItems(payload);
        });
      })
      .then(function (result) { if (result) handleCartSuccess(result); })
      .catch(function (err) { console.error("[DICI] Product card cart error", err); });
  }

  function init() {
    document.querySelectorAll("[data-js-product-container]").forEach(bind);
    document.addEventListener("submit", handleQuickViewForm, true);
    document.addEventListener("click", handleProductCardButton, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();