const selectors = {
  ageCheckPopup: "age-check-popup",
  ageCheckPopupToggle: "AgeCheckPopupToggle",
  confirmButton: ".js-age-check-popup-confirm"
};
const AgeCheckPopup = () => {
  const Toggle = window.themeCore.utils.Toggle;
  const on = window.themeCore.utils.on;
  const setCookie = window.themeCore.utils.setCookie;
  const getCookie = window.themeCore.utils.getCookie;
  let ageCheckPopup;
  let redirectURL;
  let ageCheckPopupToggle;
  let preventRedirect;
  function init() {
    ageCheckPopup = document.getElementById(selectors.ageCheckPopup);
    if (!ageCheckPopup) {
      return;
    }
    redirectURL = ageCheckPopup.getAttribute("data-redirect-url");
    showAgeCheckPopup();
    setEventListeners();
  }
  function showAgeCheckPopup() {
    if (getCookie("age_check_popup")) {
      return;
    }
    ageCheckPopupToggle = Toggle({
      toggleSelector: selectors.ageCheckPopupToggle
    });
    window.themeCore.ageCheckPopupOpen = true;
    ageCheckPopupToggle.init();
    document.body.classList.add("blur-content");
    ageCheckPopupToggle.open(ageCheckPopup);
    on("click", ageCheckPopup, function(e) {
      if (e.target == this) {
        ageCheckPopupToggle.close(ageCheckPopup);
      }
    });
    window.themeCore.EventBus.listen(`Toggle:${selectors.ageCheckPopupToggle}:close`, () => {
      if (!preventRedirect) {
        // window.location.href = redirectURL;
      }
    });
    on("keyup", (event) => {
      if (event.keyCode === 27) {
        if (!preventRedirect) {
          // window.location.href = redirectURL;
        }
      }
    });
  }
  function setEventListeners() {
    const confirmButton = document.querySelector(selectors.confirmButton);
    if (!confirmButton) {
      return;
    }
    confirmButton.addEventListener("click", function() {
      setPopupCookie();
      document.body.classList.remove("blur-content");
      preventRedirect = true;
      ageCheckPopupToggle.close(ageCheckPopup);
    });
  }
  function setPopupCookie() {
    if (!ageCheckPopup.hasAttribute("data-cookie-time")) {
      return;
    }
    let cookieTimeDay = ageCheckPopup.dataset.cookieTime;
    let cookieTime = cookieTimeDay * 24 * 60 * 60;
    setCookie("age_check_popup", "1", {
      "max-age": cookieTime
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.AgeCheckPopup = window.themeCore.AgeCheckPopup || AgeCheckPopup();
  window.themeCore.utils.register(window.themeCore.AgeCheckPopup, "age-check-popup");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
