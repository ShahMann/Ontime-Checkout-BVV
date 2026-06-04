const domain = `${window.__ENV__.PUBLIC_API_URL}/api/v1`; 
const headers = {
    'Accept': "application/json",
    "Content-type": "application/json",
    "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiZnJvbnQtYXBpIiwiaWF0IjoxNzQ1OTkyNDQyfQ.5sgCiS6_MC8p9ry1p_A3XFpKqQaTRlqFeKfmin6Ddtg'
}

window.theme = window.theme || {}

theme.store = {
    get: function(){
        let shop;
        switch (Shopify.shop) {
            case "ontime-checkout-bvv.myshopify.com":
                shop = "ONTIME-CHECKOUT.BVV.KW"
                break;
            case "ontime-kw.myshopify.com":
                shop = "ONTIME.KW"
                break;
            case "ontime-sa.myshopify.com":
                shop = "ONTIME.SA"
                break;
            case "ontime-ae.myshopify.com":
                shop = "ONTIME.AE"
                break;
            case "ontime-iraq.myshopify.com":
                shop = "ONTIME.IQ"
                break;
            
            default:
                break;
        }

        return shop;
    }
}

theme.fetch = {
    request: async(endPoint, method, body = null) => {
        let req, res;
        try {
            if (method == "GET" || method == "DELETE") {
                req = await fetch(`${domain}${endPoint}`,{
                    method: method,
                    headers: headers,
                })
            }else{
                req = await fetch(`${domain}${endPoint}`,{
                    method: method,
                    headers: headers,
                    body: JSON.stringify(body)
                })
            }
            res = await req.json();
        } catch (error) {
            res = error
        }
        return res
    }
}

theme.wishlist = {
    header: {
        setCount: (count)=>{
            document.querySelector("wishlist-header .header__wishlist-count span").innerText = count
            document.querySelector("wishlist-header .header__wishlist-count").setAttribute("data-wishlist-count", count)
            theme.wishlist.updateAPICount()
        }
    },
    updateAPICount: async ()=> {
        const customer = {
            email: document.body.dataset.customerEmail,
            id: document.body.dataset.customerId
        }
        if (!customer.email && !customer.id) {
            return
        }

        const fetchCountRes = await theme.fetch.request(`/wishlist?email=${customer.email}&customer_id=${customer.id}&source=${theme.store.get()}&page=1&limit=12`, "GET");
        const fetchHandles = fetchCountRes.data.map(async (item) => {    
            const req = await fetch(`/products/${item.handle}.json`)
            return req.json()
        })
        const productsResolved =  await Promise.allSettled(fetchHandles)
        const products = productsResolved.map(product => product.value?.product).filter(product => product !== undefined)
        const productData = products.map(product => {
            return {
                "Brand": product.vendor,
                "Product ID": product.id,
                "Tags": product.tags,
                "Price": product.variants[0].price,
                "Product Name": product.title,
                "Currency": product.variants[0].price_currency,
                "Image": product.image?.src || "",
            }
        })

        const updateData = {
            "No. Of Products": productData.length,
            "Total Amount": productData.reduce(function(a,b) { 
                return parseFloat(a) + parseFloat(b.Price)
            }, 0),
            "Product Details": productData
        }
        webengage.track("Wishlist Updated", updateData);
    }
}