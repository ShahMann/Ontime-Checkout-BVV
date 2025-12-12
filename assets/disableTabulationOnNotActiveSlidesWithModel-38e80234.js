function disableTabulationOnNotActiveSlidesWithModel(swiper) {
  const selectors = {
    interactiveElements: ".js-video iframe, video.js-video, .js-product-media-model-button, .shopify-model-viewer-ui__button, model-viewer",
    modelViewer: "model-viewer",
    userInput: ".userInput"
  };
  const slides = swiper.slides;
  slides.forEach((slide, index) => {
    const interactiveElements = [
      ...slide.querySelectorAll(selectors.interactiveElements)
    ];
    const modelViewer = slide.querySelector(selectors.modelViewer);
    if (modelViewer) {
      const userInput = modelViewer.shadowRoot && modelViewer.shadowRoot.querySelector(selectors.userInput);
      if (userInput) {
        const customStyles = modelViewer.querySelector(
          selectors.customStyles
        );
        if (!customStyles) {
          const styleElement = document.createElement("style");
          styleElement.innerHTML = `.userInput:focus-visible {
								outline-offset: -3px;
							}`;
          modelViewer.shadowRoot.append(styleElement);
        }
        interactiveElements.push(userInput);
      }
    }
    if (!interactiveElements.length) {
      return;
    }
    if (index === swiper.activeIndex) {
      interactiveElements.forEach((element) => {
        if (!element.matches(selectors.modelViewer)) {
          element.setAttribute("tabindex", 0);
          return;
        }
        element.removeAttribute("tabindex");
      });
      return;
    }
    interactiveElements.forEach((element) => {
      element.setAttribute("tabindex", -1);
    });
  });
}
export {
  disableTabulationOnNotActiveSlidesWithModel as d
};
