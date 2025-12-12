const selectors = {
  newsletterPopup: "NewsletterPopup",
  newsletterPopupToggle: "NewsletterPopupToggle",
  newsletterPopupFormInput: "newsletter-popup-contact-form-input",
  form: "newsletter-popup-contact-form",
  input: ".js-newsletter-popup-input"
};
const modificators = {
  posted: "posted"
};
const NewsletterPopup = () => {
  const Toggle = window.themeCore.utils.Toggle;
  const on = window.themeCore.utils.on;
  const setCookie = window.themeCore.utils.setCookie;
  const getCookie = window.themeCore.utils.getCookie;
  const cssClasses = window.themeCore.utils.cssClasses;
  let newsletterPopup;
  let form;
  let input;
  function init() {
    newsletterPopup = document.getElementById(selectors.newsletterPopup);
    form = document.getElementById(selectors.form);
    input = document.querySelector(selectors.input);
    if (!newsletterPopup || !form || !input) {
      return false;
    }
    let popupDelay = isPostedNewsletterPopup() ? 0 : 6e3;
    setTimeout(createNewsletterPopup, popupDelay);
  }
  function createNewsletterPopup() {
    let isChallengePage = window.location.pathname.includes("challenge");
    if (getCookie("newsletter_popup") || isChallengePage || window.themeCore.ageCheckPopupOpen) {
      return;
    }
    const newsletterPopupToggle = Toggle({
      toggleSelector: selectors.newsletterPopupToggle
    });
    newsletterPopupToggle.init();
    newsletterPopupToggle.open(newsletterPopup);
    on("click", newsletterPopup, function(e) {
      if (e.target == this) {
        newsletterPopupToggle.close(newsletterPopup);
      }
    });
    setEventBusListeners();
    if (isPostedNewsletterPopup()) {
      setNewsletterPopupCookie();
    }
    if (isCurrentForm()) {
      newsletterPopup.classList.add(cssClasses.current);
      input && input.focus();
    }
  }
  function setEventBusListeners() {
    window.themeCore.EventBus.listen(
      `Toggle:${selectors.newsletterPopupToggle}:close`,
      () => {
        setNewsletterPopupCookie();
      }
    );
  }
  function isPostedNewsletterPopup() {
    let newsletterPopupFormInput = document.getElementById(
      selectors.newsletterPopupFormInput
    );
    if (!newsletterPopupFormInput || !newsletterPopupFormInput.classList.contains(modificators.posted)) {
      return false;
    } else {
      return true;
    }
  }
  function setNewsletterPopupCookie() {
    if (!newsletterPopup.hasAttribute("data-cookie-time")) {
      return;
    }
    let cookieTimeDay = newsletterPopup.dataset.cookieTime;
    let cookieTime = cookieTimeDay * 24 * 60 * 60;
    setCookie("newsletter_popup", "1", {
      "max-age": cookieTime
    });
  }
  function isCurrentForm() {
    return !window.location.hash || window.location.hash === "#newsletter-popup-contact-form";
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.NewsletterPopup = window.themeCore.NewsletterPopup || NewsletterPopup();
  window.themeCore.utils.register(window.themeCore.NewsletterPopup, "newsletter-popup");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
