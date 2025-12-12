function handleProductCards(container) {
  const products = container.querySelectorAll('[data-collect-sku]');
  const productMap = new Map();
  const productIds = [];

  products.forEach(product => {
    const productId = product.dataset.collectSku;
    if (product.dataset.apiCalled === "true") return; // skip already handled
    product.dataset.apiCalled = "true";

    productIds.push(productId);
    productMap.set(productId, product);
  });

  if (productIds.length === 0) return;

  // Call the API using Shopify's theme.fetch.request method
  const availabilityPromise = theme.fetch.request("/pickup-info", "POST", {
    storeName: theme.store.get(),
    data: {
      productSkus: productIds
    }
  });

  availabilityPromise
  .then(response => response.json ? response.json() : response)
  .then(apiResponse => {
    if (!apiResponse.data || !Array.isArray(apiResponse.data.result)) return;

    // Transform array of { sku: boolean } objects into a map: { sku: boolean }
    const availabilityMap = {};
    apiResponse.data.result.forEach(item => {
      const sku = Object.keys(item)[0];
      availabilityMap[sku] = item[sku];
    });

    // For each sku that is true, remove 'hidden' class from span[data-collect-sku="sku"]
    Object.entries(availabilityMap).forEach(([sku, available]) => {
      if (available) {
        const span = document.querySelector(`span[data-collect-sku="${sku}"]`);
        if (span) {
          span.classList.remove('is-hidden');
        }
      }
    });
  })
  .catch(error => {
    console.error("API error:", error);
  });

}

document.addEventListener("DOMContentLoaded", function () {
  handleProductCards(document);
});

document.addEventListener("collection:updated", function () {
 handleProductCards(document);
});