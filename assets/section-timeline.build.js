const Timeline = () => {
  const selectors = {
    section: ".js-timeline",
    slider: ".js-timeline-slider",
    slide: ".js-timeline-slide",
    sliderButtonPrev: ".js-timeline-slider-button-prev",
    sliderButtonNext: ".js-timeline-slider-button-next",
    contentItem: ".js-timeline-content-item",
    slideHeading: ".js-timeline-slide-heading"
  };
  const breakpoints = {
    large: "(max-width: 1500.98px)",
    medium: "(max-width: 1199.98px)",
    extraSmall: "(max-width: 767.98px)",
    smallTabletPortrait: "(max-width: 575.98px)"
  };
  const classes = {
    ...window.themeCore.utils.cssClasses,
    activeSlide: "timeline__slide--active",
    activeContent: "timeline__item--visible"
  };
  const Swiper = window.themeCore.utils.Swiper;
  let sections = [];
  const LARGE_SCREEN = window.matchMedia(breakpoints.large);
  const MEDIUM_SCREEN = window.matchMedia(breakpoints.medium);
  const EXTRA_SMALL_SCREEN = window.matchMedia(breakpoints.extraSmall);
  const SMALL_TABLET_PORTRAIT_SCREEN = window.matchMedia(breakpoints.smallTabletPortrait);
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
    const contentItems = [...section.querySelectorAll(selectors.contentItem)];
    const sliderButtonPrev = slider.querySelector(selectors.sliderButtonPrev);
    const sliderButtonNext = slider.querySelector(selectors.sliderButtonNext);
    const activeSlideIndex = slides.findIndex((slide) => slide.dataset.isActive === "true");
    const options = {
      initialSlide: activeSlideIndex !== -1 ? activeSlideIndex : Math.ceil(slides.length / 2) || 1,
      slidesPerView: 1.5,
      spaceBetween: 32,
      centeredSlides: true,
      navigation: {
        nextEl: sliderButtonNext,
        prevEl: sliderButtonPrev
      },
      on: {
        init: () => {
          slider.addEventListener("click", (event) => changeActiveSlide(event, swiperInstance));
          adjustNavigationButtonsPosition(slider, slides, sliderButtonPrev, sliderButtonNext);
        },
        resize: () => {
          adjustNavigationButtonsPosition(slider, slides, sliderButtonPrev, sliderButtonNext);
        },
        slideChange: function() {
          updateActiveBlock(contentItems, this.activeIndex, classes.activeContent);
          updateActiveBlock(slides, this.activeIndex, classes.activeSlide);
        }
      },
      breakpoints: {
        374: { slidesPerView: 1.8 },
        576: { slidesPerView: 2.5 },
        768: { slidesPerView: 3.2 },
        1200: { slidesPerView: 2.1 },
        1501: { slidesPerView: 2.1 }
      }
    };
    function changeSliderStateOnBreakpoint(options2) {
      if (SMALL_TABLET_PORTRAIT_SCREEN.matches && slides.length > 1 || EXTRA_SMALL_SCREEN.matches && slides.length > 2 || MEDIUM_SCREEN.matches && slides.length > 3 || LARGE_SCREEN.matches && slides.length > 2 || !LARGE_SCREEN.matches && slides.length > 2) {
        if (!swiperInstance)
          swiperInstance = new Swiper(slider, options2);
      } else {
        slider.addEventListener("click", (event) => changeActiveTab(event, contentItems, slides));
        if (!swiperInstance)
          return;
        swiperInstance.destroy();
        swiperInstance = null;
        slider.classList.remove("swiper-backface-hidden");
        toggleSliderButtons(sliderButtonPrev, sliderButtonNext, true);
      }
    }
    changeSliderStateOnBreakpoint(options);
    window.addEventListener("resize", () => changeSliderStateOnBreakpoint(options));
  }
  function changeActiveSlide(event, swiperInstance) {
    const targetSlide = event.target.closest(selectors.slide);
    if (!targetSlide || !swiperInstance)
      return;
    swiperInstance.slideTo(+targetSlide.dataset.index);
  }
  function changeActiveTab(event, contentItems, slides) {
    const targetSlide = event.target.closest(selectors.slide);
    if (!targetSlide)
      return;
    updateActiveBlock(contentItems, +targetSlide.dataset.index, classes.activeContent);
    updateActiveBlock(slides, +targetSlide.dataset.index, classes.activeSlide);
  }
  function adjustNavigationButtonsPosition(slider, slides, sliderButtonPrev, sliderButtonNext) {
    const maxSlideContentWidth = slides.reduce((maxWidth, slide) => {
      var _a;
      const slideWidth = ((_a = slide.querySelector(selectors.slideHeading)) == null ? void 0 : _a.offsetWidth) || 0;
      return Math.max(maxWidth, slideWidth);
    }, 0);
    const additionalSliderButtonSpacing = LARGE_SCREEN.matches ? 32 : 50;
    if (!maxSlideContentWidth)
      return;
    const sliderButtonPosition = window.innerWidth / 2 - parseInt(maxSlideContentWidth) / 2;
    sliderButtonPrev.style.insetInlineStart = `${sliderButtonPosition - additionalSliderButtonSpacing}px`;
    sliderButtonNext.style.insetInlineEnd = `${sliderButtonPosition - additionalSliderButtonSpacing}px`;
    toggleSliderButtons(sliderButtonPrev, sliderButtonNext, false);
  }
  function toggleSliderButtons(sliderButtonPrev, sliderButtonNext, flag) {
    sliderButtonPrev.classList.toggle(classes.hidden, flag);
    sliderButtonNext.classList.toggle(classes.hidden, flag);
  }
  function updateActiveBlock(items, slideIndex, className) {
    items.forEach((item, index) => {
      item.classList.toggle(className, index === slideIndex);
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Timeline = window.themeCore.Timeline || Timeline();
  window.themeCore.utils.register(window.themeCore.Timeline, "timeline");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
