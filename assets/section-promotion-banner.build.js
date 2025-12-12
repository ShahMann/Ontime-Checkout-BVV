const selectors = {
  promoBanner: ".js-promotion-banner",
  promoBannerCloseButton: ".js-promotion-banner-close-button",
  productsPopup: "promotion-products-popup",
  productsPopupToggle: "promotion-products-popup-toggle",
  cartNotification: ".js-cart-notification",
  main: "#MainContent"
};
const ProductPromoBanner = () => {
  const setCookie = window.themeCore.utils.setCookie;
  const getCookie = window.themeCore.utils.getCookie;
  const cssClasses = window.themeCore.utils.cssClasses;
  const delay = 3e3;
  const Toggle = window.themeCore.utils.Toggle;
  let promoBanner;
  let productsPopup;
  function init() {
    promoBanner = document.querySelector(selectors.promoBanner);
    productsPopup = document.getElementById("promotion-products-popup");
    if (!promoBanner) {
      return false;
    }
    setTimeout(showPromoBanner, delay);
    addEventListeners();
    if (productsPopup) {
      initPromoProductsPopup();
    }
  }
  function setProductPromoCookie() {
    if (!promoBanner.hasAttribute("data-cookie-time")) {
      return;
    }
    let cookieTimeDay = promoBanner.dataset.cookieTime;
    let cookieTime = cookieTimeDay * 24 * 60 * 60;
    setCookie("promo_banner", "1", {
      "max-age": cookieTime
    });
  }
  function addEventListeners() {
    let promoBannerCloseButton = promoBanner.querySelector(selectors.promoBannerCloseButton);
    promoBannerCloseButton.addEventListener("click", () => {
      close();
    });
  }
  function close() {
    setProductPromoCookie();
    promoBanner.remove();
    promoBanner = null;
    if (productsPopup) {
      productsPopup.remove();
      productsPopup = null;
    }
  }
  function showPromoBanner() {
    if (getCookie("promo_banner")) {
      return;
    }
    promoBanner.classList.add(cssClasses.active);
  }
  function initPromoProductsPopup() {
    const productsPopupToggle = Toggle({
      toggleSelector: selectors.productsPopupToggle
    });
    let isPopupWasOpen = false;
    productsPopupToggle.init();
    window.themeCore.EventBus.listen("Toggle:promotion-products-popup-toggle:open", function() {
      if (isPopupWasOpen) {
        return;
      }
      productsPopup.classList.add("is-loaded-once");
      isPopupWasOpen = true;
    });
    window.themeCore.EventBus.listen("Quick-view:close", function() {
      const cartDrawer = document.getElementById("CartDrawer");
      const cartNotification = document.querySelector(selectors.cartNotification);
      if (!cartDrawer || !promoBanner) {
        return;
      }
      if (!cartDrawer.classList.contains(cssClasses.active) && promoBanner.classList.contains(cssClasses.active)) {
        setTimeout(() => {
          if (cartNotification && cartNotification.classList.contains(cssClasses.active)) {
            return;
          }
          productsPopupToggle.open(productsPopup);
        }, 800);
      }
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ProductPromoBanner = window.themeCore.ProductPromoBanner || ProductPromoBanner();
  window.themeCore.utils.register(window.themeCore.ProductPromoBanner, "promotion-banner");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
