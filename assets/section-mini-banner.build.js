import { V as Video } from "./banner-video-4cb5d217.js";
const selectors = {
  section: ".js-mini-banner",
  videoContainer: ".js-videos"
};
const MiniBanner = () => {
  let sections = [];
  let componentsList = {};
  function createComponents(Component, selector) {
    return sections.flatMap((section) => {
      const componentsNodes = section.querySelectorAll(selector);
      return Array.from(componentsNodes, (componentNode) => Component(componentNode));
    });
  }
  async function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    componentsList = {
      Video: createComponents(Video, selectors.videoContainer)
    };
    for (const list in componentsList) {
      componentsList[list].forEach((component) => component.init());
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.MiniBanner = window.themeCore.MiniBanner || MiniBanner();
  window.themeCore.utils.register(window.themeCore.MiniBanner, "mini-banner");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
