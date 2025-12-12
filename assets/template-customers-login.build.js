const selectors = {
  recoverPasswordLink: ".js-recover-password-link",
  hideRecoverPasswordLink: ".js-hide-recover-password-link",
  recoverPasswordForm: ".js-recover-password-form",
  customerLoginForm: ".js-customer-login-form",
  resetPasswordSuccess: ".reset-password-success",
  resetSuccess: ".js-reset-success",
  loginTitle: "#login-title",
  recoverTitle: "#recover-password-title",
  showPasswordButton: ".js-show-password"
};
let cssClasses;
const CustomersLoginTemplate = () => {
  function init() {
    cssClasses = window.themeCore.utils.cssClasses;
    checkUrlHash();
    resetPasswordSuccess();
  }
  document.addEventListener("click", (event) => {
    const showPasswordButton = event.target.closest(selectors.showPasswordButton);
    if (!showPasswordButton)
      return null;
    showPasswordButton.classList.toggle("active");
    const passwordInput = showPasswordButton.previousElementSibling;
    if (!passwordInput)
      return null;
    if (passwordInput && passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  });
  document.addEventListener("click", (event) => {
    const targetRecoverPasswordLink = event.target.closest(
      selectors.recoverPasswordLink
    );
    if (!targetRecoverPasswordLink) {
      return;
    }
    event.preventDefault();
    toggleRecoverPasswordForm();
  });
  document.addEventListener("click", (event) => {
    const targetHideRecoverPasswordLink = event.target.closest(
      selectors.hideRecoverPasswordLink
    );
    if (!targetHideRecoverPasswordLink) {
      return;
    }
    event.preventDefault();
    toggleRecoverPasswordForm();
  });
  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash === "#recover") {
      toggleRecoverPasswordForm();
    }
  }
  function toggleRecoverPasswordForm() {
    const recoverPasswordForm = document.querySelector(
      selectors.recoverPasswordForm
    );
    const customerLoginForm = document.querySelector(
      selectors.customerLoginForm
    );
    const loginTitle = document.querySelector(selectors.loginTitle);
    const recoverTitle = document.querySelector(selectors.recoverTitle);
    if (!recoverPasswordForm || !customerLoginForm) {
      return;
    }
    recoverPasswordForm.classList.toggle(cssClasses.hidden);
    customerLoginForm.classList.toggle(cssClasses.hidden);
    if (recoverPasswordForm.classList.contains(cssClasses.hidden)) {
      loginTitle.focus();
    } else if (customerLoginForm.classList.contains(cssClasses.hidden)) {
      recoverTitle.focus();
    }
  }
  function resetPasswordSuccess() {
    const formState = document.querySelector(
      selectors.resetPasswordSuccess
    );
    const resetSuccess = document.querySelector(selectors.resetSuccess);
    if (!formState) {
      return;
    }
    resetSuccess.classList.remove(cssClasses.hidden);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CustomersLoginTemplate = window.themeCore.CustomersLoginTemplate || CustomersLoginTemplate();
  window.themeCore.utils.register(window.themeCore.CustomersLoginTemplate, "login-template");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
