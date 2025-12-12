import { T as Ticker } from "./ticker-2aaf4347.js";
const AnnouncementBar = () => {
  let Timer;
  const globalCssClasses = window.themeCore.utils.cssClasses;
  const selectors = {
    section: ".js-announcement-bar",
    announcementBarCloser: ".js-bar-closer",
    timer: ".js-timer",
    slider: ".js-announcement-bar-slider",
    tickerContainer: ".js-announcement-bar-ticker-container"
  };
  const Swiper = window.themeCore.utils.Swiper;
  let section = null;
  let timers = null;
  let slider = null;
  let tickerContainer = null;
  function checkIsBarAllowedToShow() {
    const sessionShowBar = JSON.parse(sessionStorage.getItem("showAnnouncementBar"));
    return sessionShowBar === null;
  }
  function closeBar(event) {
    const announcementBarCloser = event.target.closest(selectors.announcementBarCloser);
    if (!announcementBarCloser) {
      return;
    }
    sessionStorage.setItem("showAnnouncementBar", false);
    section.classList.add(globalCssClasses.hidden);
    window.themeCore.EventBus.emit("announcement-bar:changed", {});
  }
  async function initSlider(sliderEl) {
    if (!sliderEl) {
      return;
    }
    const Autoplay = await window.themeCore.utils.getExternalUtil("swiperAutoplay");
    Swiper.use([Autoplay]);
    const autoplaySpeed = sliderEl.getAttribute("data-autoplay-speed");
    const isAutoPlay = sliderEl.getAttribute("data-autoplay") === "true";
    new Swiper(sliderEl, {
      slidesPerView: 1,
      arrows: false,
      loop: true,
      navigation: {
        nextEl: ".js-announcement-swiper-button-next",
        prevEl: ".js-announcement-swiper-button-prev"
      },
      autoplay: isAutoPlay ? {
        delay: autoplaySpeed,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      } : false
    });
  }
  async function init() {
    Timer = window.themeCore.utils.Timer;
    section = document.querySelector(selectors.section);
    timers = section.querySelectorAll(selectors.timer);
    slider = section.querySelector(selectors.slider);
    tickerContainer = section.querySelector(selectors.tickerContainer);
    if (checkIsBarAllowedToShow()) {
      section.classList.remove(globalCssClasses.hidden);
      section.addEventListener("click", closeBar);
      window.themeCore.EventBus.emit("announcement-bar:changed", {});
      initSlider(slider);
      Ticker(tickerContainer).init();
      setTimeout(() => {
        timers = section.querySelectorAll(selectors.timer);
        timers.forEach(function(timerEl) {
          Timer(timerEl).init();
        });
      }, 0);
      setTimeout(() => {
        window.themeCore.EventBus.emit("announcement-bar:loaded", {});
      }, 0);
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.AnnouncementBar = window.themeCore.AnnouncementBar || AnnouncementBar();
  window.themeCore.utils.register(window.themeCore.AnnouncementBar, "announcement-bar");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
