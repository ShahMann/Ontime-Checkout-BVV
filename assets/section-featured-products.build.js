const selectors = {
  section: ".js-featured-products",
  slider: ".js-featured-products-slider",
  sliderButtonNext: ".js-swiper-button-next",
  sliderButtonPrev: ".js-swiper-button-prev",
  sliderPagination: ".js-featured-products-pagination"
};
const FeaturedProducts = () => {
  let Swiper = window.themeCore.utils.Swiper;
  function init(sectionId) {
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const slider = section.querySelector(selectors.slider);
      const buttonNext = section.querySelector(selectors.sliderButtonNext);
      const buttonPrev = section.querySelector(selectors.sliderButtonPrev);
      const pagination = section.querySelector(selectors.sliderPagination);
      const slidesPerViewDesktop = +slider.getAttribute("data-slides-in-row") || 4;
      let isDynamicBullets = slider.getAttribute("data-dynamic-pagination");
      isDynamicBullets = isDynamicBullets === "true";
      const sliderOptions = {
        grabCursor: true,
        slidesPerView: 1.16,
        pagination: {
          el: pagination,
          clickable: true,
          bulletElement: "button",
          dynamicBullets: isDynamicBullets
        },
        navigation: {
          nextEl: buttonNext,
          prevEl: buttonPrev
        },
        breakpoints: {
          481: {
            slidesPerView: 2
          },
          768: {
            slidesPerView: 3
          },
          992: {
            slidesPerView: slidesPerViewDesktop
          }
        }
      };
      new Swiper(slider, sliderOptions);
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.FeaturedProducts = window.themeCore.FeaturedProducts || FeaturedProducts();
  window.themeCore.utils.register(window.themeCore.FeaturedProducts, "featured-products");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
