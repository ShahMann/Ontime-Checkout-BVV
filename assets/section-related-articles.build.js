const selectors = {
  section: ".js-related-articles"
};
const RelatedArticles = () => {
  let Slider;
  const sliderOptions = {
    grabCursor: true,
    slidesPerView: 1,
    centeredSlides: true
  };
  async function init(sectionId) {
    Slider = await window.themeCore.utils.getExternalUtil(
      "FeaturedContentSlider"
    );
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    let breakpoint = "991.98px";
    sections.forEach((section) => Slider(section, sliderOptions, breakpoint).init());
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.RelatedArticles = window.themeCore.RelatedArticles || RelatedArticles();
  window.themeCore.utils.register(window.themeCore.RelatedArticles, "related-articles");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
