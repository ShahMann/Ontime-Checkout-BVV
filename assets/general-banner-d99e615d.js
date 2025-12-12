import { V as Video } from "./banner-video-4cb5d217.js";
const Banner = () => {
  const globalClasses = window.themeCore.utils.cssClasses;
  let Timer;
  let sections = [];
  let componentsList = {};
  const selectors = {
    section: ".js-general-banner",
    timer: ".js-timer",
    videoContainer: ".js-videos",
    animationHeading: ".js-general-banner-animation-heading",
    animationInner: ".js-general-banner-animation-inner",
    animationMediaWrapper: ".js-general-banner-animation-media-wrapper",
    animationContent: ".js-general-banner-animation-content"
  };
  const attributes = {
    hidden: "hidden"
  };
  const classes = {
    ...globalClasses,
    bannerAnimated: "general-banner--animated-text",
    animated: "animated",
    animationHeadingTransformed: "general-banner__heading-animation--transformed"
  };
  function createComponents(Component, selector) {
    return sections.flatMap((section) => {
      const componentsNodes = section.querySelectorAll(selector);
      return Array.from(componentsNodes, (componentNode) => Component(componentNode));
    });
  }
  async function init(sectionId) {
    Timer = window.themeCore.utils.Timer;
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    componentsList = {
      Timers: createComponents(Timer, selectors.timer),
      Video: createComponents(Video, selectors.videoContainer)
    };
    for (const list in componentsList) {
      componentsList[list].forEach((component) => component.init());
    }
    sections.filter((section) => section.classList.contains(classes.bannerAnimated)).forEach((section) => animationInit(section));
  }
  function animationInit(section) {
    const animationHeading = section.querySelector(selectors.animationHeading);
    section.animationHeadingScale = 1;
    if (!animationHeading)
      return;
    if (isSectionCentered(section)) {
      toggleScrollLock(attributes.hidden);
      setAnimationEventListeners(section, animationHeading);
    } else {
      const checkSectionCenteredOnScroll = () => {
        if (isSectionCentered(section)) {
          toggleScrollLock(attributes.hidden);
          setAnimationEventListeners(section, animationHeading);
          document.removeEventListener("scroll", checkSectionCenteredOnScroll);
        }
      };
      document.addEventListener("scroll", checkSectionCenteredOnScroll);
    }
  }
  function setAnimationEventListeners(section, animationHeading) {
    section.increaseHeadingAnimation = () => increaseHeadingAnimation(section, animationHeading);
    document.addEventListener("wheel", section.increaseHeadingAnimation);
    document.addEventListener("touchmove", section.increaseHeadingAnimation, { passive: false });
  }
  function removeAnimationEventListeners(section) {
    if (!section.increaseHeadingAnimation)
      return;
    document.removeEventListener("wheel", section.increaseHeadingAnimation);
    document.removeEventListener("touchmove", section.increaseHeadingAnimation);
  }
  function isSectionCentered(section) {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionCenteredPosition = rect.top + rect.height / 2;
    return sectionCenteredPosition > windowHeight * 0.25 && sectionCenteredPosition < windowHeight * 0.75;
  }
  function increaseHeadingAnimation(section, animationHeading) {
    section.animationHeadingScale += 0.5;
    animationHeading.classList.add(classes.animationHeadingTransformed);
    section.animationHeadingScale < 3.5 ? animationHeading.style.transform = `scale(${section.animationHeadingScale})` : showMediaContent(section, animationHeading);
  }
  function showMediaContent(section, animationHeading) {
    const animationMediaWrapper = section.querySelector(selectors.animationMediaWrapper);
    if (!animationMediaWrapper)
      return;
    const currentAnimationMediaWrapperOpacity = parseFloat(getComputedStyle(animationMediaWrapper).opacity);
    const newAnimationMediaWrapperOpacity = currentAnimationMediaWrapperOpacity + 0.6;
    if (newAnimationMediaWrapperOpacity <= 1) {
      animationMediaWrapper.style.opacity = newAnimationMediaWrapperOpacity;
    } else {
      animationMediaWrapper.style.opacity = 1;
      animationHeading.classList.add(classes.hidden);
      showContent(section);
    }
  }
  function showContent(section) {
    const animationInner = section.querySelector(selectors.animationInner);
    const animationContent = section.querySelector(selectors.animationContent);
    if (animationInner && animationContent) {
      animationInner.classList.remove(classes.hidden);
      removeAnimationEventListeners(section);
      setTimeout(() => {
        animationContent.classList.add(classes.animated);
      }, 250);
    } else {
      removeAnimationEventListeners(section);
    }
    toggleScrollLock(null);
  }
  function toggleScrollLock(isScrollEnabled) {
    document.body.style.overflow = isScrollEnabled;
  }
  return Object.freeze({
    init
  });
};
export {
  Banner as B
};
