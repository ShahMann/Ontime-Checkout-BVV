import { d as disableTabulationOnNotActiveSlidesWithModel } from "./disableTabulationOnNotActiveSlidesWithModel-38e80234.js";
const selectors$2 = {
  container: "[data-js-product-container]",
  form: "[data-js-product-form]",
  product: "[data-js-product-json]",
  sku: ".js-product-sku",
  price: ".js-price",
  productPrice: "[data-product-price]",
  productPriceOld: "[data-price-old]",
  priceUnit: "[data-js-unit-price]",
  productPriceDiscount: "[data-product-price-discount]",
  variantId: '[name="id"]',
  submit: '[type="submit"]',
  quantityError: ".js-product-quantity-error",
  variants: "[data-js-product-variant]",
  isPreset: "[data-is-preset]",
  productInventory: "[data-product-inventory]",
  lowStockText: ".js-product-low-stock-msg",
  highStockText: ".js-product-high-stock-msg",
  additionalQuantityInput: "[data-quantity-input-additional]",
  stickyBar: ".js-sticky-add-to-cart",
  stickyBarButton: ".js-sticky-add-to-cart-button",
  recipientCheckbox: ".js-recipient-form-checkbox",
  recipientFieldsContainer: ".js-recipient-form-fields",
  recipientField: ".js-recipient-form-field",
  recipientTimeZoneOffset: ".js-recipient-form-timezone-offset",
  recipientNoJsControl: ".js-recipient-form-no-js-control",
  customFieldGroup: ".js-custom-field-block",
  customFieldInput: ".js-custom-field-input",
  customFieldCheckbox: ".js-custom-field-checkbox",
  animate: ".js-animate",
  breaksVal: ".js-price-breaks-val",
  volumePricing: ".js-product-volume-pricing",
  quantityRuleMin: ".js-product-quantity-rule-min",
  quantityRuleMax: ".js-product-quantity-rule-max",
  quantityRuleIncrement: ".js-product-quantity-rule-increment",
  quantityRuleMinVal: ".js-product-quantity-rule-min-val",
  quantityRuleMaxVal: ".js-product-quantity-rule-max-val",
  quantityRuleIncrementVal: ".js-product-quantity-rule-increment-val",
  volumePricingList: ".js-product-volume-pricing-list",
  volumePricingJSON: "[data-product-qty-breaks-json]",
  volumePricingShowMore: ".js-product-volume-pricing-show-more",
  priceVolume: ".js-price-volume",
  formError: ".js-form-error",
  swatchLabelName: ".js-swatch-label-name",
  quantityRules: ".js-product-quantity-rules",
  productAddToCartText: ".js-product-add-to-cart-button-text",
  inventoryStatusQuantity: ".js-product-inventory-status-quantity"
};
let classes = {};
const attributes = {
  id: "id",
  isCurrencyEnabled: "data-currency-code-enabled"
};
const ProductForm = () => {
  let convertFormData;
  let QuantityWidget;
  let cssClasses;
  let formatMoney;
  let getUrlWithVariant;
  let containers = [];
  let forms = [];
  function init2() {
    window.themeCore.utils.arrayIncludes;
    convertFormData = window.themeCore.utils.convertFormData;
    QuantityWidget = window.themeCore.utils.QuantityWidget;
    cssClasses = window.themeCore.utils.cssClasses;
    formatMoney = window.themeCore.utils.formatMoney;
    getUrlWithVariant = window.themeCore.utils.getUrlWithVariant;
    classes = {
      ...cssClasses,
      onSale: "price--on-sale",
      hidePrice: "price--hide",
      animate: "js-animate",
      animated: "animated"
    };
    containers = findContainers();
    forms = setForms();
    setEventListeners();
    setEventBusListeners2();
    initOptions();
    showOptions();
    initStickyBar();
    initRecipientForm();
  }
  function setEventListeners() {
    forms.forEach(({ container, form }) => {
      const formId = form.getAttribute("id");
      const formElements = [...container.querySelectorAll(`[form=${formId}]`)];
      formElements.forEach((formElement) => {
        formElement.addEventListener("change", onChangeForm);
      });
      form.addEventListener("submit", onFormSubmit);
    });
    window.themeCore.EventBus.listen("cart:updated", function(cartData) {
      if (!cartData) {
        return;
      }
      if (!cartData.items) {
        return;
      }
      containers.forEach(function(container) {
        const variantSelector = container.querySelector("[name=id]");
        variantSelector.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }
  function setEventBusListeners2() {
    if (forms.length) {
      forms.forEach(({ form }) => {
        const formId = form.getAttribute("id");
        window.themeCore.EventBus.listen(`form:${formId}:change-variant`, updateForm);
      });
    }
  }
  function updateForm({ currentVariant, elements, container, form, product, isTrusted }) {
    updateOptions({
      product,
      elements,
      form
    });
    const quantityVariantInCart = getVariantCountInCart(currentVariant);
    if (isTrusted) {
      updateSwatchLabelName(currentVariant, container);
      updateSku(elements, currentVariant);
      updateSku({ skuContainer: elements.mobileSkuContainer }, currentVariant);
      updatePrice(elements, currentVariant);
      updateVariantId(elements, currentVariant);
      updateErrorMessages(elements);
      updateAddToCart(elements, currentVariant);
      updateStockStatus(container, currentVariant);
      updatePickupAvailability(currentVariant, container);
    }
    updateVolumePricing(container, currentVariant, quantityVariantInCart, isTrusted);
    updateQuantityRules(container, currentVariant);
    updateQuantityLabelCartCount(container, quantityVariantInCart);
  }
  function updatePickupAvailability(variant, container) {
    const pickUpAvailability = container.querySelector("pickup-availability");
    if (!pickUpAvailability) {
      return;
    }
    if (variant && variant.available) {
      pickUpAvailability.fetchAvailability(variant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }
  function updateSwatchLabelName(variant, container) {
    const swatchNameEl = container.querySelector(selectors$2.swatchLabelName);
    if (!swatchNameEl) {
      return;
    }
    if (!variant) {
      const swatchName = swatchNameEl.getAttribute("data-swatch-name");
      const swatchOptionSelected = container.querySelector(`[data-option='${swatchName}']:checked`);
      if (swatchOptionSelected) {
        swatchNameEl.textContent = swatchOptionSelected.value;
      }
      return;
    }
    const optionPosition = swatchNameEl.getAttribute("data-swatch-position");
    const optionLabel = "option" + optionPosition;
    const optionName = variant[optionLabel];
    if (!optionName) {
      return;
    }
    swatchNameEl.textContent = optionName;
  }
  function updatePrice({ priceContainers }, variant) {
    if (!variant) {
      priceContainers.forEach((priceContainer) => priceContainer.classList.add(classes.hidePrice));
      updateUnitPrice(priceContainers, {});
      return;
    } else if (!priceContainers.length) {
      return;
    }
    priceContainers.forEach((priceContainer) => {
      const isCurrencyEnabled = priceContainer.hasAttribute(attributes.isCurrencyEnabled);
      const format = isCurrencyEnabled ? window.themeCore.objects.shop.money_with_currency_format : window.themeCore.objects.shop.money_format;
      const { price, compare_at_price } = variant;
      const onSale = compare_at_price > price;
      const moneyPrice = formatMoney(price, format);
      const moneyPriceOld = formatMoney(compare_at_price, format);
      priceContainer.classList.remove(classes.hidePrice);
      if (onSale) {
        priceContainer.classList.add(classes.onSale);
        const productPriceDiscount = priceContainer.querySelector(selectors$2.productPriceDiscount);
        const discountPercentage = (compare_at_price - price) / compare_at_price * 100;
        if (productPriceDiscount)
          productPriceDiscount.innerHTML = `-${Math.ceil(discountPercentage)}%`;
      } else {
        priceContainer.classList.remove(classes.onSale);
      }
      const productPrice = priceContainer.querySelectorAll(selectors$2.productPrice);
      const productPriceOld = priceContainer.querySelectorAll(selectors$2.productPriceOld);
      productPrice.forEach((element) => element.innerHTML = moneyPrice);
      productPriceOld.forEach((element) => element.innerHTML = moneyPriceOld);
    });
    updateUnitPrice(priceContainers, variant);
  }
  function updateUnitPrice(priceContainers, variant) {
    priceContainers.forEach((priceContainer) => {
      const unitPrice = [...priceContainer.querySelectorAll(selectors$2.priceUnit)];
      if (!unitPrice.length) {
        return;
      }
      const unitPriceContainerEl = unitPrice.find((element) => element.dataset.jsUnitPrice === "container");
      const unitPriceMoneyEl = unitPrice.find((element) => element.dataset.jsUnitPrice === "money");
      const unitPriceReferenceEl = unitPrice.find((element) => element.dataset.jsUnitPrice === "reference");
      const variantUnitPrice = variant.unit_price;
      const variantUnitPriceMeasurement = variant.unit_price_measurement;
      if (unitPriceMoneyEl) {
        if (variantUnitPrice) {
          const format = window.themeCore.objects.shop.money_format;
          unitPriceMoneyEl.innerHTML = formatMoney(variantUnitPrice, format);
        } else {
          unitPriceMoneyEl.innerHTML = "";
        }
      }
      if (unitPriceReferenceEl) {
        if (variantUnitPriceMeasurement) {
          const referenceValue = variantUnitPriceMeasurement.reference_value;
          const referenceUnit = variantUnitPriceMeasurement.reference_unit;
          unitPriceReferenceEl.innerHTML = referenceValue !== 1 ? referenceValue + referenceUnit : referenceUnit;
        } else {
          unitPriceReferenceEl.innerHTML = "";
        }
      }
      if (unitPriceContainerEl && (variantUnitPrice || variantUnitPriceMeasurement)) {
        unitPriceContainerEl.classList.remove(window.themeCore.utils.cssClasses.hidden);
      } else {
        unitPriceContainerEl.classList.add(window.themeCore.utils.cssClasses.hidden);
      }
    });
  }
  function updateSku({ skuContainer }, variant) {
    if (!skuContainer) {
      return;
    }
    let sku = null;
    if (variant) {
      sku = variant.sku;
    }
    if (!sku) {
      const isPreset = skuContainer.closest(selectors$2.isPreset);
      if (isPreset && isPreset.dataset.isPreset === "true") {
        return;
      }
      skuContainer.innerHTML = "";
      return;
    }
    const skuText = skuContainer.dataset.skuText;
    skuContainer.innerHTML = skuText ? skuText.replaceAll("{SKU}", sku).replaceAll("{sku}", sku) : sku;
  }
  function updateVariantId({ variantIdContainers }, variant) {
    if (!variantIdContainers || !variantIdContainers.length || !variant) {
      return;
    }
    const { id } = variant;
    variantIdContainers.forEach((variantIdContainer) => variantIdContainer.value = id);
  }
  function updateErrorMessages({ quantityError }) {
    if (!quantityError) {
      return;
    }
    quantityError.innerHTML = "";
  }
  function updateAddToCart({ submit }, currentVariant) {
    const removeDisabled = () => submit.forEach((button) => button.removeAttribute("disabled"));
    const setDisabled = () => submit.forEach((button) => button.setAttribute("disabled", "disabled"));
    const setSubmitText = (text) => submit.forEach((button) => {
      const buttonText = button.querySelector(selectors$2.productAddToCartText);
      buttonText.innerText = text;
    });
    const isPreorderTemplate = submit.some((button) => button.hasAttribute("data-preorder"));
    const soldOut = window.themeCore.translations.get("products.product.sold_out");
    const unavailable = window.themeCore.translations.get("products.product.unavailable");
    const preOrder = window.themeCore.translations.get("products.product.pre_order");
    const addToCart = isPreorderTemplate ? preOrder : window.themeCore.translations.get("products.product.add_to_cart");
    if (currentVariant && currentVariant.available) {
      removeDisabled();
      setSubmitText(addToCart);
    } else if (currentVariant && !currentVariant.available) {
      setDisabled();
      setSubmitText(soldOut);
    } else {
      setDisabled();
      setSubmitText(unavailable);
    }
  }
  function updateStockStatus(container, variant) {
    const productInventoryInfo = container.querySelector(selectors$2.productInventory);
    if (!productInventoryInfo) {
      return;
    }
    const lowStockTreshold = productInventoryInfo.getAttribute("data-low-stock-threshold");
    const lowStockMessage = container.querySelector(selectors$2.lowStockText);
    const highStockMessage = container.querySelector(selectors$2.highStockText);
    const inventoryStatusQuantity = container.querySelectorAll(selectors$2.inventoryStatusQuantity);
    const inventoryJSON = JSON.parse(productInventoryInfo.innerText);
    if (!variant) {
      highStockMessage.classList.add(window.themeCore.utils.cssClasses.hidden);
      lowStockMessage.classList.add(window.themeCore.utils.cssClasses.hidden);
      return;
    }
    const currentInventory = inventoryJSON.find((variantInventory) => variantInventory.id === variant.id);
    const canSellAfterZero = currentInventory.inventory_policy === "continue" || currentInventory.inventory_management === null;
    const inventoryQuantity = currentInventory.inventory_quantity;
    if (inventoryStatusQuantity.length > 0) {
      inventoryStatusQuantity.forEach((quantity) => {
        if (Number(quantity.innerHTML) !== inventoryQuantity) {
          quantity.innerHTML = inventoryQuantity;
        }
        if (canSellAfterZero && inventoryQuantity <= 0) {
          quantity.classList.add(classes.hidden);
        } else {
          quantity.classList.remove(classes.hidden);
        }
      });
    }
    if (!variant || !variant.available || !canSellAfterZero && inventoryQuantity <= 0) {
      highStockMessage.classList.add(window.themeCore.utils.cssClasses.hidden);
      lowStockMessage.classList.add(window.themeCore.utils.cssClasses.hidden);
      return;
    }
    if (!canSellAfterZero && inventoryQuantity <= lowStockTreshold) {
      lowStockMessage.classList.remove(window.themeCore.utils.cssClasses.hidden);
      highStockMessage.classList.add(window.themeCore.utils.cssClasses.hidden);
    }
    if (inventoryQuantity > lowStockTreshold || canSellAfterZero) {
      highStockMessage.classList.remove(window.themeCore.utils.cssClasses.hidden);
      lowStockMessage.classList.add(window.themeCore.utils.cssClasses.hidden);
    }
  }
  function updateQuantityRules(container, variant) {
    const currentContainerData = forms.find((form) => form.container.getAttribute("data-section-id") === container.getAttribute("data-section-id"));
    const quantityWidgetEl = currentContainerData.elements.quantityWidgetEl;
    const quantityRules = container.querySelector(selectors$2.quantityRules);
    if (!quantityRules) {
      return;
    }
    if (!variant || variant && !variant.quantity_rule) {
      quantityRules.classList.add(cssClasses.hidden);
      return;
    } else {
      quantityRules.classList.remove(cssClasses.hidden);
    }
    const variantQuantityRules = variant.quantity_rule;
    const quantityRuleIncrement = quantityRules.querySelector(selectors$2.quantityRuleIncrement);
    const quantityRuleMin = quantityRules.querySelector(selectors$2.quantityRuleMin);
    const quantityRuleMax = quantityRules.querySelector(selectors$2.quantityRuleMax);
    const quantityRuleIncrementVal = quantityRules.querySelector(selectors$2.quantityRuleIncrementVal);
    const quantityRuleMinVal = quantityRules.querySelector(selectors$2.quantityRuleMinVal);
    const quantityRuleMaxVal = quantityRules.querySelector(selectors$2.quantityRuleMaxVal);
    if (quantityRuleIncrementVal) {
      quantityRuleIncrementVal.textContent = window.themeCore.translations.get("products.product.increments_of", { number: variantQuantityRules.increment });
      quantityWidgetEl.setIncrement(variantQuantityRules.increment);
      variantQuantityRules.increment > 1 ? quantityRuleIncrement.classList.remove(cssClasses.hidden) : quantityRuleIncrement.classList.add(cssClasses.hidden);
    }
    if (quantityRuleMinVal) {
      quantityRuleMinVal.textContent = window.themeCore.translations.get("products.product.minimum_of", { number: variantQuantityRules.min });
      quantityWidgetEl.setMin(variantQuantityRules.min);
      quantityWidgetEl.toggleDecrease();
      quantityWidgetEl.toggleIncrease();
      variantQuantityRules.min > 1 ? quantityRuleMin.classList.remove(cssClasses.hidden) : quantityRuleMin.classList.add(cssClasses.hidden);
    }
    if (quantityRuleMaxVal) {
      if (variantQuantityRules.max !== null) {
        quantityRuleMaxVal.textContent = window.themeCore.translations.get("products.product.maximum_of", { number: variantQuantityRules.max });
        quantityRuleMax.classList.remove(cssClasses.hidden);
        quantityWidgetEl.setMax(variantQuantityRules.max);
      } else {
        quantityRuleMaxVal.textContent = "";
        quantityRuleMax.classList.add(cssClasses.hidden);
        quantityWidgetEl.setMax("");
      }
      quantityWidgetEl.toggleDecrease();
      quantityWidgetEl.toggleIncrease();
    }
    if (variantQuantityRules.increment < 2 && variantQuantityRules.min < 2 && variantQuantityRules.max === null) {
      quantityRules.classList.add(cssClasses.hidden);
    } else {
      quantityRules.classList.remove(cssClasses.hidden);
    }
  }
  function updateVolumePricing(container, variant, quantity, isTrusted) {
    const currentContainerData = forms.find((form) => form.container.getAttribute("data-section-id") === container.getAttribute("data-section-id"));
    const quantityWidgetEl = currentContainerData.elements.quantityWidgetEl;
    const currentVariantEl = container.querySelector("[name=id]");
    if (!currentVariantEl) {
      return;
    }
    const volumePricing = container.querySelector(selectors$2.volumePricing);
    const volumePricingList = container.querySelector(selectors$2.volumePricingList);
    const volumePricingJSONEl = container.querySelector(selectors$2.volumePricingJSON);
    let quantityBreaks = null;
    if (!volumePricingJSONEl || !volumePricing) {
      return;
    }
    if (variant) {
      const volumePricingJSON = JSON.parse(volumePricingJSONEl.innerHTML);
      quantityBreaks = volumePricingJSON[variant.id].quantity_price_breaks;
      updateVariantVolumePrice(quantityBreaks);
      if (!isTrusted) {
        return;
      }
      if (quantityBreaks.length) {
        renderVolumePriceList(quantityBreaks);
        volumePricing.classList.remove(cssClasses.hidden);
      } else {
        volumePricing.classList.add(cssClasses.hidden);
      }
    } else {
      volumePricing.classList.add(cssClasses.hidden);
    }
    function renderVolumePriceList(quantityBreaks2) {
      const showMoreBtn = container.querySelector(selectors$2.volumePricingShowMore);
      const moneyFormat = window.themeCore.objects.shop.money_with_currency_format;
      const priceTranslation = window.themeCore.translations.get("products.product.volume_pricing.each", {
        price: formatMoney(variant.price, moneyFormat)
      });
      showMoreBtn.addEventListener("click", function(e) {
        e.preventDefault();
        let listHiddenItems = volumePricingList.querySelectorAll(".is-hidden");
        if (!listHiddenItems.length) {
          return;
        }
        listHiddenItems.forEach(function(listItem) {
          listItem.classList.remove(cssClasses.hidden);
        });
        showMoreBtn.classList.add(cssClasses.hidden);
      });
      volumePricingList.innerHTML = "";
      let defaultMinPriceHTML = `
				<li class="product-volume-pricing__list-item">
					<span>${variant.quantity_rule.min}<span aria-hidden>+</span></span>
					<span>${priceTranslation}</span>
				</li>
			`;
      volumePricingList.insertAdjacentHTML("beforeend", defaultMinPriceHTML);
      quantityBreaks2.forEach(function(quantityBreak, i) {
        let hiddenClass = i >= 2 ? `${cssClasses.hidden}` : "";
        let quantityBreakHTML = `
					<li class="product-volume-pricing__list-item ${hiddenClass}">
						<span>${quantityBreak.minimum_quantity}<span aria-hidden>+</span></span>
						<span>${quantityBreak.price_each}</span>
					</li>
				`;
        volumePricingList.insertAdjacentHTML("beforeend", quantityBreakHTML);
      });
      if (quantityBreaks2.length >= 3) {
        showMoreBtn.classList.remove(cssClasses.hidden);
      } else {
        showMoreBtn.classList.add(cssClasses.hidden);
      }
    }
    function updateVariantVolumePrice(quantityBreaks2) {
      const priceEls = container.querySelectorAll(selectors$2.priceVolume);
      const moneyFormat = window.themeCore.objects.shop.money_with_currency_format;
      const priceTranslation = window.themeCore.translations.get("products.product.volume_pricing.price_at_each", {
        price: formatMoney(variant.price, moneyFormat)
      });
      if (!priceEls.length) {
        return;
      }
      if (!variant) {
        priceEls.forEach((el) => el.classList.add(cssClasses.hidden));
        return;
      }
      if (!quantityBreaks2 || !quantityBreaks2.length) {
        priceEls.forEach((el) => el.innerHTML = priceTranslation);
        priceEls.forEach((el) => el.classList.remove(cssClasses.hidden));
        return;
      }
      const currentBreak = quantityBreaks2.findLast((qtyBreak) => {
        return Number(quantity) + Number(quantityWidgetEl.quantity.value) >= qtyBreak.minimum_quantity;
      });
      if (!currentBreak) {
        priceEls.forEach((el) => el.innerHTML = priceTranslation);
        priceEls.forEach((el) => el.classList.remove(cssClasses.hidden));
        return;
      }
      priceEls.forEach((el) => el.innerHTML = currentBreak.price_at_each);
      priceEls.forEach((el) => el.classList.remove(cssClasses.hidden));
    }
  }
  function getVariantCountInCart(variant) {
    const cartData = window.themeCore.cartObject;
    if (!cartData || !variant) {
      return;
    }
    if (!cartData.items.length) {
      return 0;
    }
    const currentVariant = cartData.items.find(function(item) {
      return item.variant_id === variant.id;
    });
    if (!currentVariant) {
      return 0;
    }
    return currentVariant.quantity;
  }
  function updateQuantityLabelCartCount(container, quantity) {
    if (!container) {
      return;
    }
    const priceBreaksEl = container.querySelector(selectors$2.breaksVal);
    if (!priceBreaksEl) {
      return;
    }
    priceBreaksEl.classList.toggle(cssClasses.hidden, !quantity);
    if (!quantity) {
      priceBreaksEl.innerHTML = "";
    }
    priceBreaksEl.innerHTML = window.themeCore.translations.get("products.product.quantity_in_cart", { quantity });
  }
  function onChangeForm({ currentTarget: targetFormElement, target, isTrusted }) {
    const formId = targetFormElement.getAttribute("form");
    const currentFormEntity = forms.find(({ form, elements: { optionElements } }) => {
      const currentFormId = form.getAttribute("id");
      return currentFormId === formId && (optionElements.includes(target) || target.name === "id");
    });
    if (!currentFormEntity) {
      return;
    }
    currentFormEntity.findVariant = {
      isId: target.name === "id",
      target
    };
    currentFormEntity.isTrusted = isTrusted;
    findCurrentVariant(currentFormEntity);
  }
  function validateCustomFields(arr) {
    const MINIMAL_SCROLL_OFFSET = 32;
    let error = false;
    let invalidObj = null;
    arr.forEach(function(obj) {
      const inputValue = obj.input.value.trim();
      if (obj.checkbox) {
        if (obj.checkbox.checked && !inputValue.length) {
          obj.input.classList.add("error");
          obj.checkbox.classList.remove("error");
          invalidObj = obj;
          error = true;
        } else if (!obj.checkbox.checked && inputValue.length) {
          obj.input.classList.remove("error");
          obj.checkbox.classList.add("error");
          invalidObj = obj;
          error = true;
        } else {
          obj.input.classList.remove("error");
          obj.checkbox.classList.remove("error");
        }
      }
    });
    if (invalidObj) {
      const elementY = getElementY(invalidObj.input);
      const targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight - MINIMAL_SCROLL_OFFSET : elementY - MINIMAL_SCROLL_OFFSET;
      window.scrollTo({
        top: targetY,
        behavior: "smooth"
      });
    }
    return error;
  }
  function getElementY(element) {
    return window.pageYOffset + element.getBoundingClientRect().top;
  }
  function onFormSubmit(event) {
    const target = event.target;
    event.preventDefault();
    const form = forms.find((f) => f.id === target.getAttribute(attributes.id));
    const customFieldElementsArr = form.elements.customFieldElements;
    if (customFieldElementsArr) {
      let isError = validateCustomFields(customFieldElementsArr);
      if (isError) {
        return;
      }
    }
    if (form) {
      const { submit } = form.elements;
      submit.forEach((button) => button.classList.add(classes.loading));
    }
    const formData = new FormData(target);
    const serialized = convertFormData(formData);
    window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.ADD_TO_CART, serialized).then((response) => {
      onFormSubmitSuccess(response, form);
    }).catch((error) => {
      onFormSubmitError(error, form);
    });
  }
  function onFormSubmitSuccess(success, form) {
    if (!form) {
      return;
    }
    const formElement = form.container;
    const { quantityWidget, submit } = form.elements;
    quantityWidget && quantityWidget.setValue(0);
    submit.forEach((button) => button.classList.remove(classes.loading));
    resetRecipientForm(formElement);
    window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART);
  }
  function onFormSubmitError(error, form) {
    if (!form) {
      return;
    }
    const formElement = form.container;
    const hasRecipientForm = formElement.querySelector(selectors$2.recipientCheckbox);
    let { description } = error;
    const { quantityError, submit } = form.elements;
    if (typeof description === "object" && hasRecipientForm) {
      const sectionID = form.container.dataset.sectionId;
      let errors = error.errors;
      const errorMessages = formElement.querySelectorAll(selectors$2.formError);
      const recipientFormFields = formElement.querySelectorAll(selectors$2.recipientField);
      if (errorMessages.length && recipientFormFields.length) {
        errorMessages.forEach(function(messageEl) {
          messageEl.classList.add(classes.hidden);
          messageEl.innerText = "";
        });
        recipientFormFields.forEach(function(field) {
          field.setAttribute("aria-invalid", false);
          field.removeAttribute("aria-describedby");
        });
      }
      return Object.entries(errors).forEach(([key, value]) => {
        const errorMessageId = `RecipientForm-${key}-error-${sectionID}`;
        const errorMessageElement = formElement.querySelector(`#${errorMessageId}`);
        const inputId = `Recipient-${key}-${sectionID}`;
        const inputElement = formElement.querySelector(`#${inputId}`);
        let message = `${value.join(", ")}`;
        if (key === "send_on") {
          message = `${value.join(", ")}`;
        }
        if (errorMessageElement) {
          errorMessageElement.innerText = message;
          errorMessageElement.classList.remove(classes.hidden);
        }
        if (inputElement) {
          inputElement.setAttribute("aria-invalid", true);
          inputElement.setAttribute("aria-describedby", errorMessageId);
        }
        submit.forEach((button) => button.classList.remove(classes.loading));
      });
    }
    quantityError && (quantityError.innerHTML = description);
    submit.forEach((button) => button.classList.remove(classes.loading));
  }
  function findCurrentVariant({ container, form, product, elements, findVariant, isTrusted = true }, firstInitialization = false) {
    const variants = product.variants;
    const formData = new FormData(form);
    const sectionId = container.dataset.sectionId;
    const formId = form.getAttribute("id");
    let currentVariant;
    const optionKeys = [...formData.keys()].filter((key) => key.startsWith("option"));
    let options = {};
    optionKeys.forEach((key) => options[key] = formData.get(key));
    if (Object.keys(options).some((key) => options[key])) {
      currentVariant = variants.find((variant) => Object.keys(options).every((key) => options[key] === variant[key]));
    } else if (findVariant && findVariant.isId) {
      currentVariant = variants.find((variant) => Number(findVariant.target.value) === variant.id);
    } else {
      return;
    }
    window.themeCore.EventBus.emit(`form:${formId}:change-variant`, {
      container,
      form,
      product,
      currentVariant,
      elements,
      isTrusted
    });
    if (currentVariant) {
      window.themeCore.EventBus.emit(`pdp:section-${sectionId}:change-variant`, {
        variantId: currentVariant.id,
        variant: currentVariant,
        product,
        firstInitialization
      });
      document.dispatchEvent(
        new CustomEvent("product:variant:change", {
          detail: currentVariant.id
        })
      );
    } else {
      document.dispatchEvent(
        new CustomEvent("product:variant:change", {
          detail: null
        })
      );
    }
    if (isEnableHistoryState(form)) {
      updateHistoryState(currentVariant);
    }
  }
  function updateHistoryState(variant) {
    if (!variant) {
      return null;
    }
    const url = getUrlWithVariant(window.location.href, variant.id);
    window.history.replaceState({ path: url }, "", url);
  }
  function isEnableHistoryState(form) {
    return form.dataset.enableHistoryState || false;
  }
  function initOptions() {
    forms.forEach((form) => {
      updateOptions(form);
      findCurrentVariant(form, true);
    });
  }
  function updateOptions(formEntity) {
    const {
      product,
      elements: { optionElements },
      form
    } = formEntity;
    const formData = new FormData(form);
    const selected = {
      option1: null,
      option2: null,
      option3: null
    };
    for (const [key, value] of formData.entries()) {
      if (Object.keys(selected).includes(key)) {
        selected[key] = value;
      }
    }
    const existingOptions = Object.keys(selected).filter((key) => selected[key]);
    existingOptions.forEach((option, index) => {
      const currentElements = optionElements.filter(({ name }) => option === name);
      currentElements.forEach((currentElement) => {
        const { value, name } = currentElement;
        const variantOptions = {};
        product.options.forEach((option2, currentIndex) => {
          const key = `option${currentIndex + 1}`;
          if (currentIndex < index) {
            variantOptions[key] = selected[key];
          }
        });
        variantOptions[name] = value;
        const availableVariant = product.variants.find((variant) => Object.keys(variantOptions).every((key) => variantOptions[key] === variant[key]) && variant.available);
        setAvailable(currentElement, !!availableVariant);
      });
    });
  }
  function setAvailable(input, available) {
    let label = input.nextElementSibling;
    if (input.matches("select")) {
      return;
    }
    if (available) {
      label.classList.remove(cssClasses.disabled);
    } else {
      label.classList.add(cssClasses.disabled);
    }
  }
  function findContainers() {
    return [...document.querySelectorAll(selectors$2.container)];
  }
  function setForms() {
    return containers.reduce((acc, container) => {
      const productJsonTag = container.querySelector(selectors$2.product);
      const form = container.querySelector(selectors$2.form);
      let product = {};
      try {
        product = JSON.parse(productJsonTag.innerHTML);
      } catch (e) {
        return acc;
      }
      const findFormSubmitButtons = () => {
        return [...container.querySelectorAll(selectors$2.submit)].filter((button) => {
          const isInsideForm = button.closest(selectors$2.form);
          const buttonForm = button.getAttribute("form");
          const formId = form.getAttribute("id");
          return isInsideForm || buttonForm === formId;
        });
      };
      const id = form.getAttribute(attributes.id);
      const submit = findFormSubmitButtons();
      const skuContainer = container.querySelector(selectors$2.sku);
      const priceContainers = [...container.querySelectorAll(selectors$2.price)];
      const quantityError = container.querySelector(selectors$2.quantityError);
      const variantIdContainers = [...container.querySelectorAll(selectors$2.variantId)];
      const optionElements = [...container.querySelectorAll("[data-option]")];
      let mobileSkuContainer = null;
      const additionalQuantityInput = container.querySelector(selectors$2.additionalQuantityInput);
      const quantityWidgetEl = QuantityWidget(container, {
        onQuantityChange: (widget) => {
          updateErrorMessages({ quantityError });
          variantIdContainers.forEach(function(variantContainer) {
            variantContainer.dispatchEvent(new Event("change", { bubbles: true }));
          });
          additionalQuantityInput && (additionalQuantityInput.value = widget.quantity.value);
        }
      }).init();
      additionalQuantityInput && additionalQuantityInput.addEventListener("input", () => {
        if (additionalQuantityInput.value !== quantityWidgetEl.value) {
          quantityWidgetEl.setValue(additionalQuantityInput.value);
          quantityWidgetEl.dispatch();
        }
      });
      const customFieldBlocks = [...container.querySelectorAll(selectors$2.customFieldGroup)];
      const customFieldElements = customFieldBlocks.map(function(customFieldBlock) {
        let input = customFieldBlock.querySelector(selectors$2.customFieldInput);
        let checkbox = customFieldBlock.querySelector(selectors$2.customFieldCheckbox);
        return {
          input,
          checkbox
        };
      });
      return [
        ...acc,
        {
          id,
          container,
          form,
          product,
          elements: {
            skuContainer,
            priceContainers,
            quantityWidgetEl,
            quantityError,
            variantIdContainers,
            submit,
            mobileSkuContainer,
            optionElements,
            customFieldElements
          }
        }
      ];
    }, []);
  }
  function initStickyBar() {
    containers.forEach((container) => {
      const stickyBar = container.querySelector(selectors$2.stickyBar);
      const mainButton = container.querySelector(selectors$2.submit);
      if (!stickyBar || !mainButton) {
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const rect = mainButton.getBoundingClientRect();
          stickyBar.classList.toggle(window.themeCore.utils.cssClasses.active, !entry.isIntersecting && rect.bottom < 0);
          if (!entry.isIntersecting) {
            const animate = stickyBar.closest(selectors$2.animate);
            animate && animate.classList.remove(classes.animate);
            animate && animate.classList.add(classes.animated);
          }
        });
      }, {});
      observer.observe(mainButton);
      stickyBar.addEventListener("click", (event) => {
        const stickyBarButton = event.target.closest(selectors$2.stickyBarButton);
        if (!stickyBarButton) {
          return;
        }
        mainButton.focus();
      });
    });
  }
  function initRecipientForm() {
    containers.forEach((container) => {
      const recipientCheckbox = container.querySelector(selectors$2.recipientCheckbox);
      const recipientFormFieldsContainer = container.querySelector(selectors$2.recipientFieldsContainer);
      const recipientFormFields = container.querySelectorAll(selectors$2.recipientField);
      const recipientTimeZoneOffset = container.querySelector(selectors$2.recipientTimeZoneOffset);
      const recipientControlNoJsCheckbox = container.querySelector(selectors$2.recipientNoJsControl);
      if (!recipientCheckbox || !recipientFormFieldsContainer || !recipientFormFields || !recipientTimeZoneOffset) {
        return;
      }
      recipientTimeZoneOffset.value = (/* @__PURE__ */ new Date()).getTimezoneOffset().toString();
      recipientControlNoJsCheckbox.disabled = true;
      recipientCheckbox.disabled = false;
      disableInputFields();
      recipientCheckbox.addEventListener("change", function() {
        if (recipientCheckbox.checked) {
          recipientFormFieldsContainer.classList.remove(classes.hidden);
          enableInputFields();
        } else {
          recipientFormFieldsContainer.classList.add(classes.hidden);
          disableInputFields();
        }
      });
      function disableInputFields() {
        recipientFormFields.forEach(function(field) {
          field.disabled = true;
        });
        recipientTimeZoneOffset.disabled = true;
      }
      function enableInputFields() {
        recipientFormFields.forEach(function(field) {
          field.disabled = false;
        });
        recipientTimeZoneOffset.disabled = false;
      }
    });
  }
  function recipientFormClearErrors(form) {
    const recipientCheckbox = form.querySelector(selectors$2.recipientCheckbox);
    if (!recipientCheckbox) {
      return;
    }
    const recipientFormFieldsContainer = form.querySelector(selectors$2.recipientFieldsContainer);
    const errorMessages = recipientFormFieldsContainer.querySelectorAll(selectors$2.formError);
    const recipientFormFields = form.querySelectorAll(selectors$2.recipientField);
    if (!errorMessages || !recipientFormFields) {
      return;
    }
    errorMessages.forEach(function(messageEl) {
      messageEl.classList.add(classes.hidden);
      messageEl.innerText = "";
    });
    recipientFormFields.forEach(function(field) {
      field.setAttribute("aria-invalid", false);
      field.removeAttribute("aria-describedby");
    });
  }
  function recipientFormClearInputs(form) {
    const recipientCheckbox = form.querySelector(selectors$2.recipientCheckbox);
    if (!recipientCheckbox) {
      return;
    }
    const recipientFormFields = form.querySelectorAll(selectors$2.recipientField);
    if (!recipientFormFields) {
      return;
    }
    recipientFormFields.forEach(function(field) {
      field.value = "";
    });
  }
  function resetRecipientForm(form) {
    const recipientCheckbox = form.querySelector(selectors$2.recipientCheckbox);
    if (!recipientCheckbox) {
      return;
    }
    if (recipientCheckbox.checked) {
      recipientCheckbox.checked = false;
      recipientCheckbox.dispatchEvent(new Event("change"));
      recipientFormClearErrors(form);
      recipientFormClearInputs(form);
    }
  }
  function showOptions() {
    containers.forEach((form) => {
      const variants = form.querySelector(selectors$2.variants);
      if (variants && variants.dataset.jsProductVariant !== "no-hidden") {
        variants.classList.add(cssClasses.hidden);
        variants.addEventListener("change", () => {
        });
      }
    });
  }
  function allForms() {
    return forms;
  }
  return Object.freeze({
    init: init2,
    allForms
  });
};
const selectors$1 = {
  container: "[data-zoom-container]",
  media: "[data-zoom-media]",
  modal: "[data-zoom-modal]",
  toggle: "[data-zoom-modal-toggle]",
  content: "[data-zoom-content]",
  slider: "[data-zoom-slider]",
  slide: "[data-zoom-slide]",
  modalMedia: ".js-zoom-slider-modal-media",
  prevSlide: ".swiper-button-prev",
  nextSlide: ".swiper-button-next",
  button: "[data-js-zoom-button]",
  productSlider: "[data-js-product-media-slider]",
  productSliderWrapper: ".swiper-wrapper",
  notInitedIframe: ".js-video.js-video-youtube, .js-video:empty"
};
const breakpoints = {
  afterMedium: 1200
};
const Zoom = (context = document) => {
  const Swiper = window.themeCore.utils.Swiper;
  const off = window.themeCore.utils.off;
  const on = window.themeCore.utils.on;
  const Toggle2 = window.themeCore.utils.Toggle;
  const VIDEO_TYPES = window.themeCore.utils.VIDEO_TYPES;
  const Video2 = window.themeCore.utils.Video;
  const globalClasses = window.themeCore.utils.cssClasses;
  let containers = null;
  let isDrag = false;
  async function init2() {
    containers = getContainers();
    containers.forEach((container) => {
      if (!container.media.length) {
        return;
      }
      container.modal.init();
      initVideos2(container);
      container.slider = initMediaSlider(container);
      const observer = new MutationObserver(() => {
        if (container.el.querySelector(selectors$1.notInitedIframe)) {
          return;
        }
        disableTabulationOnNotActiveSlidesWithModel(container.slider);
        observer.disconnect();
      });
      const observerOptions = {
        attributes: true,
        childList: true,
        subtree: true
      };
      observer.observe(container.el, observerOptions);
      zoomMove(container);
    });
    setEventListeners();
  }
  function zoomMove(container) {
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    const mouseDownHandler = function(e) {
      if (window.innerWidth < breakpoints.afterMedium) {
        return;
      }
      pos = {
        x: e.clientX,
        y: e.clientY
      };
      on("mousemove", document, mouseMoveHandler);
      on("mouseup", document, mouseUpHandler);
    };
    const mouseMoveHandler = function(e) {
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;
      isDrag = Boolean(dx + dy);
    };
    const mouseUpHandler = function() {
      off("mousemove", document, mouseMoveHandler);
      off("mouseup", document, mouseUpHandler);
    };
    on("mousedown", container.el, mouseDownHandler);
  }
  function setEventListeners() {
    containers.forEach((container) => {
      on("click", container.el, (e) => onTriggerClick(e, container));
      on("click", container.el, (e) => onSlideClick(e, container));
      on("click", container.el, (e) => onButtonClick(e, container));
      window.themeCore.EventBus.listen(
        `Toggle:${container.modalEl.id}:close`,
        (e) => onZoomModalClose(e, container)
      );
    });
  }
  function getContainers() {
    return [...context.querySelectorAll(selectors$1.container)].map(
      (container) => {
        const media = [...container.querySelectorAll(selectors$1.media)];
        const slides = [...container.querySelectorAll(selectors$1.slide)];
        const content = container.querySelector(selectors$1.content);
        const modalEl = container.querySelector(selectors$1.modal);
        const sliderEl = container.querySelector(selectors$1.slider);
        const button = container.querySelector(selectors$1.button);
        const modal = Toggle2({
          toggleSelector: modalEl.id
        });
        return {
          el: container,
          sliderEl,
          slides,
          modalEl,
          modal,
          media,
          content,
          button
        };
      }
    );
  }
  function initVideos2({ slides }) {
    slides.forEach((slide) => {
      const [video] = Video2({
        videoContainer: slide,
        options: {
          youtube: {
            controls: 1,
            showinfo: 1
          }
        }
      }).init();
      if (video) {
        slide.video = video;
      }
    });
  }
  function initMediaSlider({ sliderEl, slides }) {
    return new Swiper(sliderEl, {
      slidesPerView: 1,
      allowTouchMove: false,
      zoom: {
        maxRatio: 3,
        minRatio: 1
      },
      navigation: {
        prevEl: selectors$1.prevSlide,
        nextEl: selectors$1.nextSlide
      },
      on: {
        beforeSlideChangeStart: function(slider) {
          if (slider && slider.zoom && typeof slider.zoom.out === "function") {
            slider.zoom.out();
          }
        },
        slideChange: function(swiper) {
          pauseAllVideos(slides);
          disableTabulationOnNotActiveSlidesWithModel(swiper);
        }
      }
    });
  }
  function pauseAllVideos(slides) {
    const videoSlides = slides.filter((slide) => slide.video);
    if (!videoSlides.length) {
      return;
    }
    videoSlides.forEach(({ video }) => {
      if (VIDEO_TYPES.youtube === video.type) {
        video.player.pauseVideo();
      } else {
        video.player.pause();
      }
    });
  }
  function onTriggerClick(event, container) {
    const media = event.target.closest(selectors$1.media);
    if (!media || !container.media.length) {
      return;
    }
    removeLoaded(container.modalEl);
    const mediaId = media.dataset.zoomMedia;
    const index = container.slides.findIndex(
      (slide) => slide.dataset.zoomSlide === mediaId
    );
    container.slider.slideTo(index, 0);
    document.querySelector(":root").style.setProperty("--page-height", ` ${window.innerHeight}px`);
    container.modal.open(container.modalEl);
    disableTabulationOnNotActiveSlidesWithModel(container.slider);
    window.themeCore.EventBus.emit("product:zoom:open");
  }
  function onSlideClick(event, container) {
    const slide = event.target.closest(selectors$1.slide);
    if (!slide || isDrag) {
      isDrag = false;
      return;
    }
    container.slider.zoom.toggle();
  }
  function onButtonClick(event, container) {
    const button = event.target.closest(selectors$1.button);
    if (!button) {
      return;
    }
    removeLoaded(container.modalEl);
    const galleryLayout = container.el.dataset.mediaLayout;
    const productSlider = container.el.querySelector(
      selectors$1.productSlider
    );
    if (!productSlider) {
      return;
    }
    let media = null;
    switch (galleryLayout) {
      case "carousel":
        media = productSlider.querySelector(".swiper-slide-active");
        break;
      case "stacked":
        media = [...productSlider.querySelectorAll(".swiper-slide")][0];
        break;
      case "stacked_2_col":
        media = [...productSlider.querySelectorAll(".swiper-slide")][0];
        break;
      default:
        media = [...productSlider.querySelectorAll(".swiper-slide")][0];
        return;
    }
    if (!media || !container.media.length) {
      return;
    }
    const mediaId = media.dataset.zoomMedia || media.dataset.zoomMediaHtmlVideo;
    const index = container.slides.findIndex(
      (slide) => slide.dataset.zoomSlide === mediaId
    );
    container.slider.slideTo(index, 0);
    document.querySelector(":root").style.setProperty("--page-height", ` ${window.innerHeight}px`);
    container.modal.open(container.modalEl);
    disableTabulationOnNotActiveSlidesWithModel(container.slider);
    window.themeCore.EventBus.emit("product:zoom:open");
  }
  function removeLoaded(modal) {
    const modalMedias = modal.querySelectorAll(selectors$1.modalMedia);
    if (modalMedias.length < 1) {
      return;
    }
    modalMedias.forEach((modalMedia) => {
      if (modalMedia.classList.contains(globalClasses.loading)) {
        if (!modalMedia.complete) {
          modalMedia.addEventListener("load", () => {
            modalMedia.classList.remove(globalClasses.loading);
          });
        } else {
          modalMedia.classList.remove(globalClasses.loading);
        }
      }
    });
  }
  function onZoomModalClose(event, container) {
    if (!event) {
      return;
    }
    container.slider.zoom.out();
    pauseAllVideos(container.slides);
  }
  return Object.freeze({
    init: init2
  });
};
const ProductCarousel = ({ config, selectors: selectors2, sectionId }) => {
  const Swiper = window.themeCore.utils.Swiper;
  const extendDefaults = window.themeCore.utils.extendDefaults;
  const defaultSelectors = {
    slider: ".js-product-media-slider",
    sliderNavigationNext: ".js-product-media-slider-next",
    sliderNavigationPrev: ".js-product-media-slider-prev",
    thumbNavigationNext: ".js-product-media-thumb-next",
    thumbNavigationPrev: ".js-product-media-thumb-prev",
    sliderSlideVariantId: ".js-product-gallery-slide-variant",
    sliderThumbnails: ".js-product-media-slider-thumbnails",
    sliderPagination: ".product-media__slider-pagination",
    activeClass: ".swiper-slide-active",
    modelPoster: ".js-product-media-model-poster",
    notInitedIframe: ".js-video.js-video-youtube, .js-video:empty"
  };
  selectors2 = extendDefaults(defaultSelectors, selectors2);
  let Slider = null;
  let Thumbnails = null;
  let initiated = false;
  function init2() {
    if (initiated) {
      return Slider;
    }
    const mainSlider = document.querySelector(selectors2.slider);
    const sliderThumbnails = document.querySelector(selectors2.sliderThumbnails);
    let sliderAutoHeight = mainSlider.dataset.autoHeight;
    const thumbnailsPosition = sliderThumbnails.dataset.thumbnailsPosition;
    let thumbnailsDirections = "horizontal";
    if (thumbnailsPosition === "left") {
      thumbnailsDirections = "vertical";
    }
    if (thumbnailsDirections === "horizontal") {
      Thumbnails = new Swiper(selectors2.sliderThumbnails, {
        direction: thumbnailsDirections,
        slidesPerView: 5,
        spaceBetween: 16,
        freeMode: true,
        watchSlidesProgress: true,
        a11y: {
          slideRole: ""
        },
        threshold: 10
      });
    } else {
      Thumbnails = new Swiper(selectors2.sliderThumbnails, {
        direction: thumbnailsDirections,
        freeMode: true,
        watchSlidesProgress: true,
        threshold: 10,
        breakpoints: {
          1200: {
            slidesPerView: 4,
            spaceBetween: 10
          }
        }
      });
    }
    Thumbnails.$el.on("keydown", (e) => {
      if (e.keyCode !== 13 && e.keyCode !== 32) {
        return;
      }
      const slideIndex = e.target.dataset.slideIndex;
      if (!slideIndex)
        return;
      Thumbnails.slideTo(slideIndex);
      Slider.slideTo(slideIndex);
    });
    let prevArrow = document.querySelector(selectors2.sliderNavigationPrev);
    let nextArrow = document.querySelector(selectors2.sliderNavigationNext);
    let dynamicPagination = document.querySelector(selectors2.slider).getAttribute("data-dynamic-pagination");
    dynamicPagination = dynamicPagination === "true";
    sliderAutoHeight = sliderAutoHeight === "true";
    Slider = new Swiper(selectors2.slider, {
      ...config,
      autoHeight: sliderAutoHeight,
      spaceBetween: 8,
      navigation: {
        nextEl: nextArrow,
        prevEl: prevArrow
      },
      pagination: {
        el: selectors2.sliderPagination,
        clickable: true,
        dynamicBullets: dynamicPagination
      },
      thumbs: {
        swiper: Thumbnails
      }
    });
    let thumbPrevButton = document.querySelector(selectors2.thumbNavigationPrev);
    let thumbNextButton = document.querySelector(selectors2.thumbNavigationNext);
    if (thumbnailsDirections === "vertical" && thumbPrevButton && thumbNextButton) {
      Slider.on("slideChange", function() {
        if (this.activeIndex === 0) {
          thumbPrevButton.setAttribute("disabled", "");
          thumbPrevButton.classList.add("swiper-button-disabled");
        } else {
          thumbPrevButton.removeAttribute("disabled");
          thumbPrevButton.classList.remove("swiper-button-disabled");
        }
        if (this.slides.length - 1 === this.activeIndex) {
          thumbNextButton.setAttribute("disabled", "");
          thumbNextButton.classList.add("swiper-button-disabled");
        } else {
          thumbNextButton.removeAttribute("disabled", "");
          thumbNextButton.classList.remove("swiper-button-disabled");
        }
      });
      thumbPrevButton.addEventListener("click", function() {
        Slider.slidePrev();
      });
      thumbNextButton.addEventListener("click", function() {
        Slider.slideNext();
      });
    }
    Slider.on("slideChange", function(swiper) {
      const activeSlide = swiper.slides[swiper.activeIndex];
      if (!activeSlide) {
        return;
      }
      swiper.allowTouchMove = !(activeSlide.hasAttribute("data-model-slide") && !activeSlide.querySelector(selectors2.modelPoster));
    });
    const targetNode = document.querySelector(selectors2.slider);
    const observer = new MutationObserver(() => {
      if (targetNode.querySelector(selectors2.notInitedIframe)) {
        return;
      }
      disableTabulationOnNotActiveSlidesWithModel(Slider);
      observer.disconnect();
    });
    const observerOptions = {
      attributes: true,
      childList: true,
      subtree: true
    };
    observer.observe(targetNode, observerOptions);
    setEventBusListeners2();
    initiated = true;
  }
  function setEventBusListeners2() {
    if (!Slider) {
      return;
    }
    Slider.on("slideChange", function(swiper) {
      window.themeCore.EventBus.emit("product-slider:slide-change");
      disableTabulationOnNotActiveSlidesWithModel(swiper);
    });
    window.themeCore.EventBus.listen(`pdp:section-${sectionId}:change-variant`, onChangeVariant);
  }
  function onChangeVariant({ variantId }) {
    if (!Slider) {
      return;
    }
    const currentIndex = [...Slider.slides].findIndex((slide) => {
      const slideVariantIdEl = slide.querySelector(selectors2.sliderSlideVariantId);
      if (!slideVariantIdEl) {
        return false;
      }
      const slideVariantIds = slideVariantIdEl.dataset.variantId;
      return slideVariantIds.includes(variantId);
    });
    if (!currentIndex && currentIndex !== 0) {
      return;
    }
    Slider.slideTo(currentIndex);
  }
  function destroy() {
    if (Slider && initiated) {
      Slider.destroy();
      Slider = null;
    }
    if (Thumbnails && initiated) {
      Thumbnails.destroy();
      Thumbnails = null;
    }
    initiated = false;
  }
  function disableSwipe() {
    if (!Slider) {
      return;
    }
    Slider.allowTouchMove = false;
  }
  return Object.freeze({
    init: init2,
    destroy,
    disableSwipe
  });
};
const ProductStickyForm = (section) => {
  const on = window.themeCore.utils.on;
  const DEFAULT_HEADER_HEIGHT = 1;
  const STICKY_SCROLL_KOEFICIENT = 100;
  const selectors2 = {
    stickyContainer: ".js-product-sticky-container",
    headerContentWrapper: "[data-header-container]",
    headerSticky: "[data-header-sticky]",
    cssRoot: ":root"
  };
  const cssVariables = {
    headerHeightStatic: "--header-height-static"
  };
  const breakpoints2 = {
    afterMedium: 1200
  };
  const stickyContainers = [
    ...section.querySelectorAll(selectors2.stickyContainer)
  ];
  const cssRoot = document.querySelector(selectors2.cssRoot);
  let headerHeight = getHeaderHeight();
  let windowHeight = window.innerHeight;
  let oldScrollPosition = window.scrollY;
  function getHeaderHeight() {
    const header = document.querySelector(selectors2.headerContentWrapper);
    if (!header) {
      return DEFAULT_HEADER_HEIGHT;
    }
    const isHeaderSticky = header.closest(selectors2.headerSticky);
    if (!isHeaderSticky) {
      return DEFAULT_HEADER_HEIGHT;
    }
    const headerHeightStaticValue = cssRoot.style.getPropertyValue(cssVariables.headerHeightStatic);
    return headerHeightStaticValue ? parseInt(headerHeightStaticValue) : DEFAULT_HEADER_HEIGHT;
  }
  function init2() {
    if (stickyContainers) {
      const smallerContainer = stickyContainers.reduce(
        (acc, container) => container.offsetHeight > (acc && acc.offsetHeight) ? acc : container
      );
      initStickyContainer(smallerContainer);
    }
  }
  function initStickyContainer(container) {
    if (!container || !section) {
      return;
    }
    container.style.top = headerHeight + "px";
    on("scroll", () => {
      onScroll(container);
    });
  }
  function onScroll(container) {
    if (window.innerWidth < breakpoints2.afterMedium) {
      return;
    }
    headerHeight = getHeaderHeight();
    let containerHeight = container.getBoundingClientRect().height || 0;
    let differentHeights = windowHeight - containerHeight + headerHeight;
    setTimeout(() => {
      let currentScrollPosition = window.scrollY;
      windowHeight = window.innerHeight;
      containerHeight = container.getBoundingClientRect().height || 0;
      if (differentHeights < headerHeight) {
        if (oldScrollPosition > differentHeights) {
          section.style.top = `${windowHeight - containerHeight}px`;
        } else {
          section.style.top = `${oldScrollPosition}px`;
        }
      }
      if (currentScrollPosition > oldScrollPosition) {
        let containerTopPosition = parseInt(
          container.style.top.replace("px", "")
        );
        if (!containerTopPosition) {
          return;
        }
        if (containerTopPosition > windowHeight - containerHeight - Math.ceil(
          container.clientHeight / STICKY_SCROLL_KOEFICIENT
        )) {
          container.style.top = `${containerTopPosition - Math.ceil(
            container.clientHeight / STICKY_SCROLL_KOEFICIENT
          )}px`;
        }
      } else if (currentScrollPosition < oldScrollPosition) {
        let containerTopPosition = parseInt(
          container.style.top.replace("px", "")
        );
        if (!containerTopPosition) {
          return;
        }
        if (containerTopPosition < headerHeight) {
          container.style.top = `${containerTopPosition + Math.ceil(
            container.clientHeight / STICKY_SCROLL_KOEFICIENT
          )}px`;
        }
      }
      oldScrollPosition = window.scrollY;
    }, 0);
  }
  return Object.freeze({
    init: init2
  });
};
const ProductNotifyMe = (section) => {
  const sectionId = section && section.dataset.sectionId;
  const selectors2 = {
    notifyMeButtonWrapper: ".js-notify-me-button-wrapper",
    notifyMeButton: ".js-notify-me-button",
    notifyMePopup: ".js-notify-me-popup",
    notifyMeForm: ".js-notify-me-form",
    notifyMeFormStatus: ".js-notify-me-form-status",
    notifyMeFormInputMessage: "[name='contact[message]']",
    notifyMeFormInputProductURL: "[name='contact[ProductURL]']"
  };
  const placeholders = {
    productTitle: "{{ product_title }}"
  };
  const cssClasses = {
    active: "is-active",
    hidden: "is-hidden",
    isPosted: "is-posted",
    isNotifyMeActive: "is-notify-me-popup-active"
  };
  const searchParams = {
    contactPosted: "contact_posted",
    contactProductUrl: "contact[ProductURL]",
    contactMessage: "contact[message]",
    formType: "form_type"
  };
  const Toggle2 = window.themeCore.utils.Toggle;
  const on = window.themeCore.utils.on;
  let notifyMeButtonWrapper = null;
  let notifyMeButton = null;
  let notifyMePopup = null;
  let notifyMeForm = null;
  let notifyMeFormInputMessage = null;
  let notifyMeFormInputProductURL = null;
  let notifyMePopupToggle = null;
  let notifyMeFormStatus = null;
  let notifyMeFormId = null;
  let changeVariantIsFired = false;
  function init2() {
    if (!section || !sectionId) {
      return false;
    }
    notifyMeButtonWrapper = section.querySelector(selectors2.notifyMeButtonWrapper);
    notifyMeButton = section.querySelector(selectors2.notifyMeButton);
    notifyMePopup = section.querySelector(selectors2.notifyMePopup);
    notifyMeForm = section.querySelector(selectors2.notifyMeForm);
    if (!notifyMeButton || !notifyMePopup || !notifyMeForm) {
      return false;
    }
    notifyMeFormId = notifyMeForm.id;
    notifyMeFormInputMessage = notifyMeForm.querySelector(selectors2.notifyMeFormInputMessage);
    notifyMeFormInputProductURL = notifyMeForm.querySelector(selectors2.notifyMeFormInputProductURL);
    notifyMeFormStatus = notifyMeForm.querySelector(selectors2.notifyMeFormStatus);
    if (!notifyMeFormInputMessage || !notifyMeFormInputProductURL || !notifyMeFormStatus) {
      return;
    }
    initToggle();
    initFormStatus();
    setEventBusListeners2();
  }
  function initToggle() {
    notifyMePopupToggle = Toggle2({
      toggleSelector: notifyMePopup.id
    });
    notifyMePopupToggle.init();
    on("click", notifyMePopup, function(e) {
      if (e.target == this) {
        notifyMePopupToggle.close(notifyMePopup);
      }
    });
    window.themeCore.EventBus.listen(`Toggle:${notifyMePopup.id}:close`, closeNotifyMePopup);
    window.themeCore.EventBus.listen(`Toggle:${notifyMePopup.id}:open`, openNotifyMePopup);
  }
  function initFormStatus() {
    if (isCurrentFormPosted()) {
      notifyMeForm.classList.add(cssClasses.isPosted);
      notifyMePopupToggle.open(notifyMePopup);
    }
  }
  function isCurrentFormPosted() {
    return window.location.hash.includes(`#${notifyMeFormId}`) && notifyMeFormStatus.dataset.formStatus === "posted";
  }
  function closeNotifyMePopup() {
    if (isCurrentFormPosted()) {
      setTimeout(() => {
        notifyMeForm.classList.remove(cssClasses.isPosted);
        section.classList.remove(cssClasses.isNotifyMeActive);
      }, 400);
      let newUrl = new URL(window.location.href);
      newUrl.hash = "";
      newUrl.searchParams.delete(searchParams.contactPosted);
      newUrl.searchParams.delete(searchParams.contactProductUrl);
      newUrl.searchParams.delete(searchParams.contactMessage);
      newUrl.searchParams.delete(searchParams.formType);
      window.history.replaceState({}, null, newUrl.toString());
    }
  }
  function openNotifyMePopup() {
    section.classList.add(cssClasses.isNotifyMeActive);
  }
  function setEventBusListeners2() {
    window.themeCore.EventBus.listen(`pdp:section-${sectionId}:change-variant`, onChangeVariant);
    if (!changeVariantIsFired) {
      const productElementJSON = section.querySelector("[data-js-product-json]");
      let productJSON;
      try {
        productJSON = JSON.parse(productElementJSON.innerText);
      } catch {
        productJSON = null;
      }
      if (!productJSON) {
        return;
      }
      if (productJSON.has_only_default_variant) {
        updateFormFields(productJSON.variants[0], productJSON);
        updateNotifyMeButton(productJSON.variants[0]);
      }
    }
  }
  function onChangeVariant({ variant, product }) {
    changeVariantIsFired = true;
    if (!variant || !product) {
      return false;
    }
    updateNotifyMeButton(variant);
    updateFormFields(variant, product);
  }
  function updateFormFields(variant, product) {
    const variantAvailable = variant.available;
    const variantId = variant.id;
    const productURL = product.url;
    const productTitle = product.title;
    if (variantAvailable || !variantId || !productURL || !productTitle) {
      notifyMeFormInputMessage.value = "";
      notifyMeFormInputProductURL.value = "";
      return false;
    }
    const variantURL = `${window.location.origin}${productURL}?variant=${variantId}`;
    const notifyMeMessage = notifyMeFormInputMessage.dataset.notifyMeMessage;
    notifyMeFormInputMessage.value = notifyMeMessage.replace(placeholders.productTitle, productTitle);
    notifyMeFormInputProductURL.value = variantURL;
  }
  function updateNotifyMeButton(variant) {
    const variantAvailable = variant.available;
    if (variantAvailable) {
      notifyMeButtonWrapper.classList.add(cssClasses.hidden);
    } else {
      notifyMeButtonWrapper.classList.remove(cssClasses.hidden);
    }
  }
  return Object.freeze({
    init: init2
  });
};
const ProductAskQuestion = (section) => {
  const sectionId = section && section.dataset.sectionId;
  const selectors2 = {
    askQuestionButton: ".js-ask-question-button",
    askQuestionPopup: ".js-ask-question-popup",
    askQuestionForm: ".js-ask-question-form",
    askQuestionFormStatus: ".js-ask-question-form-status",
    askQuestionFormInputProductURL: "[name='contact[product_url]']"
  };
  const cssClasses = {
    active: "is-active",
    isPosted: "is-posted",
    isNotifyMeActive: "is-ask-question-popup-active"
  };
  const searchParams = {
    contactPosted: "contact_posted",
    contactProductUrl: "contact[product_url]",
    contactMessage: "contact[body]",
    formType: "form_type"
  };
  const Toggle2 = window.themeCore.utils.Toggle;
  const on = window.themeCore.utils.on;
  let askQuestionButton = null;
  let askQuestionPopup = null;
  let askQuestionForm = null;
  let askQuestionFormInputProductURL = null;
  let askQuestionPopupToggle = null;
  let askQuestionFormStatus = null;
  let askQuestionFormId = null;
  let changeVariantIsFired = false;
  function init2() {
    if (!section || !sectionId) {
      return false;
    }
    askQuestionButton = section.querySelector(selectors2.askQuestionButton);
    askQuestionPopup = section.querySelector(selectors2.askQuestionPopup);
    askQuestionForm = section.querySelector(selectors2.askQuestionForm);
    if (!askQuestionButton || !askQuestionPopup || !askQuestionForm) {
      return false;
    }
    askQuestionFormId = askQuestionForm.id;
    askQuestionFormInputProductURL = askQuestionForm.querySelector(selectors2.askQuestionFormInputProductURL);
    askQuestionFormStatus = askQuestionForm.querySelector(selectors2.askQuestionFormStatus);
    if (!askQuestionFormInputProductURL || !askQuestionFormStatus) {
      return;
    }
    initToggle();
    initFormStatus();
    setEventBusListeners2();
  }
  function initToggle() {
    askQuestionPopupToggle = Toggle2({
      toggleSelector: askQuestionPopup.id
    });
    askQuestionPopupToggle.init();
    on("click", askQuestionPopup, function(e) {
      if (e.target == this) {
        askQuestionPopupToggle.close(askQuestionPopup);
      }
    });
    window.themeCore.EventBus.listen(`Toggle:${askQuestionPopup.id}:close`, closeAskQuestionPopup);
    window.themeCore.EventBus.listen(`Toggle:${askQuestionPopup.id}:open`, openQuestionPopup);
  }
  function initFormStatus() {
    if (isCurrentFormPosted()) {
      askQuestionForm.classList.add(cssClasses.isPosted);
      askQuestionPopupToggle.open(askQuestionPopup);
    }
  }
  function isCurrentFormPosted() {
    return window.location.hash.includes(`#${askQuestionFormId}`) && askQuestionFormStatus.dataset.formStatus === "posted";
  }
  function closeAskQuestionPopup() {
    if (isCurrentFormPosted()) {
      setTimeout(() => {
        askQuestionForm.classList.remove(cssClasses.isPosted);
        section.classList.remove(cssClasses.isNotifyMeActive);
      }, 400);
      let newUrl = new URL(window.location.href);
      newUrl.hash = "";
      newUrl.searchParams.delete(searchParams.contactPosted);
      newUrl.searchParams.delete(searchParams.contactProductUrl);
      newUrl.searchParams.delete(searchParams.contactMessage);
      newUrl.searchParams.delete(searchParams.formType);
      window.history.replaceState({}, null, newUrl.toString());
    }
  }
  function openQuestionPopup() {
    section.classList.add(cssClasses.isNotifyMeActive);
  }
  function setEventBusListeners2() {
    window.themeCore.EventBus.listen(`pdp:section-${sectionId}:change-variant`, onChangeVariant);
    if (!changeVariantIsFired) {
      const productElementJSON = section.querySelector("[data-js-product-json]");
      let productJSON;
      try {
        productJSON = JSON.parse(productElementJSON.innerText);
      } catch {
        productJSON = null;
      }
      if (!productJSON) {
        return;
      }
      if (productJSON.has_only_default_variant) {
        updateFormFields(productJSON.variants[0], productJSON);
      }
    }
  }
  function onChangeVariant({ variant, product }) {
    changeVariantIsFired = true;
    if (!variant || !product) {
      return false;
    }
    updateFormFields(variant, product);
  }
  function updateFormFields(variant, product) {
    const variantId = variant.id;
    const productURL = product.url;
    if (!variantId || !productURL) {
      askQuestionFormInputProductURL.value = "";
      return false;
    }
    const variantURL = `${window.location.origin}${productURL}?variant=${variantId}`;
    askQuestionFormInputProductURL.value = variantURL;
  }
  return Object.freeze({
    init: init2
  });
};
const ProductMediaScroller = (section) => {
  const selectors2 = {
    mediaContainer: ".js-product-media-container",
    mediaItem: ".js-product-media-item",
    mediaItemVariant: ".js-product-media-item-variant",
    header: ".js-header",
    cssRoot: ":root"
  };
  const attributes2 = {
    enableMediaScroller: "data-enable-media-scroller",
    staticHeader: "data-static-header",
    hideOnScrollHeader: "data-hide-on-scroll-down"
  };
  const cssVariables = {
    headerHeightStatic: "--header-height-static",
    headerHeight: "--header-height"
  };
  const breakpoints2 = {
    afterMedium: "(min-width: 1200px)"
  };
  const sectionId = section && section.dataset.sectionId;
  const cssRoot = document.querySelector(selectors2.cssRoot);
  let previousVariantId;
  function init2() {
    if (!section) {
      return;
    }
    const mediaContainer = section.querySelector(selectors2.mediaContainer);
    if (!mediaContainer) {
      return;
    }
    const enableMediaScroller = mediaContainer.hasAttribute(attributes2.enableMediaScroller);
    if (!enableMediaScroller) {
      return;
    }
    setEventBusListeners2();
  }
  function setEventBusListeners2() {
    window.themeCore.EventBus.listen(`pdp:section-${sectionId}:change-variant`, onChangeVariant);
  }
  function onChangeVariant({ variantId, firstInitialization }) {
    if (previousVariantId === variantId) {
      return;
    }
    previousVariantId = variantId;
    const isDesktop = window.matchMedia(breakpoints2.afterMedium).matches;
    if (!isDesktop || firstInitialization) {
      return;
    }
    const mediaContainer = section.querySelector(selectors2.mediaContainer);
    const mediaItems = mediaContainer.querySelectorAll(selectors2.mediaItem);
    const currentMediaItem = [...mediaItems].find((mediaItem) => {
      const mediaItemVariant = mediaItem.querySelector(selectors2.mediaItemVariant);
      if (!mediaItemVariant) {
        return false;
      }
      const mediaItemVariantIds = mediaItemVariant.dataset.variantId;
      return mediaItemVariantIds.includes(variantId);
    });
    if (!currentMediaItem) {
      return null;
    }
    scrollToElement(currentMediaItem);
  }
  function scrollToElement(element) {
    const sectionBoundingClientRect = section.getBoundingClientRect();
    const elementBoundingClientRect = element.getBoundingClientRect();
    const elementTopOffset = Math.round(elementBoundingClientRect.top);
    const sectionTopOffset = Math.round(sectionBoundingClientRect.top);
    const sectionBottomOffset = Math.round(sectionBoundingClientRect.bottom);
    const windowScrollY = Math.round(window.scrollY);
    const scrollOffset = 8;
    let scrollTo = windowScrollY + elementTopOffset - scrollOffset;
    const containerTop = windowScrollY + sectionTopOffset - scrollOffset;
    const containerBottom = windowScrollY + sectionBottomOffset + scrollOffset;
    scrollTo = Math.max(scrollTo, containerTop);
    const currentHeaderHeight = getCurrentHeaderHeight();
    const currentScrollTo = scrollTo - currentHeaderHeight;
    if (Math.abs(windowScrollY - currentScrollTo) <= 1) {
      return;
    }
    const headerHeight = getHeaderHeight(windowScrollY, scrollTo);
    scrollTo = scrollTo - headerHeight;
    scrollTo = Math.min(scrollTo, containerBottom - window.innerHeight);
    window.scrollTo({
      top: scrollTo,
      behavior: "smooth"
    });
  }
  function getCurrentHeaderHeight() {
    const header = document.querySelector(selectors2.header);
    if (!header) {
      return 0;
    }
    const isHeaderStatic = header.hasAttribute(attributes2.staticHeader);
    if (isHeaderStatic) {
      return 0;
    }
    const headerHeightValue = cssRoot.style.getPropertyValue(cssVariables.headerHeight);
    return headerHeightValue ? parseInt(headerHeightValue) : 0;
  }
  function getHeaderHeight(windowScrollY, scrollTo) {
    const header = document.querySelector(selectors2.header);
    if (!header) {
      return 0;
    }
    const isHeaderStatic = header.hasAttribute(attributes2.staticHeader);
    const isHideOnScrollHeader = header.hasAttribute(attributes2.hideOnScrollHeader);
    const headerHeightStaticValue = cssRoot.style.getPropertyValue(cssVariables.headerHeightStatic);
    const headerHeightStatic = headerHeightStaticValue ? parseInt(headerHeightStaticValue) : 0;
    if (isHeaderStatic || isHideOnScrollHeader && windowScrollY < scrollTo - headerHeightStatic) {
      return 0;
    }
    return headerHeightStatic;
  }
  return Object.freeze({
    init: init2
  });
};
const ProductSection = (section) => {
  const Toggle2 = window.themeCore.utils.Toggle;
  const isElementInViewport = window.themeCore.utils.isElementInViewport;
  const off = window.themeCore.utils.off;
  const on = window.themeCore.utils.on;
  const cssClasses = window.themeCore.utils.cssClasses;
  const selectors2 = {
    mediaContainer: ".js-product-media-container",
    thumbnailsStacked: ".js-product-media-thumbnails-stacked",
    thumbnailsSlide: ".js-product-media-thumbnails-slide",
    slide: ".js-product-gallery-slide",
    modelButton: ".js-product-media-model-button",
    modelPoster: ".js-product-media-model-poster",
    modelContent: ".js-product-media-model-content"
  };
  const sectionId = section && section.dataset.sectionId;
  const carouselSelectors = {
    slider: `.js-product-media-slider-${sectionId}`,
    sliderNavigationNext: `.js-product-media-slider-next-${sectionId}`,
    sliderNavigationPrev: `.js-product-media-slider-prev-${sectionId}`,
    thumbNavigationNext: `.js-product-media-thumb-next-${sectionId}`,
    thumbNavigationPrev: `.js-product-media-thumb-prev-${sectionId}`,
    sliderSlideVariantId: `.js-product-gallery-slide-variant-${sectionId}`,
    sliderThumbnails: `.js-product-media-slider-thumbnails-${sectionId}`,
    sliderPagination: `.product-media__slider-pagination-${sectionId}`
  };
  const mediaContainerClasses = {
    stacked: "product-media--layout-stacked",
    stacked_2_col: "product-media--layout-stacked_2_col",
    stacked_2_col_with_big_img: "product-media--layout-stacked_2_col_with_big_image",
    slider: "product-media--layout-carousel"
  };
  const drawersSelectors = {
    sizeGuideDrawer: `productSizeGuideDrawer-${sectionId}`,
    highlightDrawer: `highlightDrawer-${sectionId}`,
    descriptionDrawer: `descriptionDrawer-${sectionId}`,
    customDrawer1: `productDrawer1-${sectionId}`,
    customDrawer2: `productDrawer2-${sectionId}`
  };
  let Carousel = null;
  function init2() {
    const ProductZoom = Zoom(section);
    Carousel = ProductCarousel({
      selectors: carouselSelectors,
      sectionId
    });
    const productStickyForms = ProductStickyForm(section);
    ProductZoom.init();
    productStickyForms.init();
    initCarousel();
    setDrawers();
    initModelButtons();
    initNotifyMe();
    initAskQuestion();
    const productHandle = section.dataset.productHandle;
    if (!productHandle) {
      return;
    }
    let recentlyViewed = localStorage.getItem("theme_recently_viewed");
    if (recentlyViewed) {
      try {
        recentlyViewed = JSON.parse(recentlyViewed);
        recentlyViewed = [.../* @__PURE__ */ new Set([...recentlyViewed, productHandle])];
        recentlyViewed = recentlyViewed.slice(-11);
        localStorage.setItem("theme_recently_viewed", JSON.stringify(recentlyViewed));
      } catch (e) {
        console.log(e);
      } finally {
        return;
      }
    }
    localStorage.setItem("theme_recently_viewed", `["${productHandle}"]`);
  }
  function initCarousel() {
    const mediaContainer = section.querySelector(selectors2.mediaContainer);
    if (!mediaContainer) {
      return;
    }
    const mediaLayout = mediaContainer.dataset.mediaLayout;
    if (!mediaLayout) {
      return;
    }
    if (mediaLayout === "carousel") {
      Carousel.init();
    }
    if (mediaLayout === "stacked" || mediaLayout === "stacked_2_col" || mediaLayout === "stacked_2_col_with_big_image") {
      updateMedia();
      on("scroll", document, onScroll);
      activeDragThumbnail();
      on("resize", updateMedia);
      ProductMediaScroller(section).init();
    }
  }
  function updateMedia() {
    const mediaContainer = section.querySelector(selectors2.mediaContainer);
    if (!mediaContainer) {
      return;
    }
    const mediaLayout = mediaContainer.dataset.mediaLayout;
    let stackedClass = mediaContainerClasses.stacked;
    if (mediaLayout === "stacked_2_col") {
      stackedClass = mediaContainerClasses.stacked_2_col;
    } else if (mediaLayout === "stacked_2_col_with_big_image") {
      stackedClass = mediaContainerClasses.stacked_2_col_with_big_img;
    }
    if (window.innerWidth > 1199) {
      Carousel.destroy();
      mediaContainer.classList.add(stackedClass);
      mediaContainer.classList.remove(mediaContainerClasses.slider);
    } else {
      Carousel.init();
      mediaContainer.classList.add(mediaContainerClasses.slider);
      mediaContainer.classList.remove(stackedClass);
    }
  }
  function onScroll() {
    off("scroll", document, onScroll);
    const mediaContainer = section.querySelector(selectors2.mediaContainer);
    const thumbnailsStacked = section.querySelector(selectors2.thumbnailsStacked);
    if (!mediaContainer || !thumbnailsStacked) {
      return;
    }
    const slides = [...mediaContainer.querySelectorAll(selectors2.slide)];
    slides.forEach((slide) => {
      setTimeout(() => {
        if (isElementInViewport(slide, thumbnailsStacked, 200)) {
          const thumbnails = [...thumbnailsStacked.querySelectorAll(selectors2.thumbnailsSlide)];
          thumbnails.forEach((thumbnail) => {
            thumbnail.classList.remove(cssClasses.active);
          });
          const currentThumbnail = thumbnails.find((thumbnail) => thumbnail.dataset.mediaId === slide.dataset.mediaId);
          if (currentThumbnail) {
            currentThumbnail.classList.add(cssClasses.active);
            const offsetTopThumbnail = currentThumbnail.offsetTop;
            const offsetHeightContainer = thumbnailsStacked.offsetHeight / 2;
            const offsetHeightThumbnail = currentThumbnail.offsetHeight / 2;
            const scroll = offsetTopThumbnail - offsetHeightContainer + offsetHeightThumbnail;
            thumbnailsStacked.scroll(0, scroll);
          }
        }
        on("scroll", document, onScroll);
      }, 700);
    });
  }
  function activeDragThumbnail() {
    const thumbnail = section.querySelector(selectors2.thumbnailsStacked);
    if (!thumbnail) {
      return;
    }
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    let isDrag = false;
    const mouseDownHandler = function(e) {
      thumbnail.style.cursor = "grabbing";
      thumbnail.style.userSelect = "none";
      thumbnail.style.scrollBehavior = "auto";
      pos = {
        left: thumbnail.scrollLeft,
        top: thumbnail.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY
      };
      on("mousemove", document, mouseMoveHandler);
      on("mouseup", document, mouseUpHandler);
    };
    const mouseMoveHandler = function(e) {
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;
      isDrag = Boolean(dx + dy);
      thumbnail.scrollTop = pos.top - dy;
      thumbnail.scrollLeft = pos.left - dx;
    };
    const mouseUpHandler = function() {
      const anchors = [...thumbnail.querySelectorAll("a")];
      if (anchors && isDrag) {
        const preventDefault = (e) => {
          e.preventDefault();
          anchors.forEach((anchor) => {
            off("click", anchor, preventDefault);
          });
          isDrag = false;
        };
        anchors.forEach((anchor) => {
          on("click", anchor, preventDefault);
        });
      }
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      thumbnail.style.cursor = "grab";
      thumbnail.style.removeProperty("user-select");
      thumbnail.style.scrollBehavior = "smooth";
    };
    on("mousedown", thumbnail, mouseDownHandler);
  }
  function setDrawers() {
    try {
      setToggleDrawer(drawersSelectors.sizeGuideDrawer, { hasFullWidth: true });
      setToggleDrawer(drawersSelectors.highlightDrawer);
      setToggleDrawer(drawersSelectors.descriptionDrawer);
      setToggleDrawer(drawersSelectors.customDrawer1);
      setToggleDrawer(drawersSelectors.customDrawer2);
    } catch (e) {
    }
  }
  function setToggleDrawer(selector, options = {}) {
    const toggleButton = document.querySelector(`[data-js-toggle="${selector}"]`);
    if (!toggleButton) {
      return;
    }
    const ToggleDrawer = Toggle2({
      toggleSelector: selector,
      ...options
    });
    ToggleDrawer.init();
    if (selector === drawersSelectors.sizeGuideDrawer) {
      let sizeGuideDrawer = document.getElementById(drawersSelectors.sizeGuideDrawer);
      if (!sizeGuideDrawer) {
        return;
      }
      on("click", sizeGuideDrawer, function(e) {
        if (e.target == this) {
          ToggleDrawer.close(sizeGuideDrawer);
        }
      });
    }
  }
  function initModelButtons() {
    const modelButtons = [...section.querySelectorAll(selectors2.modelButton)];
    if (!modelButtons.length) {
      return;
    }
    section.addEventListener("click", (event) => {
      const button = event.target.closest(selectors2.modelButton);
      if (!button) {
        return;
      }
      const container = button.parentElement;
      const poster = container.querySelector(selectors2.modelPoster);
      const content = container.querySelector(selectors2.modelContent);
      if (!poster || !content) {
        return;
      }
      poster.remove();
      button.remove();
      content.classList.remove(cssClasses.hidden);
      Carousel.disableSwipe();
    });
  }
  function initNotifyMe() {
    const productNotifyMe = ProductNotifyMe(section);
    productNotifyMe.init();
  }
  function initAskQuestion() {
    const productAskQuestion = ProductAskQuestion(section);
    productAskQuestion.init();
  }
  return Object.freeze({
    init: init2
  });
};
const selectors = {
  section: '[data-section-type="product"]',
  productAvailabilityToggleSelector: "[data-js-toggle-selector]",
  video: ".js-video",
  slide: ".js-product-gallery-slide"
};
const videos = [];
let Video;
let sections;
let ProductForms;
let Toggle;
async function init(sectionId) {
  Video = window.themeCore.utils.Video;
  Toggle = window.themeCore.utils.Toggle;
  sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
  ProductForms = ProductForm();
  sections.forEach(initSection);
  ProductForms.init();
  initVideos();
  setEventBusListeners();
  window.themeCore.EventBus.emit("product:loaded");
}
function initSection(section) {
  const productSection = ProductSection(section);
  window.themeCore.EventBus.listen(
    `pickup-availability-drawer:productAvailability-pickup-availability__${section.dataset.sectionId}:loaded`,
    () => {
      const productAvailabilityToggles = [
        ...document.querySelectorAll(
          selectors.productAvailabilityToggleSelector
        )
      ];
      const productAvailabilityToggle = productAvailabilityToggles.find(
        (toggle) => {
          return toggle.dataset.jsToggle === `productAvailability-pickup-availability__${section.dataset.sectionId}`;
        }
      );
      const productAvailability = Toggle({
        toggleSelector: productAvailabilityToggle.dataset.target
      });
      productAvailability.init();
    }
  );
  productSection.init();
}
function pauseVideoPlayers() {
  if (!videos.length)
    return;
  videos.forEach(({ player }) => {
    try {
      player.pauseVideo();
    } catch (e) {
    }
    try {
      player.pause();
    } catch (e) {
    }
  });
}
function setEventBusListeners() {
  window.themeCore.EventBus.listen("product-slider:slide-change", pauseVideoPlayers);
  window.themeCore.EventBus.listen("product:zoom:open", pauseVideoPlayers);
}
function initVideos() {
  const slides = [...document.querySelectorAll(selectors.slide)];
  slides.forEach((slide) => {
    const [video] = Video({
      videoContainer: slide,
      options: {
        youtube: {
          controls: 1,
          showinfo: 1
        }
      }
    }).init();
    if (video) {
      videos.push(video);
    }
  });
}
const Product = () => {
  return Object.freeze({
    init
  });
};
export {
  Product as P
};
