import { B as Banner } from "./general-banner-d99e615d.js";
import "./banner-video-4cb5d217.js";
const action = () => {
  window.themeCore.Banner = window.themeCore.Banner || Banner();
  window.themeCore.utils.register(window.themeCore.Banner, "banner-animation-heading");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
