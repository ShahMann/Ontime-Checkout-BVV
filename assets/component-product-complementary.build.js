const selectors = {
  section: ".js-complementary-products",
  content: ".js-complementary-products-content",
  complementaryItem: ".js-complementary-item",
  swiper: ".swiper",
  buttonPrev: ".js-complementary-products-slider-prev",
  buttonNext: ".js-complementary-products-slider-next"
};
const ProductComplementary = () => {
  let sections = [];
  const Swiper = window.themeCore.utils.Swiper;
  const cssClasses = window.themeCore.utils.cssClasses;
  async function init() {
    sections = [...document.querySelectorAll(selectors.section)];
    await Promise.all(sections.map((section) => setupComplementary(section)));
    window.themeCore.LazyLoadImages.init();
    sections.forEach((section) => initSlider(section));
  }
  async function getHTML(url) {
    const response = await fetch(url);
    const resText = await response.text();
    return new DOMParser().parseFromString(resText, "text/html");
  }
  async function setupComplementary(section) {
    try {
      const url = new URL(window.location.origin + section.dataset.url);
      const sectionFetched = await getHTML(url.toString());
      const content = section.querySelector(selectors.content);
      const contentFetched = sectionFetched.querySelector(selectors.content);
      content.innerHTML = contentFetched == null ? void 0 : contentFetched.innerHTML;
      section.classList.add(cssClasses.active);
      window.themeCore.EventBus.emit("compare-products:init");
    } catch (e) {
      console.error(e);
    }
  }
  function initSlider(section) {
    const slider = section.querySelector(selectors.swiper);
    const buttonNext = section.querySelector(selectors.buttonNext);
    const buttonPrev = section.querySelector(selectors.buttonPrev);
    const layout = section.dataset.productLayout;
    const complementaryItems = section.querySelectorAll(selectors.complementaryItem);
    const productsCount = layout === "three_columns" ? 2 : 3;
    if (complementaryItems.length < 1) {
      section.classList.add(cssClasses.hidden);
    }
    if (!slider) {
      return;
    }
    new Swiper(slider, {
      slidesPerView: 1.16,
      spaceBetween: 16,
      speed: 600,
      navigation: {
        nextEl: buttonNext,
        prevEl: buttonPrev
      },
      breakpoints: {
        576: {
          slidesPerView: 2
        },
        1400: {
          slidesPerView: productsCount
        }
      }
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ProductComplementary = window.themeCore.ProductComplementary || ProductComplementary();
  window.themeCore.utils.register(window.themeCore.ProductComplementary, "product-complementary");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
