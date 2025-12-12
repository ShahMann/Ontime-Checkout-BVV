const Video = (videoContainer) => {
  const Video2 = window.themeCore.utils.Video;
  const VIDEO_TYPES = window.themeCore.utils.VIDEO_TYPES;
  const cssClasses = window.themeCore.utils.cssClasses;
  const mobileSize = window.matchMedia("(max-width: 767px)");
  const selectors = {
    iframe: "iframe",
    videoContainer: ".js-video-section",
    startButton: ".js-video-start-button",
    videoPlaceholder: ".js-video-placeholder",
    mobileVideoPlayer: "video__player--mobile",
    section: "[data-section-id]"
  };
  const attributes = {
    sectionId: "data-section-id",
    type: "data-type"
  };
  const config = {
    videoContainer,
    options: {
      youtube: {
        autoplay: 0,
        controls: 1,
        showinfo: 0,
        rel: 0,
        playsinline: 1,
        loop: 0
      },
      vimeo: {
        controls: true,
        loop: false,
        muted: true,
        portrait: false,
        title: false,
        keyboard: false,
        byline: false,
        autopause: false
      }
    }
  };
  let videos;
  const startButton = videoContainer.querySelector(selectors.startButton);
  videoContainer.querySelector(
    selectors.videoPlaceholder
  );
  function initVideos(config2) {
    return Video2(config2).init();
  }
  function playVideo(player, type) {
    switch (type) {
      case VIDEO_TYPES.html: {
        player.play();
        break;
      }
      case VIDEO_TYPES.vimeo: {
        player.play();
        break;
      }
      case VIDEO_TYPES.youtube: {
        player.mute();
        player.playVideo();
        break;
      }
      default:
        return;
    }
  }
  function pauseVideo(video) {
    if (video.type === "youtube") {
      video.player.pauseVideo();
      return;
    }
    video.player.pause();
  }
  function startVideo(video) {
    if (window.innerWidth >= 768 && video.device === "desktop") {
      playVideo(video.player, video.type);
    }
    if (window.innerWidth < 768 && video.device === "mobile") {
      playVideo(video.player, video.type);
    }
    startButton == null ? void 0 : startButton.classList.add("hide");
    video.videoWrapper.classList.add(cssClasses.active);
  }
  function setEventListeners(videoContainer2, video) {
    videoContainer2.addEventListener("click", (event) => {
      if (event.target.closest(selectors.startButton) || event.target.closest(selectors.videoPlaceholder)) {
        startVideo(video);
      }
    });
    mobileSize.addEventListener("change", () => {
      if (video.type === "html") {
        if (video.device === "mobile" && !mobileSize.matches) {
          video.player.pause();
        }
        if (video.device === "desktop" && mobileSize.matches) {
          video.player.pause();
        }
      }
      if (video.type === "vimeo") {
        if (video.device === "mobile" && !mobileSize.matches) {
          video.player.pause();
        }
        if (video.device === "desktop" && mobileSize.matches) {
          video.player.pause();
        }
      }
      if (video.type === "youtube") {
        if (video.device === "mobile" && !mobileSize.matches) {
          video.player.pauseVideo();
        }
        if (video.device === "desktop" && mobileSize.matches) {
          video.player.pauseVideo();
        }
      }
      const section = video.videoWrapper.closest(selectors.section);
      if (!section) {
        return;
      }
      const type = section.getAttribute(attributes.type);
      if (type !== "popup") {
        return;
      }
      startVideo(video);
    });
  }
  async function init() {
    videos = initVideos(config);
    if (videos && videos.length) {
      videos.forEach((video) => {
        setEventListeners(videoContainer, video);
        const section = video.videoWrapper.closest(selectors.section);
        if (!section) {
          return;
        }
        const sectionId = section.getAttribute(attributes.sectionId);
        const type = section.getAttribute(attributes.type);
        if (type !== "popup") {
          return;
        }
        window.themeCore.EventBus.listen(`Toggle:video-${sectionId}:open`, (target) => {
          if (!target.contains(video.videoWrapper) || getComputedStyle(video.videoWrapper).getPropertyValue("display") === "none") {
            return;
          }
          startVideo(video);
        });
        window.themeCore.EventBus.listen(`Toggle:video-${sectionId}:close`, (target) => {
          if (!target.contains(video.videoWrapper)) {
            return;
          }
          pauseVideo(video);
        });
      });
    }
  }
  return Object.freeze({
    init
  });
};
export {
  Video as V
};
