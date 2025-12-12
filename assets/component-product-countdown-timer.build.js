import { P as ProductCountDownTimer } from "./product-countdown-timer-ffb05e2c.js";
const action = () => {
  window.themeCore.ProductCountDownTimer = window.themeCore.ProductCountDownTimer || ProductCountDownTimer();
  window.themeCore.utils.register(window.themeCore.ProductCountDownTimer, "product-countdown-timer");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
