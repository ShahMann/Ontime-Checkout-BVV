const selectors = {
  section: ".js-trend-products-section",
  hotSpot: ".js-trend-products-spot",
  productPopup: ".js-trend-product-popup",
  slider: ".js-trend-products-slider"
};
const breakpoints = {
  extraSmall: "(max-width: 767.68px)"
};
const extraSmallScreen = window.matchMedia(breakpoints.extraSmall);
const TrendProducts = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  const Swiper = window.themeCore.utils.Swiper;
  let sections = [];
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach(
      (section) => section.addEventListener("click", clickHandler)
    );
    sections.forEach((section) => {
      let slider = section.querySelector(selectors.slider);
      if (!slider) {
        return;
      }
      initSlider(slider);
    });
  }
  function clickHandler(event) {
    const spotButton = event.target.closest(selectors.hotSpot);
    const section = event.target.closest(selectors.section);
    const spotButtons = [...section.querySelectorAll(selectors.hotSpot)];
    const activeSpotButtons = spotButtons.filter((button) => {
      return button.classList.contains(cssClasses.active);
    });
    if (spotButton) {
      const targetPopupID = spotButton.getAttribute("data-target");
      const targetPopup = document.getElementById(targetPopupID);
      if (!targetPopupID || !targetPopup) {
        return;
      }
      if (activeSpotButtons.length) {
        activeSpotButtons.forEach(function(button) {
          if (spotButton === button) {
            return;
          }
          const productPopupID = button.getAttribute("data-target");
          const productPopup = document.getElementById(productPopupID);
          productPopup.classList.remove(cssClasses.active);
          productPopup.classList.remove("need-animate");
          button.classList.remove(cssClasses.active);
          button.setAttribute("aria-expanded", "false");
        });
      }
      spotButton.classList.toggle(cssClasses.active);
      let isExpanded = spotButton.classList.contains(cssClasses.active);
      targetPopup.classList.toggle(cssClasses.active);
      if (isExpanded) {
        spotButton.setAttribute("aria-expanded", "true");
        document.addEventListener("click", closeAllHotSpots);
      } else {
        spotButton.setAttribute("aria-expanded", "false");
        targetPopup.classList.remove("need-animate");
      }
    }
    function closeAllHotSpots(event2) {
      const isTarget = event2.target.closest(selectors.hotSpot) || event2.target.closest(selectors.productPopup);
      if (isTarget) {
        return;
      }
      let hotSpots = document.querySelectorAll(selectors.hotSpot);
      let productPopups = document.querySelectorAll(
        selectors.productPopup
      );
      if (!hotSpots || !productPopups) {
        return;
      }
      hotSpots.forEach(function(hotSpot) {
        hotSpot.classList.remove(cssClasses.active);
        hotSpot.setAttribute("aria-expanded", "false");
      });
      productPopups.forEach(function(popup) {
        popup.classList.remove(cssClasses.active);
        popup.classList.remove("need-animate");
      });
      document.removeEventListener("click", closeAllHotSpots);
    }
  }
  function initSlider(slider) {
    let swiperSlider;
    let options = {
      slidesPerView: 1,
      watchSlidesProgress: true,
      spaceBetween: 4,
      pagination: {
        el: ".js-trend-products-slider-pagination",
        clickable: true,
        bulletElement: "button"
      },
      breakpoints: {
        576: {
          slidesPerView: 2
        }
      }
    };
    if (extraSmallScreen.matches) {
      swiperSlider = new Swiper(slider, options);
    }
    extraSmallScreen.addEventListener(
      "change",
      changeSliderStateOnBreakpoint
    );
    function changeSliderStateOnBreakpoint(media) {
      if (media.matches) {
        swiperSlider = new Swiper(slider, options);
      } else {
        swiperSlider.destroy();
        slider.classList.remove("swiper-backface-hidden");
      }
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.TrendProducts = window.themeCore.TrendProducts || TrendProducts();
  window.themeCore.utils.register(window.themeCore.TrendProducts, "trends-products");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
