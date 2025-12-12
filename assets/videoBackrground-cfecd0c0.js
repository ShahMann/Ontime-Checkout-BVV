const selectors = {
  iframe: "iframe"
};
async function initVideos(config) {
  const Video = window.themeCore.utils.Video;
  return Video(config).init();
}
function vimeoDisableTabIndexHandler(videos) {
  const VIDEO_TYPES = window.themeCore.utils.VIDEO_TYPES;
  videos.filter((video) => video.type === VIDEO_TYPES.vimeo).forEach(
    (video) => video.player.on("loaded", () => disableTabIndex(video.videoWrapper))
  );
}
function disableTabIndex(videoElement) {
  const iframe = videoElement.querySelector(selectors.iframe);
  if (!iframe) {
    return;
  }
  iframe.setAttribute("tabindex", "-1");
}
function playVideo(player, type) {
  const VIDEO_TYPES = window.themeCore.utils.VIDEO_TYPES;
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
function pauseVideo(player, type) {
  const VIDEO_TYPES = window.themeCore.utils.VIDEO_TYPES;
  switch (type) {
    case VIDEO_TYPES.html: {
      player.pause();
      break;
    }
    case VIDEO_TYPES.vimeo: {
      player.pause();
      break;
    }
    case VIDEO_TYPES.youtube: {
      player.pauseVideo();
      break;
    }
    default:
      return;
  }
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
export {
  pauseVideo as a,
  initVideos as i,
  playVideo as p,
  setIntersectionObserver as s,
  vimeoDisableTabIndexHandler as v
};
