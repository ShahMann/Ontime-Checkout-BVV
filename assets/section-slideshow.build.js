import { p as playVideo, a as pauseVideo, i as initVideos, v as vimeoDisableTabIndexHandler } from "./videoBackrground-cfecd0c0.js";
const Video = (videoContainer) => {
  const config = {
    videoContainer,
    options: {
      youtube: {
        autoplay: 0,
        controls: 0,
        showinfo: 0,
        rel: 0,
        playsinline: 1,
        loop: 1
      },
      vimeo: {
        controls: false,
        loop: true,
        muted: true,
        portrait: false,
        title: false,
        keyboard: false,
        byline: false,
        autopause: false
      }
    }
  };
  async function init() {
    const videos = await initVideos(config);
    if (videos && videos.length) {
      vimeoDisableTabIndexHandler(videos);
      return videos;
    }
  }
  return Object.freeze({
    init,
    playVideo,
    pauseVideo
  });
};
const Slider = async (section) => {
  const Swiper = window.themeCore.utils.Swiper;
  const A11y = window.themeCore.utils.swiperA11y;
  const Pagination = window.themeCore.utils.swiperPagination;
  const Autoplay = await window.themeCore.utils.getExternalUtil("swiperAutoplay");
  const Parallax = await window.themeCore.utils.getExternalUtil("swiperParallax");
  const EffectFade = await window.themeCore.utils.getExternalUtil("swiperEffectFade");
  const EffectFlip = await window.themeCore.utils.getExternalUtil("swiperEffectFlip");
  const EffectCreative = await window.themeCore.utils.getExternalUtil("swiperEffectCreative");
  Swiper.use([Pagination, Autoplay, Parallax, EffectFade, EffectFlip, EffectCreative, A11y]);
  const selectors2 = {
    slider: ".js-slider",
    slide: ".swiper-slide",
    activeSlide: ".swiper-slide-active",
    sliderSettings: ".js-slider-settings",
    video: ".js-video",
    videoPosterDesktop: ".js-video-poster-desktop",
    videoPosterMobile: ".js-video-poster-mobile",
    playButton: ".js-video-button-play",
    pauseButton: ".js-video-button-pause",
    showButtons: "[data-show-button=true]",
    currentVideo: ".swiper-slide.swiper-slide-active .js-video, .js-slider:not(.swiper) .js-video",
    button: ".js-button",
    iframe: "iframe",
    currentVimeoVideo: ".swiper-slide.swiper-slide-active .js-video.js-video-vimeo, .js-slider:not(.swiper) .js-video.js-video-vimeo"
  };
  const classes = {
    active: "is-active",
    swiperSlideActive: "swiper-slide-active"
  };
  const mediaSmall = window.matchMedia("(max-width: 767px)");
  const slider = section.querySelector(selectors2.slider);
  const sliderSettingsDOM = section.querySelector(selectors2.sliderSettings);
  const pauseButton = section.querySelector(selectors2.pauseButton);
  const playButton = section.querySelector(selectors2.playButton);
  const playVideo2 = await Video(section).playVideo;
  const pauseVideo2 = await Video(section).pauseVideo;
  let timeoutId, swiperSlider, sliderSettings;
  let slides;
  if (slider) {
    slides = [...slider.querySelectorAll(selectors2.slide)];
  }
  async function initSwiper() {
    sliderSettings = getSettings();
    if (!sliderSettings) {
      return;
    }
    swiperSlider = new Swiper(slider, {
      ...sliderSettings,
      autoplay: false
    });
    const activeSlide = section.querySelector(selectors2.activeSlide);
    if (activeSlide) {
      disableTabulationOnNotActiveSlides(activeSlide);
      let activeSlideMedia = slider.querySelectorAll(".js-need-animate-after-load");
      if (activeSlideMedia.length) {
        activeSlideMedia.forEach(function(mediaEl) {
          mediaEl.classList.add("need-animate");
        });
      }
    }
    let videos = await Video(section).init();
    if (videos && videos.length) {
      mediaSmall.addEventListener("change", () => {
        initVideos2(videos);
      });
      initVideos2(videos);
      section.addEventListener("click", (event) => clickHandler(event, videos));
      swiperSlider.on("slidesLengthChange", async function() {
        videos = await Video(section).init();
      });
      window.addEventListener("resize", handleCurrentVimeoVideo);
    }
    swiperSlider.on("slideChange", function(swiper) {
      window.themeCore.LazyLoadImages.init();
      const activeSlide2 = section.querySelector(`${selectors2.slide}:nth-child(${swiper.activeIndex + 1}`);
      disableTabulationOnNotActiveSlides(activeSlide2);
      if (!videos || !videos.length) {
        return;
      }
      const currentVideo = [...section.querySelectorAll(`${selectors2.slide}:nth-child(${swiper.activeIndex + 1}) ${selectors2.video}`)].filter(
        (video) => getComputedStyle(video).getPropertyValue("display") !== "none"
      );
      const showButtons = !!section.querySelector(`${selectors2.slide}:nth-child(${swiper.activeIndex + 1}) ${selectors2.showButtons}`);
      handleVideoButtons(showButtons, currentVideo);
      handleVideos(videos, currentVideo);
      if (currentVideo && currentVideo.length) {
        currentVideo.forEach((curVideo) => {
          if (!curVideo.dataset.vimeoInitialized) {
            return;
          }
          const iframe = curVideo.querySelector(selectors2.iframe);
          iframe && handleVimeoSize(iframe);
        });
      }
    });
    if (sliderSettings && sliderSettings.autoplay && sliderSettings.autoplay.delay) {
      autoplayIteration();
      swiperSlider.on("slideChangeTransitionEnd", () => {
        autoplayIteration();
      });
    }
  }
  function getSettings() {
    try {
      return JSON.parse(sliderSettingsDOM.textContent);
    } catch {
      return null;
    }
  }
  function init() {
    if (slider && sliderSettingsDOM) {
      setIntersectionObserver(initSwiper);
      return;
    } else if (slides && slides.length === 1) {
      slides[0].classList.add(classes.swiperSlideActive);
    }
    setIntersectionObserver(initSingleVideo);
  }
  function handleVideos(videos, currentVideo, initiatorClick) {
    const posterSelector = mediaSmall.matches ? selectors2.videoPosterMobile : selectors2.videoPosterDesktop;
    if (!videos) {
      return;
    }
    videos.forEach((video) => {
      let isCurrentVideo = currentVideo.some((videoItem) => video.videoWrapper === videoItem && (JSON.parse(videoItem.dataset.autoplay) || initiatorClick));
      if (currentVideo && currentVideo.length && isCurrentVideo) {
        currentVideo.forEach((curVideo) => {
          if (video.videoWrapper === curVideo && (JSON.parse(curVideo.dataset.autoplay) || initiatorClick)) {
            const poster = curVideo.closest(selectors2.slide).querySelector(posterSelector);
            playVideo2(video.player, video.type);
            if (poster) {
              setTimeout(() => poster.remove(), 200);
            }
          }
        });
        return;
      }
      pauseVideo2(video.player, video.type);
    });
  }
  function playCurrentVideo(videos, initiatorClick) {
    const currentVideo = [...section.querySelectorAll(selectors2.currentVideo)].filter((video) => getComputedStyle(video).getPropertyValue("display") !== "none");
    handleVideos(videos, currentVideo, initiatorClick);
  }
  function pauseVideos(videos) {
    videos.forEach((videoObj) => {
      pauseVideo2(videoObj.player, videoObj.type);
    });
  }
  async function initSingleVideo() {
    let videos = await Video(section).init();
    const showButtons = !!section.querySelector(`${selectors2.showButtons}`);
    const currentVideo = [...section.querySelectorAll(`${selectors2.video}`)].filter((video) => getComputedStyle(video).getPropertyValue("display") !== "none");
    handleVideoButtons(showButtons, currentVideo);
    section.addEventListener("click", (event) => clickHandler(event, videos));
    playCurrentVideo(videos);
    window.addEventListener("resize", handleCurrentVimeoVideo);
    mediaSmall.addEventListener("change", () => {
      playCurrentVideo(videos);
      handleVideoButtons(showButtons, currentVideo);
    });
  }
  function handleVideoButtons(show, currentVideo) {
    currentVideo = currentVideo || [...section.querySelectorAll(selectors2.currentVideo)].filter((video) => getComputedStyle(video).getPropertyValue("display") !== "none");
    if (currentVideo && currentVideo.length && !JSON.parse(currentVideo[0].dataset.autoplay)) {
      pauseButton.classList.remove(classes.active);
      if (show) {
        playButton.classList.add(classes.active);
        return;
      }
      playButton.classList.remove(classes.active);
      return;
    }
    playButton.classList.remove(classes.active);
    if (show) {
      pauseButton.classList.add(classes.active);
      return;
    }
    pauseButton.classList.remove(classes.active);
  }
  function clickHandler(event, videos) {
    const pauseButtonCurrent = event.target.closest(selectors2.pauseButton);
    if (pauseButtonCurrent) {
      pauseButton.classList.remove(classes.active);
      playButton.classList.add(classes.active);
      pauseVideos(videos);
      return;
    }
    const playButtonCurrent = event.target.closest(selectors2.playButton);
    if (playButtonCurrent) {
      pauseButton.classList.add(classes.active);
      playButton.classList.remove(classes.active);
      playCurrentVideo(videos, true);
    }
  }
  function initVideos2(videos) {
    const showButtons = !!section.querySelector(`${selectors2.slide}${selectors2.activeSlide} ${selectors2.showButtons}`);
    handleVideoButtons(showButtons);
    playCurrentVideo(videos);
  }
  function disableTabulationOnNotActiveSlides(activeSlide) {
    const slides2 = [...section.querySelectorAll(selectors2.slide)];
    slides2.forEach((slide) => {
      const buttons = slide.querySelectorAll(selectors2.button);
      if (!buttons.length) {
        return;
      }
      if (slide === activeSlide) {
        buttons.forEach((button) => button.setAttribute("tabindex", 0));
        return;
      }
      buttons.forEach((button) => button.setAttribute("tabindex", -1));
    });
  }
  function setIntersectionObserver(handler) {
    const observer = new IntersectionObserver(
      (entries, observer2) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handler();
            observer2.unobserve(section);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    initFirstVimeoAppearance();
  }
  function handleVimeoSize(iframe) {
    if (!iframe) {
      return;
    }
    setTimeout(() => {
      const initialIframeWidth = iframe == null ? void 0 : iframe.width;
      const initialIframeHeight = iframe == null ? void 0 : iframe.height;
      const iframeContainer = iframe.parentElement;
      const aspectRatio = initialIframeWidth && initialIframeHeight ? initialIframeWidth / initialIframeHeight : 16 / 9;
      const containerWidth = iframeContainer.offsetWidth;
      const containerHeight = iframeContainer.offsetHeight;
      let iframeWidth, iframeHeight, scaleValue;
      if (containerWidth / aspectRatio < containerHeight) {
        iframeHeight = containerWidth / aspectRatio;
        scaleValue = containerHeight / iframeHeight;
      } else {
        iframeWidth = containerHeight * aspectRatio;
        scaleValue = containerWidth / iframeWidth;
      }
      iframe.style.setProperty("--scale", scaleValue);
    }, 1);
  }
  function handleCurrentVimeoVideo() {
    const currentVimeoVideos = [...section.querySelectorAll(selectors2.currentVimeoVideo)].filter((video) => getComputedStyle(video).getPropertyValue("display") !== "none");
    if (!currentVimeoVideos.length)
      return;
    currentVimeoVideos.forEach((currentVimeoVideo) => {
      const currentVimeoVideoIframe = currentVimeoVideo.querySelector(selectors2.iframe);
      currentVimeoVideoIframe && handleVimeoSize(currentVimeoVideoIframe);
    });
  }
  function initFirstVimeoAppearance() {
    const observer = new MutationObserver((entries) => {
      entries.forEach((mutation) => {
        if (mutation.target.dataset.vimeoInitialized) {
          handleCurrentVimeoVideo();
        }
      });
    });
    observer.observe(section, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }
  function autoplayIteration() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      swiperSlider.slideNext(sliderSettings.speed);
    }, sliderSettings.autoplay.delay);
  }
  return Object.freeze({
    init
  });
};
const selectors = {
  section: ".js-slideshow",
  videoContainer: ".js-videos"
};
const Slideshow = () => {
  async function init(sectionId) {
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach(async (section) => {
      const slider = await Slider(section);
      slider.init();
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Slideshow = window.themeCore.Slideshow || Slideshow();
  window.themeCore.utils.register(window.themeCore.Slideshow, "slideshow");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
