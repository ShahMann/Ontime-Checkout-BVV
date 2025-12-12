const selectors = {
  blockSlider: ".js-collection-list-slider",
  paginationSlider: ".js-collection-list-slider-pagination"
};
const CollectionList = () => {
  const Swiper = window.themeCore.utils.Swiper;
  async function init(sectionId) {
    const blockSlider = [...document.querySelectorAll(selectors.blockSlider)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    if (blockSlider.length > 0) {
      blockSlider.forEach((slider) => {
        const numberColumn = slider.dataset.column;
        let isDynamicBullets = slider.getAttribute("data-dynamic-pagination");
        isDynamicBullets = isDynamicBullets === "true";
        new Swiper(slider, {
          slidesPerView: 1.22,
          pagination: {
            el: selectors.paginationSlider,
            clickable: true,
            dynamicBullets: isDynamicBullets
          },
          breakpoints: {
            767.98: {
              slidesPerView: numberColumn
            }
          }
        });
      });
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CollectionList = window.themeCore.CollectionList || CollectionList();
  window.themeCore.utils.register(window.themeCore.CollectionList, "collection-list");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
