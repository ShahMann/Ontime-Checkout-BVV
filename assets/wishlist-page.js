if (!customElements.get("wishlist-page")) {
	class WishlistPage extends HTMLElement {
		constructor() {
			super()
			this.containers = {
				wishlist: '.wishlist-container',
				emptyWishlist: '.empty-wishlist-container',
				login: '.login-content-wrapper',
				pagination: "#paginationControls"
			}
			this.customer = {
				id: document.body.dataset.customerId,
				email: document.body.dataset.customerEmail
			}
			this.page = 1;
			this.limit = 12;
			this.defaultLimit = 10; 
		}

		connectedCallback() {
			if (!this.customer.email && !this.customer.id) {
				this.showCustomerLogInState()
				return
			}
			return this.syncWishlist()
		}

		showCustomerLogInState(){
			this.querySelector(this.containers.login).classList.remove("is-hidden")
		}

		showNotFoundState(){
			this.querySelector(this.containers.wishlist).classList.add("is-hidden")
			this.querySelector(this.containers.emptyWishlist).classList.remove("is-hidden")
		}

		async syncWishlist(){
			const wishlistsReq = await this.fetchWishlists();
			this.totalCount = wishlistsReq.totalCount
			theme.wishlist.header.setCount(this.totalCount)
			if (wishlistsReq.totalCount == 0) {
				this.showNotFoundState()
				return
			}
			const productIds = this.getProductIDChunks(wishlistsReq.data)
			this.fetchProductCards(productIds).then(results => {
				let productCards = `<ul id="product-grid" class="grid product-grid">${results.join("")}</ul>`
				this.insertCards(productCards, wishlistsReq.data)
			})
		}

		getProductIDChunks(wishlists){
			function chunkArray(arr, chunkSize = 10) {
				const chunks = [];
				for (let i = 0; i < arr.length; i += chunkSize) {
					chunks.push(arr.slice(i, i + chunkSize));
				}
				return chunks;
			}

			const chunked = chunkArray(wishlists, this.defaultLimit);

			return chunked.map((chunk) => {
				return chunk.map((wishlist)=> `id:${wishlist.product_id} OR `)
			})			
		}

		async fetchWishlists() {
			return await theme.fetch.request(`/wishlist?email=${this.customer.email}&customer_id=${this.customer.id}&source=${theme.store.get()}&page=${this.page}&limit=${this.limit}`, "GET")
		}

		async fetchProductCards(productIds) {
			return await Promise.all(
				productIds.map((ids) => {
					let url = `/search?view=wishlist&type=product&q=` + ids.join(" ")
					return fetch(url).then(response => {
						if (!response.ok) {
							throw new Error(`Fetch failed for ${url}: ${response.status}`);
						}
						return response.text();
					})
				})
			)
		}

		insertCards(productCardsHTML, wishlists){
			this.querySelector(this.containers.wishlist).innerHTML = ""
			this.querySelector(this.containers.wishlist).insertAdjacentHTML("beforeend", productCardsHTML)
			wishlists.map((wishlist)=>{
				let target = document.querySelector(`.product-card[data-product-id="${wishlist.product_id}"][data-variant-id="${wishlist.variant_id}"]`)
				target?.querySelector("wishlist-remove").setAttribute("data-id", wishlist.uuid)
			})
			this.syncWishlistRemove()
			this.syncPagination()
		}

		syncWishlistRemove(){
			let wishlistNodes = this.querySelectorAll("wishlist-remove")
			Array.from(wishlistNodes).map(node=> {
				node.addEventListener("click", this.handleWishlistRemove.bind(this))
			})
		}

		async handleWishlistRemove(evt){
			this.classList.add("loading")
			const id = evt.currentTarget.dataset.id
			const deleteWishlistRes = await theme.fetch.request(`/wishlist/${id}?email=${this.customer.email}`, "DELETE")
			this.syncWishlist()	
			setTimeout(() => {
				this.classList.remove("loading")
			}, 1500);
		}

		syncPagination(){
			this.querySelector(this.containers.pagination).innerHTML = ""
			const totalPages = Math.ceil(this.totalCount / this.limit);
			if (totalPages <= 1) {
				return 
			}
			const prevBtn = document.createElement('button');
			prevBtn.textContent = 'Prev';
			prevBtn.disabled = this.page === 1;
			prevBtn.addEventListener('click', () => {
				if (this.page > 1) {
					this.page--;
					this.syncWishlist();
				}
			});

			this.querySelector(this.containers.pagination).appendChild(prevBtn)
			
			for (let i = 1; i <= totalPages; i++) {
				const btn = document.createElement('button');
				btn.className = 'pagination__item'
				btn.textContent = i;
				if (i === this.page) btn.classList.add('active');
				btn.addEventListener('click', () => {
					if (this.page !== i) {
						this.page = i;
						this.syncWishlist();
					}
				});
				this.querySelector(this.containers.pagination).appendChild(btn);
			}

			const nextBtn = document.createElement('button');
			nextBtn.textContent = 'Next';
			nextBtn.disabled = this.page === totalPages;
			nextBtn.addEventListener('click', () => {
				if (this.page < totalPages) {
					this.page++;
					this.syncWishlist();
				}
			});
			this.querySelector(this.containers.pagination).appendChild(nextBtn);
		}
	}
	customElements.define('wishlist-page', WishlistPage)
}