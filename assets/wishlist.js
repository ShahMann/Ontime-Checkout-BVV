if (!customElements.get('wishlist-element')) {
    class WishlistElement extends HTMLElement {
        constructor() {
            super()
            this.handle = this.dataset.handle
            this.productId = this.dataset.productid
            this.variantId = this.dataset.variantid
            this.sku = this.dataset.sku
            this.currency = this.dataset.currency
            this.value = this.dataset.value
            this.title = this.dataset.title
            this.category = this.dataset.category
            
            if (!this.sku || this.sku == "") return
            this.customer = {
                email: document.body.dataset.customerEmail,
                id: document.body.dataset.customerId
            }
            this.button = this.querySelector("button")
            this.emptyWishlist = this.button.querySelector(".heart-empty")
            this.filledWishlist = this.button.querySelector(".heart-fill")
            this.syncWishlist()
            this.button.addEventListener("click", (evt) => {
                if (evt.pointerType != '') {
                    this.wishlistClick(evt)
                }
            })

            this.eventData = {
                "Product Id": this.dataset.productid,
                "Variant Id": this.dataset.variantid,
                "Product Name": this.dataset.title,
                "Tag": this.dataset.tags,
                "Quantity": 1,
                "Vendor": this.dataset.vendor,
                "Price": parseFloat(this.dataset.price),
                "Discounted Price": parseFloat(this.dataset.comparedAtPrice),
                "Discount": parseFloat(this.dataset.discountPrice),
                "Total Variants": this.dataset.variantCount,
                "Currency": this.dataset.currency,
                "Size": this.dataset.size,
                "Color": this.dataset.color,
                "Image": this.dataset.image
            }
        }

        async syncWishlist(){
            if (!this.customer.email && !this.customer.id) {
                this.addToWishlistState()
                return
            }
            const getWishlistDetail = await this.fetchWishlist()
            if (!this.isObjectBlank(getWishlistDetail.data)) {
                this.wishlistId = getWishlistDetail.data.uuid
                return this.removeToWishlistState()
            }
            return this.addToWishlistState()
        }

        async fetchWishlist() {
            if (!this.customer.email && !this.customer.id) return

            return await theme.fetch.request(`/wishlist/${this.sku}?email=${this.customer.email}&customer_id=${this.customer.id}&source=${theme.store.get()}`, "GET");
        }

        addToWishlistState() {
            this.filledWishlist.classList.add("is-hidden")
            this.emptyWishlist.classList.remove("is-hidden")
            this.button.classList.remove("is-hidden")
        }

        removeToWishlistState() {
            this.filledWishlist.classList.remove("is-hidden")
            this.emptyWishlist.classList.add("is-hidden")
            this.button.classList.remove("is-hidden")
        }

        wishlistClick(evt) {
            evt.preventDefault()
            if (!this.customer.email && !this.customer.id) {
                let returnTo = window.location.pathname
                window.location.href = `/customer_authentication/login?return_to=${returnTo.replaceAll('/', "%2F")}`
                return
            }

            let target = evt.target.closest("div")
            target.parentElement.setAttribute("disabled", true)                         

            
            if (target.classList.contains("added-to-wishlist")) {
                return this.removeFromWishlist(target)
            }

            return this.addToWishlist(target)
        }

        async addToWishlist(target) {
            const body = {
                "store_name": theme.store.get(),
                "customer_email": this.customer.email,
                "customer_id": `${this.customer.id}`,
                "product_id": `${this.productId}`,
                "variant_id": `${this.variantId}`,
                "sku_id": this.sku,
                "handle": this.handle
            }

            const addToWishlistReq = await theme.fetch.request(`/wishlist`, "POST", body)
            if (addToWishlistReq.status == 201) {
                this.wishlistId = addToWishlistReq.uuid
                this.removeToWishlistState()
                this.handleWishlistCount(+1)
                target.parentElement.removeAttribute("disabled")
                
                // Track the event data
                webengage.track("Added To Wishlist", this.eventData);
            }

            gtag("event", "add_to_wishlist", {
                currency: this.currency,
                value: this.value,
                items: [
                  {
                    item_id: this.productId,
                    item_name: this.title,
                    index: 0,
                    item_brand: this.category,
                    item_variant: this.variantId,
                    price: this.value,
                    quantity: 1,
                    sku: this.sku
                  }
                ],
            });
        }

        async removeFromWishlist(target) {

            const removeFromWishlistReq = await theme.fetch.request(`/wishlist/${this.wishlistId}?email=${this.customer.email}`, "DELETE")
            if (removeFromWishlistReq.status == 200) {
                this.addToWishlistState()
                this.handleWishlistCount(-1)
                target.parentElement.removeAttribute("disabled")

                // Track the event data
                webengage.track("Removed From Wishlist", this.eventData);
            }
        }


        isObjectBlank(obj) {
            return (
                obj &&
                typeof obj === 'object' &&
                !Array.isArray(obj) &&
                Object.keys(obj).length === 0
            );
        }

        handleWishlistCount(count){
            let fetchCurrentCount = document.querySelector("wishlist-header .header__wishlist-count span").innerText
            let newCount = parseInt(fetchCurrentCount) + count
            theme.wishlist.header.setCount(newCount)
        }
    }

    customElements.define('wishlist-element', WishlistElement)
}