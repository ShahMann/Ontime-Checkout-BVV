const selectors = {
  card: ".js-product-card",
  form: ".js-product-card-form",
  imageWrapper: ".js-product-card-images-wrapper",
  price: ".js-price",
  priceWrapper: ".js-price-container",
  button: ".js-product-card-button",
  product: ".js-product-card-product",
  option: "select[data-option], [data-option]:checked",
  hiddenInput: ".js-product-card-variant-input",
  swatches: "[data-option-index]",
  formError: ".js-product-card-error",
  checkmark: ".js-product-card-checkmark",
  minQuantity: ".js-product-card-min-value"
};
const ProductCardWithForm = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  function init() {
    addListeners();
  }
  function addListeners() {
    document.addEventListener("change", changeHandler);
    document.addEventListener("submit", submitHandler);
  }
  async function changeHandler(event) {
    const form = event.target.closest(selectors.form);
    if (!form) {
      return;
    }
    const card = form.closest(selectors.card);
    if (!card) {
      return;
    }
    const sectionId = card.dataset.section;
    const imageWrappers = [...card.querySelectorAll(selectors.imageWrapper)];
    const swatches = form.querySelector(selectors.swatches);
    const swatchesIndex = swatches && swatches.dataset.optionIndex;
    let options = [...form.querySelectorAll(selectors.option)];
    const price = card.querySelector(selectors.price);
    const priceContainer = card.querySelector(selectors.priceWrapper);
    let button = form.querySelector(selectors.button);
    button && button.classList.contains(cssClasses.hidden) && (button = null);
    const product = getSettings(form.querySelector(selectors.product));
    const checkmark = card.querySelector(selectors.checkmark);
    const formError = form.querySelector(selectors.formError);
    if (!product) {
      return;
    }
    const variants = product.variants;
    const optionValues = options.map((option) => {
      return {
        [option.dataset.option]: option.value
      };
    });
    const allOptionsChecked = (!swatchesIndex || options.some((option) => option.name === swatchesIndex)) && options.every((option) => option.value);
    if (!allOptionsChecked) {
      return;
    }
    checkmark && checkmark.classList.add(cssClasses.active);
    const hiddenInput = form.querySelector(selectors.hiddenInput);
    const hiddenQuantity = form.querySelector(selectors.minQuantity);
    const variant = getVariant(variants, optionValues);
    if (variant) {
      setCurrentVariant(variant.id, hiddenInput);
      setCurrentVariantQuantity(variant, hiddenQuantity);
      updateImages(variant.id, imageWrappers);
      await updatePrice(product.handle, variant.id, priceContainer);
    } else {
      setCurrentVariant("", hiddenInput);
      hidePrice(price);
    }
    updateButton(variant, button || formError);
    window.themeCore.EventBus.emit(`product-card:change-variant`, {
      sectionId
    });
  }
  function getSettings(element) {
    try {
      return JSON.parse(element.textContent);
    } catch {
      return null;
    }
  }
  function getVariant(variants, optionValues) {
    return variants.find((variant) => optionValues.every((optionValue) => variant[Object.keys(optionValue)[0]] === Object.values(optionValue)[0]));
  }
  function setCurrentVariant(variantId, hiddenInput) {
    if (!hiddenInput) {
      return;
    }
    hiddenInput.value = variantId;
  }
  function setCurrentVariantQuantity(variant, inputQuantity) {
    if (!inputQuantity || !variant.quantity_rule) {
      return;
    }
    inputQuantity.value = variant.quantity_rule.min;
  }
  function updateImages(variantId, imageWrappers) {
    imageWrappers.forEach((imageWrapper) => imageWrapper.classList.toggle(cssClasses.active, imageWrapper.dataset.variant === String(variantId)));
  }
  async function updatePrice(productHandle, variantId, price) {
    if (!price) {
      return;
    }
    const url = getProductUrl(productHandle, variantId, "price").toString();
    if (!url) {
      return;
    }
    const fetchPrice = await getHTML(url, selectors.fetchPrice);
    price.innerHTML = fetchPrice.querySelector(selectors.price) && fetchPrice.querySelector(selectors.price).outerHTML;
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
      console.error(error);
    }
  }
  function updateButton(variant, button) {
    if (!button) {
      return;
    }
    const isFormError = !button.matches(selectors.button);
    const isIconButton = button.hasAttribute("data-type-icon");
    if (!isIconButton) {
      if (!variant) {
        button.innerHTML = window.themeCore.translations.get("products.product.unavailable");
      } else if (!variant.available) {
        button.innerHTML = window.themeCore.translations.get("products.product.sold_out");
      } else if (!isFormError) {
        button.innerHTML = window.themeCore.translations.get("products.product.add_to_cart");
      } else {
        button.innerHTML = "";
      }
    }
    if (isFormError) {
      return;
    }
    button.disabled = !variant || !variant.available;
  }
  function getProductUrl(productHandle, variant, templateSuffix) {
    if (!productHandle) {
      return;
    }
    const locale = window.Shopify.routes.root;
    const url = new URL(`${window.location.origin}${locale}products/${productHandle}`);
    url.searchParams.set("view", templateSuffix);
    if (variant) {
      url.searchParams.set("variant", variant);
    }
    return url;
  }
  function hidePrice(price) {
    if (!price) {
      return;
    }
    price.innerHTML = "";
  }
  async function submitHandler(event) {
    const form = event.target.closest(selectors.form);
    const formData = form && new FormData(form);
    const variant = form && form.querySelector(selectors.hiddenInput);
    const variantId = variant && variant.value;
    const minQuantityEl = form && form.querySelector(selectors.minQuantity);
    const minQuantity = minQuantityEl ? Number(minQuantityEl.value) : 1;
    if (!formData || !variantId) {
      return;
    }
    event.preventDefault();
    const errorMessage = await addToCart(variantId, minQuantity);
    changeErrorMessage(form, errorMessage);
    window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART);
    if (!errorMessage) {
      return;
    }
  }
  async function addToCart(variantId, quantity) {
    try {
      await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.ADD_TO_CART, {
        id: variantId,
        quantity
      });
    } catch (error) {
      return error.description;
    }
  }
  function changeErrorMessage(form, message = "") {
    const formError = form && form.querySelector(selectors.formError);
    if (!formError) {
      return;
    }
    formError.innerText = message;
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ProductCardWithForm = window.themeCore.ProductCardWithForm || ProductCardWithForm();
  window.themeCore.utils.register(window.themeCore.ProductCardWithForm, "product-card-with-banner");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
