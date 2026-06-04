if (!customElements.get('store-availability')) {
    class StoreAvailability extends HTMLElement{
        constructor(){
            super();
            this.sku = this.dataset.sku
            this.clickAndCollectContainer = this.querySelector(".click-and-collect")
            this.storeListContainer = this.querySelector(".store-availability")
            this.skeleton = this.querySelector("skeleton")

            this.webengageObject = {
                "Product Id":this.dataset.productid,
                "Product Name":this.dataset.title,
                "Tag":this.dataset.tags,
                "Quantity": parseInt(1),
                "Vendor":this.dataset.vendor,
                "Discounted Price": parseFloat(this.dataset.comparedAtPrice),
                "Discount": parseFloat(this.dataset.discountPrice),
                "Price": parseFloat(this.dataset.price),
                "Currency":this.dataset.currency,
                "Size":this.dataset.size,
                "Color":this.dataset.color,
                "Variant Id":this.dataset.variantid,
                "Total Variants": parseInt(this.dataset.variantCount),
                "Image":this.dataset.image
            }
        }

        async connectedCallback(){
            const checkClickAndCollectReq = await theme.fetch.request("/pickup-info", "POST", {
                storeName: theme.store.get(),
                data: {
                    productSkus: [this.sku]
                }
            });
            
            if (checkClickAndCollectReq.data.result[0][this.sku]) {
                this.skeleton?.remove()
                this.handleSyncStores(this.clickAndCollectContainer, 'showDrawer-click-and-collect-drawer', "click-and-collect-drawer")
            }

            this.handleSyncStores(this.storeListContainer, 'showDrawer-store-list', "store-list-drawer")

            const fetchReqRes = await theme.fetch.request("/product-page-info", "POST", {
                "product":{
                    "storeName": theme.store.get(),
                    "productSku": [this.sku],
                    "pageType": "product"
                }
            });

            this.skeleton?.remove()

            document.dispatchEvent(new CustomEvent('generateOrderCount', {
                detail: fetchReqRes.data.ordersCount
            }));

            if (fetchReqRes.data.pickupAddress.length > 0) {
                this.handleClickAndCollectTrigger(fetchReqRes.data.pickupAddress)
                const webengageClickAndCollectObject = {
                    ...this.webengageObject,
                    "Store Name": fetchReqRes.data.pickupAddress.map(item => item.store_address.store_name).join(', '),
                    "Store Information":  fetchReqRes.data.pickupAddress.map(item => {
                        return {
                            "Store Name": item.store_address.store_name,
                            "Store Address": item.store_address.address_line_1 + " " + item.store_address.address_line_2 + " " + item.store_address.area + " " + item.store_address.city + " " + item.store_address.state + " " + item.store_address.country
                        }
                    })
                }
                
                document.querySelector(`.product-drawers__item [data-target="showDrawer-click-and-collect-drawer"]`).addEventListener("click", () => {
                    webengage.track("Click and collect", webengageClickAndCollectObject)
                });
            }
            
            if (fetchReqRes.data.storeDetails.length > 0) {
                this.handleStoreAvailabilityTrigger(fetchReqRes.data.storeDetails)
                const webengageStoreAvailabilityObject = {
                    ...this.webengageObject,
                    "Store Name": fetchReqRes.data.storeDetails.map(item => item.store_address.store_name).join(', '),
                    "Store Information":  fetchReqRes.data.storeDetails.map(item => {
                        return {
                            "Store Name": item.store_address.store_name,
                            "Store Address": item.store_address.address_line_1 + " " + item.store_address.address_line_2 + " " + item.store_address.area + " " + item.store_address.city + " " + item.store_address.state + " " + item.store_address.country
                        }
                    })
                }
                
                document.querySelector(`.product-drawers__item [data-target="showDrawer-store-list"]`).addEventListener("click", () => {
                    webengage.track("Available in stores", webengageStoreAvailabilityObject)
                });
            }
        }

        async handleClickAndCollectTrigger(pickupAddresses){
            const stores = this.generateStores(pickupAddresses)

            document.querySelector("click-and-collect-drawer .drawer__body").innerHTML = stores.outerHTML
        }

        handleStoreAvailabilityTrigger(storeAddresses){
            const stores = this.generateStores(storeAddresses)

            document.querySelector("store-list-drawer .drawer__body").innerHTML = stores.outerHTML
        }

        generateStores(stores){
            const ul = document.createElement('ul');
            ul.className = 'store-availability-list';
            ul.setAttribute('role', 'list');

            stores.forEach(store => {
                const li = document.createElement('li');
                li.classList.add('store-availability-list__item');
                li.innerHTML = `
                <h4 class="store-title">${store.store_address.store_name}</h4>
                <address class="pickup-availability-address">
                    <p>
                    ${store.store_address.address_line_1}, ${store.store_address.address_line_2 || ''}<br/>
                    ${store.store_address.area || ''}<br/>
                    ${store.store_address.city}, ${store.store_address.state}<br/>
                    ${store.store_address.country}
                    </p>
                    <p class="location">
                        <a href="${store.store_address.geo_location}" target="_blank" class="direction-link">Store Direction</a>
                        <span class="direction-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" focusable="false" aria-hidden="true" class="a8x1wuy a8x1wux _1fragem32 _1fragemq0 _1fragemly _1fragemlo _1fragemp6"><path stroke-linejoin="round" d="m7.875 11.697 4.003-8.578c.296-.635-.362-1.293-.997-.997L2.303 6.125c-.453.212-.35.884.146.949l3.385.446a.75.75 0 0 1 .646.646l.446 3.385c.065.495.737.599.949.146"></path></svg>
                        </span>
                    </p>
                </address>`;
                ul.appendChild(li);
            });

            return ul
        }

        handleSyncStores(containerTarget, drawerSelector, drawerTarget){
            containerTarget.classList.remove("is-hidden")

            let clonedNode = containerTarget.querySelector(drawerTarget)

            containerTarget.querySelector(drawerTarget).remove()

            document.body.append(clonedNode)

            let Toggle =  window.themeCore.utils.Toggle;
             const drawer = Toggle({
                toggleSelector: drawerSelector
            });

            drawer.init()
        }
    }

    customElements.define('store-availability', StoreAvailability)
}