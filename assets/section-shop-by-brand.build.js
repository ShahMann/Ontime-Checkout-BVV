const selectors = {
  section: ".js-shop-by-brand-section",
  slider: ".js-shop-by-brand-slider",
  slide: ".js-shop-by-brand-slide",
  sliderPagination: ".js-shop-by-brand-slider-pagination"
};
const breakpoints = {
  large: "(max-width: 1500px)",
  medium: "(max-width: 1200px)",
  small: "(max-width: 991px)",
  extraSmall: "(max-width: 767px)"
};
const ShopByBrand = () => {
  const Swiper = window.themeCore.utils.Swiper;
  let sections = [];
  const LARGE_SCREEN = window.matchMedia(breakpoints.large);
  const MEDIUM_SCREEN = window.matchMedia(breakpoints.medium);
  const SMALL_SCREEN = window.matchMedia(breakpoints.small);
  const EXTRA_SMALL_SCREEN = window.matchMedia(breakpoints.extraSmall);
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const slider = section.querySelector(selectors.slider);
      if (!slider)
        return;
      initSlider(slider);
    });
  }
  function initSlider(slider) {
    let swiperInstance = null;
    const slides = [...slider.querySelectorAll(selectors.slide)];
    let isDynamicBullets = slider.getAttribute("data-dynamic-pagination");
    isDynamicBullets = isDynamicBullets === "true";
    const options = {
      slidesPerView: 2,
      pagination: {
        el: selectors.sliderPagination,
        clickable: true,
        bulletElement: "button",
        dynamicBullets: isDynamicBullets
      },
      breakpoints: {
        576: {
          slidesPerView: 3
        },
        992: {
          slidesPerView: 4
        },
        1200: {
          slidesPerView: 6
        },
        1501: {
          slidesPerView: 9
        }
      }
    };
    function changeSliderStateOnBreakpoint() {
      if (EXTRA_SMALL_SCREEN.matches && slides.length > 2 || SMALL_SCREEN.matches && slides.length > 3 || MEDIUM_SCREEN.matches && slides.length > 4 || LARGE_SCREEN.matches && slides.length > 6 || !LARGE_SCREEN.matches && slides.length > 9) {
        if (!swiperInstance)
          swiperInstance = new Swiper(slider, options);
      } else {
        if (!swiperInstance)
          return;
        swiperInstance.destroy();
        swiperInstance = null;
        slider.classList.remove("swiper-backface-hidden");
      }
    }
    window.addEventListener("resize", changeSliderStateOnBreakpoint);
    changeSliderStateOnBreakpoint();
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ShopByBrand = window.themeCore.ShopByBrand || ShopByBrand();
  window.themeCore.utils.register(window.themeCore.ShopByBrand, "shop-by-brand");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
