const selectors = {
  section: ".js-cookie-bar",
  button: ".js-cookie-bar-accept"
};
const CookieBar = () => {
  const setCookie = window.themeCore.utils.setCookie;
  const getCookie = window.themeCore.utils.getCookie;
  const cssClasses = window.themeCore.utils.cssClasses;
  const delay = 6e3;
  let section;
  function init() {
    section = document.querySelector(selectors.section);
    if (!section) {
      return false;
    }
    setTimeout(show, delay);
    addEventListeners();
  }
  function setCookieBarCookie() {
    if (!section.hasAttribute("data-cookie-time")) {
      return;
    }
    let cookieTimeDay = section.dataset.cookieTime;
    let cookieTime = cookieTimeDay * 24 * 60 * 60;
    setCookie("cookie_bar", "1", {
      "max-age": cookieTime
    });
  }
  function addEventListeners() {
    section.addEventListener("click", (event) => {
      const button = event.target.closest(selectors.button);
      if (button) {
        close();
      }
    });
  }
  function close() {
    setCookieBarCookie();
    section.remove();
  }
  function show() {
    if (getCookie("cookie_bar")) {
      return;
    }
    section.classList.remove(cssClasses.hidden);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CookieBar = window.themeCore.CookieBar || CookieBar();
  window.themeCore.utils.register(window.themeCore.CookieBar, "cookie-bar");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
