const FaqTemplate = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  const on = window.themeCore.utils.on;
  const throttle = window.themeCore.utils.throttle;
  let sections = [];
  const selectors = {
    anchorWrapper: ".js-faq-anchor-wrapper",
    anchor: ".js-faq-anchor-link",
    anchorActive: ".js-faq-anchor-link.is-active",
    anchorsListContainer: ".js-side-navigation-container",
    anchorsList: ".js-side-navigation-list",
    section: '[data-section-type="faq-template"]',
    block: ".js-faq-block",
    blockFirst: ".js-faq-block:first-of-type",
    cssRoot: ":root",
    header: ".js-header",
    headerSticky: "[data-header-sticky]"
  };
  const attributes = {
    url: "href",
    dataHideOnScrollDown: "data-hide-on-scroll-down"
  };
  const breakpoints = {
    extraSmall: 767,
    medium: 1199
  };
  const cssVariables = {
    anchorsListOffsetTop: "--sticky-sidebar-offset-top",
    headerHeight: "--header-height",
    headerOffset: "--header-offset-top"
  };
  const DEFAULT_HEADER_OFFSET = "0px";
  const THROTTLE_DURATION = 25;
  const TRANSPARENT_HEADER_INDENT_COMPENSATION = 0;
  const MINIMAL_SCROLL_OFFSET = 32;
  let header;
  let IS_HEADER_STICKY;
  let IS_HEADER_HIDE_ON_SCROLL_DOWN;
  let cssRoot = null;
  let headerOffsetTop = DEFAULT_HEADER_OFFSET;
  function init(sectionId) {
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        cssVariables.anchorsListOffsetTop
      )
    );
    header = document.querySelector(selectors.header);
    header && (IS_HEADER_STICKY = !!header.querySelector(selectors.headerSticky));
    header && (IS_HEADER_HIDE_ON_SCROLL_DOWN = header.hasAttribute(
      attributes.dataHideOnScrollDown
    ));
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`)).map(
      (element) => {
        const blocks = element.querySelectorAll(selectors.block);
        const anchors = element.querySelectorAll(selectors.anchor);
        const navbar = element.querySelector(
          selectors.anchorsListContainer
        );
        const list = element.querySelector(selectors.anchorsList);
        return {
          el: element,
          blocks,
          anchors,
          navbar,
          list
        };
      }
    );
    updateCssVariables();
    if (sections && sections.length) {
      sections.forEach((section) => {
        on("resize", window, updateCssVariables);
        on("click", section.el, anchorHandler);
        on(
          "scroll",
          throttle(() => {
            scrollHandler(section);
            updateCssVariables();
            trackIntersection(section.navbar);
          }, THROTTLE_DURATION)
        );
        section.navbar.addEventListener("transitionend", function(event) {
          trackIntersection(section.navbar);
        });
      });
    }
  }
  function updateCssVariables() {
    cssRoot = document.querySelector(selectors.cssRoot);
    headerOffsetTop = cssRoot.style.getPropertyValue(
      cssVariables.headerOffset
    );
    if (headerOffsetTop.trim() === DEFAULT_HEADER_OFFSET) {
      cssRoot.style.getPropertyValue(cssVariables.headerHeight).trim();
    }
  }
  function anchorHandler(event) {
    var _a, _b;
    const target = event.target.closest(selectors.anchor);
    const section = event.target.closest(selectors.section);
    if (!target || !section) {
      return;
    }
    preventEvent(event);
    const blockId = target.getAttribute(attributes.url);
    if (!blockId) {
      return;
    }
    const block = section.querySelector(blockId);
    let offset = MINIMAL_SCROLL_OFFSET;
    const navbar = event.target.closest(selectors.anchorsListContainer);
    const isExtraSmall = window.innerWidth <= breakpoints.extraSmall;
    const isAfterMedium = window.innerWidth > breakpoints.medium;
    if (isExtraSmall && navbar) {
      offset += navbar.getBoundingClientRect().height;
    }
    if (IS_HEADER_STICKY && !IS_HEADER_HIDE_ON_SCROLL_DOWN || IS_HEADER_HIDE_ON_SCROLL_DOWN && window.scrollY > getElementY(block)) {
      offset += ((_b = (_a = window.themeCore) == null ? void 0 : _a.Header) == null ? void 0 : _b.getHeaderHeightStatic) ? window.themeCore.Header.getHeaderHeightStatic() : 0;
      if (isAfterMedium) {
        offset -= TRANSPARENT_HEADER_INDENT_COMPENSATION;
      }
    }
    scrollToTarget(block, offset);
    const activeAnchors = section.querySelectorAll(selectors.anchorActive);
    if (target === activeAnchors[0]) {
      return;
    }
    activeAnchors.forEach(
      (anchor) => anchor.classList.remove(cssClasses.active)
    );
  }
  function scrollHandler(section) {
    var _a, _b;
    const { anchors, blocks, navbar, list } = section;
    if (!anchors || !blocks || !navbar) {
      return;
    }
    let offset = window.pageYOffset + MINIMAL_SCROLL_OFFSET;
    const isExtraSmall = window.innerWidth <= breakpoints.extraSmall;
    const isAfterMedium = window.innerWidth > breakpoints.medium;
    if (isExtraSmall && navbar) {
      offset += navbar.getBoundingClientRect().height;
    }
    if (IS_HEADER_STICKY && !IS_HEADER_HIDE_ON_SCROLL_DOWN || IS_HEADER_HIDE_ON_SCROLL_DOWN && header.getBoundingClientRect().y >= 0) {
      offset += ((_b = (_a = window.themeCore) == null ? void 0 : _a.Header) == null ? void 0 : _b.getHeaderHeightStatic) ? window.themeCore.Header.getHeaderHeightStatic() : 0;
      if (isAfterMedium) {
        offset -= TRANSPARENT_HEADER_INDENT_COMPENSATION;
      }
    }
    let closestElement = [...blocks].map((element) => ({
      el: element,
      diff: Math.round(offset - element.offsetTop)
    })).filter((element) => element.diff >= 0).sort((a, b) => a.diff - b.diff);
    if (closestElement[0]) {
      closestElement = closestElement[0].el;
    }
    let newActive = Array.from(anchors).find(
      (link) => link.getAttribute(attributes.url) === `#${closestElement.id}`
    );
    if (!newActive || newActive.classList.contains(cssClasses.active)) {
      return null;
    }
    anchors.forEach((link) => {
      link.classList.remove(cssClasses.active);
    });
    newActive.classList.add(cssClasses.active);
    if (!list) {
      return;
    }
    const newActiveParent = newActive.closest(selectors.anchorWrapper);
    const newActiveOffset = newActiveParent.offsetLeft - 16;
    list.scrollTo({
      left: newActiveOffset,
      behavior: "smooth"
    });
  }
  function preventEvent(event) {
    if (!event) {
      return false;
    }
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
  function getElementY(target) {
    return window.pageYOffset + target.getBoundingClientRect().top;
  }
  function scrollToTarget(target, offset = 0) {
    const elementY = getElementY(target);
    const targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight - MINIMAL_SCROLL_OFFSET : elementY - offset;
    window.scrollTo({
      top: targetY + 1,
      behavior: "smooth"
    });
  }
  function trackIntersection(target) {
    var _a, _b;
    const targetTopPosition = target.getBoundingClientRect().top;
    const targetBottomPosition = target.getBoundingClientRect().bottom;
    const headerHeight = ((_b = (_a = window.themeCore) == null ? void 0 : _a.Header) == null ? void 0 : _b.getHeaderHeight) ? window.themeCore.Header.getHeaderHeight() : 0;
    const isSticky = headerHeight >= targetTopPosition && targetBottomPosition >= headerHeight;
    target.classList.toggle(cssClasses.sticky, isSticky);
    const isExtraSmall = window.innerWidth <= breakpoints.extraSmall;
    if (isExtraSmall) {
      window.themeCore.EventBus.emit("Toggle:headerBoxShadow", isSticky);
    } else {
      window.themeCore.EventBus.emit("Toggle:headerBoxShadow", false);
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.FaqTemplate = window.themeCore.FaqTemplate || FaqTemplate();
  window.themeCore.utils.register(window.themeCore.FaqTemplate, "faq-page-template");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
