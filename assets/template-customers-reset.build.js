const selectors = {
  showPasswordButton: ".js-show-password"
};
const CustomersResetTemplate = () => {
  function init() {
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
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CustomersResetTemplate = window.themeCore.CustomersResetTemplate || CustomersResetTemplate();
  window.themeCore.utils.register(window.themeCore.CustomersResetTemplate, "reset-template");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
