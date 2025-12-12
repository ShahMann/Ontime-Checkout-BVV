const selectors = {
  section: ".js-best-sellers",
  collection: ".js-best-sellers-collection",
  product: ".js-best-sellers-product",
  collectionButton: ".js-best-sellers-collection-button"
};
const BestSellers = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  let sections = [];
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      setEventListeners(section);
    });
  }
  function setEventListeners(section) {
    let collections = [...section.querySelectorAll(selectors.collection)];
    collections.forEach((targetCollection) => targetCollection.addEventListener("click", () => {
      showTargetItem(section, targetCollection);
      toggleCollection(collections, targetCollection);
      toggleCollectionButton(section, targetCollection);
    }));
  }
  function toggleCollectionButton(section, targetCollection) {
    const targetCollectionHref = targetCollection.dataset.href;
    const collectionButton = section.querySelector(selectors.collectionButton);
    if (!collectionButton)
      return;
    targetCollectionHref ? toggleItem(collectionButton, cssClasses.hidden, false) : toggleItem(collectionButton, cssClasses.hidden, true);
    collectionButton.href = targetCollectionHref;
  }
  function toggleCollection(collections, targetCollection) {
    collections.forEach((collection) => toggleItem(collection, cssClasses.active, false));
    toggleItem(targetCollection, cssClasses.active, true);
  }
  function showTargetItem(section, targetCollection) {
    const products = [...section.querySelectorAll(selectors.product)];
    return products.filter(
      (product) => product.dataset.index === targetCollection.dataset.index ? toggleItem(product, cssClasses.active, true) : toggleItem(product, cssClasses.active, false)
    );
  }
  function toggleItem(item, className, flag) {
    item.classList.toggle(className, flag);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.BestSellers = window.themeCore.BestSellers || BestSellers();
  window.themeCore.utils.register(window.themeCore.BestSellers, "best-sellers");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
