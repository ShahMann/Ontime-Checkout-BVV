const Slider = async (gallery) => {
  let autoplaySpeed = gallery.getAttribute("data-autoplay-speed");
  let isDynamicBullets = gallery.getAttribute("data-dynamic-pagination");
  isDynamicBullets = isDynamicBullets === "true";
  const Swiper = window.themeCore.utils.Swiper;
  const Autoplay = await window.themeCore.utils.getExternalUtil(
    "swiperAutoplay"
  );
  Swiper.use([Autoplay]);
  function init() {
    const gallerySlider = new Swiper(gallery, {
      slidesPerView: "auto",
      centeredSlides: true,
      loop: true,
      autoplay: autoplaySpeed ? {
        delay: autoplaySpeed,
        disableOnInteraction: true
      } : false,
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
        dynamicBullets: isDynamicBullets
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      breakpoints: {
        1200: {
          autoplay: autoplaySpeed ? {
            delay: autoplaySpeed,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          } : false
        }
      }
    });
    gallerySlider.update();
  }
  return Object.freeze({
    init
  });
};
const selectors = {
  gallery: ".js-image-slider-container"
};
const ImageSlider = () => {
  async function init(sectionId) {
    const galleries = [...document.querySelectorAll(selectors.gallery)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    galleries.forEach(async (gallery) => {
      const slider = await Slider(gallery);
      slider.init();
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ImageSlider = window.themeCore.ImageSlider || ImageSlider();
  window.themeCore.utils.register(window.themeCore.ImageSlider, "image-slider");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
