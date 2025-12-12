const selectors = {
  container: ".js-cards-grid"
};
const CardsGrid = () => {
  let Slider;
  let sections = [];
  const sliderOptions = {
    slidesPerView: 1.1,
    spaceBetween: 16,
    breakpoints: {
      575.98: {
        slidesPerView: 2
      }
    }
  };
  async function init(sectionId) {
    Slider = await window.themeCore.utils.getExternalUtil(
      "FeaturedContentSlider"
    );
    sections = [...document.querySelectorAll(selectors.container)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      let isDynamicBullets = section.getAttribute("data-dynamic-pagination");
      isDynamicBullets = isDynamicBullets === "true";
      Slider(section, sliderOptions, "767.98px", false, isDynamicBullets).init();
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CardsGrid = window.themeCore.CardsGrid || CardsGrid();
  window.themeCore.utils.register(window.themeCore.CardsGrid, "cards-grid");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
