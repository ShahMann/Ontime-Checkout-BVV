const CollectionTemplate = () => {
  const selectors = {
    section: ".js-collection",
    gridViewButton: ".js-grid-view-btn",
    gridViewButtons: ".js-grid-view-buttons",
    grid: ".js-grid-wrapper"
  };
  async function init() {
    const ProductFilters = await window.themeCore.utils.getExternalUtil("ProductFilters");
    const section = document.querySelector(selectors.section);
    const gridViewButtons = [...document.querySelectorAll(selectors.gridViewButton)];
    ProductFilters(section).init();
    if (gridViewButtons.length > 0) {
      initGridViewButtons(gridViewButtons);
    }
  }
  function initGridViewButtons(gridButtons) {
    const productsGrid = document.querySelector(selectors.grid);
    const customerGridView = localStorage.getItem("collection-grid-cols");
    const gridViewButtonsWrappers = document.querySelectorAll(selectors.gridViewButtons);
    const defaultButtons = document.querySelectorAll('.js-grid-view-btn[data-grid-cols="4"]');
    if (customerGridView) {
      const activeButtons = [...document.querySelectorAll(`.js-grid-view-btn[data-grid-cols="${customerGridView}"]`)];
      productsGrid.setAttribute("data-grid-col", customerGridView);
      [...defaultButtons].forEach((defaultButton) => defaultButton.classList.remove("is-active"));
      activeButtons.forEach((activeButton) => activeButton.classList.add("is-active"));
    }
    productsGrid.classList.remove("collection__items-hide-on-load");
    [...gridViewButtonsWrappers].forEach((gridViewButtonsWrapper) => gridViewButtonsWrapper.classList.add("animated"));
    gridButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        const gridView = button.getAttribute("data-grid-cols");
        if (button.classList.contains("is-active")) {
          return;
        }
        const currentActive = [...gridButtons].filter((el) => el.classList.contains("is-active"));
        const newActive = [...gridButtons].filter((el) => el.getAttribute("data-grid-cols") === gridView);
        [...currentActive].forEach((el) => el.classList.remove("is-active"));
        [...newActive].forEach((el) => el.classList.add("is-active"));
        productsGrid.setAttribute("data-grid-col", gridView);
        if (gridView === "3") {
          localStorage.setItem("collection-grid-cols", gridView);
        } else if (gridView === "2") {
          localStorage.setItem("collection-grid-cols", gridView);
        } else {
          localStorage.removeItem("collection-grid-cols");
        }
      });
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CollectionTemplate = window.themeCore.CollectionTemplate || CollectionTemplate();
  window.themeCore.utils.register(window.themeCore.CollectionTemplate, "collection-body");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
