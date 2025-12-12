const selectors = {
  section: ".js-lookbook",
  lookSlider: ".js-lookbook-slider",
  lookSlide: ".js-lookbook-slide",
  pointButton: ".js-lookbook-point",
  sliderButtonPrev: ".js-lookbook-slider-button-prev",
  lookSliderPagination: ".js-lookbook-slider-pagination",
  buyBox: ".js-lookbook-buy-box",
  buyBoxButton: ".js-lookbook-buy-box-button",
  buyBoxTitle: ".js-lookbook-buy-box-title",
  buyBoxPrice: ".js-lookbook-buy-box-price",
  productsList: ".js-lookbook-products-list",
  productCard: ".js-product-card",
  loader: `[data-js-overlay="lookbook-modal"] .loader`,
  modal: "lookbook-modal",
  lookProducts: ".js-lookbook-modal",
  sliderButtonNext: ".js-lookbook-slider-button-next",
  productsSlider: ".js-lookbook-products",
  productSlide: ".js-lookbook-products-slide",
  productsSliderPagination: ".js-lookbook-products-pagination"
};
const attributes = {
  pointButtonIndex: "data-point-index"
};
const closeSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
const Lookbook = () => {
  const Swiper = window.themeCore.utils.Swiper;
  let EffectFade;
  let buyBox;
  let container;
  let modal;
  let allProductsHasAvailableVariant;
  let allProductsHasOnlyOneVariant;
  const on = window.themeCore.utils.on;
  const Toggle = window.themeCore.utils.Toggle;
  const overlay = window.themeCore.utils.overlay;
  const cssClasses = window.themeCore.utils.cssClasses;
  let sectionComponents = [];
  async function init(sectionId) {
    EffectFade = await window.themeCore.utils.getExternalUtil("swiperEffectFade");
    Swiper.use([EffectFade]);
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    if (sections) {
      sections.forEach((section) => {
        sectionComponents.push({
          section,
          lookSlider: section.querySelector(selectors.lookSlider),
          lookSlide: [
            ...section.querySelectorAll(selectors.lookSlide)
          ],
          productsSliders: [
            ...section.querySelectorAll(selectors.productsSlider)
          ],
          productSlide: [
            ...section.querySelectorAll(selectors.productSlide)
          ],
          pointButtons: [
            ...section.querySelectorAll(selectors.pointButton)
          ],
          sliderButtonNext: section.querySelector(
            selectors.sliderButtonNext
          ),
          sliderButtonPrev: section.querySelector(
            selectors.sliderButtonPrev
          ),
          buyBoxButtons: [
            ...section.querySelectorAll(selectors.buyBoxButton)
          ]
        });
      });
    }
    setEventListeners();
    slidersInit();
  }
  function setEventListeners() {
    sectionComponents.forEach(({ pointButtons, buyBoxButtons }) => {
      pointButtons.forEach((pointButton) => {
        on("click", pointButton, pointButtonHandler);
      });
      buyBoxButtons.forEach((buyBoxButton) => {
        on("click", buyBoxButton, buyBoxButtonHandler);
      });
    });
  }
  function pointButtonHandler(event) {
    const pointButton = event.target.closest(selectors.pointButton);
    togglePointButton(pointButton);
  }
  function getLayout(productCards) {
    const productCardsLayout = document.createElement("html");
    productCardsLayout.innerHTML = productCards.map((card) => card.outerHTML).join(" ");
    const html = document.createElement("html");
    html.innerHTML = `
			<div
				class="modal lookbook-modal js-lookbook-modal js-products-bundle"
				id="lookbook-modal"
				data-modal-once="true"
				tabindex="-1"
				aria-modal="true"
				role="dialog"
				data-section="lookbook-modal"
			>
				<header class="modal__header lookbook-modal__header">
					${buyBox.querySelector(selectors.buyBoxTitle) && `
					<h2 class="lookbook-modal__heading">
							${buyBox.querySelector(selectors.buyBoxTitle).textContent}
					</h2>`}

					<button
						class="lookbook-modal__close focus-visible-outline"
						data-target="lookbook-modal"
						data-js-toggle="lookbook-modal"
						aria-label="${window.themeCore.translations.get("general.accessibility.close_modal")}">
						${closeSVG}
					</button>
				</header>

				<div class="modal__body lookbook-modal__body">
					<div class="modal__body lookbook-modal__content">
						${productCardsLayout.querySelector("body").innerHTML}
					</div>
				</div>

				<div class="modal__footer lookbook-modal__footer">
					<div class="lookbook-modal__button-wrapper no-js-hidden">
						<small class="lookbook-modal__error js-product-bundle-error"></small>

						<div class="lookbook-modal__total js-product-total">
							${window.themeCore.translations.get("sections.shop_the_look.subtotal")} <span class="lookbook-modal__price js-product-total-price"></span>
						</div>

						<button
							class="button button--secondary lookbook-modal__button js-products-bundle-button"
							data-disabled-label="${window.themeCore.translations.get("sections.shop_the_look.add_to_cart_disabled")}"
							data-enabled-label="${window.themeCore.translations.get("sections.shop_the_look.add_to_cart")}"
							${allProductsHasOnlyOneVariant === "true" && allProductsHasAvailableVariant === "true" ? "" : "disabled"}
						>
							${renderBuyButtonText()}
						</button>
					</div>
				</div>
			</div>
		`;
    return html.querySelector(selectors.lookProducts);
  }
  function renderBuyButtonText() {
    if (allProductsHasOnlyOneVariant === "true") {
      if (allProductsHasAvailableVariant === "true") {
        return window.themeCore.translations.get("sections.shop_the_look.add_to_cart");
      } else {
        return window.themeCore.translations.get("sections.shop_the_look.add_to_cart_sold_out");
      }
    } else {
      return window.themeCore.translations.get("sections.shop_the_look.add_to_cart_disabled");
    }
  }
  function getLookProducts() {
    const products = buyBox.querySelector(selectors.productsList);
    if (!products) {
      return [];
    }
    try {
      return JSON.parse(products.textContent);
    } catch (e) {
      return [];
    }
  }
  async function buyBoxButtonHandler(event) {
    if (buyBox) {
      buyBox = null;
    }
    buyBox = event.target.closest(selectors.buyBox);
    allProductsHasAvailableVariant = buyBox.dataset.allProductsHasAvailableVariant;
    allProductsHasOnlyOneVariant = buyBox.dataset.allProductsHasOnlyOneVariant;
    overlay({ namespace: `lookbook-preloader` }).open(true);
    let productCards = (await getProductCards()).map((card) => card.value);
    container = getLayout(productCards);
    document.body.append(container);
    const toggleConfig = {
      toggleSelector: selectors.modal,
      previouslySelectedElement: event.target
    };
    modal = Toggle(toggleConfig);
    modal.init({ once: true });
    modal.open(container);
    let ProductBundle = await window.themeCore.utils.getExternalUtil("products-bundle");
    ProductBundle().initSection(container, cssClasses);
    const loader = document.querySelector(selectors.loader);
    if (loader) {
      loader.remove();
    }
    setTimeout(() => container.focus(), 50);
    let shopTheLookPopup = document.querySelector(selectors.lookProducts);
    if (shopTheLookPopup) {
      window.themeCore.EventBus.listen("cart-notification:open", function(e) {
        modal.close(shopTheLookPopup);
      });
    }
  }
  async function getProductCards() {
    const products = getLookProducts();
    try {
      return await Promise.allSettled(products.map((product) => getProductCard(product)));
    } catch (error) {
      console.log(error);
    }
  }
  async function getProductCard(product) {
    const url = `/products/${product}?view=modal-product-card`;
    return await getHTML(url, selectors.productCard);
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
  function togglePointButton(pointButton) {
    const closestSlide = pointButton.closest(selectors.lookSlide);
    const productSlider = closestSlide.querySelector(selectors.productsSlider);
    const pointButtonIndex = getPointButtonIndex(pointButton);
    const currentPointButtons = [...closestSlide.querySelectorAll(selectors.pointButton)];
    removeActiveClasses(currentPointButtons);
    setCurrentElementActive(pointButton);
    setCurrentSlide(productSlider.swiper, pointButtonIndex);
  }
  function removeActiveClasses(elements) {
    elements.forEach(
      (element) => element.classList.remove(cssClasses.active)
    );
  }
  function setCurrentElementActive(element) {
    element.classList.add(cssClasses.active);
  }
  function getPointButtonIndex(pointButton) {
    return +pointButton.getAttribute(attributes.pointButtonIndex);
  }
  function slidersInit() {
    sectionComponents.forEach((section) => {
      const slider = section.lookSlider;
      const buttonNext = section.sliderButtonNext;
      const buttonPrev = section.sliderButtonPrev;
      section.swiper = lookSliderInit(slider, buttonNext, buttonPrev);
      section.productsSliders.forEach((productSlider) => {
        const productSliderPagination = productSlider.querySelector(selectors.productsSliderPagination);
        productsSliderInit(productSlider, productSliderPagination);
      });
    });
  }
  function lookSliderInit(slider, buttonNext, buttonPrev) {
    let isDynamicBullets = slider.getAttribute("data-dynamic-pagination");
    isDynamicBullets = isDynamicBullets === "true";
    return new Swiper(slider, {
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: selectors.lookSliderPagination,
        type: "bullets",
        clickable: true,
        dynamicBullets: isDynamicBullets
      },
      speed: 600,
      navigation: {
        nextEl: buttonNext,
        prevEl: buttonPrev
      },
      breakpoints: {
        768: {
          allowTouchMove: false
        }
      }
    });
  }
  function productsSliderInit(slider, pagination) {
    let slidesCount = slider.querySelectorAll(selectors.productSlide).length;
    let spaceBetweenMobile = slidesCount === 1 ? 0 : 16;
    let spaceBetweenDesktop = slidesCount === 1 ? 0 : 30;
    return new Swiper(slider, {
      slidesPerView: 1.26,
      nested: true,
      spaceBetween: spaceBetweenMobile,
      speed: 600,
      pagination: {
        el: pagination,
        type: "bullets",
        clickable: true
      },
      breakpoints: {
        768: {
          slidesPerView: 1,
          spaceBetween: spaceBetweenDesktop
        }
      }
    });
  }
  function setCurrentSlide(slider, index) {
    slider.slideTo(index);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Lookbook = window.themeCore.Lookbook || Lookbook();
  window.themeCore.utils.register(window.themeCore.Lookbook, "lookbook");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
