const classes = {
  cartReminder: "cart-reminder",
  closeButton: "cart-reminder__close-button",
  content: "cart-reminder__content",
  text: "cart-reminder__text",
  outline: "focus-visible-outline"
};
const CartReminder = (config) => {
  const setCookie = window.themeCore.utils.setCookie;
  const getCookie = window.themeCore.utils.getCookie;
  const deleteCookie = window.themeCore.utils.deleteCookie;
  const on = window.themeCore.utils.on;
  const body = document.querySelector("body");
  let cartReminder = null;
  let timeout = null;
  let closeTimeout;
  let cookieTimeMinutes = config.cookieTime;
  let cookieTime = cookieTimeMinutes * 60 * 1e3;
  if (config.displayFrequency === "one_time") {
    closeTimeout = 24 * 60 * 60 * 1e3;
  } else {
    closeTimeout = cookieTime;
  }
  let cookieExpires = (/* @__PURE__ */ new Date()).setTime((/* @__PURE__ */ new Date()).getTime() + cookieTime);
  let closeCookieExpires = (/* @__PURE__ */ new Date()).setTime((/* @__PURE__ */ new Date()).getTime() + closeTimeout);
  const strings = {
    CART_TYPE_DRAWER: "drawer"
  };
  function init() {
    checkCart();
    setEventListeners();
  }
  function checkCart() {
    window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART, { noOpen: true });
  }
  function setTimerTimeout() {
    if (getCookie("cart_reminder")) {
      timeout = +getCookie("cart_reminder") - (/* @__PURE__ */ new Date()).getTime();
    } else {
      timeout = null;
    }
  }
  function setEventListeners() {
    window.themeCore.EventBus.listen("cart:updated", (event) => {
      if (!getCookie("cart_reminder_closed")) {
        onCartUpdated(event);
      }
    });
    window.themeCore.EventBus.listen("cart-reminder:added", () => {
      cartReminder = document.querySelector(`.${classes.cartReminder}`);
      if (!cartReminder) {
        return;
      }
      let cartReminderCloseButton = cartReminder.querySelector(`.${classes.closeButton}`);
      let cartReminderButton = cartReminder.querySelector(`.${classes.content}`);
      on("click", cartReminderButton, () => {
        window.themeCore.EventBus.emit("cart:drawer:open");
        setCookieOnClose();
        removePopupFromDOM();
      });
      on("click", cartReminderCloseButton, () => {
        setCookieOnClose();
        removePopupFromDOM();
      });
    });
  }
  function setCookieTime() {
    cookieExpires = (/* @__PURE__ */ new Date()).setTime((/* @__PURE__ */ new Date()).getTime() + cookieTime);
    setCookie("cart_reminder", cookieExpires, {
      expires: new Date(cookieExpires)
    });
  }
  function setCookieOnClose() {
    closeCookieExpires = (/* @__PURE__ */ new Date()).setTime((/* @__PURE__ */ new Date()).getTime() + closeTimeout);
    setCookie("cart_reminder_closed", "1", {
      expires: new Date(closeCookieExpires)
    });
  }
  function onCartUpdated(event) {
    if (event.item_count > 0) {
      if (!getCookie("cart_reminder")) {
        setCookieTime();
      }
      setTimerTimeout();
      if (timeout) {
        setTimeout(() => {
          insertPopupToDOM();
        }, timeout);
      }
    } else {
      deleteCookie("cart_reminder");
      removePopupFromDOM();
    }
  }
  function DOMCartReminder() {
    const DOMContent = config.cartType === strings.CART_TYPE_DRAWER ? DOMContentWithCartDrawer() : DOMContentWithCartPage();
    return `
			<div
				class="${classes.cartReminder}"
				style="
					--cart-reminder-color-text: ${config.colorText};
					--cart-reminder-color-bg: ${config.colorBg};
					--cart-reminder-color-icon: ${config.colorIcon};
					--cart-reminder-color-button-close: ${config.colorButtonClose};
				"
			>
				${DOMContent}

				<button
					class="${classes.closeButton} ${classes.outline}"
					aria-label="${config.closeButtonA11y}"
					type="button"
					data-cart-reminder-close
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path d="M18 6L6 18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M6 6L18 18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		`;
  }
  function DOMContentWithCartDrawer() {
    return `
			<button
				type="button"
				class="${classes.content} ${classes.outline}"
				data-target="CartDrawer"
				data-js-toggle="CartDrawer"
				aria-expanded="false"
				aria-controls="CartDrawer"
				aria-label="${config.cartButtonA11y}"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M14 5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3C11.4696 3 10.9609 3.21071 10.5858 3.58579C10.2107 3.96086 10 4.46957 10 5" stroke="#4D71F9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M20.6453 18.696L19.2603 9.696C19.1877 9.22376 18.9494 8.79312 18.5868 8.48203C18.2241 8.17094 17.7621 7.99994 17.2843 8H6.71632C6.23835 7.9997 5.77609 8.17059 5.41324 8.4817C5.0504 8.79282 4.81097 9.22359 4.73832 9.696L3.35332 18.696C3.30949 18.981 3.32781 19.2721 3.40702 19.5494C3.48624 19.8267 3.62448 20.0836 3.81226 20.3024C4.00005 20.5212 4.23294 20.6969 4.49496 20.8173C4.75699 20.9377 5.04195 21 5.33032 21H18.6703C18.9585 20.9997 19.2433 20.9372 19.505 20.8167C19.7668 20.6961 19.9995 20.5204 20.187 20.3016C20.3746 20.0828 20.5126 19.8261 20.5917 19.5489C20.6709 19.2718 20.6891 18.9808 20.6453 18.696Z" fill="#4D71F9" class="custom-icon--fill" />
					<path d="M16 11L10.5 16.5L8 14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="custom-icon--stroke" />
				</svg>

				<span class="${classes.text}">
					${config.text}
				</span>
			</button>
		`;
  }
  function DOMContentWithCartPage() {
    return `
			<a
				href="${config.cartRoute}"
				class="${classes.content} ${classes.outline}"
				aria-label="${config.cartLinkA11y}"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M14 5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3C11.4696 3 10.9609 3.21071 10.5858 3.58579C10.2107 3.96086 10 4.46957 10 5" stroke="#4D71F9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M20.6453 18.696L19.2603 9.696C19.1877 9.22376 18.9494 8.79312 18.5868 8.48203C18.2241 8.17094 17.7621 7.99994 17.2843 8H6.71632C6.23835 7.9997 5.77609 8.17059 5.41324 8.4817C5.0504 8.79282 4.81097 9.22359 4.73832 9.696L3.35332 18.696C3.30949 18.981 3.32781 19.2721 3.40702 19.5494C3.48624 19.8267 3.62448 20.0836 3.81226 20.3024C4.00005 20.5212 4.23294 20.6969 4.49496 20.8173C4.75699 20.9377 5.04195 21 5.33032 21H18.6703C18.9585 20.9997 19.2433 20.9372 19.505 20.8167C19.7668 20.6961 19.9995 20.5204 20.187 20.3016C20.3746 20.0828 20.5126 19.8261 20.5917 19.5489C20.6709 19.2718 20.6891 18.9808 20.6453 18.696Z" fill="#4D71F9" class="custom-icon--fill" />
					<path d="M16 11L10.5 16.5L8 14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="custom-icon--stroke" />
				</svg>

				<span class="${classes.text}">
					${config.text}
				</span>
			</a>
		`;
  }
  function insertPopupToDOM() {
    if (cartReminder) {
      removePopupFromDOM();
    }
    body.insertAdjacentHTML("afterbegin", DOMCartReminder());
    window.themeCore.EventBus.emit("cart-reminder:added");
  }
  function removePopupFromDOM() {
    if (cartReminder) {
      cartReminder.remove();
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  if (!window.themeCore || !window.themeCore.CartReminder || window.themeCore.CartReminder.initiated) {
    return;
  }
  CartReminder(window.themeCore.CartReminder.config).init();
  window.themeCore.CartReminder.initiated = true;
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
