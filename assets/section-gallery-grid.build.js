const selectors = {
  videoContainer: ".js-gallery-grid-video-container"
};
const GalleryGrid = () => {
  function init() {
    const videoContainers = [...document.querySelectorAll(selectors.videoContainer)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    if (!videoContainers.length) {
      return;
    }
    videoContainers.forEach(function(videoContainer) {
      videoContainer.addEventListener("mouseenter", function() {
        const video = videoContainer.querySelector(".js-gallery-grid-video");
        if (!video || window.innerWidth < 1200) {
          return;
        }
        video.play();
      });
      videoContainer.addEventListener("mouseleave", function() {
        const video = videoContainer.querySelector(".js-gallery-grid-video");
        if (!video || window.innerWidth < 1200) {
          return;
        }
        video.pause();
      });
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.GalleryGrid = window.themeCore.GalleryGrid || GalleryGrid();
  window.themeCore.utils.register(window.themeCore.GalleryGrid, "gallery-grid");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
