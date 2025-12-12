const ImageCompare = () => {
  function init() {
    let t = {
      792: (t2, e2, i2) => {
        i2.d(e2, { Z: () => n });
        let s = i2(609), o = i2.n(s)()(function(t3) {
          return t3[1];
        });
        o.push([
          t2.id,
          ':host{--divider-width: 2px;--divider-color: #fff;--divider-shadow: none;--default-handle-width: 50px;--default-handle-color: #fff;--default-handle-opacity: 1;--default-handle-shadow: none;--handle-position-start: 50%;position:relative;display:inline-block;overflow:hidden;line-height:0;direction:ltr}@media screen and (-webkit-min-device-pixel-ratio: 0)and (min-resolution: 0.001dpcm){:host{outline-offset:1px}}::slotted(*){-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;-o-user-drag:none;user-drag:none;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.first{position:absolute;left:0;top:0;right:0;line-height:normal;font-size:100%;max-height:100%;height:100%;width:100%;--exposure: 50%;--keyboard-transition-time: 0ms;--default-transition-time: 0ms;--transition-time: var(--default-transition-time)}.first .first-overlay-container{position:relative;clip-path:inset(0 var(--exposure) 0 0);transition:clip-path var(--transition-time);height:100%}.first .first-overlay{overflow:hidden;height:100%}.first.focused{will-change:clip-path}.first.focused .first-overlay-container{will-change:clip-path}.second{position:relative}.handle-container{transform:translateX(50%);position:absolute;top:0;right:var(--exposure);height:100%;transition:right var(--transition-time),bottom var(--transition-time)}.focused .handle-container{will-change:right}.divider{position:absolute;height:100%;width:100%;left:0;top:0;display:flex;align-items:center;justify-content:center;flex-direction:column}.divider:after{content:" ";display:block;height:100%;border-left-width:var(--divider-width);border-left-style:solid;border-left-color:var(--divider-color);box-shadow:var(--divider-shadow)}.handle{position:absolute;top:var(--handle-position-start);pointer-events:none;box-sizing:border-box;margin-left:1px;transform:translate(calc(-50% - 0.5px), -50%);line-height:0}.default-handle{width:var(--default-handle-width);opacity:var(--default-handle-opacity);transition:all 1s;filter:drop-shadow(var(--default-handle-shadow))}.default-handle path{stroke:var(--default-handle-color)}.vertical .first-overlay-container{clip-path:inset(0 0 var(--exposure) 0)}.vertical .handle-container{transform:translateY(50%);height:auto;top:unset;bottom:var(--exposure);width:100%;left:0;flex-direction:row}.vertical .divider:after{height:1px;width:100%;border-top-width:var(--divider-width);border-top-style:solid;border-top-color:var(--divider-color);border-left:0}.vertical .handle{top:auto;left:var(--handle-position-start);transform:translate(calc(-50% - 0.5px), -50%) rotate(90deg)}',
          ""
        ]);
        const n = o;
      },
      609: (t2) => {
        t2.exports = function(t3) {
          let e2 = [];
          return e2.toString = function() {
            return this.map(function(e3) {
              let i2 = t3(e3);
              return e3[2] ? "@media ".concat(e3[2], " {").concat(i2, "}") : i2;
            }).join("");
          }, e2.i = function(t4, i2, s) {
            "string" == typeof t4 && (t4 = [[null, t4, ""]]);
            let o = {};
            if (s)
              for (let n = 0; n < this.length; n++) {
                let r = this[n][0];
                null != r && (o[r] = true);
              }
            for (let a = 0; a < t4.length; a++) {
              let d = [].concat(t4[a]);
              s && o[d[0]] || (i2 && (d[2] ? d[2] = "".concat(i2, " and ").concat(d[2]) : d[2] = i2), e2.push(d));
            }
          }, e2;
        };
      }
    }, e = {};
    function i(s) {
      let o = e[s];
      if (void 0 !== o)
        return o.exports;
      let n = e[s] = { id: s, exports: {} };
      return t[s](n, n.exports, i), n.exports;
    }
    i.n = (t2) => {
      let e2 = t2 && t2.__esModule ? () => t2.default : () => t2;
      return i.d(e2, { a: e2 }), e2;
    }, i.d = (t2, e2) => {
      for (let s in e2)
        i.o(e2, s) && !i.o(t2, s) && Object.defineProperty(t2, s, {
          enumerable: true,
          get: e2[s]
        });
    }, i.o = (t2, e2) => Object.prototype.hasOwnProperty.call(t2, e2), (() => {
      let t2 = i(792);
      const e2 = "rendered", s = (t3, e3) => {
        const i2 = t3.getBoundingClientRect();
        let s2, o2;
        return "mousedown" === e3.type ? (s2 = e3.clientX, o2 = e3.clientY) : (s2 = e3.touches[0].clientX, o2 = e3.touches[0].clientY), s2 >= i2.x && s2 <= i2.x + i2.width && o2 >= i2.y && o2 <= i2.y + i2.height;
      }, o = document.createElement("template");
      o.innerHTML = '<div class="second" id="second"> <slot name="second"><slot name="before"></slot></slot> </div> <div class="first" id="first"> <div class="first-overlay"> <div class="first-overlay-container" id="firstImageContainer"> <slot name="first"><slot name="after"></slot></slot> </div> </div> <div class="handle-container"> <div class="divider"></div> <div class="handle" id="handle"> <slot name="handle"> <svg xmlns="http://www.w3.org/2000/svg" class="default-handle" viewBox="-8 -3 16 6"> <path d="M -5 -2 L -7 0 L -5 2 M 5 -2 L 7 0 L 5 2" fill="none" vector-effect="non-scaling-stroke"/> </svg> </slot> </div> </div> </div> ';
      const n = { ArrowLeft: -1, ArrowRight: 1 }, r = ["horizontal", "vertical"], a = (t3) => ({
        x: t3.touches[0].pageX,
        y: t3.touches[0].pageY
      }), d = (t3) => ({ x: t3.pageX, y: t3.pageY });
      class h extends HTMLElement {
        constructor() {
          super(), this.exposure = this.hasAttribute("value") ? parseFloat(this.getAttribute("value")) : 50, this.slideOnHover = false, this.slideDirection = "horizontal", this.keyboard = "enabled", this.isMouseDown = false, this.animationDirection = 0, this.handle = false, this.onMouseMove = (t3) => {
            if (this.isMouseDown || this.slideOnHover) {
              const e4 = d(t3);
              this.slideToPage(e4);
            }
          }, this.onMouseDown = (t3) => {
            if (this.slideOnHover)
              return;
            if (this.handle && !s(this.handleElement, t3))
              return;
            t3.preventDefault(), window.addEventListener("mousemove", this.onMouseMove), window.addEventListener("mouseup", this.onWindowMouseUp), this.isMouseDown = true, this.enableTransition();
            const e4 = d(t3);
            this.slideToPage(e4);
          }, this.onWindowMouseUp = () => {
            this.isMouseDown = false, window.removeEventListener("mousemove", this.onMouseMove), window.removeEventListener("mouseup", this.onWindowMouseUp);
          }, this.touchStartPoint = null, this.isTouchComparing = false, this.hasTouchMoved = false, this.onTouchStart = (t3) => {
            this.handle && !s(this.handleElement, t3) || (this.touchStartPoint = a(t3), this.enableTransition(), this.slideToPage(this.touchStartPoint));
          }, this.onTouchMove = (t3) => {
            if (null === this.touchStartPoint)
              return;
            const e4 = a(t3);
            if (this.isTouchComparing)
              return this.slideToPage(e4), t3.preventDefault(), false;
            if (!this.hasTouchMoved) {
              const i3 = Math.abs(e4.y - this.touchStartPoint.y), s2 = Math.abs(e4.x - this.touchStartPoint.x);
              if ("horizontal" === this.slideDirection && i3 < s2 || "vertical" === this.slideDirection && i3 > s2)
                return this.isTouchComparing = true, // this.focus(),
                this.slideToPage(e4), t3.preventDefault(), false;
              this.hasTouchMoved = true;
            }
          }, this.onTouchEnd = () => {
            this.isTouchComparing = false, this.hasTouchMoved = false, this.touchStartPoint = null;
          }, this.onKeyDown = (t3) => {
            if ("disabled" === this.keyboard)
              return;
            const e4 = n[t3.key];
            this.animationDirection !== e4 && void 0 !== e4 && (this.animationDirection = e4, this.startSlideAnimation());
          }, this.onKeyUp = (t3) => {
            if ("disabled" === this.keyboard)
              return;
            const e4 = n[t3.key];
            void 0 !== e4 && this.animationDirection === e4 && this.stopSlideAnimation();
          }, this.resetDimensions = () => {
            this.imageWidth = this.offsetWidth, this.imageHeight = this.offsetHeight;
          };
          const e3 = this.attachShadow({ mode: "open" }), i2 = document.createElement("style");
          i2.innerHTML = t2.Z, this.getAttribute("nonce") && i2.setAttribute("nonce", this.getAttribute("nonce")), e3.appendChild(i2), e3.appendChild(o.content.cloneNode(true)), this.firstElement = e3.getElementById("first"), this.secondElement = e3.getElementById("second"), this.handleElement = e3.getElementById("handle");
        }
        get value() {
          return this.exposure;
        }
        set value(t3) {
          const e3 = parseFloat(t3);
          e3 !== this.exposure && (this.exposure = e3, this.enableTransition(), this.setExposure());
        }
        get hover() {
          return this.slideOnHover;
        }
        set hover(t3) {
          this.slideOnHover = "false" !== t3.toString().toLowerCase(), this.removeEventListener("mousemove", this.onMouseMove), this.slideOnHover && this.addEventListener("mousemove", this.onMouseMove);
        }
        get direction() {
          return this.slideDirection;
        }
        set direction(t3) {
          this.slideDirection = t3.toString().toLowerCase(), this.slide(0), this.firstElement.classList.remove(...r), r.includes(this.slideDirection) && this.firstElement.classList.add(this.slideDirection);
        }
        static get observedAttributes() {
          return ["hover", "direction"];
        }
        connectedCallback() {
          this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("dragstart", (t3) => (t3.preventDefault(), false)), new ResizeObserver(this.resetDimensions).observe(this), this.setExposure(0), this.keyboard = this.hasAttribute("keyboard") && "disabled" === this.getAttribute("keyboard") ? "disabled" : "enabled", this.addEventListener("keydown", this.onKeyDown), this.addEventListener("keyup", this.onKeyUp), this.addEventListener("touchstart", this.onTouchStart, {
            passive: true
          }), this.addEventListener("touchmove", this.onTouchMove, {
            passive: false
          }), this.addEventListener("touchend", this.onTouchEnd), this.addEventListener("mousedown", this.onMouseDown), this.handle = this.hasAttribute("handle"), this.hover = !!this.hasAttribute("hover") && this.getAttribute("hover"), this.direction = this.hasAttribute("direction") ? this.getAttribute("direction") : "horizontal", this.resetDimensions(), this.classList.contains(e2) || this.classList.add(e2), this.closest(".animated") ? this.startAnimation() : null, this.querySelectorAll('[slot="before"], [slot="after"]').length > 0 && console.warn(
            `<img-comparison-slider>: slot names "before" and "after" are deprecated and soon won't be supported. Please use slot="first" instead of slot="after", and slot="second" instead of slot="before".`
          );
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "attributes" && mutation.attributeName === "class") {
                if (this.closest(".animated")) {
                  this.startAnimation();
                  observer.disconnect();
                }
              }
            }
          });
          observer.observe(this.closest("section"), { attributes: true });
        }
        startAnimation() {
          let animationTime = 1e3;
          let startTime = performance.now();
          let isFirstFinished = false;
          const animate = (time) => {
            let timeFraction = (time - startTime) / animationTime;
            if (timeFraction > 1)
              timeFraction = 1;
            if (isFirstFinished) {
              this.exposure = 100 - timeFraction * 50;
            } else {
              this.exposure = timeFraction * 100;
            }
            this.setExposure(0);
            if (timeFraction < 1) {
              requestAnimationFrame(animate);
            } else if (!isFirstFinished) {
              isFirstFinished = true;
              startTime = performance.now();
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
        disconnectedCallback() {
          this.transitionTimer && window.clearTimeout(this.transitionTimer);
        }
        attributeChangedCallback(t3, e3, i2) {
          "hover" === t3 && (this.hover = i2), "direction" === t3 && (this.direction = i2), "keyboard" === t3 && (this.keyboard = "disabled" === i2 ? "disabled" : "enabled");
        }
        setExposure(t3 = 0) {
          let e3;
          this.exposure = (e3 = this.exposure + t3) < 0 ? 0 : e3 > 100 ? 100 : e3, this.firstElement.style.setProperty("--exposure", 100 - this.exposure + "%");
        }
        slide(t3 = 0) {
          this.setExposure(t3);
          const e3 = new Event("slide");
          this.dispatchEvent(e3);
        }
        slideToPage(t3) {
          "horizontal" === this.slideDirection && this.slideToPageX(t3.x), "vertical" === this.slideDirection && this.slideToPageY(t3.y);
        }
        slideToPageX(t3) {
          const e3 = t3 - this.getBoundingClientRect().left - window.scrollX;
          this.exposure = e3 / this.imageWidth * 100, this.slide(0);
        }
        slideToPageY(t3) {
          const e3 = t3 - this.getBoundingClientRect().top - window.scrollY;
          this.exposure = e3 / this.imageHeight * 100, this.slide(0);
        }
        enableTransition() {
          this.firstElement.style.setProperty("--transition-time", "100ms"), this.transitionTimer = window.setTimeout(() => {
            this.firstElement.style.setProperty("--transition-time", "var(--default-transition-time)"), this.transitionTimer = null;
          }, 100);
        }
        startSlideAnimation() {
          let t3 = null, e3 = this.animationDirection;
          this.firstElement.style.setProperty("--transition-time", "var(--keyboard-transition-time)");
          const i2 = (s2) => {
            if (0 === this.animationDirection || e3 !== this.animationDirection)
              return;
            null === t3 && (t3 = s2);
            const o2 = (s2 - t3) / 16.666666666666668 * this.animationDirection;
            this.slide(o2), setTimeout(() => window.requestAnimationFrame(i2), 0), t3 = s2;
          };
          window.requestAnimationFrame(i2);
        }
        stopSlideAnimation() {
          this.animationDirection = 0, this.firstElement.style.setProperty("--transition-time", "var(--default-transition-time)");
        }
      }
      if (!customElements.get("img-comparison-slider")) {
        "undefined" != typeof window && window.customElements.define("img-comparison-slider", h);
      }
    })();
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ImageCompare = window.themeCore.ImageCompare || ImageCompare();
  window.themeCore.utils.register(window.themeCore.ImageCompare, "image-compare");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
