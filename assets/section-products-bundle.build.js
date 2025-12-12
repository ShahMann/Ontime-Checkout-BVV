const selectors = {
  section: ".js-products-bundle",
  button: ".js-products-bundle-button",
  cardButton: ".js-product-card-button",
  hiddenInput: ".js-product-card-variant-input",
  formError: ".js-product-card-error",
  error: ".js-product-bundle-error",
  total: ".js-product-total",
  totalPrice: ".js-product-total-price",
  amount: "[data-amount]",
  card: ".js-product-card",
  isCurrencyEnabled: "[data-currency-code-enabled]"
};
const attributes = {
  amount: "data-amount"
};
const ProductsBundle = () => {
  let sections;
  let formatMoney;
  async function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => initSection(section));
  }
  function initSection(section) {
    if (!section) {
      return;
    }
    const isCurrencyEnabled = section.querySelector(selectors.isCurrencyEnabled);
    const format = isCurrencyEnabled ? window.themeCore.objects.shop.money_with_currency_format : window.themeCore.objects.shop.money_format;
    formatMoney = (amount) => window.themeCore.utils.formatMoney(amount, format);
    const sectionId = section.dataset.section;
    const button = section.querySelector(selectors.button);
    if (!button) {
      return;
    }
    const buttonLabels = {
      enabled: button.dataset.enabledLabel,
      disabled: button.dataset.disabledLabel
    };
    window.themeCore.EventBus.listen(
      `product-card:change-variant`,
      (event) => changeVariantHandler({
        event,
        section,
        sectionId,
        button,
        buttonLabels
      })
    );
    section.addEventListener("click", clickHandler);
    updateTotal(section);
  }
  function changeVariantHandler({ event, section, sectionId, button, buttonLabels }) {
    if (event.sectionId !== sectionId) {
      return;
    }
    const hiddenInputs = [...section.querySelectorAll(selectors.hiddenInput)];
    const formErrors = [...section.querySelectorAll(selectors.formError)];
    const enableButton = hiddenInputs.every((input) => input.value) && formErrors.every((error) => error.innerText !== window.themeCore.translations.get("products.product.sold_out"));
    button.disabled = !enableButton;
    button.innerHTML = buttonLabels[enableButton ? "enabled" : "disabled"];
    updateTotal(section);
  }
  function updateTotal(section) {
    const total = section.querySelector(selectors.total);
    const totalPrice = section.querySelector(selectors.totalPrice);
    const amount = getAmount(section);
    if (!total || !totalPrice) {
      return;
    }
    total.classList.toggle(window.themeCore.utils.cssClasses.active, amount !== null);
    if (amount !== null) {
      totalPrice.innerText = formatMoney(amount);
    }
  }
  function getAmount(section) {
    const cards = [...section.querySelectorAll(selectors.card)];
    const amounts = cards.map((card) => {
      const element = card.querySelector(selectors.amount);
      const hiddenInput = card.querySelector(selectors.hiddenInput);
      if (!element || !hiddenInput || !hiddenInput.getAttribute("value")) {
        return null;
      }
      return element.getAttribute(attributes.amount) || null;
    });
    if (amounts.includes(null)) {
      return null;
    }
    return amounts.reduce((accumulator, element) => accumulator += +element, 0);
  }
  async function clickHandler(event) {
    const button = event.target.closest(selectors.button);
    if (!button) {
      return;
    }
    const section = button.closest(selectors.section);
    if (!section) {
      return;
    }
    const error = section.querySelector(selectors.error);
    const variantIds = [...section.querySelectorAll(selectors.hiddenInput)].map((input) => input.value);
    const errorMessage = await addToCart(variantIds);
    error && (error.innerHTML = errorMessage);
    !errorMessage && window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART);
  }
  async function addToCart(variantIds) {
    try {
      await window.themeCore.CartApi.makeRequest(
        window.themeCore.CartApi.actions.ADD_TO_CART_MANY,
        variantIds.map((id) => ({ id, quantity: 1 }))
      );
      return "";
    } catch (error) {
      return error.description;
    }
  }
  return Object.freeze({
    init,
    initSection
  });
};
const action = () => {
  window.themeCore.ProductsBundle = window.themeCore.ProductsBundle || ProductsBundle();
  window.themeCore.utils.register(window.themeCore.ProductsBundle, "products-bundle");
  window.themeCore.utils.registerExternalUtil(ProductsBundle, "products-bundle");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
