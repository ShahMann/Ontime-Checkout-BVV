const selectors$1 = {
  xrButton: "[data-shopify-xr]"
};
const attributes = {
  hidden: "data-shopify-xr-hidden"
};
const ArModel = () => {
  let ARModels = [];
  async function init(models) {
    if (!window.Shopify || !models) {
      return;
    }
    ARModels = models;
    await window.Shopify.loadFeatures([
      {
        name: "shopify-xr",
        version: "1.0",
        onLoad: setupShopifyXr
      }
    ]);
    await window.Shopify.loadFeatures([
      {
        name: "model-viewer-ui",
        version: "1.0",
        onLoad: setupModelViewerUI
      }
    ]);
  }
  function setupShopifyXr() {
    if (!window.ShopifyXR) {
      document.addEventListener("shopify_xr_initialized", (e) => {
        window.themeCore.shopifyXREnabled = e.detail.shopifyXREnabled;
        if (e.detail.shopifyXREnabled) {
          setupShopifyXr();
        }
      });
    } else if (window.themeCore.shopifyXREnabled) {
      window.ShopifyXR.addModels(ARModels);
      window.ShopifyXR.setupXRElements();
      const xrButtons = document.querySelectorAll(selectors$1.xrButton);
      xrButtons.forEach(
        (button) => button.removeAttribute(attributes.hidden)
      );
    }
  }
  function setupModelViewerUI() {
    const models = [...document.querySelectorAll("model-viewer")];
    models.forEach((model) => new window.Shopify.ModelViewerUI(model));
  }
  return Object.freeze({
    init
  });
};
const selectors = {
  modelsJSON: "#ProductModelsJSON",
  section: '[data-section-type="product"]'
};
const action = () => {
  const sections = [...document.querySelectorAll(selectors.section)];
  sections.forEach(initModel);
  function initModel(section) {
    const modelsJSON = section.querySelector(selectors.modelsJSON);
    const ProductARModel = ArModel();
    if (modelsJSON) {
      ProductARModel.init(JSON.parse(modelsJSON.textContent));
      modelsJSON.remove();
    }
  }
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
