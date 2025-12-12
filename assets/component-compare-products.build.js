const CompareProducts = () => {
  const selectors = {
    addButton: ".js-compare-products-button",
    productButton: ".js-compare-products-popup-button",
    stickyAddToCart: ".js-sticky-add-to-cart",
    compareProductCard: ".js-compare-product",
    compareProducts: ".js-compare-products",
    modal: "compare-products",
    compareProductRow: ".js-product-compare-row",
    removeButton: ".js-product-compare-remove",
    clearButton: ".js-compare-products-clear",
    filterMenuOpener: ".js-filter-menu-opener"
  };
  const attributes = {
    product: "data-product-handle",
    productTitle: "data-product-title",
    ariaLabel: "aria-label",
    count: "data-count",
    empty: "data-empty"
  };
  const closeSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
  const chevronSVG = `<svg class="icon icon-rtl" aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M8.91016 19.9201L15.4302 13.4001C16.2002 12.6301 16.2002 11.3701 15.4302 10.6001L8.91016 4.08008" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
							   </svg>`;
  const MAX_COMPARE_PRODUCTS = 6;
  const classes = {
    ...window.themeCore.utils.cssClasses,
    bigPadding: "big-padding",
    largePadding: "large-padding"
  };
  let productButton, translations, overlay, Toggle, container, modal;
  function init() {
    productButton = document.querySelector(selectors.productButton);
    if (!productButton) {
      return;
    }
    updateProductButton();
    initAddButtons();
    setInitLister();
    addEventListeners();
  }
  function setInitLister() {
    window.themeCore.EventBus.listen(`compare-products:init`, initAddButtons);
  }
  function initAddButtons() {
    translations = {
      add: window.themeCore.translations.get("products.compare_products.product_button_add"),
      remove: window.themeCore.translations.get("products.compare_products.product_button_remove"),
      error: window.themeCore.translations.get("products.compare_products.quantity_error")
    };
    overlay = window.themeCore.utils.overlay;
    Toggle = window.themeCore.utils.Toggle;
    const addButtons = [...document.querySelectorAll(selectors.addButton)];
    if (!addButtons.length) {
      return;
    }
    const products = getComparedProducts();
    addButtons.forEach((button) => {
      const product = button.getAttribute(attributes.product);
      if (!product) {
        return;
      }
      const productTitle = button.getAttribute(attributes.productTitle);
      if (productTitle) {
        const ariaLabel = translations[products.includes(product) ? "remove" : "add"].replaceAll("{{ product }}", productTitle);
        button.setAttribute(attributes.ariaLabel, ariaLabel);
      }
      button.classList.toggle(classes.active, products.includes(product));
      button.classList.remove(classes.hidden);
    });
    productButton.setAttribute(attributes.count, products.length);
  }
  function getComparedProducts() {
    const products = localStorage.getItem("theme-compare-products");
    if (!products) {
      return [];
    }
    try {
      return JSON.parse(products);
    } catch (e) {
      return [];
    }
  }
  function setComparedProducts(products) {
    if (!products) {
      return;
    }
    if (products.length > MAX_COMPARE_PRODUCTS) {
      showErrorNotification();
      return;
    }
    localStorage.setItem("theme-compare-products", JSON.stringify(products));
    initAddButtons();
  }
  function toggleProduct(product) {
    let products = getComparedProducts();
    if (products.includes(product)) {
      products = products.filter((productElement) => productElement !== product);
    } else {
      products = [...products, product];
    }
    setComparedProducts(products);
  }
  function removeProduct(product) {
    let products = getComparedProducts();
    products = products.filter((productElement) => productElement !== product);
    setComparedProducts(products);
  }
  function clear() {
    setComparedProducts([]);
  }
  function addEventListeners() {
    document.addEventListener("click", addButtonsClickHandler);
    document.addEventListener("click", removeButtonsClickHandler);
    productButton.addEventListener("click", productButtonClickHandler);
  }
  function addButtonsClickHandler(event) {
    const addButton = event.target.closest(selectors.addButton);
    if (!addButton) {
      return;
    }
    const product = addButton.getAttribute(attributes.product);
    if (!product) {
      return;
    }
    toggleProduct(product);
  }
  function removeButtonsClickHandler(event) {
    const removeButton = event.target.closest(selectors.removeButton);
    const clearButton = event.target.closest(selectors.clearButton);
    if (!removeButton && !clearButton) {
      return;
    }
    if (clearButton) {
      clear();
      modal.close(container);
      return;
    }
    const product = removeButton.getAttribute(attributes.product);
    if (!product) {
      return;
    }
    removeProduct(product);
    const productCount = getComparedProducts().length;
    const compareProducts = document.querySelector(selectors.compareProducts);
    if (compareProducts) {
      if (productCount < 2) {
        modal.close(container);
        return;
      }
      const productRows = [...compareProducts.querySelectorAll(`[${attributes.product}="${product}"]`)];
      productRows.forEach((row) => row.remove());
      compareProducts.style = `--compare-products-count: ${productCount}`;
    }
  }
  function updateProductButton() {
    const hasStickyAddToCart = !!document.querySelector(selectors.stickyAddToCart);
    const hasFilterMenuOpener = !!document.querySelector(selectors.filterMenuOpener);
    if (hasStickyAddToCart) {
      productButton.classList.add(classes.bigPadding);
      return;
    }
    if (hasFilterMenuOpener) {
      productButton.classList.add(classes.largePadding);
    }
  }
  function showErrorNotification() {
    setTimeout(() => {
      const CartNotificationError = window.themeCore.CartNotificationError;
      CartNotificationError.addNotification(translations.error, window.themeCore.translations.get("products.compare_products.quantity_error_heading"));
      CartNotificationError.open();
    });
  }
  async function productButtonClickHandler() {
    const products = getComparedProducts();
    productButton.disabled = true;
    overlay({ namespace: "compare-products-preloader" }).open(true);
    let productCards = (await getProductCards()).map((card) => card.value);
    productCards.forEach((card, index) => !card && removeProduct(products[index]));
    productCards = productCards.filter(Boolean);
    container = getLayout(productCards);
    container.style = `--compare-products-count: ${productCards.length}`;
    document.body.append(container);
    const toggleConfig = {
      toggleSelector: selectors.modal,
      previouslySelectedElement: productButton
    };
    modal = Toggle(toggleConfig);
    modal.init({ once: true });
    modal.open(container);
    setTimeout(() => container.focus(), 50);
    productButton.disabled = false;
  }
  async function getProductCards() {
    const products = getComparedProducts();
    try {
      return await Promise.allSettled(products.map((product) => getProductCard(product)));
    } catch (error) {
      console.log(error);
    }
  }
  async function getProductCard(product) {
    const locale = window.Shopify.routes.root;
    const url = `${locale}products/${product}?view=compare`;
    return await getHTML(url, selectors.compareProductCard);
  }
  async function getHTML(url, selector) {
    try {
      const response = await fetch(url);
      const resText = await response.text();
      let result = new DOMParser().parseFromString(resText, "text/html");
      if (selector) {
        result = result.querySelector(selector);
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  function getLayout(productCards) {
    const productCardsLayout = document.createElement("html");
    productCardsLayout.innerHTML = productCards.map((card) => card.outerHTML).join(" ");
    let rows = Array.from(Array(11)).map((x, index) => {
      return [...productCardsLayout.querySelectorAll(`${selectors.compareProductRow}[data-index="${index + 1}"]`)];
    });
    rows = rows.filter((row) => !row.every((col) => col.hasAttribute(attributes.empty)));
    const html = document.createElement("html");
    html.innerHTML = `
			<div
			class="modal compare-products js-compare-products"
			id="compare-products"
			data-modal-once="true"
			tabindex="-1"
			aria-modal="true"
			role="dialog"
			>
				<header class="modal__header compare-products__header">
					${window.themeCore.compareProductsTitle && `<h2 class="compare-products__heading h3">
							${window.themeCore.compareProductsTitle}
						</h2>`}
					${window.themeCore.translations.get("products.compare_products.clear_all") && `<button class="button-link-chevron button-link-chevron--small compare-products__clear js-compare-products-clear">
							${window.themeCore.translations.get("products.compare_products.clear_all")}
							${chevronSVG}
						</button>`}

					<button
						class="compare-products__close focus-visible-outline"
						data-target="compare-products"
						data-js-toggle="compare-products"
						aria-label="${window.themeCore.translations.get("general.accessibility.close_modal")}">
						${closeSVG}
					</button>
				</header>

				<div class="modal__body compare-products__body">
					<div class="modal__body compare-products__content compare-product-card">
						${rows.map((row) => row.map((col) => col.outerHTML).join("")).join("")}
					</div>
				</div>
			</div>
		`;
    return html.querySelector(selectors.compareProducts);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CompareProducts = window.themeCore.CompareProducts || CompareProducts();
  window.themeCore.utils.register(window.themeCore.CompareProducts, "compare-products");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
