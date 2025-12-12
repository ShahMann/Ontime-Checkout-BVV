const ProductFilters = (section) => {
  const cssClasses = {
    ...window.themeCore.utils.cssClasses,
    searchWithSideBar: "search--with-sidebar"
  };
  const Toggle = window.themeCore.utils.Toggle;
  const overlay = window.themeCore.utils.overlay;
  window.themeCore.utils.debounce;
  const isSearchTemplate = window.location.pathname === "/search";
  const CHANGEABLE_ELEMENTS_MULTIPLE_SELECTORS = {
    form: ".js-form",
    selectedFiltersWrapper: ".js-selected-filters-wrapper",
    filtersContainer: ".js-filters-container",
    filterAccordionItem: ".js-accordion-filter-item",
    filterLists: ".js-filter-list",
    filterPrice: ".js-filter-price",
    filtersBody: ".js-filters-body"
  };
  const CHANGEABLE_ELEMENTS_ONCE_SELECTORS = {
    emptyTitle: ".js-template-empty-title",
    gridWrapper: ".js-grid-wrapper",
    searchSideBar: ".js-search-sidebar",
    filterMenuOpenerWrapper: ".js-filter-menu-opener-wrapper",
    filterMenuOpener: ".js-filter-menu-opener",
    activeFiltersCounter: ".js-active-filters-counter",
    pagination: ".js-pagination",
    loadMoreButton: ".js-lazy-load",
    infiniteScroll: ".js-infinite-scroll",
    search: ".js-search"
  };
  const FILTER_PRICE_SELECTORS = {
    maxInput: ".js-price-input-max",
    minInput: ".js-price-input-min",
    rangeInputs: ".js-range-inputs",
    minRange: ".js-price-range-min",
    maxRange: ".js-price-range-max",
    priceProgress: ".js-price-progress"
  };
  const selectors = {
    collectionHeader: ".js-collection-header",
    filterMenuToggler: "filterMenuToggler",
    paginationLink: ".js-pagination-link",
    priceNumberInput: ".js-price-input",
    priceRangeInput: ".js-price-range",
    removeFilterLink: ".js-remove-filter",
    resetFilters: ".js-reset-filters",
    cssRoot: ":root",
    header: "[data-header-container]",
    pageLoader: ".js-page-preloader",
    productFilters: ".js-product-filters",
    searchTypes: ".js-search-types",
    searchTypeActiveButton: "[data-search-type].is-active",
    accordionFilterItemDrawer: ".js-accordion-filter-item-drawer",
    filtersContainerDrawer: ".js-filters-container-drawer",
    activeFilters: ".js-active-filters",
    ...CHANGEABLE_ELEMENTS_MULTIPLE_SELECTORS,
    ...CHANGEABLE_ELEMENTS_ONCE_SELECTORS,
    ...FILTER_PRICE_SELECTORS
  };
  const classes = {
    fixed: "is-fixed",
    noEvents: "no-events",
    error: "is-error",
    ...cssClasses
  };
  const attributes = {
    searchTypes: "data-search-type"
  };
  const FILTER_FORM_KEYS = {
    priceFrom: "filter.v.price.gte",
    priceTo: "filter.v.price.lte"
  };
  const URL_KEYS_TO_SAVE = {
    query: "q",
    type: "type",
    optionsPrefix: "options[prefix]"
  };
  const URL_KEYS = {
    page: "page",
    sort: "sort_by",
    ...URL_KEYS_TO_SAVE
  };
  const cssVariables = {
    rangeMin: "--range-min",
    rangeMax: "--range-max",
    headerHeight: "--header-height",
    headerOffsetTop: "--header-offset-top"
  };
  const breakpoints = {
    extraSmall: "(max-width: 767px)"
  };
  const globals = {
    extraSmallScreen: window.matchMedia(breakpoints.extraSmall),
    openMenuButtonObserver: null,
    infiniteScrollObserver: null,
    cssRoot: document.querySelector(selectors.cssRoot)
  };
  const drawer = Toggle({
    toggleSelector: selectors.filterMenuToggler,
    closeAccordionsOnHide: false,
    toggleTabIndex: false
  });
  let currentNodes = getNodes(section, CHANGEABLE_ELEMENTS_MULTIPLE_SELECTORS);
  currentNodes = Object.assign(currentNodes, getNodes(section, CHANGEABLE_ELEMENTS_ONCE_SELECTORS, true));
  let currentBaseUrl = window.location.href.split("#")[0];
  const pageLoader = document.querySelector(selectors.pageLoader);
  function getNodes(container, selectors2, once) {
    const nodes = {};
    Object.entries(selectors2).forEach(([elementName, selector]) => {
      const elements = [...container.querySelectorAll(selector)];
      if (!elements.length) {
        nodes[elementName] = null;
        return;
      }
      if (elements.length > 1 || !once) {
        nodes[elementName] = elements;
        return;
      }
      nodes[elementName] = elements[0];
    });
    if ((container == null ? void 0 : container.matches) && container.matches(selectors2.search)) {
      nodes.search = container;
    }
    return nodes;
  }
  function setMenuButtonObserver() {
    let headerHeight = getHeaderHeightWithOffsetTop();
    headerHeight = 0;
    const intersectionOptions = {
      rootMargin: `-${headerHeight}px 0px 0px 0px`
    };
    globals.openMenuButtonObserver = initIntersectionObserver(currentNodes.filterMenuOpenerWrapper, unFixMenuOpener, fixMenuOpener, intersectionOptions);
  }
  function getHeaderHeightWithOffsetTop() {
    const headerHeight = globals.cssRoot.style.getPropertyValue(cssVariables.headerHeight);
    const headerOffsetTop = globals.cssRoot.style.getPropertyValue(cssVariables.headerOffsetTop);
    return parseInt(headerHeight) + parseInt(headerOffsetTop);
  }
  function setInfiniteScrollObserver() {
    globals.infiniteScrollObserver = initIntersectionObserver(
      currentNodes.infiniteScroll,
      () => unobserveAndUpdateTemplate(globals.infiniteScrollObserver, currentNodes.infiniteScroll)
    );
  }
  function initIntersectionObserver(observerNode, intersectCallback, noIntersectCallback, options = {}) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeof intersectCallback === "function" && intersectCallback();
        } else {
          typeof noIntersectCallback === "function" && noIntersectCallback();
        }
      });
    }, options);
    observer.observe(observerNode);
    return observer;
  }
  function unFixMenuOpener() {
    if (!currentNodes.filterMenuOpener) {
      return;
    }
    currentNodes.filterMenuOpener.classList.remove(classes.fixed);
    currentNodes.filterMenuOpenerWrapper.style.minHeight = `auto`;
  }
  function fixMenuOpener() {
    if (!currentNodes.filterMenuOpener || isViewPortAboveElement(currentNodes.filterMenuOpenerWrapper)) {
      return;
    }
    currentNodes.filterMenuOpenerWrapper.style.minHeight = `${currentNodes.filterMenuOpenerWrapper.offsetHeight}px`;
    currentNodes.filterMenuOpener.classList.add(classes.fixed);
  }
  function isViewPortAboveElement(opener) {
    const headerHeight = getHeaderHeightWithOffsetTop();
    return opener.offsetTop + opener.offsetHeight >= window.pageYOffset + headerHeight;
  }
  async function formChangeHandler(event) {
    const form = event.target.closest(selectors.form);
    if (!form || isPriceInputsWithErrors()) {
      return;
    }
    const formData = new FormData(form);
    const formKeys = [...formData.keys()];
    let { minInput, maxInput } = getNodes(form, FILTER_PRICE_SELECTORS);
    if (Array.isArray(minInput)) {
      minInput = minInput[0];
    }
    if (Array.isArray(maxInput)) {
      maxInput = maxInput[0];
    }
    formKeys.forEach((key) => {
      if (key === FILTER_FORM_KEYS.priceFrom || key === FILTER_FORM_KEYS.priceTo) {
        if (key === FILTER_FORM_KEYS.priceFrom && Number(minInput.value) === Number(minInput.min) || key === FILTER_FORM_KEYS.priceTo && Number(maxInput.value) === Number(maxInput.max)) {
          formData.delete(key);
        }
      }
    });
    const url = createFetchingURL(formData);
    form.classList.add(classes.loading);
    window.parent === window.top && window.history.pushState({}, null, url);
    await rerenderTemplate(url);
    form.classList.remove(classes.loading);
    window.themeCore.Accordion.setTabIndex(".product-filters__form-accordion", "hidden");
  }
  function createFetchingURL(formData) {
    const queryString = new URLSearchParams(formData).toString();
    const initialUrl = new URL(window.location.href);
    const url = new URL(`${window.location.origin}${window.location.pathname}?${queryString}`);
    for (const key in URL_KEYS_TO_SAVE) {
      const value = initialUrl.searchParams.get(URL_KEYS_TO_SAVE[key]);
      value && url.searchParams.set(URL_KEYS_TO_SAVE[key], value);
    }
    return url;
  }
  function isPriceInputsWithErrors() {
    if (!currentNodes.filterPrice) {
      return false;
    }
    const priceNumberInputs = [...currentNodes.filterPrice].flatMap((filterPrice) => {
      return [...filterPrice.querySelectorAll(selectors.priceNumberInput)];
    });
    return priceNumberInputs.some((input) => input.classList.contains(classes.error));
  }
  async function rerenderTemplate(url) {
    currentNodes.gridWrapper.ariaBusy = "true";
    const requestURL = getSectionIdRequestURL(url, section.id);
    const newHTML = await getHTML(requestURL);
    let newNodes = getNodes(newHTML, CHANGEABLE_ELEMENTS_MULTIPLE_SELECTORS);
    newNodes = Object.assign(newNodes, getNodes(newHTML, CHANGEABLE_ELEMENTS_ONCE_SELECTORS, true));
    setHTML(newNodes);
    window.themeCore.LazyLoadImages.init();
    currentNodes.gridWrapper.ariaBusy = "false";
    window.themeCore.EventBus.emit("compare-products:init");
    currentBaseUrl = window.location.href.split("#")[0];
  }
  function getSectionIdRequestURL(url, sectionId = section.id) {
    const requestURL = new URL(url);
    requestURL.searchParams.set("section_id", sectionId);
    return requestURL.toString();
  }
  async function getHTML(url) {
    const response = await fetch(url);
    const resText = await response.text();
    return new DOMParser().parseFromString(resText, "text/html");
  }
  function setHTML(newNodes) {
    if (!newNodes || !Object.keys(newNodes).length) {
      return;
    }
    const {
      selectedFiltersWrapper,
      gridWrapper,
      filterMenuOpener,
      activeFiltersCounter,
      filterAccordionItem,
      filterPrice,
      pagination,
      loadMoreButton,
      infiniteScroll,
      filtersBody,
      searchSideBar,
      search
    } = newNodes;
    if (search && currentNodes.search) {
      currentNodes.search.classList.toggle(cssClasses.searchWithSideBar, search.classList.contains(cssClasses.searchWithSideBar));
    }
    if (searchSideBar && currentNodes.searchSideBar) {
      currentNodes.searchSideBar.classList.toggle(cssClasses.hidden, searchSideBar.classList.contains(cssClasses.hidden));
    }
    const productFilters = document.querySelector(selectors.productFilters);
    if (productFilters && selectedFiltersWrapper) {
      currentNodes.filtersBody.innerHTML = filtersBody.innerHTML;
      productFilters.classList.remove(cssClasses.hidden);
      currentNodes = getNodes(section, CHANGEABLE_ELEMENTS_MULTIPLE_SELECTORS);
      currentNodes = Object.assign(currentNodes, getNodes(section, CHANGEABLE_ELEMENTS_ONCE_SELECTORS, true));
      window.themeCore.Accordion.init();
      filterPrice && drawPriceRange();
    }
    if (productFilters && currentNodes.selectedFiltersWrapper && !selectedFiltersWrapper && filtersBody) {
      currentNodes.filtersBody.innerHTML = filtersBody.innerHTML;
      productFilters.classList.add(cssClasses.hidden);
      currentNodes = getNodes(section, CHANGEABLE_ELEMENTS_MULTIPLE_SELECTORS);
      currentNodes = Object.assign(currentNodes, getNodes(section, CHANGEABLE_ELEMENTS_ONCE_SELECTORS, true));
    }
    currentNodes.gridWrapper.innerHTML = gridWrapper.innerHTML;
    if (gridWrapper.innerHTML) {
      currentNodes.emptyTitle.classList.add(classes.hidden);
      currentNodes.emptyTitle.ariaHidden = "true";
    } else {
      currentNodes.emptyTitle.classList.remove(classes.hidden);
      currentNodes.emptyTitle.ariaHidden = "false";
    }
    if (currentNodes.filtersContainer && currentNodes.filtersContainer && filterAccordionItem) {
      [...currentNodes.filtersContainer].forEach((filtersContainer) => {
        const filterItemsInDOM = filtersContainer.querySelectorAll(selectors.filterAccordionItem);
        Array.from(filterItemsInDOM).forEach((currentElement) => {
          if (!Array.from(filterAccordionItem).some(({ id }) => currentElement.id === id)) {
            currentElement.remove();
          }
        });
      });
    }
    if (filterAccordionItem && filterAccordionItem.length) {
      filterAccordionItem.forEach((filterItem) => {
        const currentElementOnPage = document.getElementById(filterItem.id);
        if (currentElementOnPage) {
          const currentFilterList = currentElementOnPage.querySelector(selectors.filterLists);
          const newFilterList = filterItem.querySelector(selectors.filterLists);
          if (!currentFilterList || !newFilterList) {
            return;
          }
          currentFilterList.innerHTML = newFilterList.innerHTML;
        } else {
          if (filterItem.parentElement && currentNodes.filtersContainer) {
            [...currentNodes.filtersContainer].forEach((filtersContainer) => {
              const isContainerDrawer = filtersContainer.matches(selectors.filtersContainerDrawer);
              const isFilterItemDrawer = filterItem.matches(selectors.accordionFilterItemDrawer);
              if (isContainerDrawer !== isFilterItemDrawer) {
                return;
              }
              const filterItemIndex = filterAccordionItem.filter((item) => item.matches(selectors.accordionFilterItemDrawer) === isFilterItemDrawer).findIndex((item) => item.id === filterItem.id);
              const prevDomElement = filtersContainer.querySelector(`:nth-child(${filterItemIndex} of ${selectors.filterAccordionItem})`);
              const nextDomElement = filtersContainer.querySelector(`:nth-child(${filterItemIndex + 2} of ${selectors.filterAccordionItem})`);
              if (prevDomElement) {
                prevDomElement.after(filterItem);
              } else if (nextDomElement) {
                nextDomElement.before(filterItem);
              } else {
                filtersContainer.appendChild(filterItem);
              }
            });
          }
        }
      });
    }
    window.themeCore.Accordion.init(".js-filters-container");
    currentNodes.filterMenuOpener.dataset.count = filterMenuOpener ? filterMenuOpener.dataset.count : 0;
    replaceNodes({
      activeFiltersCounter,
      filterPrice,
      pagination,
      selectedFiltersWrapper,
      infiniteScroll,
      loadMoreButton
    });
    infiniteScroll && setInfiniteScrollObserver();
    filterPrice && drawPriceRange();
  }
  function drawPriceRange() {
    const { minInput, maxInput, rangeInputs } = getNodes(section, FILTER_PRICE_SELECTORS);
    if (!rangeInputs) {
      return;
    }
    [...rangeInputs].forEach((rangeInputs2, index) => {
      const { thumbOffset } = rangeInputs2.dataset;
      const rangeMinStyle = `calc(${Number(minInput[index].value) / Number(minInput[index].max) * 100}% - ${thumbOffset}px)`;
      const rangeMaxStyle = `calc(${Number(maxInput[index].value) / Number(maxInput[index].max) * 100}% + ${thumbOffset}px)`;
      rangeInputs2.style.setProperty(cssVariables.rangeMin, rangeMinStyle);
      rangeInputs2.style.setProperty(cssVariables.rangeMax, rangeMaxStyle);
    });
  }
  function replaceNodes(newNodes) {
    if (!newNodes || !Object.keys(newNodes).length) {
      return;
    }
    for (const newNodeName in newNodes) {
      if (currentNodes[newNodeName]) {
        const nodesList = Array.isArray(currentNodes[newNodeName]) ? currentNodes[newNodeName] : [currentNodes[newNodeName]];
        const newValues = Array.isArray(newNodes[newNodeName]) ? newNodes[newNodeName] : [newNodes[newNodeName]];
        nodesList.forEach((listEl, index) => {
          const currentValue = newValues[index];
          if (!currentValue) {
            return;
          }
          listEl.classList.remove(...listEl.classList);
          listEl.classList.add(...(currentValue == null ? void 0 : currentValue.classList) || []);
          listEl.innerHTML = (currentValue == null ? void 0 : currentValue.innerHTML) || "";
          if (currentValue) {
            for (const key in currentValue.dataset) {
              listEl.dataset[key] = currentValue.dataset[key];
            }
          }
        });
      }
    }
  }
  async function paginationClickHandler(event) {
    const paginationLink = event.target.closest(selectors.paginationLink);
    if (!paginationLink) {
      return;
    }
    event.preventDefault();
    pageLoader.classList.add(classes.active);
    paginationLink.classList.add(classes.noEvents);
    unFixMenuOpener();
    let scrollPos = calcScrollTopPos();
    window.scrollTo(0, scrollPos);
    window.parent === window.top && window.history.pushState({}, null, paginationLink.href);
    await rerenderTemplate(paginationLink.href);
    pageLoader.classList.remove(classes.active);
    const searchTypes = document.querySelector(selectors.searchTypes);
    const searchTypeActiveButton = document.querySelector(selectors.searchTypeActiveButton);
    if (!searchTypes || !searchTypeActiveButton) {
      return;
    }
    searchTypes.value = searchTypeActiveButton.getAttribute(attributes.searchTypes);
  }
  async function popStateHandler() {
    const newBaseUrl = window.location.href.split("#")[0];
    if (newBaseUrl === currentBaseUrl) {
      return;
    }
    currentBaseUrl = newBaseUrl;
    overlay({ namespace: "filters-template" }).open();
    await rerenderTemplate(window.location.href);
    overlay({ namespace: "filters-template" }).close();
  }
  function calcScrollTopPos() {
    const isHeaderSticky = document.querySelector(selectors.header).hasAttribute("data-header-sticky");
    const headerHeight = isHeaderSticky ? getHeaderHeightWithOffsetTop() : 0;
    const elToScroll = document.querySelector(selectors.collectionHeader);
    if (!elToScroll) {
      return 0;
    }
    const collectionSectionPos = window.pageYOffset + elToScroll.getBoundingClientRect().top;
    const scrollOffset = headerHeight + 10;
    return collectionSectionPos - scrollOffset;
  }
  function priceInputHandler(event) {
    const currentInput = event.target.closest(selectors.priceNumberInput);
    if (!currentInput) {
      return;
    }
    let { minInput, maxInput, minRange, maxRange } = getNodes(section, FILTER_PRICE_SELECTORS);
    [...minInput].forEach((minInput2, index) => {
      const isInputsValuesValid = maxInput[index].value && minInput2.value && Number(maxInput[index].value) <= Number(maxInput[index].max) && Number(minInput2.value) >= Number(minInput2.min);
      if (Number(maxInput[index].value) - Number(minInput2.value) >= 0 && isInputsValuesValid) {
        currentInput.dataset.type === "min" ? minRange.value = minInput2.value : maxRange[index].value = maxInput[index].value;
        removePriceErrorState(minInput2, maxInput[index]);
        return;
      }
      currentInput.dataset.type === "min" ? minInput2.classList.add(classes.error) : maxInput[index].classList.add(classes.error);
    });
    drawPriceRange();
  }
  function priceRangeInputHandler(event) {
    const currentRange = event.target.closest(selectors.priceRangeInput);
    if (!currentRange) {
      return;
    }
    const { minInput, maxInput, minRange, maxRange } = getNodes(section, FILTER_PRICE_SELECTORS);
    [...minInput].forEach((minInput2, index) => {
      if (maxRange[index].value - minRange[index].value < 0) {
        currentRange.dataset.type === "min" ? minRange[index].value = minInput2.value : maxRange[index].value = maxInput[index].value;
      }
      minInput2.value = minRange[index].value;
      maxInput[index].value = maxRange[index].value;
      removePriceErrorState(minInput2, maxInput[index]);
    });
    drawPriceRange();
  }
  function removePriceErrorState(...inputs) {
    inputs.forEach((input) => input.classList.remove(classes.error));
  }
  async function removeFilterClickHandler(event) {
    const removeFilterLink = event.target.closest(selectors.removeFilterLink);
    if (!removeFilterLink) {
      return;
    }
    event.preventDefault();
    [...currentNodes.form].forEach((form) => {
      form.classList.add(classes.loading);
    });
    window.parent === window.top && window.history.pushState({}, null, removeFilterLink.href);
    await rerenderTemplate(removeFilterLink.href);
    [...currentNodes.form].forEach((form) => {
      form.classList.remove(classes.loading);
    });
    window.themeCore.Accordion.setTabIndex(".product-filters__form-accordion", "hidden");
  }
  async function resetFiltersClickHandler(event) {
    const resetFilters = event.target.closest(selectors.resetFilters);
    if (!resetFilters) {
      return;
    }
    const url = new URL(window.location.href);
    const urlKeys = [...url.searchParams.keys()];
    urlKeys.filter((key) => ![URL_KEYS.sort, URL_KEYS.query, URL_KEYS.type].includes(key)).forEach((key) => url.searchParams.delete(key));
    [...currentNodes.form].forEach((form) => {
      form.classList.add(classes.loading);
    });
    window.parent === window.top && window.history.pushState({}, null, url);
    await rerenderTemplate(url);
    const activeFilters = section.querySelectorAll(selectors.activeFilters);
    activeFilters.forEach((filter) => filter.remove());
    [...currentNodes.form].forEach((form) => {
      form.classList.remove(classes.loading);
    });
    window.themeCore.Accordion.setTabIndex(".product-filters__form-accordion", "hidden");
  }
  async function unobserveAndUpdateTemplate(observer, infiniteScroll) {
    observer.unobserve(infiniteScroll);
    const link = window.location.origin + infiniteScroll.dataset.nextUrl;
    pageLoader.classList.add(classes.active);
    await updateTemplate(link);
    pageLoader.classList.remove(classes.active);
  }
  async function updateTemplate(url) {
    const requestURL = getSectionIdRequestURL(url, section.id);
    const newHTML = await getHTML(requestURL);
    const { gridWrapper, infiniteScroll, loadMoreButton } = getNodes(newHTML, CHANGEABLE_ELEMENTS_ONCE_SELECTORS, true);
    currentNodes.gridWrapper.insertAdjacentHTML("beforeend", gridWrapper.innerHTML);
    replaceNodes({ infiniteScroll, loadMoreButton });
    infiniteScroll && setInfiniteScrollObserver();
    window.themeCore.LazyLoadImages.init();
    window.themeCore.EventBus.emit("compare-products:init");
  }
  async function loadMoreClickHandler(event) {
    const loadMoreButton = event.target.closest(selectors.loadMoreButton);
    if (!loadMoreButton) {
      return;
    }
    pageLoader.classList.add(classes.active);
    loadMoreButton.classList.add(classes.noEvents);
    const nextUrl = window.location.origin + loadMoreButton.dataset.nextUrl;
    await updateTemplate(nextUrl);
    pageLoader.classList.remove(classes.active);
  }
  function collapseNotActiveAccordions(event) {
    const currentAccordion = event.target.closest(selectors.filterAccordionItem);
    if (currentAccordion == null ? void 0 : currentAccordion.matches(selectors.accordionFilterItemDrawer)) {
      return;
    }
    window.themeCore.Accordion.collapseAllItems(`${selectors.filtersContainer}:not(${selectors.filtersContainerDrawer})`, currentAccordion);
  }
  function setListeners(nodes) {
    const { filterMenuOpenerWrapper, loadMoreButton, infiniteScroll, filterLists, filterPrice, pagination, form } = nodes;
    if (filterMenuOpenerWrapper) {
      drawer.init();
      setMenuButtonObserver();
    }
    if (filterLists || filterPrice || isSearchTemplate) {
      section.addEventListener("click", removeFilterClickHandler);
      document.body.addEventListener("click", collapseNotActiveAccordions);
    }
    filterPrice && drawPriceRange();
    section.addEventListener("input", priceInputHandler);
    section.addEventListener("input", priceRangeInputHandler);
    if (pagination || form) {
      window.addEventListener("popstate", popStateHandler);
    }
    form && section.addEventListener("change", formChangeHandler);
    if (filterLists || isSearchTemplate) {
      section.addEventListener("click", resetFiltersClickHandler);
    }
    (pagination || !!section.querySelector(selectors.paginationLink)) && section.addEventListener("click", paginationClickHandler);
    loadMoreButton && section.addEventListener("click", loadMoreClickHandler);
    infiniteScroll && setInfiniteScrollObserver();
    const horizontalFilters = section.querySelector(".js-filters-horizontal");
    if (horizontalFilters) {
      horizontalFilters.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
          window.themeCore.Accordion.collapseAllItems(`${selectors.filtersContainer}:not(${selectors.filtersContainerDrawer})`);
        }
      });
    }
  }
  function init() {
    if (!section || !Object.keys(currentNodes).length) {
      return;
    }
    setListeners(currentNodes);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.utils.registerExternalUtil(ProductFilters, "ProductFilters");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
