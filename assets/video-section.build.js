import { V as Video } from "./video-player-8f5c3d27.js";
const selectors = {
  section: ".js-video-section",
  videoContainer: ".js-video-container",
  videoPopup: ".js-video-popup"
};
const attributes = {
  sectionId: "data-section-id"
};
const VideoSectionPlayer = () => {
  const Toggle = window.themeCore.utils.Toggle;
  let sections = [];
  let componentsList = {};
  function createComponents(Component, selector) {
    return sections.filter((section) => section.querySelector(selector)).map((section) => {
      const componentNode = section.querySelector(selector);
      const sectionId = section.getAttribute(attributes.sectionId);
      const videoPopup = section.querySelector(selectors.videoPopup);
      if (videoPopup) {
        const videoPopupToggle = Toggle({
          toggleSelector: `video-${sectionId}`
        });
        videoPopupToggle.init();
        videoPopup.addEventListener("click", (event) => {
          if (event.target === videoPopup) {
            videoPopupToggle.close(videoPopup);
          }
        });
      }
      return Component(componentNode);
    });
  }
  function init(sectionId) {
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
  window.themeCore.VideoSectionPlayer = window.themeCore.VideoSectionPlayer || VideoSectionPlayer();
  window.themeCore.utils.register(window.themeCore.VideoSectionPlayer, "video");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
