if (!customElements.get("pickup-availability")) {
  customElements.define(
    "pickup-availability",
    class PickupAvailability extends HTMLElement {
      constructor() {
        super();
        if (!this.hasAttribute("available")) {
          return;
        }
        this.errorHtml = this.querySelector(
          "template"
        ).content.firstElementChild.cloneNode(true);
        this.onClickRefreshList = this.onClickRefreshList.bind(this);
        this.fetchAvailability = this.fetchAvailability.bind(this);
        this.initEventListeners();
        try {
          this.fetchAvailability(this.dataset.variantId);
        } catch (e) {
        }
      }
      initEventListeners() {
        document.addEventListener("theme:all:loaded", () => {
          this.fetchAvailability(this.dataset.variantId);
        });
      }
      fetchAvailability(variantId) {
        const sectionId = this.dataset.sectionId;
        let rootUrl = this.dataset.rootUrl;
        if (!rootUrl.endsWith("/")) {
          rootUrl = rootUrl + "/";
        }
        const variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;
        fetch(variantSectionUrl).then((response) => response.text()).then((text) => {
          const sectionInnerHTML = new DOMParser().parseFromString(text, "text/html").querySelector(".shopify-section");
          this.renderPreview(sectionInnerHTML, sectionId);
        }).catch(() => {
          const button = this.querySelector("button");
          if (button) {
            button.removeEventListener(
              "click",
              this.onClickRefreshList
            );
          }
          this.renderError();
        });
      }
      onClickRefreshList() {
        this.fetchAvailability(this.dataset.variantId);
      }
      renderError() {
        this.innerHTML = "";
        this.appendChild(this.errorHtml);
        this.querySelector("button").addEventListener(
          "click",
          this.onClickRefreshList
        );
      }
      renderPreview(sectionInnerHTML, sectionId) {
        const pickupAvailabilityPreview = sectionInnerHTML.querySelector(
          "pickup-availability-preview"
        );
        if (!pickupAvailabilityPreview) {
          this.innerHTML = "";
          this.removeAttribute("available");
          return;
        }
        const toggle = pickupAvailabilityPreview.querySelector(
          "[data-js-toggle-selector]"
        );
        if (toggle) {
          toggle.dataset.target += `__${sectionId}`;
          toggle.dataset.jsToggle = toggle.dataset.target;
        }
        this.innerHTML = pickupAvailabilityPreview.outerHTML;
        this.setAttribute("available", "");
        const drawer = sectionInnerHTML.querySelector(
          "pickup-availability-drawer"
        );
        if (drawer) {
          drawer.id += `__${sectionId}`;
          const toggle2 = drawer.querySelector(
            "[data-js-toggle-selector]"
          );
          if (toggle2) {
            toggle2.dataset.target += `__${sectionId}`;
            toggle2.dataset.jsToggle = toggle2.dataset.target;
          }
          const availableDrawer = document.querySelector(
            `pickup-availability-drawer#productAvailability-pickup-availability__${this.dataset.sectionId}`
          );
          if (availableDrawer) {
            availableDrawer.outerHTML = drawer.outerHTML;
          } else {
            document.body.appendChild(drawer);
          }
        }
      }
    }
  );
}
if (!customElements.get("pickup-availability-drawer")) {
  customElements.define(
    "pickup-availability-drawer",
    class PickupAvailabilityDrawer extends HTMLElement {
      constructor() {
        super();
        window.themeCore.EventBus.emit(
          `pickup-availability-drawer:${this.id}:loaded`
        );
      }
    }
  );
}
