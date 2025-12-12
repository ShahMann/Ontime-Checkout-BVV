const PredictiveSearch = () => {
  const debounce = window.themeCore.utils.debounce;
  const globalClasses = window.themeCore.utils.cssClasses;
  const selectors = {
    form: ".js-predictive-search-form",
    input: ".js-predictive-search-input",
    searchBody: ".js-predictive-search-body",
    resultContainer: ".js-predictive-search-result-container",
    searchType: "input[name='type']",
    applyButton: ".js-predictive-search-apply-button",
    resultRow: ".js-predictive-search-result-row",
    tabsButton: ".js-predictive-search-tabs-button",
    preloader: ".js-preloader",
    searchPopup: "#headerPopupSearch",
    resultWrapper: ".js-predictive-search-results",
    footer: ".js-predictive-search-footer",
    activeTab: ".js-predictive-search-tabs-button.is-active",
    featuredItems: ".js-predictive-search-featured-items"
  };
  const attributes = {
    disabled: "disabled",
    id: "id",
    dataId: "data-id",
    ariaExpanded: "aria-expanded",
    ariaHidden: "aria-hidden"
  };
  const classes = {
    visuallyHidden: "visually-hidden",
    emptySearchBody: "predictive-search__body--empty",
    ...globalClasses
  };
  const SEARCH_RESULTS_COUNT = 8;
  let cachedResults = {};
  const preloader = document.querySelector(selectors.preloader);
  const footer = document.querySelector(selectors.footer);
  const resultContainer = document.querySelector(selectors.resultContainer);
  const defaultResult = resultContainer ? resultContainer.innerHTML : null;
  const featuredItems = document.querySelector(selectors.featuredItems);
  const searchBody = document.querySelector(selectors.searchBody);
  const applyButton = document.querySelector(selectors.applyButton);
  async function searchAction(event) {
    const input = event.target.closest(selectors.input);
    const searchPopup = document.querySelector(selectors.searchPopup);
    if (!searchPopup || !input || !resultContainer) {
      return;
    }
    const inputValue = input.value.trim();
    if (!inputValue.length) {
      applyButton && applyButton.setAttribute(attributes.disabled, attributes.disabled);
      applyButton && applyButton.setAttribute(attributes.ariaHidden, "true");
      clearInnerResults(resultContainer);
      footer && footer.classList.add(classes.hidden);
      resultContainer.innerHTML = defaultResult;
      !featuredItems && resultContainer.classList.add(classes.hidden);
      searchBody && searchBody.classList.remove(classes.emptySearchBody);
      return;
    }
    initPreloader();
    if (cachedResults[inputValue]) {
      renderResult(cachedResults[inputValue], resultContainer, applyButton);
      removePreloader();
      footer && footer.classList.remove(classes.hidden);
      return;
    }
    const searchResponse = await getResult(inputValue);
    const responseText = new DOMParser().parseFromString(await searchResponse.text(), "text/html");
    cachedResults[inputValue] = responseText;
    renderResult(responseText, resultContainer, applyButton);
    removePreloader();
    footer && footer.classList.remove(classes.hidden);
  }
  function resetAction() {
    if (!resultContainer)
      return;
    applyButton && applyButton.setAttribute(attributes.disabled, attributes.disabled);
    applyButton && applyButton.setAttribute(attributes.ariaHidden, "true");
    clearInnerResults(resultContainer);
    resultContainer.innerHTML = defaultResult;
    footer && footer.classList.add(classes.hidden);
    !featuredItems && resultContainer.classList.add(classes.hidden);
    searchBody && searchBody.classList.remove(classes.emptySearchBody);
  }
  function initPreloader() {
    if (!preloader) {
      return;
    }
    preloader.classList.add(classes.active);
  }
  function removePreloader() {
    if (!preloader) {
      return;
    }
    preloader.classList.remove(classes.active);
  }
  function renderResult(responseText, resultContainer2, applyButton2) {
    clearInnerResults(resultContainer2);
    applyButton2 && applyButton2.removeAttribute(attributes.disabled);
    applyButton2 && applyButton2.removeAttribute(attributes.ariaHidden);
    const result = responseText.querySelector(selectors.resultWrapper);
    if (!result) {
      applyButton2 && applyButton2.setAttribute(attributes.disabled, attributes.disabled);
      applyButton2 && applyButton2.setAttribute(attributes.ariaHidden, "true");
      renderEmptyResult(resultContainer2);
      resultContainer2.classList.remove(classes.hidden);
      searchBody && searchBody.classList.add(classes.emptySearchBody);
      return;
    }
    resultContainer2.innerHTML = result.innerHTML;
    resultContainer2.classList.remove(classes.hidden);
    searchBody && searchBody.classList.remove(classes.emptySearchBody);
    window.themeCore.EventBus.emit("compare-products:init");
    document.addEventListener("click", setActiveTabCategory);
  }
  function setActiveTabCategory(event) {
    const tabButtons = [...document.querySelectorAll(selectors.tabsButton)];
    const resultRows = [...document.querySelectorAll(selectors.resultRow)];
    const targetTabButton = event.target.closest(selectors.tabsButton);
    if (!targetTabButton || !tabButtons.length || !resultRows.length) {
      return;
    }
    tabButtons.forEach((button) => {
      button.classList.remove(classes.active);
      button.setAttribute(attributes.ariaExpanded, false);
    });
    targetTabButton.classList.add(classes.active);
    targetTabButton.setAttribute(attributes.ariaExpanded, true);
    resultRows.forEach((resultRow) => {
      resultRow.classList.remove(classes.active);
      resultRow.classList.add(classes.visuallyHidden);
    });
    resultRows.filter((resultRow) => resultRow.dataset.id === targetTabButton.dataset.id).forEach((resultRow) => {
      resultRow.classList.add(classes.active);
      resultRow.classList.remove(classes.visuallyHidden);
    });
  }
  function renderEmptyResult(resultContainer2) {
    var _a, _b, _c;
    const emptyResult = `
				<p class="h4 predictive-search__result-empty">
					${((_c = (_b = (_a = window.themeCore) == null ? void 0 : _a.objects) == null ? void 0 : _b.settings) == null ? void 0 : _c.predictive_search_no_result) || window.themeCore.translations.get("general.predictive_search.no_results")}
				</p>
			`;
    resultContainer2.innerHTML += emptyResult;
  }
  async function getResult(inputValue) {
    const searchType = document.querySelector(selectors.searchType);
    if (!searchType) {
      return;
    }
    const resourcesType = `${encodeURIComponent("resources[type]")}=${searchType.value}`;
    const resourcesLimit = `${encodeURIComponent("resources[limit]")}=${SEARCH_RESULTS_COUNT}`;
    let url = '';

    if (searchType.dataset.searchBySkuBarcode == 'true') {
      const optionsFields = `${encodeURIComponent("resources[options][fields]")}=author,body,product_type,tag,title,variants.barcode,variants.sku,variants.title,vendor`;
      url = `${window.Shopify.routes.root}search/suggest?q=${encodeURIComponent(inputValue)}&${resourcesType}&${resourcesLimit}&${optionsFields}&section_id=predictive-search`;
    }else{
      url = `${window.Shopify.routes.root}search/suggest?q=${encodeURIComponent(inputValue)}&${resourcesType}&${resourcesLimit}&section_id=predictive-search`;
    }

   return await fetch(url);
  }
  function clearInnerResults(resultContainer2) {
    resultContainer2.innerHTML = "";
  }
  function onFormSubmit(event) {
    const form = event.target.closest(selectors.form);
    if (!form) {
      return;
    }
    event.preventDefault();
    const inputValue = form.querySelector(selectors.input).value.trim();
    if (!inputValue.length) {
      return;
    }
    searchRedirect(inputValue);
  }
  function searchRedirect(value) {
    const activeTab = document.querySelector(selectors.activeTab);
    if (!activeTab) {
      return;
    }
    const valueEncoded = encodeURI(value);
    const url = `${window.Shopify.routes.root}search/?type=${activeTab.getAttribute(attributes.dataId)}&options%5Bprefix%5D=last&q=${valueEncoded}`;
    window.location.replace(url);
  }
  function init() {
    document.addEventListener("input", debounce(searchAction, 200, false));
    document.addEventListener("reset", resetAction);
    document.addEventListener("submit", onFormSubmit);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.PredictiveSearch = window.themeCore.PredictiveSearch || PredictiveSearch();
  window.themeCore.utils.register(window.themeCore.PredictiveSearch, "predictive-search");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
