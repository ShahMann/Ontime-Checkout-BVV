const selectors = {
  section: ".js-benefits-section",
  slider: ".js-benefits-slider",
  slide: ".js-benefits-slide",
  sliderPagination: ".js-benefits-slider-pagination"
};
const breakpoints = {
  extraSmall: "(max-width: 767px)"
};
const classes = {
  noIndent: "benefits--no-indent"
};
const Benefits = () => {
  const Swiper = window.themeCore.utils.Swiper;
  let sections = [];
  const EXTRA_SMALL_SCREEN = window.matchMedia(breakpoints.extraSmall);
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const slider = section.querySelector(selectors.slider);
      if (!slider)
        return;
      initSlider(section, slider);
    });
  }
  function initSlider(section, slider) {
    let swiperInstance = null;
    const slides = [...slider.querySelectorAll(selectors.slide)];
    const options = {
      slidesPerView: 1,
      spaceBetween: section.classList.contains(classes.noIndent) ? 0 : 16,
      pagination: {
        el: selectors.sliderPagination,
        clickable: true,
        bulletElement: "button"
      }
    };
    function changeSliderStateOnBreakpoint() {
      if (EXTRA_SMALL_SCREEN.matches && slides.length > 1) {
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
  window.themeCore.Benefits = window.themeCore.Benefits || Benefits();
  window.themeCore.utils.register(window.themeCore.Benefits, "benefits");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
