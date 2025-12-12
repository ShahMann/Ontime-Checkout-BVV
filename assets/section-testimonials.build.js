const Slider = async (reviewsContainer) => {
  let autoplaySpeed = reviewsContainer.getAttribute("data-autoplay-speed");
  let layout = reviewsContainer.getAttribute("data-layout");
  let slidesToView = reviewsContainer.getAttribute("data-slides-per-view") || 3;
  let slidesToView_768 = 2;
  let slideCenter = false;
  let isDynamicBullets = reviewsContainer.getAttribute("data-dynamic-pagination");
  isDynamicBullets = isDynamicBullets === "true";
  if (layout === "big-image" || layout === "big-product") {
    slidesToView_768 = 1;
  } else if (layout === "base") {
    slidesToView_768 = 1.4;
    slideCenter = true;
  }
  const Swiper = window.themeCore.utils.Swiper;
  const Autoplay = await window.themeCore.utils.getExternalUtil("swiperAutoplay");
  Swiper.use([Autoplay]);
  function init() {
    const reviewsSlider = new Swiper(reviewsContainer, {
      slidesPerView: 1,
      centeredSlides: slideCenter,
      loop: true,
      spaceBetween: 16,
      autoplay: autoplaySpeed ? {
        delay: autoplaySpeed
      } : false,
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        bulletElement: "button",
        clickable: true,
        dynamicBullets: isDynamicBullets
      },
      breakpoints: {
        768: {
          slidesPerView: slidesToView_768
        },
        1200: {
          slidesPerView: slidesToView
        }
      }
    });
    reviewsSlider.update();
  }
  return Object.freeze({
    init
  });
};
const selectors = {
  reviews: ".js-testimonials-container"
};
const Testimonials = () => {
  async function init(sectionId) {
    const reviewsContainers = [
      ...document.querySelectorAll(selectors.reviews)
    ].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    reviewsContainers.forEach(async (reviewsContainer) => {
      const slider = await Slider(reviewsContainer);
      slider.init();
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Testimonials = window.themeCore.Testimonials || Testimonials();
  window.themeCore.utils.register(window.themeCore.Testimonials, "testimonials");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
