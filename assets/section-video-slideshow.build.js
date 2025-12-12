import { V as Video } from "./video-player-8f5c3d27.js";
import { c as cssClasses } from "./cssClasses-aee656ec.js";
const selectors = {
  section: ".js-video-slideshow",
  sliderBox: ".js-video-slideshow-slider",
  sliderItem: ".js-video-slideshow-item",
  sliderItemMedia: ".js-video-slideshow-item-media",
  sliderPagination: ".js-video-slideshow-slider-pagination",
  sliderButtonPrev: ".js-video-slideshow-slider-prev-btn",
  sliderButtonNext: ".js-video-slideshow-slider-next-btn",
  videoPopup: ".js-video-slideshow-popup",
  videoContainer: ".js-video-slideshow-container",
  videoContent: ".js-video-slideshow-media-container"
};
const attributes = {
  sectionId: "data-section-id"
};
const VideoSlideshow = () => {
  const Toggle = window.themeCore.utils.Toggle;
  const Swiper = window.themeCore.utils.Swiper;
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
          const targetPopup = event.target;
          setTimeout(() => {
            const videoContent = videoPopup.querySelector(selectors.videoContent);
            if (!videoPopup.classList.contains(cssClasses.active)) {
              videoContent.innerHTML = "";
            }
          }, 1e3);
          if (targetPopup === videoPopup) {
            videoPopupToggle.close(videoPopup);
          }
        });
      }
      return Component(componentNode);
    });
  }
  function addContentVideo() {
    const sections2 = document.querySelectorAll(selectors.section);
    sections2.forEach((section) => {
      const sectionId = document.getElementById(section.id);
      const itemsBox = sectionId.querySelectorAll(selectors.sliderItem);
      if (itemsBox.length > 0) {
        itemsBox.forEach((item) => {
          item.addEventListener("click", function() {
            const videoItemMedia = item.querySelector(selectors.sliderItemMedia);
            const videoContent = sectionId.querySelector(selectors.videoContent);
            if (videoContent && videoItemMedia) {
              if (videoContent.innerHTML !== videoItemMedia.innerHTML) {
                videoContent.innerHTML = videoItemMedia.innerHTML;
                componentsList.Video.forEach((video) => {
                  video.init();
                });
              }
            }
          });
        });
      }
    });
  }
  function init(sectionId) {
    const sliderBox = [...document.querySelectorAll(selectors.sliderBox)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    if (sliderBox.length > 0) {
      sliderBox.forEach((slider) => {
        let isDynamicBullets = slider.getAttribute("data-dynamic-pagination");
        isDynamicBullets = isDynamicBullets === "true";
        new Swiper(slider, {
          slidesPerView: 1,
          navigation: {
            nextEl: selectors.sliderButtonNext,
            prevEl: selectors.sliderButtonPrev
          },
          pagination: {
            el: selectors.sliderPagination,
            clickable: true,
            dynamicBullets: isDynamicBullets
          },
          breakpoints: {
            575.98: {
              slidesPerView: 2
            },
            991.98: {
              slidesPerView: 3
            }
          }
        });
      });
    }
    addContentVideo();
    sections = [...document.querySelectorAll(selectors.section)];
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
  window.themeCore.VideoSlideshow = window.themeCore.VideoSlideshow || VideoSlideshow();
  window.themeCore.utils.register(window.themeCore.VideoSlideshow, "video-slideshow");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
