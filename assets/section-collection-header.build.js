const CollectionHeader = () => {
  const selectors = {
    section: ".js-collection-header-section",
    timer: ".js-timer"
  };
  let Timer;
  let sections = [];
  let componentsList = {};
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
      Timers: createComponents(Timer, selectors.timer)
    };
    for (const list in componentsList) {
      componentsList[list].forEach((component) => component.init());
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CollectionHeader = window.themeCore.CollectionHeader || CollectionHeader();
  window.themeCore.utils.register(window.themeCore.CollectionHeader, "collection-header");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
