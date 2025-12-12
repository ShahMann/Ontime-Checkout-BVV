import { T as Ticker$1 } from "./ticker-2aaf4347.js";
const selectors = {
  section: ".js-ticker-container"
};
const Ticker = () => {
  function init(sectionId) {
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => Ticker$1(section).init());
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Ticker = window.themeCore.Ticker || Ticker();
  window.themeCore.utils.register(window.themeCore.Ticker, "ticker");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
