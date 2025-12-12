const selectors = {
  popup: "password-popup",
  form: ".js-password-header-form",
  input: ".js-password-header-form",
  overlay: '[data-js-window="overlay"]'
};
const classes = {
  error: "error"
};
const PasswordHeader = () => {
  const Toggle = window.themeCore.utils.Toggle;
  function init() {
    const popup = document.getElementById(selectors.popup);
    if (!popup) {
      return;
    }
    const input = popup.querySelector(selectors.input);
    const modal = Toggle({
      toggleSelector: selectors.popup,
      elementToFocus: input,
      toggleTabIndex: false
    });
    modal.init();
    const form = popup.querySelector(selectors.form);
    const isFormHasErrors = form && form.classList.contains(classes.error);
    if (isFormHasErrors || document.querySelector(selectors.overlay)) {
      modal.open(popup);
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.PasswordHeader = window.themeCore.PasswordHeader || PasswordHeader();
  window.themeCore.utils.register(window.themeCore.PasswordHeader, "password-header");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
