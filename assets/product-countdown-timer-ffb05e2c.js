const ProductCountDownTimer = () => {
  let Timer;
  const selectors = {
    block: ".js-product-countdown-timer",
    timer: ".js-timer"
  };
  async function init() {
    Timer = window.themeCore.utils.Timer;
    window.themeCore.EventBus.listen(
      `product:count-down-timer-reinit`,
      reinitBlocks
    );
    reinitBlocks();
  }
  function reinitBlocks() {
    const blocks = [...document.querySelectorAll(selectors.block)];
    blocks.forEach((block) => {
      const timer = block.querySelector(selectors.timer);
      Timer(timer).init();
    });
  }
  return Object.freeze({
    init
  });
};
export {
  ProductCountDownTimer as P
};
