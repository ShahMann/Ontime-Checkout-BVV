const SearchTemplate = () => {
  const cssClasses = {
    ...window.themeCore.utils.cssClasses,
    animated: "animated"
  };
  const attributes = {
    searchType: "data-search-type",
    gridCol: "data-grid-cols",
    type: "data-type"
  };
  const selectors = {
    section: ".js-search",
    tabButton: `[${attributes.searchType}]`,
    resultCounter: ".js-search-result-counter",
    reset: ".js-search-reset",
    input: ".js-search-input",
    gridViewButton: ".js-grid-view-btn",
    gridViewButtons: ".js-grid-view-buttons",
    grid: ".js-grid-wrapper",
    typesWrapper: ".js-search-types-wrapper"
  };
  async function init() {
    const ProductFilters = await window.themeCore.utils.getExternalUtil(
      "ProductFilters"
    );
    const section = document.querySelector(selectors.section);
    ProductFilters(section).init();
    const input = section.querySelector(selectors.input);
    await initButtons(section);
    window.themeCore.EventBus.listen("compare-products:init", () => {
      const url = new URL(window.location.href);
      const type = url.searchParams.get("type");
      const tabButtons = section.querySelectorAll(selectors.tabButton);
      tabButtons.forEach((tabButton) => {
        const buttonType = tabButton.getAttribute(attributes.searchType);
        tabButton.classList.toggle(cssClasses.active, buttonType === type);
      });
      const grid = section.querySelector(selectors.grid);
      if (grid) {
        grid.setAttribute(attributes.type, type);
      }
      initButtons(section);
    });
    section.addEventListener("click", (event) => {
      const reset = event.target.closest(selectors.reset);
      if (!reset || !input) {
        return;
      }
      event.preventDefault();
      input.value = "";
    });
    const gridViewButtons = [...section.querySelectorAll(selectors.gridViewButton)];
    if (gridViewButtons.length > 0) {
      initGridViewButtons(gridViewButtons);
    }
    section.classList.add(cssClasses.animated);
  }
  async function initButtons(section) {
    let url = new URL(window.location.href);
    url.searchParams.set("view", "count");
    const tabButtons = section.querySelectorAll(selectors.tabButton);
    const currentButton = [...tabButtons].find((button) => button.classList.contains(cssClasses.active));
    if (currentButton) {
      const buttonsWrapper = currentButton.closest(selectors.typesWrapper);
      const newActiveOffset = currentButton.offsetLeft - 16;
      buttonsWrapper.scrollTo({
        left: newActiveOffset,
        behavior: "smooth"
      });
    }
    let allResults = 0;
    for (const tabButton of tabButtons) {
      const type = tabButton.getAttribute(attributes.searchType);
      if (type !== "product") {
        const query = url.searchParams.get("q");
        url = new URL(url.origin + url.pathname);
        url.searchParams.set("view", "count");
        url.searchParams.set("q", query);
      }
      url.searchParams.set("type", type);
      try {
        const res = await fetch(url.toString());
        const data = await res.text();
        tabButton.setAttribute("data-items-count", data);
        tabButton.innerText = window.themeCore.translations.get(`sections.search_template.${type}s`, { count: data });
        allResults += +data;
      } catch (e) {
        console.log(e);
      }
    }
    const resultCounter = section.querySelector(selectors.resultCounter);
    if (resultCounter) {
      resultCounter.innerText = window.themeCore.translations.get(`general.search.results_with_count.${allResults === 1 ? "one" : "other"}`, {
        count: allResults,
        terms: url.searchParams.get("q")
      });
    }
  }
  function initGridViewButtons(gridButtons) {
    const productsGrid = document.querySelector(selectors.grid);
    const customerGridView = localStorage.getItem("search-grid-cols");
    const gridViewButtonsWrappers = document.querySelectorAll(selectors.gridViewButtons);
    const defaultButtons = document.querySelectorAll('.js-grid-view-btn[data-grid-cols="4"]');
    if (customerGridView) {
      const activeButtons = [...document.querySelectorAll(`.js-grid-view-btn[data-grid-cols="${customerGridView}"]`)];
      productsGrid.setAttribute(attributes.gridCol, customerGridView);
      [...defaultButtons].forEach((defaultButton) => defaultButton.classList.remove(cssClasses.active));
      activeButtons.forEach((activeButton) => activeButton.classList.add(cssClasses.active));
    }
    [...gridViewButtonsWrappers].forEach((gridViewButtonsWrapper) => gridViewButtonsWrapper.classList.add("animated"));
    gridButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        const gridView = button.getAttribute(attributes.gridCol);
        if (button.classList.contains(cssClasses.active)) {
          return;
        }
        const currentActive = [...gridButtons].filter((el) => el.classList.contains("is-active"));
        const newActive = [...gridButtons].filter((el) => el.getAttribute("data-grid-cols") === gridView);
        [...currentActive].forEach((el) => el.classList.remove(cssClasses.active));
        [...newActive].forEach((el) => el.classList.add(cssClasses.active));
        productsGrid.setAttribute(attributes.gridCol, gridView);
        if (gridView === "3" || gridView === "2") {
          localStorage.setItem("search-grid-cols", gridView);
        } else {
          localStorage.removeItem("search-grid-cols");
        }
      });
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.SearchTemplate = window.themeCore.SearchTemplate || SearchTemplate();
  window.themeCore.utils.register(window.themeCore.SearchTemplate, "search-template");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
