const Video = (videoContainer) => {
  const Video2 = window.themeCore.utils.Video;
  const selectors = {
    iframe: "iframe"
  };
  const VIDEO_TYPES = window.themeCore.utils.VIDEO_TYPES;
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
  let videos;
  function initVideos(config2) {
    return Video2(config2).init();
  }
  function vimeoDisableTabIndexHandler(videos2) {
    videos2.filter((video) => video.type === VIDEO_TYPES.vimeo).forEach(
      (video) => video.player.on(
        "loaded",
        () => disableTabIndex(video.videoWrapper)
      )
    );
  }
  function disableTabIndex(videoElement) {
    const iframe = videoElement.querySelector(selectors.iframe);
    if (!iframe) {
      return;
    }
    iframe.setAttribute("tabindex", "-1");
  }
  function setIntersectionObserver(video) {
    const observer = new IntersectionObserver(
      (entries, observer2) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo(video.player, video.type);
            observer2.unobserve(video.videoWrapper);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(video.videoWrapper);
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
  async function init() {
    videos = initVideos(config);
    if (videos && videos.length) {
      vimeoDisableTabIndexHandler(videos);
      videos.forEach((video) => setIntersectionObserver(video));
    }
  }
  return Object.freeze({
    init
  });
};
export {
  Video as V
};
