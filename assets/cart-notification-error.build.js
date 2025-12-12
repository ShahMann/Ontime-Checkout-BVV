const CartNotificationError = () => {
  let cssClasses;
  let on;
  let trapFocus;
  let classes;
  const selectors = {
    component: ".js-cart-notification-error",
    content: ".js-cart-notification-content",
    heading: ".js-notification-error-heading",
    close: "[data-notification-close]",
    modal: ".js-cart-notification-modal"
  };
  let component = null;
  let content = null;
  let heading = null;
  let modal = null;
  let isOpen = false;
  function init() {
    cssClasses = window.themeCore.utils.cssClasses;
    on = window.themeCore.utils.on;
    trapFocus = window.themeCore.utils.trapFocus;
    classes = {
      ...cssClasses
    };
    component = document.querySelector(selectors.component);
    if (!component) {
      return;
    }
    content = component.querySelector(selectors.content);
    heading = component.querySelector(selectors.heading);
    modal = component.querySelector(selectors.modal);
    initEventListeners();
  }
  function showNotification() {
    if (!component) {
      return;
    }
    modal.focus();
    trapFocus(modal);
    component.classList.add(classes.active);
    isOpen = true;
    window.themeCore.EventBus.emit("cart-notification:open", { modal });
  }
  function hideNotification() {
    if (!component) {
      return;
    }
    component.classList.remove(classes.active);
    isOpen = false;
  }
  function addNotification(html, headingContent = window.themeCore.translations.get("cart.notifications.error")) {
    if (!content || !html) {
      return false;
    }
    content.innerHTML = html;
    heading.innerHTML = headingContent;
    return true;
  }
  function isNotificationShowed() {
    return isOpen;
  }
  function initEventListeners() {
    on("click", component, onCloseButtonClick);
    on("click", onBodyClick);
  }
  function onCloseButtonClick(event) {
    const close = event.target.closest(selectors.close);
    if (!close) {
      return;
    }
    event.preventDefault();
    hideNotification();
  }
  function onBodyClick(event) {
    const target = event.target;
    if (target !== modal && !target.closest(selectors.modal)) {
      hideNotification();
    }
  }
  return Object.freeze({
    init,
    open: showNotification,
    close: hideNotification,
    addNotification,
    isOpen: isNotificationShowed
  });
};
const action = () => {
  window.themeCore.CartNotificationError = window.themeCore.CartNotificationError || CartNotificationError();
  window.themeCore.utils.register(window.themeCore.CartNotificationError, "cart-notification-error");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
