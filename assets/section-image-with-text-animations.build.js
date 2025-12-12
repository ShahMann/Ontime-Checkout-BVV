const ImageWithTextAnimations = () => {
  let sections = [];
  const selectors = {
    section: ".js-image-with-text-animations",
    image: ".js-image-with-text-animations-image",
    mediaContainer: ".js-image-with-text-animations-media-container"
  };
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const image = section.querySelector(selectors.image);
      const mediaContainer = section.querySelector(selectors.mediaContainer);
      const isAnimationEnabled = section.dataset.enableAnimation;
      image && setEventListeners(section, image, mediaContainer, isAnimationEnabled);
    });
  }
  function setEventListeners(section, image, mediaContainer, isAnimationEnabled) {
    isAnimationEnabled && section.addEventListener("mousemove", (event) => moveImage(image, section, event));
    window.addEventListener("resize", () => {
      isAnimationEnabled && resetImagePositions(image);
      mediaContainer && setMediaContentHeight(image, mediaContainer);
    });
    mediaContainer && setMediaContentHeight(image, mediaContainer);
  }
  function setMediaContentHeight(image, mediaContainer) {
    const imageHeight = image.offsetHeight;
    mediaContainer.style.minHeight = `${imageHeight}px`;
  }
  function moveImage(image, section, event) {
    const { moveX, moveY } = calculateMovement(event, section);
    applyMovementToImage(image, moveX, moveY);
  }
  function calculateMovement(event, section) {
    const sectionRect = section.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const xPercent = mouseX / sectionRect.width;
    const yPercent = mouseY / sectionRect.height;
    const moveX = clampPosition((xPercent - 0.5) * 30, -15, 15);
    const moveY = clampPosition((yPercent - 0.5) * 30, -15, 15);
    return { moveX, moveY };
  }
  function applyMovementToImage(image, moveX, moveY) {
    image.style.top = `${moveY}px`;
    image.style.left = `${moveX}px`;
  }
  function resetImagePositions(element) {
    element.style.top = `0px`;
    element.style.left = `0px`;
  }
  function clampPosition(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ImageWithTextAnimations = window.themeCore.ImageWithTextAnimations || ImageWithTextAnimations();
  window.themeCore.utils.register(window.themeCore.ImageWithTextAnimations, "image-with-text-animations");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
