const selectors = {
  section: ".js-collection-list-3",
  slider: ".js-collection-list-3-slider",
  pagination: ".js-collection-list-3-pagination",
  prevButton: ".js-collection-list-slider-prev-btn",
  nextButton: ".js-collection-list-slider-next-btn"
};
const CollectionList = () => {
  const Swiper = window.themeCore.utils.Swiper;
  async function init(sectionId) {
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const slider = section.querySelector(selectors.slider);
      const pagination = section.querySelector(selectors.pagination);
      let isDynamicBullets = slider.getAttribute("data-dynamic-pagination");
      isDynamicBullets = isDynamicBullets === "true";
      const sliderOptions = {
        slidesPerView: 1.16,
        breakpoints: {
          768: {
            slidesPerView: 4
          },
          1200: {
            slidesPerView: 6
          }
        },
        pagination: {
          el: pagination,
          clickable: true,
          bulletElement: "button",
          dynamicBullets: isDynamicBullets
        },
        navigation: {
          prevEl: section.querySelector(selectors.prevButton),
          nextEl: section.querySelector(selectors.nextButton)
        },
        spaceBetween: 16
      };
      new Swiper(slider, sliderOptions);
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CollectionList3 = window.themeCore.CollectionList3 || CollectionList();
  window.themeCore.utils.register(window.themeCore.CollectionList3, "collection-list-3");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
