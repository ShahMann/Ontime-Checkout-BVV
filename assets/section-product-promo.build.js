const selectors = {
  section: ".js-product-promo",
  buttonQuickView: ".js-product-promo-quick-view-button",
  buttonClose: ".js-product-promo-quick-view-button-close",
  main: "#MainContent"
};
const ProductPromo = () => {
  const setCookie = window.themeCore.utils.setCookie;
  const getCookie = window.themeCore.utils.getCookie;
  const cssClasses = window.themeCore.utils.cssClasses;
  const delay = 6e3;
  let section;
  let handle;
  let variantId;
  let variantsCount;
  function init() {
    section = document.querySelector(selectors.section);
    if (!section) {
      return false;
    }
    handle = section.dataset.handle;
    variantId = section.dataset.variantId;
    variantsCount = section.dataset.variantCount;
    setTimeout(showProductPromo, delay);
    addEventListeners();
  }
  function setProductPromoCookie() {
    if (!section.hasAttribute("data-cookie-time")) {
      return;
    }
    let cookieTimeDay = section.dataset.cookieTime;
    let cookieTime = cookieTimeDay * 24 * 60 * 60;
    setCookie("product_promo", "1", {
      "max-age": cookieTime
    });
  }
  function addEventListeners() {
    section.addEventListener("click", (event) => {
      if (event.target.closest(selectors.buttonQuickView)) {
        quickViewButtonHandler();
        close();
        return;
      }
      if (event.target.closest(selectors.buttonClose)) {
        close();
      }
    });
  }
  function quickViewButtonHandler() {
    variantsCount > 1 ? emitQuickViewClickEvent() : emitCartEvent();
  }
  async function emitCartEvent() {
    try {
      await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.ADD_TO_CART, {
        id: variantId,
        quantity: 1
      });
      await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART);
    } catch (error) {
      onQuantityError(error);
    }
  }
  function onQuantityError(error) {
    const CartNotificationError = window.themeCore.CartNotificationError;
    CartNotificationError.addNotification(error.description);
    CartNotificationError.open();
  }
  function emitQuickViewClickEvent() {
    const main = document.querySelector(selectors.main);
    window.themeCore.EventBus.emit("product-card:quick-view:clicked", {
      productHandle: handle,
      variant: variantId,
      showDescription: true,
      focusTarget: main
    });
  }
  function close() {
    setProductPromoCookie();
    section.remove();
  }
  function showProductPromo() {
    if (getCookie("product_promo")) {
      return;
    }
    section.classList.remove(cssClasses.hidden);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ProductPromo = window.themeCore.ProductPromo || ProductPromo();
  window.themeCore.utils.register(window.themeCore.ProductPromo, "product-promo");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
