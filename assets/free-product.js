// Submit both the main product and the metafield variant in one request to /cart/add.js
(function () {
  if (typeof document === 'undefined') return;

  function buildItemsPayload(form, freeId) {
    var fd = new FormData(form);
    var mainId = fd.get('id');
    var qty = fd.get('quantity') || '1';
    if (!mainId) return null;
    var data = new FormData();
    data.append('items[0][id]', String(mainId));
    data.append('items[0][quantity]', String(qty));
    if (freeId) {
      data.append('items[1][id]', String(freeId));
      data.append('items[1][quantity]', '1');
    }
    // forward line item properties if present
    fd.forEach(function (val, key) {
      if (key && key.indexOf('properties[') === 0) {
        data.append('items[0][' + key + ']', val);
      }
    });
    return data;
  }

  function submitItems(data) {
    return fetch('/cart/add.js', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin'
    }).then(function (res) {
      if (!res.ok) return res.json().then(function (j) { throw j; });
      return res.json();
    });
  }

  function updateCartCount() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        if (typeof window.updateCartCount === 'function') {
          window.updateCartCount(cart.item_count);
        }
        // Update cart count in header
        const cartCountElements = document.querySelectorAll('[data-cart-count]');
        cartCountElements.forEach(element => {
          element.textContent = cart.item_count;
          element.setAttribute('data-cart-count', cart.item_count);
        });
      })
      .catch(error => console.error('Error updating cart count:', error));
  }

  function bind(sectionEl) {
    if (!sectionEl) return;
    var form = sectionEl.querySelector('[data-js-product-form]');
    if (!form) return;
    var freeId = sectionEl && sectionEl.dataset && sectionEl.dataset.freeVariantId;
    form.addEventListener('submit', function (e) {
      // fully take over submit so theme JS doesn't double-add
      e.preventDefault();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      var payload = buildItemsPayload(form, freeId);
      if (!payload) return;

      submitItems(payload)
        .then(function (result) {
          try {
            var params = [];
            var mainId = payload.get('items[0][id]');
            var mainQty = Number(payload.get('items[0][quantity]') || 1);
            var freeIdParam = payload.get('items[1][id]');
            if (mainId) params.push({ id: Number(mainId), quantity: mainQty });
            if (freeIdParam) params.push({ id: Number(freeIdParam), quantity: 1 });
            var action = (window.themeCore && window.themeCore.CartApi && window.themeCore.CartApi.actions) ? (params.length > 1 ? window.themeCore.CartApi.actions.ADD_TO_CART_MANY : window.themeCore.CartApi.actions.ADD_TO_CART) : 'add';
            var items = Array.isArray(result && result.items) ? result.items : (result && result.id ? [result] : []);
            
            if (window.themeCore && window.themeCore.EventBus) {
              // Update cart state
              window.themeCore.EventBus.emit('cart:updated', { action: action, params: [params], items: items });
              // Refresh cart drawer
              window.themeCore.EventBus.emit('cart:drawer:refresh-and-open');
              // Force header cart update
              window.themeCore.EventBus.emit('cart:refresh');
              // Update cart count
              updateCartCount();
            }
          } catch (e) {
            console.error('Error updating cart:', e);
          }
        })
        .catch(function (err) {
          console && console.warn && console.warn('Add to cart failed', err);
        });
    });
  }

  function init() {
    // Bind on all product sections; if no free id, it still works (adds only main)
    var sections = document.querySelectorAll('[data-js-product-container]');
    if (!sections || !sections.length) return;
    sections.forEach(bind);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();


