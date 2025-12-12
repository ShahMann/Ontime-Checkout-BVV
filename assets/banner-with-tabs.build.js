import { i as initVideos, v as vimeoDisableTabIndexHandler, s as setIntersectionObserver, p as playVideo, a as pauseVideo } from "./videoBackrground-cfecd0c0.js";
function Video(videoContainer) {
  const config = {
    videoContainer,
    options: {
      youtube: {
        autoplay: 0,
        controls: 0,
        showinfo: 0,
        rel: 0,
        playsinline: 1,
        loop: 1
      },
      vimeo: {
        controls: false,
        loop: true,
        muted: true,
        portrait: false,
        title: false,
        keyboard: false,
        byline: false,
        autopause: false
      }
    }
  };
  async function init() {
    const videos = await initVideos(config);
    if (videos && videos.length) {
      vimeoDisableTabIndexHandler(videos);
      videos.forEach((video) => setIntersectionObserver(video));
    }
  }
  return Object.freeze({
    init
  });
}
const selectors = {
  section: ".js-banner-with-tabs-container",
  tabButton: ".js-tab-button",
  buttonsWrapper: ".js-banner-with-tabs-buttons-wrapper",
  mediaContainer: ".js-media-container",
  video: ".js-banner-with-tabs-video"
};
const cssClasses = {
  activeTab: "banner-with-tabs__button--active",
  hidden: "is-hidden"
};
function BannerWithTabs() {
  function init(sectionId) {
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const tabButtons = section.querySelectorAll(selectors.tabButton);
      const mediaContainers = section.querySelectorAll(selectors.mediaContainer);
      const buttonsWrapper = section.querySelector(selectors.buttonsWrapper);
      if (mediaContainers && mediaContainers.length) {
        mediaContainers.forEach((container) => Video(container).init());
      }
      tabButtons == null ? void 0 : tabButtons.forEach((button, tabIndex) => {
        button.addEventListener("click", (e) => {
          const newActiveOffset = button.offsetLeft - 16;
          buttonsWrapper == null ? void 0 : buttonsWrapper.scrollTo({
            left: newActiveOffset,
            behavior: "smooth"
          });
          tabButtons.forEach((btn) => {
            const isActive = e.target === btn;
            btn.classList.toggle(cssClasses.activeTab, isActive);
          });
          mediaContainers.forEach((container, mediaIndex) => {
            const config = {
              videoContainer: container,
              options: {
                youtube: {
                  autoplay: 0,
                  controls: 0,
                  showinfo: 0,
                  rel: 0,
                  playsinline: 1,
                  loop: 1
                },
                vimeo: {
                  controls: false,
                  loop: true,
                  muted: true,
                  portrait: false,
                  title: false,
                  keyboard: false,
                  byline: false,
                  autopause: false
                }
              }
            };
            const isActive = tabIndex === mediaIndex;
            const videos = initVideos(config);
            videos.then((videos2) => {
              if (videos2 && videos2.length) {
                videos2.forEach(({ player, type }) => {
                  isActive ? playVideo(player, type) : pauseVideo(player, type);
                });
              }
            }).catch((error) => console.error("Error:", error));
            container.classList.toggle(cssClasses.hidden, !isActive);
          });
        });
      });
    });
  }
  return Object.freeze({
    init
  });
}
const action = () => {
  window.themeCore.BannerWithTabs = window.themeCore.BannerWithTabs || BannerWithTabs();
  window.themeCore.utils.register(window.themeCore.BannerWithTabs, "banner-with-tabs");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
