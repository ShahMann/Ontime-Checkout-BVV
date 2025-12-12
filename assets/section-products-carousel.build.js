const selectors = {
  section: ".js-products-carousel",
  sliderImage: ".js-products-carousel-big-image-slider",
  sliderProduct: ".js-products-carousel-product-slider",
  slideProduct: ".js-products-carousel-product-slide",
  sliderProductButtonPrev: ".js-products-carousel-slider-button-prev",
  sliderProductButtonNext: ".js-products-carousel-slider-button-next",
  sliderProductPagination: ".js-products-carousel-pagination-bullets",
  video: ".js-products-carousel-video"
};
const ProductCarousel = () => {
  const Swiper = window.themeCore.utils.Swiper;
  async function init(sectionId) {
    const EffectFade = await window.themeCore.utils.getExternalUtil("swiperEffectFade");
    Swiper.use([EffectFade]);
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const slidersImage = [...section.querySelectorAll(selectors.sliderImage)];
      const slidersProduct = [...section.querySelectorAll(selectors.sliderProduct)];
      let bigImageSlider;
      slidersImage.forEach(async (slideImage) => {
        bigImageSlider = new Swiper(slideImage, {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 16,
          allowTouchMove: false,
          effect: "fade",
          fadeEffect: {
            crossFade: true
          },
          speed: 1e3,
          on: {
            slideChange: function() {
              PlayCurrentVideo(this);
            },
            init: function() {
              PlayCurrentVideo(this);
            }
          }
        });
      });
      slidersProduct.forEach(async (slideProduct) => {
        const buttonNext = slideProduct.querySelector(selectors.sliderProductButtonNext);
        const buttonPrev = slideProduct.querySelector(selectors.sliderProductButtonPrev);
        const pagination = slideProduct.querySelector(selectors.sliderProductPagination);
        let isDynamicBullets = slideProduct.getAttribute("data-dynamic-pagination");
        isDynamicBullets = isDynamicBullets === "true";
        return new Swiper(slideProduct, {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 16,
          autoHeight: true,
          pagination: {
            el: pagination,
            clickable: true,
            dynamicBullets: isDynamicBullets
          },
          navigation: {
            nextEl: buttonNext,
            prevEl: buttonPrev
          },
          on: {
            slideChange: function() {
              if (bigImageSlider) {
                bigImageSlider.slideTo(this.activeIndex);
              }
            }
          }
        });
      });
      async function PlayCurrentVideo(slider) {
        const slides = slider.slides;
        slides.forEach((slide) => {
          if (slide.querySelector(selectors.video)) {
            slide.querySelectorAll(selectors.video).forEach((video) => {
              video.pause();
            });
          }
        });
        const CurrentVideo = slides[slider.activeIndex].querySelectorAll(`${selectors.video}`);
        if (CurrentVideo.length >= 1) {
          CurrentVideo.forEach((video) => {
            video.play();
          });
        }
      }
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ProductCarousel = window.themeCore.ProductCarousel || ProductCarousel();
  window.themeCore.utils.register(window.themeCore.ProductCarousel, "products-carousel");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
