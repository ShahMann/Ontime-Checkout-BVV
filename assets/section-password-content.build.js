const PasswordContentForm = (section) => {
  const cssClasses = window.themeCore.utils.cssClasses;
  const selectors2 = {
    form: ".js-password-content-form",
    input: ".js-password-content-input"
  };
  function init() {
    const form = section.querySelector(selectors2.form);
    const input = section.querySelector(selectors2.input);
    if (form && isCurrentForm(form)) {
      section.classList.add(cssClasses.current);
      input.focus();
    }
  }
  function isCurrentForm(form) {
    return window.location.hash === "#" + form.id;
  }
  return Object.freeze({
    init
  });
};
const selectors = {
  section: ".js-password-content"
};
const PasswordContent = () => {
  function init(sectionId) {
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => PasswordContentForm(section).init());
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.PasswordContent = window.themeCore.PasswordContent || PasswordContent();
  window.themeCore.utils.register(window.themeCore.PasswordContent, "password-content");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
