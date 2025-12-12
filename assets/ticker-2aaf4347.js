const Ticker = (tickerContainer) => {
  const classes = window.themeCore.utils.cssClasses;
  const throttle = window.themeCore.utils.throttle;
  const selectors = {
    tickerContentContainer: ".js-ticker-content-container"
  };
  let tickerContentContainer;
  let tickerItemsInitial;
  function init() {
    if (!tickerContainer) {
      return;
    }
    tickerContentContainer = tickerContainer.querySelector(selectors.tickerContentContainer);
    if (!tickerContentContainer) {
      return;
    }
    tickerItemsInitial = [...tickerContentContainer.children].filter((child) => !child.classList.contains(classes.clone));
    if (!tickerItemsInitial.length) {
      return;
    }
    setTickerContent();
    setEventListeners();
    setTickerLoaded();
  }
  function setTickerLoaded() {
    tickerContainer.classList.remove(classes.loading);
  }
  function setTickerContent() {
    const tickerContainerWidth = tickerContainer.offsetWidth;
    let tickerItemsInitialWidth = 0;
    let clonesCount = 1;
    let itemsCount = 1;
    tickerItemsInitial = [...tickerContentContainer.children].filter((child) => !child.classList.contains(classes.clone));
    tickerItemsInitial.forEach((tickerItemInitial) => {
      tickerItemsInitialWidth += tickerItemInitial.offsetWidth;
    });
    if (tickerItemsInitialWidth && tickerItemsInitialWidth > 0 && tickerItemsInitialWidth < tickerContainerWidth) {
      clonesCount = 2 * Math.ceil(tickerContainerWidth / tickerItemsInitialWidth) - 1;
    }
    itemsCount += clonesCount;
    tickerContentContainer.innerHTML = "";
    for (let i = 0; i < itemsCount; i++) {
      tickerItemsInitial.forEach((tickerItemInitial) => {
        let cloneTickerItemInitial = tickerItemInitial.cloneNode(true);
        if (i > 0) {
          cloneTickerItemInitial.classList.add(classes.clone);
        }
        tickerContentContainer.appendChild(cloneTickerItemInitial);
      });
    }
  }
  function addResizeListener(element, callback) {
    if (!element || typeof callback !== "function")
      return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        callback(entry.target);
      }
    });
    resizeObserver.observe(element);
  }
  function setEventListeners() {
    addResizeListener(tickerContainer, throttle(setTickerContent, 200));
  }
  return Object.freeze({
    init
  });
};
export {
  Ticker as T
};
