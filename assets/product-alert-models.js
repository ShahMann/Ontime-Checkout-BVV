if (!customElements.get("alert-modal-buttons")) {
    class AlertModalButtons extends HTMLElement {
        constructor() {
            super();
            this.buttons = this.querySelectorAll("button")
            this.customer = {
                id: document.body.dataset.customerId,
                email: document.body.dataset.customerEmail
            }
            this.messageBox = this.querySelector("message-wrapper")
            Array.from(this.buttons).map(button => button.addEventListener("click", this.buttonClick.bind(this)))

            this.webengageObject = {
                "Product Id": this.dataset.productid,
                "Variant Id": this.dataset.variantid,
                "Product Name": this.dataset.title,
                "Tag": this.dataset.tags,
                "Quantity": 1,
                "Vendor": this.dataset.vendor,
                "Price": parseFloat(this.dataset.price),
                "Discounted Price": parseFloat(this.dataset.comparedAtPrice),
                "Discount": parseFloat(this.dataset.discountPrice),
                "Total Variants": parseInt(this.dataset.variantCount),
                "Currency": this.dataset.currency,
                "Size": this.dataset.size,
                "Color": this.dataset.color,
                "Image": this.dataset.image
            }
        }

        async buttonClick(evt) {
            evt.preventDefault()
            const currentTarget = evt.currentTarget

            if (!this.customer.email && !this.customer.id) {
                let returnTo = window.location.pathname
                window.location.href = `/customer_authentication/login?return_to=${returnTo.replaceAll('/', "%2F")}`
                return
            }
            const overlay2 = window.themeCore.utils.overlay;
            overlay2({ namespace: `alert-mode-preloader` }).open(true);
            
            this.type = currentTarget.getAttribute("id")
            if (this.type == "backInStockBtn") {
                this.route = 'notify-variant-instock'
                this.Action = "Notify Me"
            } else {
                this.route = 'price-drop-alert'
                this.Action = "Price Drop Alert"
            }
            const submitReq = await theme.fetch.request(`/${this.route}`, "POST", this.fetchBody())

            let message = submitReq?.success_details?.success_message || submitReq?.error_details?.error_message
            this.messageBox.insertAdjacentHTML("beforeend", `<p>${message}</p>`)
            overlay2({ namespace: `alert-mode-preloader` }).close();
            
            //display a success message
            setTimeout(() => {
                this.messageBox.innerText = ''
            }, 5000);

            webengage.track(this.Action, this.webengageObject)
        }

        fetchBody() {
            let body;
            if (this.type == "backInStockBtn") {
                let details = this.querySelector("script[name='alert-back-in-stock']").innerText
                body = JSON.parse(details)
            } else {
                let details = this.querySelector("script[name='alert-price-drop']").innerText
                body = JSON.parse(details)
            }
            body.store_name = theme.store.get()
            body.device_type = "web"

            return body
        }
    }
    customElements.define("alert-modal-buttons", AlertModalButtons)
}