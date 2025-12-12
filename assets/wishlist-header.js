if (!customElements.get("wishlist-header")) {
    class WishlistHeader extends HTMLElement{
        constructor(){
            super()
            this.customer = {
                id: document.body.dataset.customerId,
                email: document.body.dataset.customerEmail
            }
        }

        async connectedCallback(){
            if (!this.customer.email) {
                return
            }
            const fetchCountRes = await theme.fetch.request(`/wishlist?email=${this.customer.email}&customer_id=${this.customer.id}&source=${theme.store.get()}&page=1&limit=12`, "GET");
            theme.wishlist.header.setCount(fetchCountRes.totalCount)
        }
    }

    customElements.define("wishlist-header", WishlistHeader)
} 