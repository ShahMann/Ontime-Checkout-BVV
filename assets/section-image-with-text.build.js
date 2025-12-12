const selectors = {
  section: ".js-image-with-text",
  image: ".js-image-with-text-image"
};
const ImageWithText = () => {
  let sections = [];
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      setEventListeners(section);
    });
  }
  function setEventListeners(section) {
    const images = [...section.querySelectorAll(selectors.image)];
    images.forEach((image) => {
      section.addEventListener("mousemove", (event) => moveImage(image, section, event));
      window.addEventListener("resize", () => resetImagePositions(image));
    });
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
  window.themeCore.ImageWithText = window.themeCore.ImageWithText || ImageWithText();
  window.themeCore.utils.register(window.themeCore.ImageWithText, "image-with-text");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
