import { d as disableTabulationOnNotActiveSlidesWithModel } from "./disableTabulationOnNotActiveSlidesWithModel-38e80234.js";
import { P as ProductCountDownTimer } from "./product-countdown-timer-ffb05e2c.js";
import { c as cssClasses } from "./cssClasses-aee656ec.js";
import { g as getDocument, $, a as getWindow, b as getTranslate, i as isObject, S as Swiper } from "./core-1f1d1c0c.js";
function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  const document2 = getDocument();
  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach((key) => {
      if (!params[key] && params.auto === true) {
        let element = swiper.$el.children(`.${checkProps[key]}`)[0];
        if (!element) {
          element = document2.createElement("div");
          element.className = checkProps[key];
          swiper.$el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}
function Navigation({
  swiper,
  extendParams,
  on: on2,
  emit
}) {
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: "swiper-button-disabled",
      hiddenClass: "swiper-button-hidden",
      lockClass: "swiper-button-lock",
      navigationDisabledClass: "swiper-navigation-disabled"
    }
  });
  swiper.navigation = {
    nextEl: null,
    $nextEl: null,
    prevEl: null,
    $prevEl: null
  };
  function getEl(el) {
    let $el;
    if (el) {
      $el = $(el);
      if (swiper.params.uniqueNavElements && typeof el === "string" && $el.length > 1 && swiper.$el.find(el).length === 1) {
        $el = swiper.$el.find(el);
      }
    }
    return $el;
  }
  function toggleEl($el, disabled) {
    const params = swiper.params.navigation;
    if ($el && $el.length > 0) {
      $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
      if ($el[0] && $el[0].tagName === "BUTTON")
        $el[0].disabled = disabled;
      if (swiper.params.watchOverflow && swiper.enabled) {
        $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
      }
    }
  }
  function update() {
    if (swiper.params.loop)
      return;
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
  }
  function onPrevClick(e) {
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind)
      return;
    swiper.slidePrev();
    emit("navigationPrev");
  }
  function onNextClick(e) {
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind)
      return;
    swiper.slideNext();
    emit("navigationNext");
  }
  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: "swiper-button-next",
      prevEl: "swiper-button-prev"
    });
    if (!(params.nextEl || params.prevEl))
      return;
    const $nextEl = getEl(params.nextEl);
    const $prevEl = getEl(params.prevEl);
    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on("click", onNextClick);
    }
    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on("click", onPrevClick);
    }
    Object.assign(swiper.navigation, {
      $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl,
      prevEl: $prevEl && $prevEl[0]
    });
    if (!swiper.enabled) {
      if ($nextEl)
        $nextEl.addClass(params.lockClass);
      if ($prevEl)
        $prevEl.addClass(params.lockClass);
    }
  }
  function destroy() {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    if ($nextEl && $nextEl.length) {
      $nextEl.off("click", onNextClick);
      $nextEl.removeClass(swiper.params.navigation.disabledClass);
    }
    if ($prevEl && $prevEl.length) {
      $prevEl.off("click", onPrevClick);
      $prevEl.removeClass(swiper.params.navigation.disabledClass);
    }
  }
  on2("init", () => {
    if (swiper.params.navigation.enabled === false) {
      disable();
    } else {
      init();
      update();
    }
  });
  on2("toEdge fromEdge lock unlock", () => {
    update();
  });
  on2("destroy", () => {
    destroy();
  });
  on2("enable disable", () => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    if ($nextEl) {
      $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
    }
    if ($prevEl) {
      $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
    }
  });
  on2("click", (_s, e) => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    const targetEl = e.target;
    if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl)))
        return;
      let isHidden;
      if ($nextEl) {
        isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
      } else if ($prevEl) {
        isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
      }
      if (isHidden === true) {
        emit("navigationShow");
      } else {
        emit("navigationHide");
      }
      if ($nextEl) {
        $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
      }
      if ($prevEl) {
        $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
      }
    }
  });
  const enable = () => {
    swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
    init();
    update();
  };
  const disable = () => {
    swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
    destroy();
  };
  Object.assign(swiper.navigation, {
    enable,
    disable,
    update,
    init,
    destroy
  });
}
function classesToSelector(classes = "") {
  return `.${classes.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")}`;
}
function Pagination({
  swiper,
  extendParams,
  on: on2,
  emit
}) {
  const pfx = "swiper-pagination";
  extendParams({
    pagination: {
      el: null,
      bulletElement: "span",
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: "bullets",
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: (number) => number,
      formatFractionTotal: (number) => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`,
      paginationDisabledClass: `${pfx}-disabled`
    }
  });
  swiper.pagination = {
    el: null,
    $el: null,
    bullets: []
  };
  let bulletSize;
  let dynamicBulletIndex = 0;
  function isPaginationDisabled() {
    return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0;
  }
  function setSideBullets($bulletEl, position) {
    const {
      bulletActiveClass
    } = swiper.params.pagination;
    $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
  }
  function update() {
    const rtl = swiper.rtl;
    const params = swiper.params.pagination;
    if (isPaginationDisabled())
      return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const $el = swiper.pagination.$el;
    let current;
    const total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
    if (swiper.params.loop) {
      current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);
      if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
        current -= slidesLength - swiper.loopedSlides * 2;
      }
      if (current > total - 1)
        current -= total;
      if (current < 0 && swiper.params.paginationType !== "bullets")
        current = total + current;
    } else if (typeof swiper.snapIndex !== "undefined") {
      current = swiper.snapIndex;
    } else {
      current = swiper.activeIndex || 0;
    }
    if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      const bullets = swiper.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;
      if (params.dynamicBullets) {
        bulletSize = bullets.eq(0)[swiper.isHorizontal() ? "outerWidth" : "outerHeight"](true);
        $el.css(swiper.isHorizontal() ? "width" : "height", `${bulletSize * (params.dynamicMainBullets + 4)}px`);
        if (params.dynamicMainBullets > 1 && swiper.previousIndex !== void 0) {
          dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);
          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }
        firstIndex = Math.max(current - dynamicBulletIndex, 0);
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }
      bullets.removeClass(["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((suffix) => `${params.bulletActiveClass}${suffix}`).join(" "));
      if ($el.length > 1) {
        bullets.each((bullet) => {
          const $bullet = $(bullet);
          const bulletIndex = $bullet.index();
          if (bulletIndex === current) {
            $bullet.addClass(params.bulletActiveClass);
          }
          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              $bullet.addClass(`${params.bulletActiveClass}-main`);
            }
            if (bulletIndex === firstIndex) {
              setSideBullets($bullet, "prev");
            }
            if (bulletIndex === lastIndex) {
              setSideBullets($bullet, "next");
            }
          }
        });
      } else {
        const $bullet = bullets.eq(current);
        const bulletIndex = $bullet.index();
        $bullet.addClass(params.bulletActiveClass);
        if (params.dynamicBullets) {
          const $firstDisplayedBullet = bullets.eq(firstIndex);
          const $lastDisplayedBullet = bullets.eq(lastIndex);
          for (let i = firstIndex; i <= lastIndex; i += 1) {
            bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
          }
          if (swiper.params.loop) {
            if (bulletIndex >= bullets.length) {
              for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
              }
              bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
            } else {
              setSideBullets($firstDisplayedBullet, "prev");
              setSideBullets($lastDisplayedBullet, "next");
            }
          } else {
            setSideBullets($firstDisplayedBullet, "prev");
            setSideBullets($lastDisplayedBullet, "next");
          }
        }
      }
      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
        const offsetProp = rtl ? "right" : "left";
        bullets.css(swiper.isHorizontal() ? offsetProp : "top", `${bulletsOffset}px`);
      }
    }
    if (params.type === "fraction") {
      $el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
      $el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
    }
    if (params.type === "progressbar") {
      let progressbarDirection;
      if (params.progressbarOpposite) {
        progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal";
      } else {
        progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
      }
      const scale = (current + 1) / total;
      let scaleX = 1;
      let scaleY = 1;
      if (progressbarDirection === "horizontal") {
        scaleX = scale;
      } else {
        scaleY = scale;
      }
      $el.find(classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
    }
    if (params.type === "custom" && params.renderCustom) {
      $el.html(params.renderCustom(swiper, current + 1, total));
      emit("paginationRender", $el[0]);
    } else {
      emit("paginationUpdate", $el[0]);
    }
    if (swiper.params.watchOverflow && swiper.enabled) {
      $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
    }
  }
  function render() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled())
      return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const $el = swiper.pagination.$el;
    let paginationHTML = "";
    if (params.type === "bullets") {
      let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
      if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }
      for (let i = 0; i < numberOfBullets; i += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
        } else {
          paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }
      $el.html(paginationHTML);
      swiper.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
    }
    if (params.type === "fraction") {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
      }
      $el.html(paginationHTML);
    }
    if (params.type === "progressbar") {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }
      $el.html(paginationHTML);
    }
    if (params.type !== "custom") {
      emit("paginationRender", swiper.pagination.$el[0]);
    }
  }
  function init() {
    swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
      el: "swiper-pagination"
    });
    const params = swiper.params.pagination;
    if (!params.el)
      return;
    let $el = $(params.el);
    if ($el.length === 0)
      return;
    if (swiper.params.uniqueNavElements && typeof params.el === "string" && $el.length > 1) {
      $el = swiper.$el.find(params.el);
      if ($el.length > 1) {
        $el = $el.filter((el) => {
          if ($(el).parents(".swiper")[0] !== swiper.el)
            return false;
          return true;
        });
      }
    }
    if (params.type === "bullets" && params.clickable) {
      $el.addClass(params.clickableClass);
    }
    $el.addClass(params.modifierClass + params.type);
    $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    if (params.type === "bullets" && params.dynamicBullets) {
      $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
      dynamicBulletIndex = 0;
      if (params.dynamicMainBullets < 1) {
        params.dynamicMainBullets = 1;
      }
    }
    if (params.type === "progressbar" && params.progressbarOpposite) {
      $el.addClass(params.progressbarOppositeClass);
    }
    if (params.clickable) {
      $el.on("click", classesToSelector(params.bulletClass), function onClick(e) {
        e.preventDefault();
        let index = $(this).index() * swiper.params.slidesPerGroup;
        if (swiper.params.loop)
          index += swiper.loopedSlides;
        swiper.slideTo(index);
      });
    }
    Object.assign(swiper.pagination, {
      $el,
      el: $el[0]
    });
    if (!swiper.enabled) {
      $el.addClass(params.lockClass);
    }
  }
  function destroy() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled())
      return;
    const $el = swiper.pagination.$el;
    $el.removeClass(params.hiddenClass);
    $el.removeClass(params.modifierClass + params.type);
    $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass)
      swiper.pagination.bullets.removeClass(params.bulletActiveClass);
    if (params.clickable) {
      $el.off("click", classesToSelector(params.bulletClass));
    }
  }
  on2("init", () => {
    if (swiper.params.pagination.enabled === false) {
      disable();
    } else {
      init();
      render();
      update();
    }
  });
  on2("activeIndexChange", () => {
    if (swiper.params.loop) {
      update();
    } else if (typeof swiper.snapIndex === "undefined") {
      update();
    }
  });
  on2("snapIndexChange", () => {
    if (!swiper.params.loop) {
      update();
    }
  });
  on2("slidesLengthChange", () => {
    if (swiper.params.loop) {
      render();
      update();
    }
  });
  on2("snapGridLengthChange", () => {
    if (!swiper.params.loop) {
      render();
      update();
    }
  });
  on2("destroy", () => {
    destroy();
  });
  on2("enable disable", () => {
    const {
      $el
    } = swiper.pagination;
    if ($el) {
      $el[swiper.enabled ? "removeClass" : "addClass"](swiper.params.pagination.lockClass);
    }
  });
  on2("lock unlock", () => {
    update();
  });
  on2("click", (_s, e) => {
    const targetEl = e.target;
    const {
      $el
    } = swiper.pagination;
    if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el && $el.length > 0 && !$(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
      if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl))
        return;
      const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);
      if (isHidden === true) {
        emit("paginationShow");
      } else {
        emit("paginationHide");
      }
      $el.toggleClass(swiper.params.pagination.hiddenClass);
    }
  });
  const enable = () => {
    swiper.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
    if (swiper.pagination.$el) {
      swiper.pagination.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
    }
    init();
    render();
    update();
  };
  const disable = () => {
    swiper.$el.addClass(swiper.params.pagination.paginationDisabledClass);
    if (swiper.pagination.$el) {
      swiper.pagination.$el.addClass(swiper.params.pagination.paginationDisabledClass);
    }
    destroy();
  };
  Object.assign(swiper.pagination, {
    enable,
    disable,
    render,
    update,
    init,
    destroy
  });
}
function Zoom({
  swiper,
  extendParams,
  on: on2,
  emit
}) {
  const window2 = getWindow();
  extendParams({
    zoom: {
      enabled: false,
      maxRatio: 3,
      minRatio: 1,
      toggle: true,
      containerClass: "swiper-zoom-container",
      zoomedSlideClass: "swiper-slide-zoomed"
    }
  });
  swiper.zoom = {
    enabled: false
  };
  let currentScale = 1;
  let isScaling = false;
  let gesturesEnabled;
  let fakeGestureTouched;
  let fakeGestureMoved;
  const gesture = {
    $slideEl: void 0,
    slideWidth: void 0,
    slideHeight: void 0,
    $imageEl: void 0,
    $imageWrapEl: void 0,
    maxRatio: 3
  };
  const image = {
    isTouched: void 0,
    isMoved: void 0,
    currentX: void 0,
    currentY: void 0,
    minX: void 0,
    minY: void 0,
    maxX: void 0,
    maxY: void 0,
    width: void 0,
    height: void 0,
    startX: void 0,
    startY: void 0,
    touchesStart: {},
    touchesCurrent: {}
  };
  const velocity = {
    x: void 0,
    y: void 0,
    prevPositionX: void 0,
    prevPositionY: void 0,
    prevTime: void 0
  };
  let scale = 1;
  Object.defineProperty(swiper.zoom, "scale", {
    get() {
      return scale;
    },
    set(value) {
      if (scale !== value) {
        const imageEl = gesture.$imageEl ? gesture.$imageEl[0] : void 0;
        const slideEl = gesture.$slideEl ? gesture.$slideEl[0] : void 0;
        emit("zoomChange", value, imageEl, slideEl);
      }
      scale = value;
    }
  });
  function getDistanceBetweenTouches(e) {
    if (e.targetTouches.length < 2)
      return 1;
    const x1 = e.targetTouches[0].pageX;
    const y1 = e.targetTouches[0].pageY;
    const x2 = e.targetTouches[1].pageX;
    const y2 = e.targetTouches[1].pageY;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance;
  }
  function onGestureStart(e) {
    const support = swiper.support;
    const params = swiper.params.zoom;
    fakeGestureTouched = false;
    fakeGestureMoved = false;
    if (!support.gestures) {
      if (e.type !== "touchstart" || e.type === "touchstart" && e.targetTouches.length < 2) {
        return;
      }
      fakeGestureTouched = true;
      gesture.scaleStart = getDistanceBetweenTouches(e);
    }
    if (!gesture.$slideEl || !gesture.$slideEl.length) {
      gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
      if (gesture.$slideEl.length === 0)
        gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
      gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0);
      gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
      gesture.maxRatio = gesture.$imageWrapEl.attr("data-swiper-zoom") || params.maxRatio;
      if (gesture.$imageWrapEl.length === 0) {
        gesture.$imageEl = void 0;
        return;
      }
    }
    if (gesture.$imageEl) {
      gesture.$imageEl.transition(0);
    }
    isScaling = true;
  }
  function onGestureChange(e) {
    const support = swiper.support;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;
    if (!support.gestures) {
      if (e.type !== "touchmove" || e.type === "touchmove" && e.targetTouches.length < 2) {
        return;
      }
      fakeGestureMoved = true;
      gesture.scaleMove = getDistanceBetweenTouches(e);
    }
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
      if (e.type === "gesturechange")
        onGestureStart(e);
      return;
    }
    if (support.gestures) {
      zoom.scale = e.scale * currentScale;
    } else {
      zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
    }
    if (zoom.scale > gesture.maxRatio) {
      zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
    }
    if (zoom.scale < params.minRatio) {
      zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
    }
    gesture.$imageEl.transform(`translate3d(0,0,0) scale(${zoom.scale})`);
  }
  function onGestureEnd(e) {
    const device = swiper.device;
    const support = swiper.support;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;
    if (!support.gestures) {
      if (!fakeGestureTouched || !fakeGestureMoved) {
        return;
      }
      if (e.type !== "touchend" || e.type === "touchend" && e.changedTouches.length < 2 && !device.android) {
        return;
      }
      fakeGestureTouched = false;
      fakeGestureMoved = false;
    }
    if (!gesture.$imageEl || gesture.$imageEl.length === 0)
      return;
    zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
    gesture.$imageEl.transition(swiper.params.speed).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
    currentScale = zoom.scale;
    isScaling = false;
    if (zoom.scale === 1)
      gesture.$slideEl = void 0;
  }
  function onTouchStart(e) {
    const device = swiper.device;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0)
      return;
    if (image.isTouched)
      return;
    if (device.android && e.cancelable)
      e.preventDefault();
    image.isTouched = true;
    image.touchesStart.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
    image.touchesStart.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
  }
  function onTouchMove(e) {
    const zoom = swiper.zoom;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0)
      return;
    swiper.allowClick = false;
    if (!image.isTouched || !gesture.$slideEl)
      return;
    if (!image.isMoved) {
      image.width = gesture.$imageEl[0].offsetWidth;
      image.height = gesture.$imageEl[0].offsetHeight;
      image.startX = getTranslate(gesture.$imageWrapEl[0], "x") || 0;
      image.startY = getTranslate(gesture.$imageWrapEl[0], "y") || 0;
      gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
      gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
      gesture.$imageWrapEl.transition(0);
    }
    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight)
      return;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.touchesCurrent.x = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX;
    image.touchesCurrent.y = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
    if (!image.isMoved && !isScaling) {
      if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
        image.isTouched = false;
        return;
      }
      if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
        image.isTouched = false;
        return;
      }
    }
    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
    image.isMoved = true;
    image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
    image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;
    if (image.currentX < image.minX) {
      image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
    }
    if (image.currentX > image.maxX) {
      image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
    }
    if (image.currentY < image.minY) {
      image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
    }
    if (image.currentY > image.maxY) {
      image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
    }
    if (!velocity.prevPositionX)
      velocity.prevPositionX = image.touchesCurrent.x;
    if (!velocity.prevPositionY)
      velocity.prevPositionY = image.touchesCurrent.y;
    if (!velocity.prevTime)
      velocity.prevTime = Date.now();
    velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
    velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
    if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2)
      velocity.x = 0;
    if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2)
      velocity.y = 0;
    velocity.prevPositionX = image.touchesCurrent.x;
    velocity.prevPositionY = image.touchesCurrent.y;
    velocity.prevTime = Date.now();
    gesture.$imageWrapEl.transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
  }
  function onTouchEnd() {
    const zoom = swiper.zoom;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0)
      return;
    if (!image.isTouched || !image.isMoved) {
      image.isTouched = false;
      image.isMoved = false;
      return;
    }
    image.isTouched = false;
    image.isMoved = false;
    let momentumDurationX = 300;
    let momentumDurationY = 300;
    const momentumDistanceX = velocity.x * momentumDurationX;
    const newPositionX = image.currentX + momentumDistanceX;
    const momentumDistanceY = velocity.y * momentumDurationY;
    const newPositionY = image.currentY + momentumDistanceY;
    if (velocity.x !== 0)
      momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
    if (velocity.y !== 0)
      momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
    const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
    image.currentX = newPositionX;
    image.currentY = newPositionY;
    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
    image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
    gesture.$imageWrapEl.transition(momentumDuration).transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
  }
  function onTransitionEnd() {
    const zoom = swiper.zoom;
    if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
      if (gesture.$imageEl) {
        gesture.$imageEl.transform("translate3d(0,0,0) scale(1)");
      }
      if (gesture.$imageWrapEl) {
        gesture.$imageWrapEl.transform("translate3d(0,0,0)");
      }
      zoom.scale = 1;
      currentScale = 1;
      gesture.$slideEl = void 0;
      gesture.$imageEl = void 0;
      gesture.$imageWrapEl = void 0;
    }
  }
  function zoomIn(e) {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;
    if (!gesture.$slideEl) {
      if (e && e.target) {
        gesture.$slideEl = $(e.target).closest(`.${swiper.params.slideClass}`);
      }
      if (!gesture.$slideEl) {
        if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
          gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
        } else {
          gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
        }
      }
      gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0);
      gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
    }
    if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0)
      return;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = "hidden";
      swiper.wrapperEl.style.touchAction = "none";
    }
    gesture.$slideEl.addClass(`${params.zoomedSlideClass}`);
    let touchX;
    let touchY;
    let offsetX;
    let offsetY;
    let diffX;
    let diffY;
    let translateX;
    let translateY;
    let imageWidth;
    let imageHeight;
    let scaledWidth;
    let scaledHeight;
    let translateMinX;
    let translateMinY;
    let translateMaxX;
    let translateMaxY;
    let slideWidth;
    let slideHeight;
    if (typeof image.touchesStart.x === "undefined" && e) {
      touchX = e.type === "touchend" ? e.changedTouches[0].pageX : e.pageX;
      touchY = e.type === "touchend" ? e.changedTouches[0].pageY : e.pageY;
    } else {
      touchX = image.touchesStart.x;
      touchY = image.touchesStart.y;
    }
    zoom.scale = gesture.$imageWrapEl.attr("data-swiper-zoom") || params.maxRatio;
    currentScale = gesture.$imageWrapEl.attr("data-swiper-zoom") || params.maxRatio;
    if (e) {
      slideWidth = gesture.$slideEl[0].offsetWidth;
      slideHeight = gesture.$slideEl[0].offsetHeight;
      offsetX = gesture.$slideEl.offset().left + window2.scrollX;
      offsetY = gesture.$slideEl.offset().top + window2.scrollY;
      diffX = offsetX + slideWidth / 2 - touchX;
      diffY = offsetY + slideHeight / 2 - touchY;
      imageWidth = gesture.$imageEl[0].offsetWidth;
      imageHeight = gesture.$imageEl[0].offsetHeight;
      scaledWidth = imageWidth * zoom.scale;
      scaledHeight = imageHeight * zoom.scale;
      translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
      translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
      translateMaxX = -translateMinX;
      translateMaxY = -translateMinY;
      translateX = diffX * zoom.scale;
      translateY = diffY * zoom.scale;
      if (translateX < translateMinX) {
        translateX = translateMinX;
      }
      if (translateX > translateMaxX) {
        translateX = translateMaxX;
      }
      if (translateY < translateMinY) {
        translateY = translateMinY;
      }
      if (translateY > translateMaxY) {
        translateY = translateMaxY;
      }
    } else {
      translateX = 0;
      translateY = 0;
    }
    gesture.$imageWrapEl.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`);
    gesture.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
  }
  function zoomOut() {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;
    if (!gesture.$slideEl) {
      if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
        gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
      } else {
        gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
      }
      gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0);
      gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
    }
    if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0)
      return;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = "";
      swiper.wrapperEl.style.touchAction = "";
    }
    zoom.scale = 1;
    currentScale = 1;
    gesture.$imageWrapEl.transition(300).transform("translate3d(0,0,0)");
    gesture.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)");
    gesture.$slideEl.removeClass(`${params.zoomedSlideClass}`);
    gesture.$slideEl = void 0;
  }
  function zoomToggle(e) {
    const zoom = swiper.zoom;
    if (zoom.scale && zoom.scale !== 1) {
      zoomOut();
    } else {
      zoomIn(e);
    }
  }
  function getListeners() {
    const support = swiper.support;
    const passiveListener = swiper.touchEvents.start === "touchstart" && support.passiveListener && swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    const activeListenerWithCapture = support.passiveListener ? {
      passive: false,
      capture: true
    } : true;
    return {
      passiveListener,
      activeListenerWithCapture
    };
  }
  function getSlideSelector() {
    return `.${swiper.params.slideClass}`;
  }
  function toggleGestures(method) {
    const {
      passiveListener
    } = getListeners();
    const slideSelector = getSlideSelector();
    swiper.$wrapperEl[method]("gesturestart", slideSelector, onGestureStart, passiveListener);
    swiper.$wrapperEl[method]("gesturechange", slideSelector, onGestureChange, passiveListener);
    swiper.$wrapperEl[method]("gestureend", slideSelector, onGestureEnd, passiveListener);
  }
  function enableGestures() {
    if (gesturesEnabled)
      return;
    gesturesEnabled = true;
    toggleGestures("on");
  }
  function disableGestures() {
    if (!gesturesEnabled)
      return;
    gesturesEnabled = false;
    toggleGestures("off");
  }
  function enable() {
    const zoom = swiper.zoom;
    if (zoom.enabled)
      return;
    zoom.enabled = true;
    const support = swiper.support;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();
    const slideSelector = getSlideSelector();
    if (support.gestures) {
      swiper.$wrapperEl.on(swiper.touchEvents.start, enableGestures, passiveListener);
      swiper.$wrapperEl.on(swiper.touchEvents.end, disableGestures, passiveListener);
    } else if (swiper.touchEvents.start === "touchstart") {
      swiper.$wrapperEl.on(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
      swiper.$wrapperEl.on(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
      swiper.$wrapperEl.on(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);
      if (swiper.touchEvents.cancel) {
        swiper.$wrapperEl.on(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
      }
    }
    swiper.$wrapperEl.on(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
  }
  function disable() {
    const zoom = swiper.zoom;
    if (!zoom.enabled)
      return;
    const support = swiper.support;
    zoom.enabled = false;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();
    const slideSelector = getSlideSelector();
    if (support.gestures) {
      swiper.$wrapperEl.off(swiper.touchEvents.start, enableGestures, passiveListener);
      swiper.$wrapperEl.off(swiper.touchEvents.end, disableGestures, passiveListener);
    } else if (swiper.touchEvents.start === "touchstart") {
      swiper.$wrapperEl.off(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
      swiper.$wrapperEl.off(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
      swiper.$wrapperEl.off(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);
      if (swiper.touchEvents.cancel) {
        swiper.$wrapperEl.off(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
      }
    }
    swiper.$wrapperEl.off(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
  }
  on2("init", () => {
    if (swiper.params.zoom.enabled) {
      enable();
    }
  });
  on2("destroy", () => {
    disable();
  });
  on2("touchStart", (_s, e) => {
    if (!swiper.zoom.enabled)
      return;
    onTouchStart(e);
  });
  on2("touchEnd", (_s, e) => {
    if (!swiper.zoom.enabled)
      return;
    onTouchEnd();
  });
  on2("doubleTap", (_s, e) => {
    if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
      zoomToggle(e);
    }
  });
  on2("transitionEnd", () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
      onTransitionEnd();
    }
  });
  on2("slideChange", () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
      onTransitionEnd();
    }
  });
  Object.assign(swiper.zoom, {
    enable,
    disable,
    in: zoomIn,
    out: zoomOut,
    toggle: zoomToggle
  });
}
function A11y({
  swiper,
  extendParams,
  on: on2
}) {
  extendParams({
    a11y: {
      enabled: true,
      notificationClass: "swiper-notification",
      prevSlideMessage: "Previous slide",
      nextSlideMessage: "Next slide",
      firstSlideMessage: "This is the first slide",
      lastSlideMessage: "This is the last slide",
      paginationBulletMessage: "Go to slide {{index}}",
      slideLabelMessage: "{{index}} / {{slidesLength}}",
      containerMessage: null,
      containerRoleDescriptionMessage: null,
      itemRoleDescriptionMessage: null,
      slideRole: "group",
      id: null
    }
  });
  swiper.a11y = {
    clicked: false
  };
  let liveRegion = null;
  function notify(message) {
    const notification = liveRegion;
    if (notification.length === 0)
      return;
    notification.html("");
    notification.html(message);
  }
  function getRandomNumber(size = 16) {
    const randomChar = () => Math.round(16 * Math.random()).toString(16);
    return "x".repeat(size).replace(/x/g, randomChar);
  }
  function makeElFocusable($el) {
    $el.attr("tabIndex", "0");
  }
  function makeElNotFocusable($el) {
    $el.attr("tabIndex", "-1");
  }
  function addElRole($el, role) {
    $el.attr("role", role);
  }
  function addElRoleDescription($el, description) {
    $el.attr("aria-roledescription", description);
  }
  function addElControls($el, controls) {
    $el.attr("aria-controls", controls);
  }
  function addElLabel($el, label) {
    $el.attr("aria-label", label);
  }
  function addElId($el, id) {
    $el.attr("id", id);
  }
  function addElLive($el, live) {
    $el.attr("aria-live", live);
  }
  function disableEl($el) {
    $el.attr("aria-disabled", true);
  }
  function enableEl($el) {
    $el.attr("aria-disabled", false);
  }
  function onEnterOrSpaceKey(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32)
      return;
    const params = swiper.params.a11y;
    const $targetEl = $(e.target);
    if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
      if (!(swiper.isEnd && !swiper.params.loop)) {
        swiper.slideNext();
      }
      if (swiper.isEnd) {
        notify(params.lastSlideMessage);
      } else {
        notify(params.nextSlideMessage);
      }
    }
    if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
      if (!(swiper.isBeginning && !swiper.params.loop)) {
        swiper.slidePrev();
      }
      if (swiper.isBeginning) {
        notify(params.firstSlideMessage);
      } else {
        notify(params.prevSlideMessage);
      }
    }
    if (swiper.pagination && $targetEl.is(classesToSelector(swiper.params.pagination.bulletClass))) {
      $targetEl[0].click();
    }
  }
  function updateNavigation() {
    if (swiper.params.loop || swiper.params.rewind || !swiper.navigation)
      return;
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    if ($prevEl && $prevEl.length > 0) {
      if (swiper.isBeginning) {
        disableEl($prevEl);
        makeElNotFocusable($prevEl);
      } else {
        enableEl($prevEl);
        makeElFocusable($prevEl);
      }
    }
    if ($nextEl && $nextEl.length > 0) {
      if (swiper.isEnd) {
        disableEl($nextEl);
        makeElNotFocusable($nextEl);
      } else {
        enableEl($nextEl);
        makeElFocusable($nextEl);
      }
    }
  }
  function hasPagination() {
    return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
  }
  function hasClickablePagination() {
    return hasPagination() && swiper.params.pagination.clickable;
  }
  function updatePagination() {
    const params = swiper.params.a11y;
    if (!hasPagination())
      return;
    swiper.pagination.bullets.each((bulletEl) => {
      const $bulletEl = $(bulletEl);
      if (swiper.params.pagination.clickable) {
        makeElFocusable($bulletEl);
        if (!swiper.params.pagination.renderBullet) {
          addElRole($bulletEl, "button");
          addElLabel($bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1));
        }
      }
      if ($bulletEl.is(`.${swiper.params.pagination.bulletActiveClass}`)) {
        $bulletEl.attr("aria-current", "true");
      } else {
        $bulletEl.removeAttr("aria-current");
      }
    });
  }
  const initNavEl = ($el, wrapperId, message) => {
    makeElFocusable($el);
    if ($el[0].tagName !== "BUTTON") {
      addElRole($el, "button");
      $el.on("keydown", onEnterOrSpaceKey);
    }
    addElLabel($el, message);
    addElControls($el, wrapperId);
  };
  const handlePointerDown = () => {
    swiper.a11y.clicked = true;
  };
  const handlePointerUp = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!swiper.destroyed) {
          swiper.a11y.clicked = false;
        }
      });
    });
  };
  const handleFocus = (e) => {
    if (swiper.a11y.clicked)
      return;
    const slideEl = e.target.closest(`.${swiper.params.slideClass}`);
    if (!slideEl || !swiper.slides.includes(slideEl))
      return;
    const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
    const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
    if (isActive || isVisible)
      return;
    if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents)
      return;
    if (swiper.isHorizontal()) {
      swiper.el.scrollLeft = 0;
    } else {
      swiper.el.scrollTop = 0;
    }
    swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
  };
  const initSlides = () => {
    const params = swiper.params.a11y;
    if (params.itemRoleDescriptionMessage) {
      addElRoleDescription($(swiper.slides), params.itemRoleDescriptionMessage);
    }
    if (params.slideRole) {
      addElRole($(swiper.slides), params.slideRole);
    }
    const slidesLength = swiper.params.loop ? swiper.slides.filter((el) => !el.classList.contains(swiper.params.slideDuplicateClass)).length : swiper.slides.length;
    if (params.slideLabelMessage) {
      swiper.slides.each((slideEl, index) => {
        const $slideEl = $(slideEl);
        const slideIndex = swiper.params.loop ? parseInt($slideEl.attr("data-swiper-slide-index"), 10) : index;
        const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
        addElLabel($slideEl, ariaLabelMessage);
      });
    }
  };
  const init = () => {
    const params = swiper.params.a11y;
    swiper.$el.append(liveRegion);
    const $containerEl = swiper.$el;
    if (params.containerRoleDescriptionMessage) {
      addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
    }
    if (params.containerMessage) {
      addElLabel($containerEl, params.containerMessage);
    }
    const $wrapperEl = swiper.$wrapperEl;
    const wrapperId = params.id || $wrapperEl.attr("id") || `swiper-wrapper-${getRandomNumber(16)}`;
    const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? "off" : "polite";
    addElId($wrapperEl, wrapperId);
    addElLive($wrapperEl, live);
    initSlides();
    let $nextEl;
    let $prevEl;
    if (swiper.navigation && swiper.navigation.$nextEl) {
      $nextEl = swiper.navigation.$nextEl;
    }
    if (swiper.navigation && swiper.navigation.$prevEl) {
      $prevEl = swiper.navigation.$prevEl;
    }
    if ($nextEl && $nextEl.length) {
      initNavEl($nextEl, wrapperId, params.nextSlideMessage);
    }
    if ($prevEl && $prevEl.length) {
      initNavEl($prevEl, wrapperId, params.prevSlideMessage);
    }
    if (hasClickablePagination()) {
      swiper.pagination.$el.on("keydown", classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
    }
    swiper.$el.on("focus", handleFocus, true);
    swiper.$el.on("pointerdown", handlePointerDown, true);
    swiper.$el.on("pointerup", handlePointerUp, true);
  };
  function destroy() {
    if (liveRegion && liveRegion.length > 0)
      liveRegion.remove();
    let $nextEl;
    let $prevEl;
    if (swiper.navigation && swiper.navigation.$nextEl) {
      $nextEl = swiper.navigation.$nextEl;
    }
    if (swiper.navigation && swiper.navigation.$prevEl) {
      $prevEl = swiper.navigation.$prevEl;
    }
    if ($nextEl) {
      $nextEl.off("keydown", onEnterOrSpaceKey);
    }
    if ($prevEl) {
      $prevEl.off("keydown", onEnterOrSpaceKey);
    }
    if (hasClickablePagination()) {
      swiper.pagination.$el.off("keydown", classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
    }
    swiper.$el.off("focus", handleFocus, true);
    swiper.$el.off("pointerdown", handlePointerDown, true);
    swiper.$el.off("pointerup", handlePointerUp, true);
  }
  on2("beforeInit", () => {
    liveRegion = $(`<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
  });
  on2("afterInit", () => {
    if (!swiper.params.a11y.enabled)
      return;
    init();
  });
  on2("slidesLengthChange snapGridLengthChange slidesGridLengthChange", () => {
    if (!swiper.params.a11y.enabled)
      return;
    initSlides();
  });
  on2("fromEdge toEdge afterInit lock unlock", () => {
    if (!swiper.params.a11y.enabled)
      return;
    updateNavigation();
  });
  on2("paginationUpdate", () => {
    if (!swiper.params.a11y.enabled)
      return;
    updatePagination();
  });
  on2("destroy", () => {
    if (!swiper.params.a11y.enabled)
      return;
    destroy();
  });
}
function Thumb({
  swiper,
  extendParams,
  on: on2
}) {
  extendParams({
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: "swiper-slide-thumb-active",
      thumbsContainerClass: "swiper-thumbs"
    }
  });
  let initialized = false;
  let swiperCreated = false;
  swiper.thumbs = {
    swiper: null
  };
  function onThumbClick() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed)
      return;
    const clickedIndex = thumbsSwiper.clickedIndex;
    const clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && $(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass))
      return;
    if (typeof clickedIndex === "undefined" || clickedIndex === null)
      return;
    let slideToIndex;
    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt($(thumbsSwiper.clickedSlide).attr("data-swiper-slide-index"), 10);
    } else {
      slideToIndex = clickedIndex;
    }
    if (swiper.params.loop) {
      let currentIndex = swiper.activeIndex;
      if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
        swiper.loopFix();
        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        currentIndex = swiper.activeIndex;
      }
      const prevIndex = swiper.slides.eq(currentIndex).prevAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
      const nextIndex = swiper.slides.eq(currentIndex).nextAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
      if (typeof prevIndex === "undefined")
        slideToIndex = nextIndex;
      else if (typeof nextIndex === "undefined")
        slideToIndex = prevIndex;
      else if (nextIndex - currentIndex < currentIndex - prevIndex)
        slideToIndex = nextIndex;
      else
        slideToIndex = prevIndex;
    }
    swiper.slideTo(slideToIndex);
  }
  function init() {
    const {
      thumbs: thumbsParams
    } = swiper.params;
    if (initialized)
      return false;
    initialized = true;
    const SwiperClass = swiper.constructor;
    if (thumbsParams.swiper instanceof SwiperClass) {
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object.assign(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Object.assign(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
    } else if (isObject(thumbsParams.swiper)) {
      const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
      Object.assign(thumbsSwiperParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
      swiperCreated = true;
    }
    swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on("tap", onThumbClick);
    return true;
  }
  function update(initial) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed)
      return;
    const slidesPerView = thumbsSwiper.params.slidesPerView === "auto" ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
    let thumbsToActivate = 1;
    const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }
    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }
    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.removeClass(thumbActiveClass);
    if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        thumbsSwiper.$wrapperEl.children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass);
      }
    } else {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        thumbsSwiper.slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
      }
    }
    const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      let currentThumbsIndex = thumbsSwiper.activeIndex;
      let newThumbsIndex;
      let direction;
      if (thumbsSwiper.params.loop) {
        if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
          thumbsSwiper.loopFix();
          thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
          currentThumbsIndex = thumbsSwiper.activeIndex;
        }
        const prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
        const nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
        if (typeof prevThumbsIndex === "undefined") {
          newThumbsIndex = nextThumbsIndex;
        } else if (typeof nextThumbsIndex === "undefined") {
          newThumbsIndex = prevThumbsIndex;
        } else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) {
          newThumbsIndex = thumbsSwiper.params.slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex;
        } else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) {
          newThumbsIndex = nextThumbsIndex;
        } else {
          newThumbsIndex = prevThumbsIndex;
        }
        direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
      }
      if (useOffset) {
        newThumbsIndex += direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
      }
      if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1)
          ;
        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0);
      }
    }
  }
  on2("beforeInit", () => {
    const {
      thumbs
    } = swiper.params;
    if (!thumbs || !thumbs.swiper)
      return;
    init();
    update(true);
  });
  on2("slideChange update resize observerUpdate", () => {
    update();
  });
  on2("setTransition", (_s, duration) => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed)
      return;
    thumbsSwiper.setTransition(duration);
  });
  on2("beforeDestroy", () => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed)
      return;
    if (swiperCreated) {
      thumbsSwiper.destroy();
    }
  });
  Object.assign(swiper.thumbs, {
    init,
    update
  });
}
const EventBus = () => {
  let eventBus = {};
  let emits = [];
  function listen(events2, handler) {
    [...[].concat(events2)].forEach((event) => {
      eventBus[event] = (eventBus[event] || []).concat(handler);
    });
    return this;
  }
  function remove(event, extraHandler) {
    eventBus[event] = [...eventBus[event]].filter(
      (handler) => handler !== extraHandler
    );
    return this;
  }
  function emit(event, data) {
    if (!emits.includes(event)) {
      emits.push(event);
    }
    if (!eventBus[event]) {
      return false;
    }
    return [...eventBus[event]].forEach((handler) => handler(data));
  }
  function all() {
    return eventBus;
  }
  function clear() {
    eventBus = {};
    emits = [];
  }
  function events() {
    return emits;
  }
  return Object.freeze({
    listen,
    emit,
    all,
    events,
    remove,
    clear
  });
};
const LazyLoadImages = () => {
  function init() {
    let lazyImages = [
      ...document.querySelectorAll(".lazy img[data-srcset]")
    ];
    if (lazyImages.length < 1) {
      return;
    }
    if ("IntersectionObserver" in window) {
      let lazyImageObserver = new IntersectionObserver(
        function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              let lazyImage = entry.target;
              const targets = [
                ...lazyImage.parentElement.querySelectorAll(
                  "[data-srcset]"
                )
              ];
              targets.forEach((lazyImage2) => {
                lazyImage2.srcset = lazyImage2.dataset.srcset;
                if (lazyImage2.dataset.src) {
                  lazyImage2.addEventListener("load", () => {
                    lazyImage2.parentElement.classList.remove(
                      "lazy"
                    );
                  });
                  lazyImage2.src = lazyImage2.dataset.src;
                }
                lazyImageObserver.unobserve(lazyImage2);
              });
            }
          });
        },
        { rootMargin: window.innerHeight + "px" }
      );
      lazyImages.forEach(function(lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      lazyImages.forEach(function(image) {
        image.srcset = image.dataset.srcset;
        if (image.dataset.src) {
          image.src = image.dataset.src;
        }
      });
    }
  }
  return Object.freeze({
    init
  });
};
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}
var hasPassiveEvents = false;
if (typeof window !== "undefined") {
  var passiveTestOptions = {
    get passive() {
      hasPassiveEvents = true;
      return void 0;
    }
  };
  window.addEventListener("testPassive", null, passiveTestOptions);
  window.removeEventListener("testPassive", null, passiveTestOptions);
}
var isIosDevice = typeof window !== "undefined" && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
var locks = [];
var documentListenerAdded = false;
var initialClientY = -1;
var previousBodyOverflowSetting = void 0;
var previousBodyPaddingRight = void 0;
var allowTouchMove = function allowTouchMove2(el) {
  return locks.some(function(lock) {
    if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
      return true;
    }
    return false;
  });
};
var preventDefault = function preventDefault2(rawEvent) {
  var e = rawEvent || window.event;
  if (allowTouchMove(e.target)) {
    return true;
  }
  if (e.touches.length > 1)
    return true;
  if (e.preventDefault)
    e.preventDefault();
  return false;
};
var setOverflowHidden = function setOverflowHidden2(options) {
  if (previousBodyPaddingRight === void 0) {
    var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
    var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;
    if (_reserveScrollBarGap && scrollBarGap > 0) {
      previousBodyPaddingRight = document.body.style.paddingRight;
      document.body.style.paddingRight = scrollBarGap + "px";
    }
  }
  if (previousBodyOverflowSetting === void 0) {
    previousBodyOverflowSetting = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
};
var restoreOverflowSetting = function restoreOverflowSetting2() {
  if (previousBodyPaddingRight !== void 0) {
    document.body.style.paddingRight = previousBodyPaddingRight;
    previousBodyPaddingRight = void 0;
  }
  if (previousBodyOverflowSetting !== void 0) {
    document.body.style.overflow = previousBodyOverflowSetting;
    previousBodyOverflowSetting = void 0;
  }
};
var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled2(targetElement) {
  return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
};
var handleScroll = function handleScroll2(event, targetElement) {
  var clientY = event.targetTouches[0].clientY - initialClientY;
  if (allowTouchMove(event.target)) {
    return false;
  }
  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    return preventDefault(event);
  }
  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    return preventDefault(event);
  }
  event.stopPropagation();
  return true;
};
var disableBodyScroll = function disableBodyScroll2(targetElement, options) {
  if (!targetElement) {
    console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.");
    return;
  }
  if (locks.some(function(lock2) {
    return lock2.targetElement === targetElement;
  })) {
    return;
  }
  var lock = {
    targetElement,
    options: options || {}
  };
  locks = [].concat(_toConsumableArray(locks), [lock]);
  if (isIosDevice) {
    targetElement.ontouchstart = function(event) {
      if (event.targetTouches.length === 1) {
        initialClientY = event.targetTouches[0].clientY;
      }
    };
    targetElement.ontouchmove = function(event) {
      if (event.targetTouches.length === 1) {
        handleScroll(event, targetElement);
      }
    };
    if (!documentListenerAdded) {
      document.addEventListener("touchmove", preventDefault, hasPassiveEvents ? { passive: false } : void 0);
      documentListenerAdded = true;
    }
  } else {
    setOverflowHidden(options);
  }
};
var clearAllBodyScrollLocks = function clearAllBodyScrollLocks2() {
  if (isIosDevice) {
    locks.forEach(function(lock) {
      lock.targetElement.ontouchstart = null;
      lock.targetElement.ontouchmove = null;
    });
    if (documentListenerAdded) {
      document.removeEventListener("touchmove", preventDefault, hasPassiveEvents ? { passive: false } : void 0);
      documentListenerAdded = false;
    }
    initialClientY = -1;
  } else {
    restoreOverflowSetting();
  }
  locks = [];
};
var enableBodyScroll = function enableBodyScroll2(targetElement) {
  if (!targetElement) {
    console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.");
    return;
  }
  locks = locks.filter(function(lock) {
    return lock.targetElement !== targetElement;
  });
  if (isIosDevice) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;
    if (documentListenerAdded && locks.length === 0) {
      document.removeEventListener("touchmove", preventDefault, hasPassiveEvents ? { passive: false } : void 0);
      documentListenerAdded = false;
    }
  } else if (!locks.length) {
    restoreOverflowSetting();
  }
};
const bodyScrollLock = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll
}, Symbol.toStringTag, { value: "Module" }));
const selectors$5 = {
  container: ".js-accordion-container",
  content: ".js-accordion-content",
  control: ".js-accordion-control",
  item: ".js-accordion-item",
  inner: ".js-accordion-inner"
};
const Accordion = (config = {}) => {
  const cssClasses2 = {
    ...window.themeCore.utils.cssClasses,
    left: "left",
    right: "right"
  };
  const extendDefaults2 = window.themeCore.utils.extendDefaults;
  const on2 = window.themeCore.utils.on;
  const focusable2 = window.themeCore.utils.focusable;
  const defaults = {
    singleOpen: false,
    expandInitial: false,
    expandAll: false
  };
  const settings = extendDefaults2(defaults, config);
  if (settings.initiated) {
    return;
  }
  let containers = [];
  let accordions = [];
  let isProcessing = false;
  function init() {
    containers = document.querySelectorAll(selectors$5.container);
    accordions = [];
    containers.forEach((container) => {
      accordions.push({
        container,
        controls: [...container.querySelectorAll(selectors$5.control)],
        content: [...container.querySelectorAll(selectors$5.content)],
        items: [...container.querySelectorAll(selectors$5.item)]
      });
    });
    setInnerHeight();
    setDefaultState();
    setEventListeners();
    settings.initiated = true;
  }
  function setInnerHeight() {
    accordions.forEach(({ content }) => {
      content.forEach((item) => {
        if (!item.closest(selectors$5.item) || !item.closest(selectors$5.item).classList.contains(cssClasses2.active)) {
          unsetTabIndexOnTarget(item);
          item.style.height = 0;
        } else {
          setTabIndexOnTarget(item);
        }
      });
    });
  }
  function setDefaultState() {
    if (settings.expandAll) {
      expandAllItems();
    }
    if (settings.expandInitial) {
      expandInitialItem();
    }
  }
  function setEventListeners() {
    accordions.forEach(({ container }) => {
      on2("click", container, handleClickEvent);
      on2("keydown", container, handleKeyboardEvent);
    });
  }
  function unsetTabIndexOnTarget(target) {
    focusable2(target).forEach(
      (element) => element.setAttribute("tabindex", -1)
    );
  }
  function setTabIndexOnTarget(target) {
    focusable2(target).forEach(
      (element) => element.setAttribute("tabindex", 0)
    );
  }
  function handleClickEvent(event) {
    const control = event.target.closest(selectors$5.control);
    if (!control || !isTargetControl(control)) {
      return;
    }
    event.preventDefault();
    toggleItem(event.target);
  }
  function handleKeyboardEvent(event) {
    if (!isTargetControl(event.target)) {
      return;
    }
    if (isKeyPressArrowUp(event) || isKeyPressArrowDown(event)) {
      handleArrowEvents(event);
      return;
    }
    if (isKeyPressHome(event) || isKeyPressEnd(event)) {
      handleHomeEndEvents(event);
    }
  }
  function handleArrowEvents(event) {
    event.preventDefault();
    const container = event.target.closest(selectors$5.container);
    const currentAccordion = accordions.find(
      ({ container: accordionContainer }) => container === accordionContainer
    );
    const index = currentAccordion.controls.indexOf(event.target);
    const direction = isKeyPressArrowUp(event) ? -1 : 1;
    const length = currentAccordion.controls.length;
    const newIndex = (index + length + direction) % length;
    currentAccordion.controls[newIndex].focus();
  }
  function handleHomeEndEvents(event) {
    event.preventDefault();
    const container = event.target.closest(selectors$5.container);
    const currentAccordion = accordions.find(
      ({ container: accordionContainer }) => container === accordionContainer
    );
    if (isKeyPressHome(event)) {
      currentAccordion.controls[0].focus();
      return;
    }
    if (isKeyPressEnd(event)) {
      currentAccordion.controls[currentAccordion.controls.length - 1].focus();
    }
  }
  function expandItem(element) {
    if (!element) {
      return;
    }
    if (isProcessing) {
      return;
    }
    const elementContent = element.querySelector(selectors$5.content);
    animateContent(element, false);
    setTabIndexOnTarget(elementContent);
    const rect = element.getBoundingClientRect();
    const isLeft = rect.x + rect.width / 2 < window.innerWidth / 2;
    const directionClass = isLeft ? cssClasses2.left : cssClasses2.right;
    element.classList.add(cssClasses2.active, directionClass);
    element.querySelector(selectors$5.control).setAttribute("aria-expanded", true);
  }
  function animateContent(element, hide) {
    if (!element) {
      return;
    }
    isProcessing = true;
    const animationDelay = 500;
    const elementContent = element.querySelector(selectors$5.content);
    const innerHeight = element.querySelector(selectors$5.inner).offsetHeight;
    if (hide) {
      elementContent.style.height = innerHeight + "px";
      setTimeout(() => {
        elementContent.style.height = 0;
        isProcessing = false;
      }, 0);
    } else {
      elementContent.style.height = innerHeight + "px";
      setTimeout(() => {
        elementContent.removeAttribute("style");
        isProcessing = false;
      }, animationDelay);
    }
  }
  function collapseItem(element, force) {
    if (!element) {
      return;
    }
    if (isProcessing && !force) {
      return;
    }
    animateContent(element, true);
    const elementContent = element.querySelector(selectors$5.content);
    unsetTabIndexOnTarget(elementContent);
    element.classList.remove(cssClasses2.active);
    setTimeout(() => element.classList.remove(cssClasses2.left, cssClasses2.right), 500);
    element.querySelector(selectors$5.control).setAttribute("aria-expanded", false);
  }
  function isItemExpanded(element) {
    return element.classList.contains(cssClasses2.active);
  }
  function collapseUnselectedItems(element) {
    const container = element.closest(selectors$5.container);
    const currentAccordion = accordions.find(
      ({ container: accordionContainer }) => container === accordionContainer
    );
    if (currentAccordion) {
      currentAccordion.items.forEach((item) => {
        if (isItemExpanded(item) && item !== element) {
          collapseItem(item);
        }
      });
    }
  }
  function toggleItem(control) {
    const item = control.closest(selectors$5.item);
    if (settings.singleOpen) {
      collapseUnselectedItems(item);
    }
    if (isItemExpanded(item)) {
      collapseItem(item);
      return;
    }
    expandItem(item);
  }
  function isKeyPressArrowDown(event) {
    return event.keyCode === 40 || event.keyCode === 34;
  }
  function isKeyPressArrowUp(event) {
    return event.keyCode === 38 || event.keyCode === 33;
  }
  function isKeyPressEnd(event) {
    return event.keyCode === 35;
  }
  function isKeyPressHome(event) {
    return event.keyCode === 36;
  }
  function isTargetControl(target) {
    return accordions.find(({ controls }) => controls.includes(target));
  }
  function expandAllItems() {
    accordions.forEach(({ items }) => {
      items.forEach((element) => {
        expandItem(element);
      });
    });
  }
  function expandInitialItem() {
    accordions.forEach(({ items }) => {
      items.forEach((element, index) => {
        if (index === 0) {
          expandItem(element);
          return;
        }
        collapseItem(element);
      });
    });
  }
  function collapseAllItems(selector, excludedElement) {
    accordions.forEach(({ items, container }) => {
      if (!selector) {
        items.forEach((item) => {
          collapseItem(item);
        });
      }
      if (typeof selector === "string") {
        selector = [selector];
      }
      if (Array.isArray(selector)) {
        const parent = container.parentElement;
        selector.forEach((elem) => {
          const container2 = parent.querySelector(elem);
          if (container2) {
            items.forEach((item) => {
              if (item === excludedElement) {
                return;
              }
              collapseItem(item, true);
            });
          }
        });
      }
    });
  }
  function initiated() {
    return !!settings.initiated;
  }
  function getContainers() {
    return containers || [];
  }
  function getAccordions() {
    return accordions || [];
  }
  function setTabIndex(selector, mode = "all", index = -1) {
    if (!selector) {
      return;
    }
    const allContainsSelector = [...document.querySelectorAll(selector)];
    const accordion = accordions.find(
      (accordion2) => allContainsSelector.find(
        (element) => element === accordion2.container
      )
    );
    if (!accordion) {
      return;
    }
    let targetContent = [];
    switch (mode) {
      case "active":
        accordion.items.filter(
          (item) => item.classList.contains(cssClasses2.active)
        ).forEach((item) => {
          accordion.content.forEach((content) => {
            if (item.contains(content)) {
              targetContent.push(content);
            }
          });
        });
        break;
      case "hidden":
        accordion.items.filter(
          (item) => !item.classList.contains(cssClasses2.active)
        ).forEach((item) => {
          accordion.content.forEach((content) => {
            if (item.contains(content)) {
              targetContent.push(content);
            }
          });
        });
        break;
      case "all":
      default:
        targetContent = accordion.content;
        break;
    }
    targetContent.forEach(
      (content) => focusable2(content).forEach((element) => {
        element.setAttribute("tabindex", index);
      })
    );
  }
  return Object.freeze({
    init,
    initiated,
    collapseAllItems,
    expandAllItems,
    expandInitialItem,
    getContainers,
    getAccordions,
    setTabIndex
  });
};
const selectors$4 = {
  container: ".js-popover-container",
  button: ".js-popover-button",
  content: ".js-popover-content"
};
const Popover = () => {
  const cssClasses2 = window.themeCore.utils.cssClasses;
  function init() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(selectors$4.button);
      if (!button) {
        const contents = [...document.querySelectorAll(selectors$4.content)];
        contents.forEach((content2) => {
          content2.classList.remove(cssClasses2.active);
          const container2 = content2.closest(selectors$4.container);
          if (!container2) {
            return;
          }
          const button2 = container2.querySelector(selectors$4.button);
          if (!button2) {
            return;
          }
          button2.setAttribute("aria-expanded", "false");
        });
        return;
      }
      const container = button.closest(selectors$4.container);
      if (!container) {
        return;
      }
      const content = container.querySelector(selectors$4.content);
      if (!content) {
        return;
      }
      content.classList.toggle(cssClasses2.active);
      const prevExpanded = button.getAttribute("aria-expanded");
      if (prevExpanded) {
        button.setAttribute("aria-expanded", prevExpanded === "true" ? "false" : "true");
      }
    });
  }
  return Object.freeze({
    init
  });
};
const Tabs = () => {
  function init() {
    document.addEventListener("click", (event) => {
      const target = event == null ? void 0 : event.target;
      if (!target) {
        return;
      }
      const button = target.closest(".js-tab-button");
      if (!button) {
        return;
      }
      if (button.classList.contains("active")) {
        return;
      }
      const tabsContainer = button.closest("[data-tabs-container]");
      const tabName = button.getAttribute("data-tab");
      const tabContent = tabsContainer.querySelector(
        `[data-tab-content=${tabName}]`
      );
      const passiveTabs = tabsContainer.querySelectorAll(
        "[data-tab-content].active"
      );
      const passiveTabsButtons = tabsContainer.querySelectorAll("[data-tab].active");
      button.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      tabContent.classList.add("active");
      button.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
      passiveTabs.forEach((content) => {
        content.classList.remove("active");
      });
      passiveTabsButtons.forEach((tabButton) => {
        tabButton.classList.remove("active");
        tabButton.setAttribute("aria-expanded", "false");
      });
    });
  }
  return Object.freeze({
    init
  });
};
const selectors$3 = {
  productCard: ".js-product-card",
  swatch: ".js-product-card-swatch",
  swatchBase: ".js-product-card-swatch-base",
  swatchesBaseContainer: ".js-product-card-swatch-base-container",
  video: ".js-product-card-video",
  imagesWrapper: ".js-product-card-images-wrapper",
  quickViewButton: ".js-product-card-quick-view-button",
  minQuantity: ".js-product-card-min-value"
};
const attributes$2 = {
  productHandle: "data-product-card-handle",
  swatchIndex: "data-swatch",
  imageIndex: "data-image",
  variant: "data-variant"
};
const ProductCard = () => {
  let initiatedState = false;
  if (initiatedState) {
    return;
  }
  let currentHoverVideo = null;
  const cssClasses2 = window.themeCore.utils.cssClasses;
  function init() {
    setEventListeners();
    window.themeCore.EventBus.emit("compare-products:init");
    initiatedState = true;
  }
  function setEventListeners() {
    document.addEventListener("click", (event) => {
      if (isTargetQuickView(event.target)) {
        quickViewButtonHandler(event);
      }
      if (isTargetSwatch(event.target)) {
        swatchHandler(event);
      }
      if (event.target.closest(selectors$3.swatchBase)) {
        const swatchBase = event.target.closest(selectors$3.swatchBase);
        swatchBaseHandler(swatchBase);
      }
    });
    document.addEventListener("mouseover", (event) => {
      if (getClosestVideo(event.target)) {
        currentHoverVideo = getClosestVideo(event.target);
        productCardVideoPlay(currentHoverVideo);
        currentHoverVideo.addEventListener(
          "mouseleave",
          () => {
            productCardVideoPause(currentHoverVideo);
            currentHoverVideo = null;
          },
          { once: true }
        );
      }
    });
  }
  function quickViewButtonHandler(event) {
    const button = getClosestQuickViewButton(event.target);
    const productCard = getClosestProductCard(event.target);
    const productHandle = getProductHandle(button);
    const variantId = getVariantId(getClosestProductCard(button));
    let isPromoBannerCard = !!button.closest("#promotion-products-popup");
    variantId ? emitQuickViewClickEvent(productHandle, variantId, isPromoBannerCard) : emitCartEvent(getVariantId(button), getMinQuantity(productCard), button);
  }
  function productCardVideoPlay(video) {
    if (!video) {
      return;
    }
    video.play();
  }
  function productCardVideoPause(video) {
    if (!video) {
      return;
    }
    video.pause();
  }
  function swatchHandler(event) {
    let swatch = getClosestSwatch(event.target);
    if (swatch.classList.contains(cssClasses2.active)) {
      return;
    }
    toggleSwatch(swatch);
  }
  function swatchBaseHandler(swatchElement) {
    const swatchesContainer = swatchElement.closest(selectors$3.swatchesBaseContainer);
    if (!swatchesContainer || swatchElement.classList.contains(cssClasses2.active)) {
      return;
    }
    let swatchesBase = swatchesContainer.querySelectorAll(selectors$3.swatchBase);
    swatchesBase.forEach(function(swatch) {
      swatch.classList.remove(cssClasses2.active);
    });
    swatchElement.classList.add(cssClasses2.active);
  }
  function isTargetQuickView(target) {
    return !!getClosestQuickViewButton(target);
  }
  function isTargetSwatch(target) {
    return !!getClosestSwatch(target);
  }
  function getClosestQuickViewButton(target) {
    return target.closest(selectors$3.quickViewButton);
  }
  function getClosestSwatch(target) {
    return target.closest(selectors$3.swatch);
  }
  function getClosestProductCard(element) {
    return element.closest(selectors$3.productCard);
  }
  function getClosestVideo(element) {
    return element.closest(selectors$3.video);
  }
  function getProductHandle(target) {
    return target.getAttribute(attributes$2.productHandle);
  }
  function getVariantId(target) {
    const currentImage = target.querySelector(`${selectors$3.imagesWrapper}.${cssClasses2.active}`);
    if (target && target.getAttribute(attributes$2.variant)) {
      return target.getAttribute(attributes$2.variant);
    } else if (currentImage && currentImage.getAttribute(attributes$2.variant)) {
      return currentImage.getAttribute(attributes$2.variant);
    }
  }
  function toggleSwatch(swatch) {
    const productCard = getClosestProductCard(swatch);
    const swatchIndex = getSwatchIndex(swatch);
    const swatches = [...productCard.querySelectorAll(selectors$3.swatch)];
    removeActiveClasses(swatches);
    setCurrentElementActive(swatch);
    toggleImage(productCard, swatchIndex);
  }
  function toggleImage(productCard, swatchIndex) {
    const images2 = [...productCard.querySelectorAll(selectors$3.imagesWrapper)];
    let currentImage = images2.find((image) => getImageIndex(image) === swatchIndex);
    removeActiveClasses(images2);
    setCurrentElementActive(currentImage);
  }
  function getSwatchIndex(swatch) {
    return swatch.getAttribute(attributes$2.swatchIndex);
  }
  function getImageIndex(image) {
    return image.getAttribute(attributes$2.imageIndex);
  }
  function removeActiveClasses(elements) {
    elements.forEach((element) => element.classList.remove(cssClasses2.active));
  }
  function setCurrentElementActive(element) {
    element.classList.add(cssClasses2.active);
  }
  function emitQuickViewClickEvent(handle, variantId, isPromoBannerCard) {
    window.themeCore.EventBus.emit("product-card:quick-view:clicked", {
      productHandle: handle,
      variant: variantId,
      isPromoBannerCard
    });
  }
  async function emitCartEvent(variantId, quantity, button) {
    try {
      const formData = {
        id: variantId,
        quantity
      }
      if (button.hasAttribute("hide-store-credit")) {
        formData.properties = {
          "__cart_type": "web"
        }
      }
      await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.ADD_TO_CART, formData);
      await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART);
    } catch (error) {
      onQuantityError(error);
    }
  }
  function onQuantityError(error) {
    const CartNotificationError = window.themeCore.CartNotificationError;
    CartNotificationError.addNotification(error.description);
    CartNotificationError.open();
  }
  function getMinQuantity(target) {
    const minQuantityEl = target.querySelector(selectors$3.minQuantity);
    if (!minQuantityEl) {
      return 1;
    }
    return Number(minQuantityEl.value) || 1;
  }
  function initiated() {
    return !!initiatedState;
  }
  return Object.freeze({
    init,
    initiated
  });
};
const QuickView = () => {
  let form = null;
  let loading = false;
  let variants = null;
  let currentVariant = null;
  let hiddenSelect = null;
  let formButton = null;
  let skuElements = null;
  let productLink = null;
  let price = null;
  let productHandle = null;
  let swatches = null;
  let sliderEl = null;
  let sliderThumbnailsEl = null;
  let slider = null;
  let sliderThumbnails = null;
  let formError = null;
  let quantity = null;
  let quantityWrapper = null;
  let quantityWidgetEl = null;
  let showDescription = false;
  let description = null;
  const buttonContent = {};
  let focusTarget = null;
  const Video2 = window.themeCore.utils.Video;
  let videos = [];
  const Toggle2 = window.themeCore.utils.Toggle;
  const overlay2 = window.themeCore.utils.overlay;
  const Swiper2 = window.themeCore.utils.Swiper;
  const cssClasses2 = window.themeCore.utils.cssClasses;
  cssClasses2.quickViewPromotionBanner = "js-quick-view-promotion-banner";
  let container;
  const selectors2 = {
    quickView: ".js-quick-view",
    preloaderOverlay: `[data-js-overlay="quick-view-preloader"]`,
    form: ".js-quick-view-form",
    variants: ".js-quick-view-variants",
    hiddenSelect: ".js-quick-view-hidden-select",
    slider: ".js-quick-view-slider",
    slide: ".js-quick-view-slider .swiper-slide",
    pagination: ".js-quick-view-slider-pagination",
    sliderThumbnails: ".js-quick-view-slider-thumbnails",
    image: ".js-quick-view-image",
    modal: "quick-view",
    productLink: ".js-quick-view-link",
    formButton: ".js-quick-submit-button",
    price: ".js-quick-view-price",
    fetchPrice: ".price",
    swatches: "[data-option]",
    media: ".js-quick-view-media",
    selectedOption: `[data-option="option1"]:checked, [data-option="option2"]:checked, [data-option="option3"]:checked, select[data-option]`,
    skuText: ".js-sku-text",
    loader: `[data-js-overlay="quick-view"] .loader`,
    formError: ".js-quick-view-error",
    quantity: "[data-quantity-input]",
    quantityWrapper: ".js-product-quantity",
    description: ".js-quick-view-description",
    volumePricing: ".js-product-volume-pricing",
    volumePricingList: ".js-product-volume-pricing-list",
    volumePricingJSON: "[data-product-qty-breaks-json]",
    volumePricingShowMore: ".js-product-volume-pricing-show-more",
    priceVolume: ".js-price-volume",
    quantityRules: ".js-product-quantity-rules",
    quantityRuleMin: ".js-product-quantity-rule-min",
    quantityRuleMax: ".js-product-quantity-rule-max",
    quantityRuleIncrement: ".js-product-quantity-rule-increment",
    quantityRuleMinVal: ".js-product-quantity-rule-min-val",
    quantityRuleMaxVal: ".js-product-quantity-rule-max-val",
    quantityRuleIncrementVal: ".js-product-quantity-rule-increment-val",
    breaksVal: ".js-price-breaks-val",
    video: ".js-video",
    modelButton: ".js-quick-view-model-button",
    modelContent: ".js-quick-view-model-content",
    quickViewImage: ".js-quick-view-image",
    sliderPagination: ".js-quick-view-slider-pagination"
  };
  function init() {
    initCurrentQuickView();
    setEventListeners();
  }
  function setEventListeners() {
    window.themeCore.EventBus.listen("product-card:quick-view:clicked", quickViewHandler);
    document.addEventListener("change", formChangeHandler);
    document.addEventListener("submit", formSubmitHandler);
  }
  async function quickViewHandler(event) {
    const variant = event.variant;
    productHandle = event.productHandle;
    showDescription = event.showDescription;
    focusTarget = event.focusTarget;
    let isPromoBannerCard = event.isPromoBannerCard;
    if (!productHandle || loading) {
      return;
    }
    const currentQuick = document.querySelector(selectors2.quickView);
    if (currentQuick) {
      const modal = Toggle2({
        toggleSelector: selectors2.modal
      });
      modal.init({ once: true });
      modal.close(container);
      return;
    }
    loading = true;
    overlay2({ namespace: `quick-view-preloader` }).open(true);
    const url = getProductUrl(productHandle, variant, "quick_view");
    if (!url) {
      return;
    }
    container = await getHTML(url, selectors2.quickView);
    if (!container) {
      return;
    }
    if (isPromoBannerCard) {
      container.classList.add(cssClasses2.quickViewPromotionBanner);
    }
    initQuickViewPopup();
    const showMoreBtn = container.querySelector(selectors2.volumePricingShowMore);
    const volumePricingList = container.querySelector(selectors2.volumePricingList);
    if (!showMoreBtn || !volumePricingList) {
      return;
    }
    showMoreBtn.addEventListener("click", function(e) {
      e.preventDefault();
      let listHiddenItems = volumePricingList.querySelectorAll(".is-hidden");
      if (!listHiddenItems.length) {
        return;
      }
      listHiddenItems.forEach(function(listItem) {
        listItem.classList.remove(cssClasses2.hidden);
      });
      showMoreBtn.classList.add(cssClasses2.hidden);
    });
  }
  function initCurrentQuickView() {
    container = document.querySelector(selectors2.quickView);
    if (!container) {
      return;
    }
    initQuickViewPopup();
    document.addEventListener("change", formChangeHandler);
    document.addEventListener("submit", formSubmitHandler);
  }
  function initQuickViewPopup() {
    hiddenSelect = container.querySelector(selectors2.hiddenSelect);
    formButton = container.querySelector(selectors2.formButton);
    skuElements = [...container.querySelectorAll(selectors2.skuText)];
    productLink = container.querySelector(selectors2.productLink);
    formError = container.querySelector(selectors2.formError);
    sliderEl = container.querySelector(selectors2.slider);
    sliderThumbnailsEl = container.querySelector(selectors2.sliderThumbnails);
    quantity = container.querySelector(selectors2.quantity);
    quantityWrapper = container.querySelector(selectors2.quantityWrapper);
    price = [...container.querySelectorAll(selectors2.price)];
    swatches = [...container.querySelectorAll(selectors2.swatches)];
    const variantsDOM = container.querySelector(selectors2.variants);
    if (!variantsDOM || !hiddenSelect || !formButton || !productLink || !price || !formError || !quantity || !quantityWrapper || !swatches) {
      return;
    }
    description = container.querySelector(selectors2.description);
    if (description && !showDescription) {
      description.remove();
    }
    variants = getSettings(variantsDOM);
    currentVariant = getCurrentVariant();
    updateSwatches();
    !document.body.contains(container) && document.body.append(container);
    window.Shopify && window.Shopify.PaymentButton && window.Shopify.PaymentButton.init && window.Shopify.PaymentButton.init();
    const toggleConfig = {
      toggleSelector: selectors2.modal
    };
    focusTarget && (toggleConfig.previouslySelectedElement = focusTarget);
    const modal = Toggle2(toggleConfig);
    window.themeCore.EventBus.emit(`product:count-down-timer-reinit`);
    quantityWidgetEl = window.themeCore.utils.QuantityWidget(quantityWrapper).init();
    modal.init({ once: true });
    modal.open(container);
    loading = false;
    if (sliderEl) {
      let isDynamicBullets = sliderEl.getAttribute("data-dynamic-pagination");
      isDynamicBullets = isDynamicBullets === "true";
      sliderThumbnails = new Swiper2(sliderThumbnailsEl, {
        slidesPerView: 5,
        spaceBetween: 4,
        freeMode: true,
        watchSlidesProgress: true,
        a11y: {
          slideRole: ""
        },
        threshold: 10,
        breakpoints: {
          1200: {
            spaceBetween: 20
          }
        }
      });
      slider = new Swiper2(sliderEl, {
        slidesPerView: 1,
        spaceBetween: 8,
        autoplay: false,
        pagination: {
          el: selectors2.pagination,
          clickable: true,
          bulletElement: "button",
          dynamicBullets: isDynamicBullets
        },
        navigation: {
          prevEl: container.querySelector(".js-quick-view-slider-prev-btn"),
          nextEl: container.querySelector(".js-quick-view-slider-next-btn")
        },
        thumbs: {
          swiper: sliderThumbnails
        }
      });
      sliderThumbnails.$el.on("keydown", (e) => {
        if (e.keyCode !== 13 && e.keyCode !== 32) {
          return;
        }
        const slideIndex = e.target.dataset.slideIndex;
        if (!slideIndex)
          return;
        sliderThumbnails.slideTo(slideIndex);
        Slider.slideTo(slideIndex);
      });
      document.dispatchEvent(new Event("theme:all:loaded"));
      slider.on("slideChange", function(swiper) {
        onProductSliderSlideChange();
        disableTabulationOnNotActiveSlidesWithModel(swiper);
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (!activeSlide) {
          return;
        }
        swiper.allowTouchMove = !(activeSlide.querySelector("model-viewer") && !activeSlide.querySelector(selectors2.modelButton));
      });
      initVideos();
      updateImage();
      sliderEl.addEventListener("click", (event) => {
        const modelButton = event.target.closest(selectors2.modelButton);
        if (!modelButton) {
          return;
        }
        const slide = modelButton.closest(selectors2.slide);
        if (!slide) {
          return;
        }
        const modelContent = slide.querySelector(selectors2.modelContent);
        const sliderImage = slide.querySelector(selectors2.quickViewImage);
        if (!modelContent || !sliderImage) {
          return;
        }
        modelContent.classList.remove(cssClasses2.hidden);
        modelButton.remove();
        sliderImage.remove();
        slider.allowTouchMove = false;
      });
    }
    setTimeout(() => container.focus(), 50);
  }
  function getProductUrl(productHandle2, variant, templateSuffix) {
    if (!productHandle2) {
      return;
    }
    const locale = window.Shopify.routes.root;
    const url = new URL(`${window.location.origin}${locale}products/${productHandle2}`);
    url.searchParams.set("view", templateSuffix);
    if (variant) {
      url.searchParams.set("variant", variant);
    }
    return url;
  }
  async function getHTML(url, selector) {
    try {
      const response = await fetch(url);
      const resText = await response.text();
      let result = new DOMParser().parseFromString(resText, "text/html");
      if (selector) {
        result = result.querySelector(selector);
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  function formChangeHandler(event) {
    const currentForm = event.target.closest(selectors2.form);
    buttonContent.addToCard = buttonContent.addToCard || window.themeCore.translations.get("products.product.add_to_cart");
    buttonContent.preOrder = buttonContent.preOrder || window.themeCore.translations.get("products.product.pre_order");
    buttonContent.soldOut = buttonContent.soldOut || window.themeCore.translations.get("products.product.sold_out");
    buttonContent.unavailable = buttonContent.unavailable || window.themeCore.translations.get("products.product.unavailable");
    if (!currentForm || !variants.length || !container) {
      return;
    }
    form = currentForm;
    changeErrorMessage();
    const checkedOptions = [...container.querySelectorAll(selectors2.selectedOption)];
    currentVariant = getCurrentVariantFromOptions(checkedOptions);
    updateButtons();
    updateSku();
    updateSwatchLabelName(currentVariant, form);
    const quantityVariantInCart = getVariantCountInCart();
    updateVolumePricing(quantityVariantInCart);
    updateQuantityRules();
    updateQuantityLabelCartCount(quantityVariantInCart);
    if (!currentVariant) {
      hidePrice();
      updateSwatches();
      return;
    }
    setCurrentVariant(currentVariant.id);
    updatePrice();
    updateImage();
    updateSwatches();
  }
  function getSettings(element) {
    try {
      return JSON.parse(element.textContent);
    } catch {
      return null;
    }
  }
  function getCurrentVariant() {
    if (!variants.length || !hiddenSelect) {
      return null;
    }
    return variants.find((variant) => variant.id === +hiddenSelect.value);
  }
  function getCurrentVariantFromOptions(checkedOptions) {
    if (!variants.length || !hiddenSelect || !checkedOptions.length) {
      return null;
    }
    const selector = checkedOptions.reduce(
      (previousValue, currentOption) => previousValue + `[data-${currentOption.dataset.option}="${currentOption.value.replaceAll('"', '\\"')}"]`,
      ""
    );
    const hiddenSelectSelectedOption = hiddenSelect.querySelector(selector);
    if (!hiddenSelectSelectedOption) {
      return null;
    }
    return variants.find((variant) => variant.id === +hiddenSelectSelectedOption.value);
  }
  function setCurrentVariant(variantId) {
    if (!variantId || !hiddenSelect) {
      return;
    }
    hiddenSelect.value = variantId;
  }
  function updateSwatchLabelName(variant, container2) {
    const swatchNameEl = container2.querySelector(".js-swatch-label-name");
    if (!swatchNameEl) {
      return;
    }
    if (!variant) {
      const swatchPosition = swatchNameEl.getAttribute("data-swatch-position");
      const swatchOptionSelected = container2.querySelector(`[data-option='option${swatchPosition}']:checked`);
      if (swatchOptionSelected) {
        swatchNameEl.textContent = swatchOptionSelected.value;
      }
      return;
    }
    const optionPosition = swatchNameEl.getAttribute("data-swatch-position");
    const optionLabel = "option" + optionPosition;
    const optionName = variant[optionLabel];
    if (!optionName) {
      return;
    }
    swatchNameEl.textContent = optionName;
  }
  function updateImage() {
    if (!currentVariant || !currentVariant.featured_media || !slider || !sliderEl) {
      return;
    }
    const featuredImage = sliderEl.querySelector(`[data-img-id="${currentVariant.featured_media.id}"]`);
    if (!featuredImage) {
      return;
    }
    const slideIndex = featuredImage.closest(`[data-slide-index]`).getAttribute("data-slide-index");
    slider.slideTo(slideIndex);
  }
  function updateButtons() {
    if (!formButton || !productLink) {
      return;
    }
    if (!currentVariant) {
      formButton.innerText = buttonContent.unavailable;
      formButton.disabled = true;
      return;
    }
    let isPreorder = formButton.hasAttribute("data-preorder");
    let addToCartText = isPreorder ? buttonContent.preOrder : buttonContent.addToCard;
    formButton.innerText = currentVariant.available ? addToCartText : buttonContent.soldOut;
    formButton.disabled = !currentVariant.available;
    const url = new URL(productLink.href);
    url.searchParams.set("variant", currentVariant.id);
    productLink.href = url.pathname + url.search;
  }
  async function updatePrice() {
    const url = getProductUrl(productHandle, currentVariant.id, "price").toString();
    if (!url) {
      return;
    }
    const fetchPrice = await getHTML(url, selectors2.fetchPrice);
    if (!fetchPrice) {
      return;
    }
    price.forEach((priceElement) => priceElement.innerHTML = fetchPrice.outerHTML);
  }
  function hidePrice() {
    price.forEach((priceElement) => priceElement.innerHTML = "");
  }
  function updateSwatches() {
    swatches.forEach((swatch) => {
      const optionIndex = +swatch.dataset.option.replace("option", "");
      const optionValue = swatch.value;
      const label = swatch.nextElementSibling;
      if (label) {
        label.classList.toggle(cssClasses2.disabled, !isSwatchAvailable(optionIndex, optionValue));
      }
    });
  }
  function updateSku() {
    if (!skuElements.length)
      return;
    const { sku } = currentVariant;
    skuElements.forEach((element) => {
      const skuText = element.dataset.skuText;
      if (!sku) {
        element.classList.add(window.themeCore.utils.cssClasses.hidden);
        return;
      }
      element.classList.remove(window.themeCore.utils.cssClasses.hidden);
      element.innerHTML = skuText ? skuText.replaceAll("{SKU}", sku).replaceAll("{sku}", sku) : sku;
    });
  }
  function isSwatchAvailable(optionIndex, optionValue) {
    if (!optionIndex || !optionValue) {
      return;
    }
    let options = [];
    if (currentVariant) {
      options = [currentVariant.option1, currentVariant.option2, currentVariant.option3];
    } else {
      const formData = new FormData(form);
      options = [formData.get("option1"), formData.get("option2"), formData.get("option3")];
    }
    options[optionIndex - 1] = optionValue;
    options = options.map((option, index) => index > optionIndex - 1 ? void 0 : option);
    const variantsWithThisOptionValue = variants.filter(
      (variant) => options.every((option, index) => typeof option === "undefined" || option === variant[`option${index + 1}`])
    );
    return variantsWithThisOptionValue.some((variant) => variant.available);
  }
  async function formSubmitHandler(event) {
    const form2 = event.target.closest(selectors2.form);
    const formData = form2 && new FormData(form2);
    if (!formData) {
      return;
    }
    event.preventDefault();
    const errorMessage = await addToCart();
    changeErrorMessage(errorMessage);
    if (errorMessage) {
      return;
    }
    const loader = document.querySelector(selectors2.loader);
    if (loader) {
      loader.remove();
    }
    if (window.themeCore.objects.settings.show_cart_notification || window.themeCore.objects.settings.cart_type === "page") {
      window.themeCore.EventBus.emit(`Toggle:quick-view:close`);
      window.themeCore.EventBus.emit(`Overlay:quick-view:close`);
    }
    window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART);
  }
  function changeErrorMessage(message = "") {
    formError.innerText = message;
  }
  function updateVolumePricing(quantity2) {
    const currentVariantEl = container.querySelector("[name=id]");
    if (!currentVariantEl) {
      return;
    }
    const volumePricing = container.querySelector(selectors2.volumePricing);
    const volumePricingList = container.querySelector(selectors2.volumePricingList);
    const volumePricingJSONEl = container.querySelector(selectors2.volumePricingJSON);
    let quantityBreaks = null;
    if (!volumePricingJSONEl || !volumePricing) {
      return;
    }
    if (currentVariant) {
      const volumePricingJSON = JSON.parse(volumePricingJSONEl.innerHTML);
      quantityBreaks = volumePricingJSON[currentVariant.id].quantity_price_breaks;
      updateVariantVolumePrice(quantityBreaks);
      if (quantityBreaks.length) {
        renderVolumePriceList(quantityBreaks);
        volumePricing.classList.remove(cssClasses2.hidden);
      } else {
        volumePricing.classList.add(cssClasses2.hidden);
      }
    } else {
      volumePricing.classList.add(cssClasses2.hidden);
    }
    function renderVolumePriceList(quantityBreaks2) {
      if (!currentVariant) {
        return;
      }
      if (Number(volumePricingList.dataset.variant) === currentVariant.id) {
        return;
      }
      volumePricingList.dataset.variant = currentVariant.id;
      const showMoreBtn = container.querySelector(selectors2.volumePricingShowMore);
      const moneyFormat2 = window.themeCore.objects.shop.money_with_currency_format;
      const priceTranslation = window.themeCore.translations.get("products.product.volume_pricing.each", {
        price: window.themeCore.utils.formatMoney(currentVariant.price, moneyFormat2)
      });
      showMoreBtn.addEventListener("click", function(e) {
        e.preventDefault();
        let listHiddenItems = volumePricingList.querySelectorAll(".is-hidden");
        if (!listHiddenItems.length) {
          return;
        }
        listHiddenItems.forEach(function(listItem) {
          listItem.classList.remove(cssClasses2.hidden);
        });
        showMoreBtn.classList.add(cssClasses2.hidden);
      });
      volumePricingList.innerHTML = "";
      let defaultMinPriceHTML = `
				<li class="product-volume-pricing__list-item">
					<span>${currentVariant.quantity_rule.min}<span aria-hidden>+</span></span>
					<span>${priceTranslation}</span>
				</li>
			`;
      volumePricingList.insertAdjacentHTML("beforeend", defaultMinPriceHTML);
      quantityBreaks2.forEach(function(quantityBreak, i) {
        let hiddenClass = i >= 2 ? `${cssClasses2.hidden}` : "";
        let quantityBreakHTML = `
					<li class="product-volume-pricing__list-item ${hiddenClass}">
						<span>${quantityBreak.minimum_quantity}<span aria-hidden>+</span></span>
						<span>${quantityBreak.price_each}</span>
					</li>
				`;
        volumePricingList.insertAdjacentHTML("beforeend", quantityBreakHTML);
      });
      if (quantityBreaks2.length >= 3) {
        showMoreBtn.classList.remove(cssClasses2.hidden);
      } else {
        showMoreBtn.classList.add(cssClasses2.hidden);
      }
    }
    function updateVariantVolumePrice(quantityBreaks2) {
      const priceEls = container.querySelectorAll(selectors2.priceVolume);
      const moneyFormat2 = window.themeCore.objects.shop.money_with_currency_format;
      const priceTranslation = window.themeCore.translations.get("products.product.volume_pricing.price_at_each", {
        price: window.themeCore.utils.formatMoney(currentVariant.price, moneyFormat2)
      });
      if (!priceEls.length) {
        return;
      }
      if (!currentVariant) {
        priceEls.forEach((el) => el.classList.add(cssClasses2.hidden));
        return;
      }
      if (!quantityBreaks2 || !quantityBreaks2.length) {
        priceEls.forEach((el) => el.innerHTML = priceTranslation);
        priceEls.forEach((el) => el.classList.remove(cssClasses2.hidden));
        return;
      }
      const currentBreak = quantityBreaks2.findLast((qtyBreak) => {
        return Number(quantity2) + Number(quantityWidgetEl.quantity.value) >= qtyBreak.minimum_quantity;
      });
      if (!currentBreak) {
        priceEls.forEach((el) => el.innerHTML = priceTranslation);
        priceEls.forEach((el) => el.classList.remove(cssClasses2.hidden));
        return;
      }
      priceEls.forEach((el) => el.innerHTML = currentBreak.price_at_each);
      priceEls.forEach((el) => el.classList.remove(cssClasses2.hidden));
    }
  }
  function updateQuantityRules() {
    const quantityRules = container.querySelector(selectors2.quantityRules);
    if (!quantityRules) {
      return;
    }
    if (!currentVariant || currentVariant && !currentVariant.quantity_rule) {
      quantityRules.classList.add(cssClasses2.hidden);
      return;
    } else {
      quantityRules.classList.remove(cssClasses2.hidden);
    }
    const variantQuantityRules = currentVariant.quantity_rule;
    const quantityRuleIncrement = quantityRules.querySelector(selectors2.quantityRuleIncrement);
    const quantityRuleMin = quantityRules.querySelector(selectors2.quantityRuleMin);
    const quantityRuleMax = quantityRules.querySelector(selectors2.quantityRuleMax);
    const quantityRuleIncrementVal = quantityRules.querySelector(selectors2.quantityRuleIncrementVal);
    const quantityRuleMinVal = quantityRules.querySelector(selectors2.quantityRuleMinVal);
    const quantityRuleMaxVal = quantityRules.querySelector(selectors2.quantityRuleMaxVal);
    if (quantityRuleIncrementVal) {
      quantityRuleIncrementVal.textContent = window.themeCore.translations.get("products.product.increments_of", { number: variantQuantityRules.increment });
      quantityWidgetEl.setIncrement(variantQuantityRules.increment);
      variantQuantityRules.increment > 1 ? quantityRuleIncrement.classList.remove(cssClasses2.hidden) : quantityRuleIncrement.classList.add(cssClasses2.hidden);
    }
    if (quantityRuleMinVal) {
      quantityRuleMinVal.textContent = window.themeCore.translations.get("products.product.minimum_of", { number: variantQuantityRules.min });
      quantityWidgetEl.setMin(variantQuantityRules.min);
      quantityWidgetEl.toggleDecrease();
      quantityWidgetEl.toggleIncrease();
      variantQuantityRules.min > 1 ? quantityRuleMin.classList.remove(cssClasses2.hidden) : quantityRuleMin.classList.add(cssClasses2.hidden);
    }
    if (quantityRuleMaxVal) {
      if (variantQuantityRules.max !== null) {
        quantityRuleMaxVal.textContent = window.themeCore.translations.get("products.product.maximum_of", { number: variantQuantityRules.max });
        quantityRuleMax.classList.remove(cssClasses2.hidden);
        quantityWidgetEl.setMax(variantQuantityRules.max);
      } else {
        quantityRuleMaxVal.textContent = "";
        quantityRuleMax.classList.add(cssClasses2.hidden);
        quantityWidgetEl.setMax("");
      }
      quantityWidgetEl.toggleDecrease();
      quantityWidgetEl.toggleIncrease();
    }
    if (variantQuantityRules.increment < 2 && variantQuantityRules.min < 2 && variantQuantityRules.max === null) {
      quantityRules.classList.add(cssClasses2.hidden);
    } else {
      quantityRules.classList.remove(cssClasses2.hidden);
    }
  }
  function updateQuantityLabelCartCount(quantity2) {
    const priceBreaksEl = container.querySelector(selectors2.breaksVal);
    if (!priceBreaksEl) {
      return;
    }
    priceBreaksEl.classList.toggle(cssClasses2.hidden, !quantity2);
    if (!quantity2 || quantity2.value === "0") {
      priceBreaksEl.innerHTML = "";
    }
    priceBreaksEl.innerHTML = window.themeCore.translations.get("products.product.quantity_in_cart", { quantity: quantity2 });
  }
  function getVariantCountInCart() {
    const cartData = window.themeCore.cartObject;
    if (!cartData || !currentVariant) {
      return;
    }
    if (!cartData.items.length) {
      return 0;
    }
    const variant = cartData.items.find(function(item) {
      return item.variant_id === currentVariant.id;
    });
    if (!variant) {
      return 0;
    }
    return variant.quantity;
  }
  async function addToCart() {
    try {
      await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.ADD_TO_CART, {
        id: currentVariant.id,
        quantity: +quantity.value
      });
    } catch (error) {
      return error.description;
    }
  }
  function onProductSliderSlideChange() {
    videos.forEach(({ player }) => {
      try {
        player.pauseVideo();
      } catch (e) {
      }
      try {
        player.pause();
      } catch (e) {
      }
    });
  }
  function initVideos() {
    const slides = [...document.querySelectorAll(selectors2.slide)];
    slides.forEach((slide) => {
      const [video] = Video2({
        videoContainer: slide,
        options: {
          youtube: {
            controls: 1,
            showinfo: 1
          }
        }
      }).init();
      if (video) {
        videos.push(video);
      }
    });
  }
  return Object.freeze({
    init
  });
};
const ScrollDirection = (config = {}) => {
  const extendDefaults2 = window.themeCore.utils.extendDefaults;
  const on2 = window.themeCore.utils.on;
  const throttle2 = window.themeCore.utils.throttle;
  const defaults = {
    threshold: 5,
    throttle: 250,
    start: 100
  };
  const settings = extendDefaults2(defaults, config);
  let previousScrollTop = 0;
  let currentScrollDirection = "";
  let newScrollDirection = "";
  function setEventListeners() {
    on2("scroll", throttle2(handleScrollEvent, settings.throttle));
  }
  function handleScrollEvent() {
    const scrollPosition = window.pageYOffset;
    setScrollState(scrollPosition);
  }
  function setScrollState(scrollPosition) {
    const scrollState = detectScrollDirection(scrollPosition);
    if (typeof scrollState === "undefined") {
      return;
    }
    if (scrollState !== currentScrollDirection) {
      currentScrollDirection = newScrollDirection;
      window.themeCore.EventBus.emit(
        "ScrollDirection:changed",
        newScrollDirection
      );
    }
  }
  function detectScrollDirection(scrollPosition) {
    if (Math.abs(previousScrollTop - scrollPosition) <= settings.threshold) {
      return newScrollDirection;
    }
    if (scrollPosition > previousScrollTop && scrollPosition > settings.start) {
      window.themeCore.EventBus.emit("ScrollDirection:down", "down");
      newScrollDirection = "down";
    } else {
      window.themeCore.EventBus.emit("ScrollDirection:up", "up");
      newScrollDirection = "up";
    }
    if (scrollPosition <= settings.start + 10) {
      window.themeCore.EventBus.emit("ScrollDirection:top", "at-top");
      newScrollDirection = "at-top";
    }
    previousScrollTop = scrollPosition;
    return newScrollDirection;
  }
  function getScrollDirection() {
    return currentScrollDirection;
  }
  return Object.freeze({
    init: setEventListeners,
    get: getScrollDirection
  });
};
const Challenge = () => {
  const selectors2 = {
    form: "main form"
  };
  function addHash() {
    const hash = window.location.hash;
    const form = document.querySelector(selectors2.form);
    if (!hash || !form || hash === "#newsletter-popup-contact-form") {
      return;
    }
    const formURL = new URL(form.action);
    formURL.hash = hash;
    form.action = formURL.toString();
  }
  function isChallenge() {
    return location.pathname === "/challenge";
  }
  function init() {
    if (!isChallenge()) {
      return;
    }
    addHash();
  }
  return Object.freeze({
    init
  });
};
const selectors$2 = {
  form: ".js-localization-form",
  input: "input[name='language_code'], input[name='country_code']",
  button: ".js-disclosure__button",
  panel: ".js-disclosure-list",
  link: ".js-disclosure__link"
};
const attributes$1 = {
  ariaExpanded: "aria-expanded",
  hidden: "hidden"
};
class localizationForm extends HTMLElement {
  constructor() {
    super();
    this.initiated = false;
    this.input = this.querySelector(selectors$2.input);
    this.button = this.querySelector(selectors$2.button);
    this.panel = this.querySelector(selectors$2.panel);
    Object.freeze(this.init());
  }
  init() {
    if (this.initiated) {
      return;
    }
    this.setEventListeners();
    this.initiated = true;
  }
  setEventListeners() {
    const openSelector = this.openSelector.bind(this);
    const closeSelector = this.closeSelector.bind(this);
    const onContainerKeyUp = this.onContainerKeyUp.bind(this);
    const onItemClick = this.onItemClick.bind(this);
    this.addEventListener("click", openSelector);
    this.addEventListener("click", closeSelector);
    this.addEventListener("keyup", onContainerKeyUp);
    this.panel.addEventListener("click", onItemClick);
  }
  hidePanel() {
    let links = this.panel.querySelectorAll(selectors$2.link);
    this.button.setAttribute(attributes$1.ariaExpanded, "false");
    this.panel.setAttribute(attributes$1.hidden, "true");
    links.forEach((link) => link.setAttribute("tabindex", -1));
  }
  onContainerKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") {
      return;
    }
    this.hidePanel();
    this.button.focus();
  }
  onItemClick(event) {
    const listItems = event.target.closest(selectors$2.link);
    if (!listItems) {
      return;
    }
    event.preventDefault();
    this.input.value = listItems.dataset.value;
    const form = listItems.closest(selectors$2.form);
    if (!form) {
      return;
    }
    form.submit();
  }
  openSelector() {
    if (this.isPanelActive()) {
      return;
    }
    setTimeout(() => {
      let links = this.panel.querySelectorAll(selectors$2.link);
      this.button.focus();
      this.panel.toggleAttribute(attributes$1.hidden);
      this.button.setAttribute(
        attributes$1.ariaExpanded,
        (this.button.getAttribute(attributes$1.ariaExpanded) === "false").toString()
      );
      links.forEach((link) => link.setAttribute("tabindex", 0));
    }, 0);
  }
  closeSelector(event) {
    if (!this.isPanelActive()) {
      return;
    }
    setTimeout(() => {
      const shouldClose = event.relatedTarget && event.relatedTarget.nodeName === "BUTTON";
      if (event.relatedTarget === null || shouldClose) {
        this.hidePanel();
      }
    }, 0);
  }
  isPanelActive() {
    return !this.panel.hasAttribute(attributes$1.hidden);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  customElements.define("localization-form", localizationForm);
});
const Toggle = (config) => {
  const removeTrapFocus2 = window.themeCore.utils.removeTrapFocus;
  const trapFocus2 = window.themeCore.utils.trapFocus;
  const cssClasses2 = window.themeCore.utils.cssClasses;
  const focusable2 = window.themeCore.utils.focusable;
  const extendDefaults2 = window.themeCore.utils.extendDefaults;
  const isElement2 = window.themeCore.utils.isElement;
  const on2 = window.themeCore.utils.on;
  const bind2 = window.themeCore.utils.bind;
  const overlay2 = window.themeCore.utils.overlay;
  const binder = bind2(document.documentElement, {
    className: "esc-bind"
  });
  let previouslySelectedElement = {};
  const defaults = {
    namespace: config.toggleSelector,
    elementToFocus: null,
    focusInput: true,
    overlay: true,
    scrollLock: true,
    toggleTabIndex: true,
    changeAriaExpanded: true,
    closeAccordionsOnHide: true,
    overlayPlacement: document.body,
    hasFullWidth: false
  };
  const settings = extendDefaults2(defaults, config);
  const namespace = settings.namespace;
  const selectors2 = {
    accordionContainer: ".js-accordion-container",
    quickViewPromotionBanner: ".js-quick-view-promotion-banner"
  };
  const nodeSelectors = {
    toggleSelector: [...document.querySelectorAll(`[data-js-toggle="${config.toggleSelector}"]`)],
    fullWidthSelector: [...document.querySelectorAll(`[data-js-full-width="${config.toggleSelector}"]`)]
  };
  function init(config2 = null) {
    setEventListeners();
    setEventBusListeners(config2);
  }
  function setEventListeners() {
    nodeSelectors.toggleSelector.forEach((element) => {
      const target = document.getElementById(element.dataset.target);
      on2("click", element, (event) => handleToggleEvent(event, target, element));
      if (settings.toggleTabIndex) {
        unsetTabIndexOnTarget(target);
      }
    });
    nodeSelectors.fullWidthSelector.forEach((element) => {
      const target = document.getElementById(element.dataset.target);
      on2("click", element, (event) => handleToggleFullWidth(event, target));
      if (settings.toggleTabIndex) {
        unsetTabIndexOnTarget(target);
      }
    });
    if (binder.isSet()) {
      return;
    }
    on2("keydown", (event) => onEscEvent(event));
    binder.set();
  }
  function setEventBusListeners(config2) {
    const eventBus = window.themeCore && window.themeCore.EventBus && window.themeCore.EventBus.all();
    const isEventListened = eventBus && eventBus[`Toggle:${namespace}:close`];
    if (isEventListened && config2 && config2.once) {
      eventBus[`EscEvent:on`] && window.themeCore.EventBus.remove("EscEvent:on", eventBus[`EscEvent:on`].at(-1));
      eventBus[`Overlay:${namespace}:close`] && window.themeCore.EventBus.remove(`Overlay:${namespace}:close`, eventBus[`Overlay:${namespace}:close`].at(-1));
      eventBus[`Toggle:${namespace}:close`] && window.themeCore.EventBus.remove(`Toggle:${namespace}:close`, eventBus[`Toggle:${namespace}:close`].at(-1));
    }
    window.themeCore.EventBus.listen(["EscEvent:on", `Overlay:${namespace}:close`, `Toggle:${namespace}:close`], (response) => {
      if (typeof response !== "undefined" && response.selector) {
        closeToggleTarget(getTargetOfToggle(response.selector));
        return;
      }
      let quickViewPromotionBanner = document.querySelector(selectors2.quickViewPromotionBanner);
      if (namespace === "quick-view" && quickViewPromotionBanner) {
        window.themeCore.EventBus.emit(`Quick-view:close`);
      }
      closeToggleTarget(getTargetOfToggle(namespace));
    });
  }
  function getTargetOfToggle(selector) {
    const toggleElement = document.querySelector(`[data-js-toggle="${selector}"]`);
    if (toggleElement) {
      return document.getElementById(toggleElement.dataset.target);
    }
  }
  function handleToggleEvent(event, target, toggler) {
    event.preventDefault();
    if (toggler) {
      config.previouslySelectedElement = toggler;
    }
    toggle(target);
  }
  function handleToggleFullWidth(event, target) {
    event.preventDefault();
    toggleFullWidth(target);
  }
  function toggle(target) {
    return isTargetActive(target) ? closeToggleTarget(target) : openToggleTarget(target);
  }
  function toggleFullWidth(target) {
    return isTargetFullWidth(target) ? disableFullWidthTarget(target) : enableFullWidthTarget(target);
  }
  function openToggleTarget(target) {
    target.classList.add(cssClasses2.active);
    document.body.classList.add(cssClasses2.drawerActive);
    document.body.classList.add("scroll-padding-0");
    if (settings.overlay) {
      overlay2({
        namespace,
        overlayPlacement: settings.overlayPlacement
      }).open();
    }
    if (settings.scrollLock) {
      document.body.style.overflow = "hidden";
    }
    window.themeCore.EventBus.emit(`Toggle:${namespace}:open`, target);
    focusTarget(target, settings.elementToFocus);
    if (settings.toggleTabIndex) {
      setTabIndexOnTarget(target);
    }
    if (settings.changeAriaExpanded) {
      let togglers = [...document.querySelectorAll(`[data-target="${target.id}"]`)];
      togglers.forEach((toggler) => {
        setAriaExpanded(toggler);
      });
    }
    binder.set();
  }
  function closeToggleTarget(target) {
    if (!target || !isTargetActive(target)) {
      return;
    }
    target.classList.remove(cssClasses2.active);
    document.body.classList.remove(cssClasses2.drawerActive);
    setTimeout(function() {
      document.body.classList.remove("scroll-padding-0");
    }, 400);
    if (settings.overlay) {
      overlay2({ namespace }).close();
    }
    if (settings.scrollLock) {
      document.body.style.overflow = null;
    }
    window.themeCore.EventBus.emit(`Toggle:${namespace}:close`, target);
    removeFocusTarget();
    if (settings.toggleTabIndex) {
      unsetTabIndexOnTarget(target);
    }
    if (settings.changeAriaExpanded) {
      let togglers = [...document.querySelectorAll(`[data-target="${target.id}"]`)];
      togglers.forEach((toggler) => {
        removeAriaExpanded(toggler);
      });
    }
    if (settings.hasFullWidth && isTargetFullWidth(target)) {
      disableFullWidthTarget(target);
    }
    if (settings.closeAccordionsOnHide) {
      window.themeCore.Accordion.collapseAllItems(`#${target.id} ${selectors2.accordionContainer}`);
    }
    binder.remove();
    const once = target.dataset.modalOnce;
    if (once) {
      target.remove();
    }
  }
  function enableFullWidthTarget(target) {
    target.classList.add(cssClasses2.full);
  }
  function disableFullWidthTarget(target) {
    target.classList.remove(cssClasses2.full);
  }
  function isTargetActive(target) {
    return target.classList.contains(cssClasses2.active);
  }
  function isTargetFullWidth(target) {
    return target.classList.contains(cssClasses2.full);
  }
  function focusTarget(target, elementToFocus) {
    if (!target) {
      return;
    }
    previouslySelectedElement = config.previouslySelectedElement || document.activeElement;
    const focusableElements = focusable2(target, settings);
    trapFocus2(target, { elementToFocus: focusableElements[0] });
    elementToFocus && setTimeout(() => elementToFocus.focus(), 50);
  }
  function removeFocusTarget() {
    if (isElement2(previouslySelectedElement)) {
      window.setTimeout(() => previouslySelectedElement.focus(), 0);
    }
    removeTrapFocus2();
  }
  function setAriaExpanded(toggler) {
    toggler.setAttribute("aria-expanded", true);
  }
  function removeAriaExpanded(toggler) {
    toggler.setAttribute("aria-expanded", false);
  }
  function unsetTabIndexOnTarget(target) {
    focusable2(target, settings).forEach((element) => {
      if (!element.closest(".js-accordion-inner")) {
        element.setAttribute("tabindex", -1);
      }
    });
  }
  function setTabIndexOnTarget(target) {
    focusable2(target, settings).forEach((element) => {
      if (!element.closest(".js-accordion-inner")) {
        element.setAttribute("tabindex", 0);
      }
    });
  }
  function onEscEvent(event) {
    if (!isKeyPressIsEsc(event) || !binder.isSet()) {
      return;
    }
    window.themeCore.EventBus.emit("EscEvent:on");
    binder.remove();
  }
  function isKeyPressIsEsc(event) {
    return event.keyCode === 27;
  }
  return Object.freeze({
    init,
    open: openToggleTarget,
    close: closeToggleTarget
  });
};
const Timer = (timerContainer) => {
  const classes = window.themeCore.utils.cssClasses;
  const selectors2 = {
    settings: ".js-timer-settings",
    daysHundreds: ".js-timer-days-hundreds",
    daysDozens: ".js-timer-days-dozens",
    daysUnits: ".js-timer-days-units",
    hoursDozens: ".js-timer-hours-dozens",
    hoursUnits: ".js-timer-hours-units",
    minutesDozens: ".js-timer-minutes-dozens",
    minutesUnits: ".js-timer-minutes-units",
    secondsDozens: ".js-timer-seconds-dozens",
    secondsUnits: ".js-timer-seconds-units"
  };
  const DATE_VALUES = {
    day: 1e3 * 60 * 60 * 24,
    hour: 1e3 * 60 * 60,
    minute: 1e3 * 60,
    second: 1e3
  };
  const settings = getSettings();
  let nodes = {};
  function getSettings() {
    try {
      return JSON.parse(
        timerContainer.querySelector(selectors2.settings).textContent
      );
    } catch {
      return null;
    }
  }
  function getNodes() {
    return {
      daysHundreds: timerContainer.querySelector(selectors2.daysHundreds),
      daysDozens: timerContainer.querySelector(selectors2.daysDozens),
      daysUnits: timerContainer.querySelector(selectors2.daysUnits),
      hoursDozens: timerContainer.querySelector(selectors2.hoursDozens),
      hoursUnits: timerContainer.querySelector(selectors2.hoursUnits),
      minuteDozens: timerContainer.querySelector(selectors2.minutesDozens),
      minuteUnits: timerContainer.querySelector(selectors2.minutesUnits),
      secondsDozens: timerContainer.querySelector(
        selectors2.secondsDozens
      ),
      secondsUnits: timerContainer.querySelector(selectors2.secondsUnits)
    };
  }
  function setCountDownTimer({ year, month, day, hour, minutes, timezone }) {
    const timezoneDifference = Number(timezone);
    const finalHour = +hour - timezoneDifference;
    const countDownDate = new Date(
      Date.UTC(year, month, day, finalHour, minutes || 0)
    );
    const interval = setInterval(() => {
      timerTick(countDownDate, interval);
    }, DATE_VALUES.second);
  }
  function timerTick(countDownDate, interval) {
    const now = (/* @__PURE__ */ new Date()).getTime();
    const distance = countDownDate - now;
    if (distance <= 0) {
      clearInterval(interval);
      return;
    }
    const dateToInner = getDateToInner(distance);
    changeTimerMarkup(dateToInner);
  }
  function getDateToInner(distance) {
    const days = Math.floor(distance / DATE_VALUES.day);
    const hours = Math.floor(
      distance % DATE_VALUES.day / DATE_VALUES.hour
    );
    const minutes = Math.floor(
      distance % DATE_VALUES.hour / DATE_VALUES.minute
    );
    const seconds = Math.floor(
      distance % DATE_VALUES.minute / DATE_VALUES.second
    );
    return getDateAsTimer(days, hours, minutes, seconds);
  }
  function getDateAsTimer(days, hours, minutes, seconds) {
    return {
      daysHundreds: days > 99 ? Math.floor(days / 100) : 0,
      daysDozens: days > 99 ? Math.floor(days % 100 / 10) : Math.floor(days / 10),
      daysUnits: days % 10,
      hoursDozens: Math.floor(hours / 10),
      hoursUnits: hours % 10,
      minutesDozens: Math.floor(minutes / 10),
      minutesUnits: minutes % 10,
      secondsDozens: Math.floor(seconds / 10),
      secondsUnits: seconds % 10
    };
  }
  function changeTimerMarkup(dateToRender) {
    if (dateToRender.daysHundreds > 0) {
      nodes.daysHundreds.classList.contains(classes.hidden) && nodes.daysHundreds.classList.remove(classes.hidden);
      nodes.daysHundreds.innerHTML = dateToRender.daysHundreds;
    } else {
      !nodes.daysHundreds.classList.contains(classes.hidden) && nodes.daysHundreds.classList.add(classes.hidden);
    }
    nodes.daysDozens.innerHTML = dateToRender.daysDozens;
    nodes.daysUnits.innerHTML = dateToRender.daysUnits;
    nodes.hoursDozens.innerHTML = dateToRender.hoursDozens;
    nodes.hoursUnits.innerHTML = dateToRender.hoursUnits;
    nodes.minuteDozens.innerHTML = dateToRender.minutesDozens;
    nodes.minuteUnits.innerHTML = dateToRender.minutesUnits;
    nodes.secondsDozens.innerHTML = dateToRender.secondsDozens;
    nodes.secondsUnits.innerHTML = dateToRender.secondsUnits;
  }
  function init() {
    if (settings) {
      nodes = getNodes();
      setCountDownTimer(settings);
    }
  }
  return Object.freeze({
    init
  });
};
function arrayIncludes(array1, array2) {
  return array2.every((v) => array1.includes(v));
}
function extendDefaults(defaults, properties) {
  if (!defaults || !properties) {
    throw new Error("Invalid number of arguments, expected 2 ");
  }
  for (const property in properties) {
    if (property !== "undefined" && typeof properties[property] !== "undefined") {
      defaults[property] = properties[property];
    }
  }
  return defaults;
}
function formToJSON(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}
function convertFormData(data) {
  let obj = {};
  for (let [key, value] of data) {
    if (obj[key] !== void 0) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
function on(event, element = window, callback, capture = false) {
  if (typeof element === "string") {
    document.querySelector(element).addEventListener(event, callback, capture);
    return;
  }
  if (typeof element === "function") {
    window.addEventListener(event, element);
    return;
  }
  if (element) {
    element.addEventListener(event, callback, capture);
  }
}
function off(event, element = window, callback, capture = false) {
  if (typeof element === "string") {
    document.querySelector(element).removeEventListener(event, callback, capture);
    return;
  }
  if (typeof element === "function") {
    window.removeEventListener(event, element);
    return;
  }
  element.removeEventListener(event, callback, capture);
}
function isElement(element) {
  return element instanceof window.Element || element instanceof window.HTMLDocument;
}
function isElementInViewport(viewport, element, bounce = 0) {
  const viewPortBounding = viewport.getBoundingClientRect();
  const elementBounding = element.getBoundingClientRect();
  const viewPortPosition = viewPortBounding.left + viewPortBounding.width;
  const elementPortPosition = elementBounding.left + elementBounding.width;
  const viewPortPositionBottom = viewPortBounding.top + viewPortBounding.height;
  const elementPortPositionBottom = elementBounding.top + elementBounding.height;
  const isElementBoundLeft = () => Math.ceil(elementBounding.left) + bounce >= viewPortBounding.left;
  const isElementBoundRight = () => viewPortPosition + bounce >= elementPortPosition;
  const isElementBoundTop = () => Math.ceil(elementBounding.top) + bounce >= viewPortBounding.top;
  const isElementBoundBottom = () => viewPortPositionBottom + bounce >= elementPortPositionBottom;
  return isElementBoundLeft() && isElementBoundRight() && isElementBoundTop() && isElementBoundBottom();
}
function throttle(callback, wait, immediate = false) {
  let timeout = null;
  let initialCall = true;
  return function(...args) {
    const callNow = immediate && initialCall;
    function next() {
      callback.apply(this, args);
      timeout = null;
    }
    if (callNow) {
      initialCall = false;
      next();
    }
    if (!timeout) {
      timeout = window.setTimeout(next, wait);
    }
  };
}
function debounce(callback, wait, immediate) {
  let timeout = null;
  return function(...args) {
    const later = function() {
      timeout = null;
      if (!immediate) {
        callback.apply(this, args);
      }
    };
    const callNow = immediate && !timeout;
    window.clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) {
      callback.apply(this, args);
    }
  };
}
function parseJSONfromMarkup(node) {
  if (!node || !node.textContent) {
    return null;
  }
  try {
    return JSON.parse(node.textContent);
  } catch {
    return null;
  }
}
const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
};
function handleTabulationOnSlides(slides, activeSlide, selector) {
  slides.forEach((slide) => {
    const elements = slide.querySelectorAll(selector);
    if (!elements.length) {
      return;
    }
    if (slide === activeSlide) {
      elements.forEach((element) => element.setAttribute("tabindex", 0));
      slide.setAttribute("aria-hidden", false);
      return;
    }
    elements.forEach((element) => element.setAttribute("tabindex", -1));
    slide.setAttribute("aria-hidden", true);
  });
}
function handleTabulationOnSlidesWithMultipleVisibleSlides(slides, selector) {
  slides.forEach((slide) => {
    const elements = slide.querySelectorAll(selector);
    if (!elements.length) {
      return;
    }
    if (isInViewport(slide)) {
      elements.forEach((element) => element.setAttribute("tabindex", 0));
      slide.setAttribute("aria-hidden", false);
      return;
    }
    elements.forEach((element) => element.setAttribute("tabindex", -1));
    slide.setAttribute("aria-hidden", true);
  });
}
function forceFocus(element, options) {
  options = options || {};
  let savedTabIndex = element.tabIndex;
  element.tabIndex = -1;
  element.dataset.tabIndex = savedTabIndex;
  element.focus();
  if (typeof options.className !== "undefined") {
    element.classList.add(options.className);
  }
  element.addEventListener("blur", callback);
  function callback(event) {
    event.target.removeEventListener(event.type, callback);
    element.tabIndex = savedTabIndex;
    delete element.dataset.tabIndex;
    if (typeof options.className !== "undefined") {
      element.classList.remove(options.className);
    }
  }
}
function focusable$1(container) {
  let elements = Array.prototype.slice.call(
    container.querySelectorAll(
      "[tabindex],[draggable],a[href],area,button:enabled,input:not([type=hidden]):enabled,object,select:enabled,textarea:enabled,iframe,video "
    )
  );
  return elements.filter(function(element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  });
}
let trapFocusHandlers = {};
function trapFocus(container, options) {
  options = options || {};
  let elements = focusable$1(container);
  let elementToFocus = options.elementToFocus || container;
  let first = elements[0];
  let last = elements[elements.length - 1];
  removeTrapFocus();
  trapFocusHandlers.focusin = function(event) {
    elements = focusable$1(container);
    first = elements[0];
    last = elements[elements.length - 1];
    if (container !== event.target && !container.contains(event.target) && !event.target.contains(container)) {
      first.focus();
    }
    if (event.target !== container && event.target !== last && event.target !== first)
      return;
    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.focusout = function() {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.keydown = function(event) {
    if (event.keyCode !== 9)
      return;
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }
    if ((event.target === container || event.target === first) && event.shiftKey) {
      event.preventDefault();
      last.focus();
    }
  };
  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);
  forceFocus(elementToFocus, options);
}
function removeTrapFocus() {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);
}
function transformLineItemProps(initialObject) {
  const transformedObject = {};
  for (const [key, value] of Object.entries(initialObject)) {
    if (key.startsWith("properties[")) {
      let isEmptyArray = false;
      if (typeof value === "object") {
        isEmptyArray = value.every((item) => !item.length);
      }
      if (value && !isEmptyArray) {
        const nestedKey = key.split("[")[1].split("]")[0];
        if (!transformedObject["properties"]) {
          transformedObject["properties"] = {};
        }
        transformedObject["properties"][nestedKey] = value;
      }
    } else {
      transformedObject[key] = value;
    }
  }
  return transformedObject;
}
const overlay = (config) => {
  const defaults = {
    namespace: "overlay",
    container: "window-overlay",
    overlayPlacement: document.body
  };
  const settings = extendDefaults(defaults, config || defaults);
  window.themeCore = window.themeCore || {};
  window.themeCore.EventBus = window.themeCore.EventBus || EventBus();
  function constructOverlay(isLoader) {
    const element = document.createElement("div");
    element.classList.add(settings.container);
    element.setAttribute("data-js-overlay", settings.namespace);
    element.setAttribute("data-js-window", "overlay");
    if (isLoader) {
      const loader = document.createElement("div");
      loader.classList.add("loader");
      element.append(loader);
    }
    return element;
  }
  function getOverlay(namespace) {
    if (namespace) {
      return document.querySelector(`[data-js-overlay="${namespace}"]`);
    }
    return document.querySelector(`[data-js-window="overlay"]`);
  }
  function updateOverlay() {
    const overlay2 = document.querySelector(`[data-js-window="overlay"]`);
    const currentOverlay = overlay2.getAttribute("data-js-overlay");
    if (currentOverlay !== settings.namespace) {
      overlay2.setAttribute("data-js-overlay", settings.namespace);
      window.themeCore.EventBus.emit(`Toggle:${currentOverlay}:close`);
      setCloseEvents();
      return true;
    }
    return true;
  }
  function open(isLoader) {
    if (getOverlay()) {
      updateOverlay();
      return;
    }
    render(isLoader);
    setCloseEvents();
  }
  function close() {
    if (!getOverlay()) {
      return;
    }
    remove();
  }
  function render(isOverlay) {
    const windowOverlay = constructOverlay(isOverlay);
    settings.overlayPlacement.appendChild(windowOverlay);
    window.setTimeout(
      () => windowOverlay.classList.add(cssClasses.active),
      1
    );
    window.themeCore.EventBus.emit(`Overlay:${settings.namespace}:open`);
  }
  function remove() {
    on("transitionend", getOverlay(), () => {
      if (getOverlay()) {
        getOverlay().remove();
      }
    });
    if (getOverlay(settings.namespace)) {
      getOverlay(settings.namespace).classList.remove(cssClasses.active);
    }
  }
  function setCloseEvents() {
    on("click", getOverlay(settings.namespace), () => handleClickEvent());
  }
  document.addEventListener("shopify:section:load", () => {
    on("click", getOverlay(settings.namespace), () => handleClickEvent());
  });
  function handleClickEvent() {
    window.themeCore.EventBus.emit(`Overlay:${settings.namespace}:close`, {
      selector: settings.namespace,
      target: document.getElementById(settings.namespace)
    });
    close();
  }
  return Object.freeze({
    open,
    close
  });
};
function images() {
  function generateSrc(src, size) {
    if (!src || !size) {
      return;
    }
    if (!src.includes("https:") && !src.includes("http:")) {
      src = "https:" + src;
    }
    const url = new URL(src);
    url.searchParams.set("width", size);
    return url.toString();
  }
  function generateSrcset(src, size) {
    if (!src || !size) {
      return;
    }
    return generateSrc(src, size) + " 1x, " + generateSrc(src, size * 2) + " 2x";
  }
  return {
    generateSrcset,
    generateSrc
  };
}
const DEFAULT_WIDGET_CONFIG = {
  isDisabledInput: false,
  isReadOnly: false,
  onQuantityChange: () => {
  },
  onIncrease: () => {
  },
  onDecrease: () => {
  },
  onQuantityZero: () => {
  }
};
const selectors$1 = {
  input: "[data-quantity-input]",
  decrease: "[data-quantity-decrease]",
  increase: "[data-quantity-increase]"
};
const attributes = {
  readonly: "readonly",
  disabled: "disabled",
  min: "min",
  max: "max",
  step: "step"
};
const QuantityWidget = (item, widgetConfig = {}) => {
  const classes = window.themeCore.utils.cssClasses;
  const on2 = window.themeCore.utils.on;
  if (!item) {
    throw new Error(`Quantity Widget::Error::Required parameter 'item' missing!`);
  }
  const config = {
    ...DEFAULT_WIDGET_CONFIG,
    ...widgetConfig
  };
  const quantity = {
    value: null,
    minValue: null,
    maxValue: null,
    step: null,
    previewsValue: null,
    initialValue: null
  };
  const controls = {
    input: null,
    decreaseBtn: null,
    increaseBtn: null
  };
  let widget = {};
  function init() {
    controls.input = item.querySelector(selectors$1.input);
    controls.decreaseBtn = item.querySelector(selectors$1.decrease);
    controls.increaseBtn = item.querySelector(selectors$1.increase);
    if (!controls.input || !controls.decreaseBtn || !controls.increaseBtn) {
      return null;
    }
    const elMin = Number(controls.input.getAttribute(attributes.min));
    const elMax = Number(controls.input.getAttribute(attributes.max));
    const elStep = Number(controls.input.getAttribute(attributes.step));
    quantity.value = Number(controls.input.value || 0);
    quantity.minValue = elMin > 0 ? elMin : 0;
    quantity.maxValue = elMax > 0 ? elMax : Infinity;
    quantity.step = elStep || 1;
    quantity.initialValue = quantity.value;
    quantity.previewsValue = quantity.initialValue;
    if (config.isReadOnly || config.isDisabledInput) {
      controls.input.setAttribute(attributes.readonly, "");
    }
    if (config.isReadOnly) {
      controls.decreaseBtn.setAttribute(attributes.disabled, "");
      controls.increaseBtn.setAttribute(attributes.disabled, "");
      controls.increaseBtn.classList.add(classes.disabled);
      controls.decreaseBtn.classList.add(classes.disabled);
    } else {
      if (quantity.value === quantity.minValue) {
        controls.decreaseBtn.setAttribute(attributes.disabled, "");
        controls.decreaseBtn.classList.add(classes.disabled);
      }
      if (quantity.value === quantity.maxValue) {
        controls.increaseBtn.setAttribute(attributes.disabled, "");
        controls.increaseBtn.classList.add(classes.disabled);
      }
      initEventListeners();
    }
    widget = {
      widget: item,
      controls,
      config,
      quantity,
      increase,
      decrease,
      setValue,
      setMin,
      setMax,
      setIncrement,
      toggleIncrease,
      toggleDecrease,
      rollbackValue,
      dispatch
    };
    return widget;
  }
  function initEventListeners() {
    on2("click", item, onChangeQuantityClick);
    if (!config.isDisabledInput) {
      on2("change", controls.input, onQuantityInput);
    }
  }
  function decrease() {
    resetDisabled();
    quantity.previewsValue = quantity.value;
    if (quantity.value > quantity.minValue) {
      let newVal = quantity.value - Number(quantity.step);
      if (newVal % quantity.step) {
        newVal = Math.max(newVal - newVal % quantity.step, quantity.minValue);
      }
      quantity.value = newVal;
    } else {
      quantity.value = quantity.minValue;
      controls.decreaseBtn.setAttribute(attributes.disabled, "");
      controls.decreaseBtn.classList.add(classes.disabled);
    }
    setInputValue(quantity.value);
    return quantity.value;
  }
  function increase() {
    resetDisabled();
    quantity.previewsValue = quantity.value;
    if (quantity.maxValue && quantity.value >= quantity.maxValue) {
      quantity.value = quantity.maxValue;
      controls.increaseBtn.setAttribute(attributes.disabled, "");
      controls.increaseBtn.classList.add(classes.disabled);
    } else {
      let newVal = Number(quantity.value) + Number(quantity.step);
      if (newVal % quantity.step) {
        newVal = newVal - newVal % quantity.step;
      }
      quantity.value = newVal;
    }
    setInputValue(quantity.value);
    return quantity.value;
  }
  function resetDisabled() {
    if (config.isReadOnly) {
      return;
    }
    controls.increaseBtn.removeAttribute(attributes.disabled);
    controls.decreaseBtn.removeAttribute(attributes.disabled);
    controls.increaseBtn.classList.remove(classes.disabled);
    controls.decreaseBtn.classList.remove(classes.disabled);
  }
  function setValue(value) {
    let newValue = value;
    if (quantity.maxValue && value >= quantity.maxValue) {
      newValue = quantity.maxValue;
    }
    if (value < quantity.minValue) {
      newValue = quantity.minValue;
    }
    if (newValue % quantity.step) {
      newValue = newValue - newValue % quantity.step;
    }
    quantity.previewsValue = quantity.value;
    quantity.value = newValue;
    setInputValue(quantity.value);
    return quantity.value;
  }
  function setMin(value) {
    controls.input.setAttribute("min", value);
    quantity.minValue = value;
    if (quantity.value < value) {
      setValue(value);
    }
  }
  function setMax(value) {
    controls.input.setAttribute("max", value);
    quantity.maxValue = value || Infinity;
    if (quantity.value > (value || Infinity)) {
      setValue(value);
    }
  }
  function setIncrement(value) {
    controls.input.setAttribute("step", value);
    quantity.step = value;
    if (quantity.value % value) {
      setValue(quantity.value - quantity.value % value);
    }
  }
  function rollbackValue() {
    if (!quantity.previewsValue) {
      return;
    }
    const prev = quantity.previewsValue;
    quantity.value = prev;
    setInputValue(quantity.value);
    return quantity.value;
  }
  function setInputValue(value) {
    controls.input.value = value;
  }
  function toggleIncrease() {
    controls.increaseBtn.classList.toggle(classes.disabled, quantity.value >= quantity.maxValue);
    controls.increaseBtn.toggleAttribute("disabled", quantity.value >= quantity.maxValue);
  }
  function toggleDecrease() {
    controls.decreaseBtn.classList.toggle(classes.disabled, quantity.value <= quantity.minValue && quantity.minValue !== null);
    controls.decreaseBtn.toggleAttribute("disabled", quantity.value <= quantity.minValue && quantity.minValue !== null);
  }
  function dispatch() {
    if (config.onQuantityChange && typeof config.onQuantityChange === "function") {
      config.onQuantityChange(widget);
    }
    if (quantity.value === 0 && config.onQuantityZero && typeof config.onQuantityZero === "function") {
      config.onQuantityZero(widget);
    }
  }
  function onChangeQuantityClick(event) {
    const isIncrease = event.target.closest(selectors$1.increase);
    const isDecrease = event.target.closest(selectors$1.decrease);
    if (!isIncrease && !isDecrease) {
      return;
    }
    event.preventDefault();
    if (isDecrease) {
      decrease();
      if (config.onDecrease && typeof config.onDecrease === "function") {
        config.onDecrease(widget);
      }
    }
    if (isIncrease) {
      increase();
      if (config.onIncrease && typeof config.onIncrease === "function") {
        config.onIncrease(widget);
      }
    }
    toggleIncrease();
    toggleDecrease();
    dispatch();
    controls.input.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function onQuantityInput(event) {
    quantity.value = Number(event.target.value || 0);
    if (quantity.maxValue < quantity.value && quantity.maxValue !== null) {
      quantity.previewsValue = quantity.value;
      quantity.value = quantity.maxValue;
    }
    if (quantity.minValue > quantity.value) {
      quantity.previewsValue = quantity.value;
      quantity.value = quantity.minValue;
    }
    if (quantity.value % quantity.step) {
      quantity.previewsValue = quantity.value;
      quantity.value = quantity.value - quantity.value % quantity.step;
    }
    setInputValue(quantity.value);
    toggleIncrease();
    toggleDecrease();
    dispatch();
  }
  return Object.freeze({
    init
  });
};
const DEFAULT_CONFIG = {
  onFormSubmit: () => {
  }
};
const CartUpsell = (section, config = DEFAULT_CONFIG) => {
  const on2 = window.themeCore.utils.on;
  const Accordion2 = window.themeCore.Accordion;
  const cssClasses2 = window.themeCore.utils.cssClasses;
  const selectors2 = {
    block: "[data-cart-upsell-block]",
    blockById: (id) => `[data-cart-upsell-block="${id}"]`,
    container: ".js-cart-upsell-container",
    header: ".js-cart-upsell-header",
    body: ".js-cart-upsell-body",
    form: "[data-cart-upsell]"
  };
  const attributes2 = {
    expanded: "aria-expanded",
    style: "style"
  };
  let blocks = [];
  let items = [];
  function init() {
    if (!section) {
      return false;
    }
    Accordion2.init();
    blocks = section.querySelectorAll(selectors2.block);
    items = [...blocks].map((block) => {
      const container = block.querySelector(selectors2.container);
      const header = block.querySelector(selectors2.header);
      const body = block.querySelector(selectors2.body);
      const forms = block.querySelectorAll(selectors2.form);
      forms.forEach((form) => {
        on2("submit", form, config.onFormSubmit);
      });
      return {
        block,
        id: block.dataset.cartUpsellBlock,
        container,
        header,
        body,
        forms
      };
    });
    return {
      container: section,
      items,
      refresh
    };
  }
  function refresh(section2) {
    if (!section2) {
      return null;
    }
    items.forEach((item) => {
      const block = section2.querySelector(selectors2.blockById(item.id));
      if (!block) {
        return;
      }
      const container = block.querySelector(selectors2.container);
      const header = block.querySelector(selectors2.header);
      const body = block.querySelector(selectors2.body);
      container && container.classList.toggle(cssClasses2.active, item.container.classList.contains(cssClasses2.active));
      header && header.setAttribute(attributes2.expanded, item.header.getAttribute(attributes2.expanded));
      body && body.setAttribute(attributes2.style, item.body.getAttribute(attributes2.style));
    });
    return section2.innerHTML;
  }
  return Object.freeze({
    init
  });
};
const Preloder = (section) => {
  const globalClasses = window.themeCore.utils.cssClasses;
  const selectors2 = {
    preloader: ".js-preloader"
  };
  const PRELOADER_DELAY = 300;
  let isShowed = false;
  let preloader = null;
  function init() {
    if (!section || !(preloader = section.querySelector(selectors2.preloader))) {
      return null;
    }
    return {
      el: preloader,
      isShowed,
      show,
      hide
    };
  }
  function show() {
    if (!preloader) {
      return;
    }
    preloader.classList.add(globalClasses.active);
  }
  function hide() {
    if (!preloader) {
      return;
    }
    setTimeout(() => {
      preloader.classList.remove(globalClasses.active);
    }, PRELOADER_DELAY);
  }
  return Object.freeze({
    init
  });
};
const ShareButton = () => {
  const selectors2 = {
    shareButton: ".js-social-share"
  };
  function init() {
    let shareButtons = document.querySelectorAll(selectors2.shareButton);
    if (!shareButtons.length) {
      return;
    }
    shareButtons.forEach((button) => {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        const shareTitle = button.getAttribute("data-share-title") || document.title;
        const shareURL = button.getAttribute("data-share-url") || document.location.href;
        if (navigator.share) {
          navigator.share({ url: shareURL, title: shareTitle });
        } else {
          const fallBackInputSelector = button.getAttribute("data-input-fallback");
          const inputCopyText = document.getElementById(fallBackInputSelector);
          const tooltip = button.querySelector(".js-share-tooltip");
          if (!inputCopyText) {
            return;
          }
          inputCopyText.select();
          inputCopyText.setSelectionRange(0, 99999);
          navigator.clipboard.writeText(inputCopyText.value);
          if (tooltip) {
            button.classList.add("is-active");
            setTimeout(() => {
              button.classList.remove("is-active");
            }, 1500);
          }
        }
      });
    });
  }
  return Object.freeze({
    init
  });
};
function focusable(container, config = {}) {
  if (!container) {
    throw new Error("Could not find container");
  }
  const defaults = [
    "[tabindex]:not([type=range])",
    "[draggable]",
    "a[href]",
    "area",
    "button:enabled",
    "input:not([type=range]):not([type=hidden]):enabled",
    "object",
    "select:enabled",
    "textarea:enabled"
  ];
  if (config && config.include && config.include.length) {
    config.include.forEach((selector) => defaults.push(selector));
  }
  const elements = [...container.querySelectorAll(defaults.join())];
  const focusableElements = elements.filter((element) => {
    return Boolean(
      element.offsetWidth || element.offsetHeight || element.getClientRects().length
    );
  });
  if (config && config.exclude && config.exclude.length) {
    const exclusionList = [
      ...container.querySelectorAll(config.exclude.join())
    ];
    return focusableElements.filter((element) => {
      return !exclusionList.includes(element);
    });
  }
  return focusableElements;
}
function updateTabindexOnElement(container, tabindex = 0) {
  const focusableElements = focusable(container);
  focusableElements.forEach((element) => {
    element.setAttribute("tabindex", tabindex);
  });
}
const arrowRight = `
	<svg class="icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
		<path fill-rule="evenodd" clip-rule="evenodd" d="M9.36899 3.15909L12.8402 6.61591C13.0533 6.82804 13.0533 7.17196 12.8402 7.38409L9.36899 10.8409C9.15598 11.053 8.81061 11.053 8.5976 10.8409C8.38459 10.6288 8.38459 10.2848 8.5976 10.0727L11.1377 7.54318L1.54545 7.54319C1.24421 7.54319 1 7.29999 1 7C1 6.70001 1.24421 6.45681 1.54545 6.45681L11.1377 6.45681L8.5976 3.92728C8.38459 3.71515 8.38459 3.37122 8.5976 3.15909C8.81061 2.94697 9.15598 2.94697 9.36899 3.15909Z"/>
	</svg>
`;
const icons = {
  arrowRight
};
const bind = (element, config) => {
  const defaults = {
    className: "post-init"
  };
  const settings = extendDefaults(defaults, config);
  function set() {
    if (!element.length) {
      element.classList.add(settings.className);
      return;
    }
    [...element].forEach((item) => {
      item.classList.add(settings.className);
    });
  }
  function remove() {
    if (!element.length) {
      element.classList.remove(settings.className);
      return;
    }
    [...element].forEach((item) => {
      item.classList.remove(settings.className);
    });
  }
  function isSet() {
    if (!element.length) {
      return element.classList.contains(settings.className);
    }
    return [...element].every((item) => {
      return item.classList.contains(settings.className);
    });
  }
  return Object.freeze({
    isSet,
    remove,
    set
  });
};
const moneyFormat = "${{amount}}";
function formatMoney(cents, format) {
  if (typeof cents === "string") {
    cents = cents.replace(".", "");
  }
  let value = "";
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || moneyFormat;
  function formatWithDelimiters(number, precision = 2, thousands = ",", decimal = ".") {
    if (isNaN(number) || number == null) {
      return 0;
    }
    number = (number / 100).toFixed(precision);
    const parts = number.split(".");
    const dollarsAmount = parts[0].replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      `$1${thousands}`
    );
    const centsAmount = parts[1] ? decimal + parts[1] : "";
    return dollarsAmount + centsAmount;
  }
  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }
  return formatString.replace(placeholderRegex, value);
}
function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : void 0;
}
function setCookie(name, value, options = {}) {
  options = {
    path: "/",
    ...options
  };
  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }
  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}
function deleteCookie(name) {
  setCookie(name, "", {
    "max-age": -1
  });
}
const CartApi = () => {
  const actions = {
    GET_CART: "getCart",
    ADD_TO_CART: "addItem",
    ADD_TO_CART_MANY: "addItems",
    UPDATE_CART: "update",
    CHANGE_CART_ITEM: "changeItem",
    CHANGE_CART_ITEM_QUANTITY: "changeQuantity",
    REMOVE_CART_ITEM: "removeItem",
    CLEAR_CART: "clear"
  };
  const api = {
    /**
     * Use the GET /{locale}/cart.js endpoint to get the cart as JSON.
     * @return {Object} - Cart object
     * */
    [actions.GET_CART]: async function() {
      return await fetch("/cart.js").then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      }).then((response) => ({
        data: response
      }));
    },
    /**
     * Use the POST /{locale}/cart/add.js endpoint to add one variant to the cart.
     * @param {Object} item - Item {variant, quantity}
     * @param {String} sections - Sections ids
     * @return {Promise} - The response for a successful POST request is a JSON object of the line item associated with the added item.
     * @throws {Error}
     * */
    [actions.ADD_TO_CART]: function(item, sections = "") {
      if (!item) {
        throw new Error(`Cart API::ERROR::'${actions.ADD_TO_CART}' - param 'item' is required!`);
      }
      return this[actions.ADD_TO_CART_MANY]([item], sections);
    },
    /**
     * Use the POST /{locale}/cart/add.js endpoint to add one or multiple variants to the cart.
     * @param {Array} items - Array of items. eg:
     * @param {String} sections - Sections ids
     * @return {Promise} - The response for a successful POST request is a JSON object of the line items associated with the added items.
     * @throws {Error}
     * */
    [actions.ADD_TO_CART_MANY]: function(items = [], sections = "") {
      if (!items || !Array.isArray(items)) {
        throw new Error(`Cart API::ERROR::'${actions.ADD_TO_CART_MANY}' - param 'items' must be an array, current value is ${items}!`);
      }
      return fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: items.map((item) => transformLineItemProps(item)),
          sections
        })
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      }).then((response) => ({
        data: response
      }));
    },
    /**
     * Use the POST /{locale}/cart/update.js endpoint to update the cart's line item quantities, note, or attributes.
     * @param {Object} updates - Updates for cart.
     * @param {String} sections - Sections ids
     * @return {Promise} - The JSON of the cart.
     * @throws {Error}
     * */
    [actions.UPDATE_CART]: function(updates = {}, sections = "") {
      if (!updates) {
        throw new Error(`Cart API::ERROR::'${actions.UPDATE_CART}' - param 'newItem' is required!`);
      }
      return fetch("/cart/update.js", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...updates, sections })
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      }).then((response) => ({
        data: response
      }));
    },
    /**
     * Use the /{locale}/cart/change.js endpoint to change the quantity, properties, and selling_plan properties of a cart line item.
     * @param {Object} newItem - Updates for line item.
     * @param {String} sections - Sections ids
     * @return {Promise} - The JSON of the cart.
     * @throws {Error}
     * */
    [actions.CHANGE_CART_ITEM]: function(newItem, sections) {
      if (!newItem) {
        throw new Error(`Cart API::ERROR::'${actions.CHANGE_CART_ITEM}' - param 'newItem' is required!`);
      }
      return fetch("/cart/change.js", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...newItem, sections })
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      }).then((response) => ({
        data: response
      }));
    },
    /**
     * Change cart item quantity
     * @param {String} key - Line item key
     * @param {Number} quantity - New line item quantity
     * @param {String} sections - Sections ids
     * @return {Promise} - The JSON of the cart.
     * @throws {Error}
     * */
    [actions.CHANGE_CART_ITEM_QUANTITY]: function(key, quantity, sections = "") {
      if (!key || !Number.isInteger(quantity)) {
        throw new Error(`Cart API::ERROR::'${actions.CHANGE_CART_ITEM_QUANTITY}' - required param is missing!`);
      }
      return this[actions.CHANGE_CART_ITEM](
        {
          id: key,
          quantity
        },
        sections
      );
    },
    /**
     * Remove line item from cart
     * @param {String} key - Line item key
     * @param {String} sections - Sections ids
     * @return {Promise} - The JSON of the cart.
     * @throws {Error}
     * */
    [actions.REMOVE_CART_ITEM]: function(key, sections = "") {
      if (!key) {
        throw new Error(`Cart API::ERROR::'${actions.REMOVE_CART_ITEM}' - param 'key' is required!`);
      }
      return this[actions.CHANGE_CART_ITEM_QUANTITY](key, 0, sections);
    },
    /**
     * Use the POST /{locale}/cart/clear.js endpoint to set all quantities of all line items in the cart to zero.
     * @return {Promise} - The JSON of an empty cart. This does not remove cart attributes or the cart note.
     * */
    [actions.CLEAR_CART]: function(sections = "") {
      return fetch("/cart/clear.js", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sections })
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      }).then((response) => ({
        data: response
      }));
    }
  };
  function makeRequest(action, ...params) {
    if (!Object.keys(api).includes(action)) {
      throw new Error(`Cart API::ERROR::makeQuery - unavailable action type - ${action}`);
    }
    return api[action](...params).then((response) => {
      const data = response.data;
      setTimeout(() => {
        window.themeCore.cartObject = data;
        window.themeCore.EventBus.emit("cart:updated", {
          ...data,
          action,
          params: [...params]
        });
      }, 0);
      return data;
    }).catch(async (error) => {
      await error.json().then((data) => {
        throw data;
      });
    });
  }
  return Object.freeze({
    actions,
    makeRequest
  });
};
const VIDEO_TYPES = {
  html: "html",
  youtube: "youtube",
  vimeo: "vimeo"
};
function Listeners() {
  this.entries = [];
}
Listeners.prototype.add = function(element, event, fn) {
  this.entries.push({ element, event, fn });
  element.addEventListener(event, fn);
};
Listeners.prototype.removeAll = function() {
  this.entries = this.entries.filter(function(listener) {
    listener.element.removeEventListener(listener.event, listener.fn);
    return false;
  });
};
function getVariantFromSerializedArray(product, collection) {
  _validateProductStructure(product);
  var optionArray = _createOptionArrayFromOptionCollection(product, collection);
  return getVariantFromOptionArray(product, optionArray);
}
function getVariantFromOptionArray(product, options) {
  _validateProductStructure(product);
  _validateOptionsArray(options);
  var result = product.variants.filter(function(variant) {
    return options.every(function(option, index) {
      return variant.options[index] === option;
    });
  });
  return result[0] || null;
}
function _createOptionArrayFromOptionCollection(product, collection) {
  _validateProductStructure(product);
  _validateSerializedArray(collection);
  var optionArray = [];
  collection.forEach(function(option) {
    for (var i = 0; i < product.options.length; i++) {
      if (product.options[i].name.toLowerCase() === option.name.toLowerCase()) {
        optionArray[i] = option.value;
        break;
      }
    }
  });
  return optionArray;
}
function _validateProductStructure(product) {
  if (typeof product !== "object") {
    throw new TypeError(product + " is not an object.");
  }
  if (Object.keys(product).length === 0 && product.constructor === Object) {
    throw new Error(product + " is empty.");
  }
}
function _validateSerializedArray(collection) {
  if (!Array.isArray(collection)) {
    throw new TypeError(collection + " is not an array.");
  }
  if (collection.length === 0) {
    return [];
  }
  if (collection[0].hasOwnProperty("name")) {
    if (typeof collection[0].name !== "string") {
      throw new TypeError(
        "Invalid value type passed for name of option " + collection[0].name + ". Value should be string."
      );
    }
  } else {
    throw new Error(collection[0] + "does not contain name key.");
  }
}
function _validateOptionsArray(options) {
  if (Array.isArray(options) && typeof options[0] === "object") {
    throw new Error(options + "is not a valid array of options.");
  }
}
var selectors = {
  idInput: '[name="id"]',
  optionInput: '[name^="options"]',
  quantityInput: '[name="quantity"]',
  propertyInput: '[name^="properties"]'
};
function getUrlWithVariant(url, id) {
  if (/variant=/.test(url)) {
    return url.replace(/(variant=)[^&]+/, "$1" + id);
  } else if (/\?/.test(url)) {
    return url.concat("&variant=").concat(id);
  }
  return url.concat("?variant=").concat(id);
}
function ProductForm(element, product, options) {
  this.element = element;
  this.product = _validateProductObject(product);
  options = options || {};
  this._listeners = new Listeners();
  this._listeners.add(
    this.element,
    "submit",
    this._onSubmit.bind(this, options)
  );
  this.optionInputs = this._initInputs(
    selectors.optionInput,
    options.onOptionChange
  );
  this.quantityInputs = this._initInputs(
    selectors.quantityInput,
    options.onQuantityChange
  );
  this.propertyInputs = this._initInputs(
    selectors.propertyInput,
    options.onPropertyChange
  );
}
ProductForm.prototype.destroy = function() {
  this._listeners.removeAll();
};
ProductForm.prototype.options = function() {
  return _serializeOptionValues(this.optionInputs, function(item) {
    var regex = /(?:^(options\[))(.*?)(?:\])/;
    item.name = regex.exec(item.name)[2];
    return item;
  });
};
ProductForm.prototype.variant = function() {
  return getVariantFromSerializedArray(this.product, this.options());
};
ProductForm.prototype.properties = function() {
  var properties = _serializePropertyValues(this.propertyInputs, function(propertyName) {
    var regex = /(?:^(properties\[))(.*?)(?:\])/;
    var name = regex.exec(propertyName)[2];
    return name;
  });
  return Object.entries(properties).length === 0 ? null : properties;
};
ProductForm.prototype.quantity = function() {
  return this.quantityInputs[0] ? Number.parseInt(this.quantityInputs[0].value, 10) : 1;
};
ProductForm.prototype._setIdInputValue = function(value) {
  var idInputElement = this.element.querySelector(selectors.idInput);
  if (!idInputElement) {
    idInputElement = document.createElement("input");
    idInputElement.type = "hidden";
    idInputElement.name = "id";
    this.element.appendChild(idInputElement);
  }
  idInputElement.value = value.toString();
};
ProductForm.prototype._onSubmit = function(options, event) {
  event.dataset = this._getProductFormEventData();
  if (event.dataset.variant) {
    this._setIdInputValue(event.dataset.variant.id);
  }
  if (options.onFormSubmit) {
    options.onFormSubmit(event);
  }
};
ProductForm.prototype._onFormEvent = function(cb) {
  if (typeof cb === "undefined") {
    return Function.prototype;
  }
  return (function(event) {
    event.dataset = this._getProductFormEventData();
    cb(event);
  }).bind(this);
};
ProductForm.prototype._initInputs = function(selector, cb) {
  var elements = Array.prototype.slice.call(
    this.element.querySelectorAll(selector)
  );
  return elements.map(
    (function(element) {
      this._listeners.add(element, "change", this._onFormEvent(cb));
      return element;
    }).bind(this)
  );
};
ProductForm.prototype._getProductFormEventData = function() {
  return {
    options: this.options(),
    variant: this.variant(),
    properties: this.properties(),
    quantity: this.quantity()
  };
};
function _serializeOptionValues(inputs, transform) {
  return inputs.reduce(function(options, input) {
    if (input.checked || // If input is a checked (means type radio or checkbox)
    input.type !== "radio" && input.type !== "checkbox") {
      options.push(transform({ name: input.name, value: input.value }));
    }
    return options;
  }, []);
}
function _serializePropertyValues(inputs, transform) {
  return inputs.reduce(function(properties, input) {
    if (input.checked || // If input is a checked (means type radio or checkbox)
    input.type !== "radio" && input.type !== "checkbox") {
      properties[transform(input.name)] = input.value;
    }
    return properties;
  }, {});
}
function _validateProductObject(product) {
  if (typeof product !== "object") {
    throw new TypeError(product + " is not an object.");
  }
  if (typeof product.variants[0].options === "undefined") {
    throw new TypeError(
      "Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route"
    );
  }
  return product;
}
const register = (component, type) => {
  if (!component || !type) {
    return;
  }
  const setup2 = (event) => {
    if (window.themeCore.sections[type]) {
      return;
    }
    const detail = event == null ? void 0 : event.detail;
    const sectionId = detail == null ? void 0 : detail.sectionId;
    const eventType = detail == null ? void 0 : detail.type;
    const addDetail = eventType === type && sectionId;
    const componentDetail = addDetail ? sectionId : void 0;
    component.init(componentDetail);
    window.themeCore.EventBus.emit(`${type}:loaded`);
    window.themeCore.sections[type] = true;
  };
  setup2();
  document.addEventListener("theme:customizer:loaded", setup2);
};
const registerExternalUtil = (component, type) => {
  if (!component || !type) {
    return;
  }
  const setup2 = () => {
    if (window.themeCore.externalUtils[type]) {
      return;
    }
    window.themeCore.utils[type] = component;
    window.themeCore.externalUtils[type] = true;
    window.themeCore.EventBus.emit(`${type}:loaded`);
  };
  setup2();
  document.addEventListener("shopify:section:load", setup2);
};
const getExternalUtil = (type) => {
  return new Promise((resolve) => {
    if (window.themeCore.utils[type]) {
      resolve(window.themeCore.utils[type]);
      return;
    }
    window.themeCore.EventBus.listen(`${type}:loaded`, () => {
      window.themeCore.utils[type] && resolve(window.themeCore.utils[type]);
    });
  });
};
const BackToTop = () => {
  const selectors2 = {
    button: ".js-back-to-top-button"
  };
  function init() {
    document.addEventListener("click", (event) => {
      const target = event == null ? void 0 : event.target;
      if (!target) {
        return;
      }
      const button = target.closest(selectors2.button);
      if (!button) {
        return;
      }
      scrollToTop();
    });
  }
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setTimeout(() => {
      document.body.setAttribute("tabindex", "-1");
      document.body.focus();
    }, 1e3);
  }
  return Object.freeze({
    init
  });
};
const AddToCart = () => {
  let initiatedState = false;
  const selectors2 = {
    addToCart: ".js-add-to-cart"
  };
  function init() {
    if (initiatedState) {
      return;
    }
    let addToCartButtons = document.querySelectorAll(selectors2.addToCart);
    if (!addToCartButtons) {
      return;
    }
    document.addEventListener("click", async function(event) {
      const button = event.target.closest(selectors2.addToCart);
      if (!button) {
        return;
      }
      const productHandle = button.getAttribute("data-product-handle");
      const productVariant = button.getAttribute("data-variant-id");
      const productQuantity = button.getAttribute("data-min-quantity");
      if (productVariant) {
        try {
          await window.themeCore.CartApi.makeRequest(
            window.themeCore.CartApi.actions.ADD_TO_CART,
            {
              id: productVariant,
              quantity: Number(productQuantity) || 1
            }
          );
          await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART);
        } catch (error) {
          const CartNotificationError = window.themeCore.CartNotificationError;
          CartNotificationError.addNotification(error.description);
          CartNotificationError.open();
        }
      } else {
        window.themeCore.EventBus.emit(
          "product-card:quick-view:clicked",
          {
            productHandle,
            variant: productVariant
          }
        );
      }
    });
    initiatedState = true;
  }
  return Object.freeze({
    init
  });
};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var dist = { exports: {} };
var Sister;
/**
* @link https://github.com/gajus/sister for the canonical source repository
* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
*/
Sister = function() {
  var sister2 = {}, events = {};
  sister2.on = function(name, handler) {
    var listener = { name, handler };
    events[name] = events[name] || [];
    events[name].unshift(listener);
    return listener;
  };
  sister2.off = function(listener) {
    var index = events[listener.name].indexOf(listener);
    if (index !== -1) {
      events[listener.name].splice(index, 1);
    }
  };
  sister2.trigger = function(name, data) {
    var listeners = events[name], i;
    if (listeners) {
      i = listeners.length;
      while (i--) {
        listeners[i].handler(data);
      }
    }
  };
  return sister2;
};
var sister = Sister;
var YouTubePlayer$1 = { exports: {} };
var browser = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs)
    return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = requireMs();
  createDebug.destroy = destroy;
  Object.keys(env).forEach((key) => {
    createDebug[key] = env[key];
  });
  createDebug.names = [];
  createDebug.skips = [];
  createDebug.formatters = {};
  function selectColor(namespace) {
    let hash = 0;
    for (let i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0;
    }
    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }
  createDebug.selectColor = selectColor;
  function createDebug(namespace) {
    let prevTime;
    let enableOverride = null;
    let namespacesCache;
    let enabledCache;
    function debug(...args) {
      if (!debug.enabled) {
        return;
      }
      const self2 = debug;
      const curr = Number(/* @__PURE__ */ new Date());
      const ms2 = curr - (prevTime || curr);
      self2.diff = ms2;
      self2.prev = prevTime;
      self2.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);
      if (typeof args[0] !== "string") {
        args.unshift("%O");
      }
      let index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
        if (match === "%%") {
          return "%";
        }
        index++;
        const formatter = createDebug.formatters[format];
        if (typeof formatter === "function") {
          const val = args[index];
          match = formatter.call(self2, val);
          args.splice(index, 1);
          index--;
        }
        return match;
      });
      createDebug.formatArgs.call(self2, args);
      const logFn = self2.log || createDebug.log;
      logFn.apply(self2, args);
    }
    debug.namespace = namespace;
    debug.useColors = createDebug.useColors();
    debug.color = createDebug.selectColor(namespace);
    debug.extend = extend;
    debug.destroy = createDebug.destroy;
    Object.defineProperty(debug, "enabled", {
      enumerable: true,
      configurable: false,
      get: () => {
        if (enableOverride !== null) {
          return enableOverride;
        }
        if (namespacesCache !== createDebug.namespaces) {
          namespacesCache = createDebug.namespaces;
          enabledCache = createDebug.enabled(namespace);
        }
        return enabledCache;
      },
      set: (v) => {
        enableOverride = v;
      }
    });
    if (typeof createDebug.init === "function") {
      createDebug.init(debug);
    }
    return debug;
  }
  function extend(namespace, delimiter) {
    const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }
  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.namespaces = namespaces;
    createDebug.names = [];
    createDebug.skips = [];
    let i;
    const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
    const len = split.length;
    for (i = 0; i < len; i++) {
      if (!split[i]) {
        continue;
      }
      namespaces = split[i].replace(/\*/g, ".*?");
      if (namespaces[0] === "-") {
        createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
      } else {
        createDebug.names.push(new RegExp("^" + namespaces + "$"));
      }
    }
  }
  function disable() {
    const namespaces = [
      ...createDebug.names.map(toNamespace),
      ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
    ].join(",");
    createDebug.enable("");
    return namespaces;
  }
  function enabled(name) {
    if (name[name.length - 1] === "*") {
      return true;
    }
    let i;
    let len;
    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }
    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }
  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
  }
  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }
    return val;
  }
  function destroy() {
    console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  }
  createDebug.enable(createDebug.load());
  return createDebug;
}
var common = setup;
(function(module, exports) {
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load2;
  exports.useColors = useColors;
  exports.storage = localstorage();
  exports.destroy = (() => {
    let warned = false;
    return () => {
      if (!warned) {
        warned = true;
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
    };
  })();
  exports.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
  ];
  function useColors() {
    if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
      return true;
    }
    if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
      return false;
    }
    return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
    typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
    typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  function formatArgs(args) {
    args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
    if (!this.useColors) {
      return;
    }
    const c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match) => {
      if (match === "%%") {
        return;
      }
      index++;
      if (match === "%c") {
        lastC = index;
      }
    });
    args.splice(lastC, 0, c);
  }
  exports.log = console.debug || console.log || (() => {
  });
  function save(namespaces) {
    try {
      if (namespaces) {
        exports.storage.setItem("debug", namespaces);
      } else {
        exports.storage.removeItem("debug");
      }
    } catch (error) {
    }
  }
  function load2() {
    let r;
    try {
      r = exports.storage.getItem("debug");
    } catch (error) {
    }
    if (!r && typeof process !== "undefined" && "env" in process) {
      r = {}.DEBUG;
    }
    return r;
  }
  function localstorage() {
    try {
      return localStorage;
    } catch (error) {
    }
  }
  module.exports = common(exports);
  const { formatters } = module.exports;
  formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (error) {
      return "[UnexpectedJSONParseError]: " + error.message;
    }
  };
})(browser, browser.exports);
var browserExports = browser.exports;
var FunctionStateMap = { exports: {} };
var PlayerStates = { exports: {} };
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    BUFFERING: 3,
    ENDED: 0,
    PAUSED: 2,
    PLAYING: 1,
    UNSTARTED: -1,
    VIDEO_CUED: 5
  };
  module.exports = exports["default"];
})(PlayerStates, PlayerStates.exports);
var PlayerStatesExports = PlayerStates.exports;
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _PlayerStates = PlayerStatesExports;
  var _PlayerStates2 = _interopRequireDefault(_PlayerStates);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  exports.default = {
    pauseVideo: {
      acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PAUSED],
      stateChangeRequired: false
    },
    playVideo: {
      acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PLAYING],
      stateChangeRequired: false
    },
    seekTo: {
      acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PLAYING, _PlayerStates2.default.PAUSED],
      stateChangeRequired: true,
      // TRICKY: `seekTo` may not cause a state change if no buffering is
      // required.
      // eslint-disable-next-line unicorn/numeric-separators-style
      timeout: 3e3
    }
  };
  module.exports = exports["default"];
})(FunctionStateMap, FunctionStateMap.exports);
var FunctionStateMapExports = FunctionStateMap.exports;
var eventNames = { exports: {} };
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ["ready", "stateChange", "playbackQualityChange", "playbackRateChange", "error", "apiChange", "volumeChange"];
  module.exports = exports["default"];
})(eventNames, eventNames.exports);
var eventNamesExports = eventNames.exports;
var functionNames = { exports: {} };
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ["cueVideoById", "loadVideoById", "cueVideoByUrl", "loadVideoByUrl", "playVideo", "pauseVideo", "stopVideo", "getVideoLoadedFraction", "cuePlaylist", "loadPlaylist", "nextVideo", "previousVideo", "playVideoAt", "setShuffle", "setLoop", "getPlaylist", "getPlaylistIndex", "setOption", "mute", "unMute", "isMuted", "setVolume", "getVolume", "seekTo", "getPlayerState", "getPlaybackRate", "setPlaybackRate", "getAvailablePlaybackRates", "getPlaybackQuality", "setPlaybackQuality", "getAvailableQualityLevels", "getCurrentTime", "getDuration", "removeEventListener", "getVideoUrl", "getVideoEmbedCode", "getOptions", "getOption", "addEventListener", "destroy", "setSize", "getIframe", "getSphericalProperties", "setSphericalProperties"];
  module.exports = exports["default"];
})(functionNames, functionNames.exports);
var functionNamesExports = functionNames.exports;
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _debug = browserExports;
  var _debug2 = _interopRequireDefault(_debug);
  var _FunctionStateMap = FunctionStateMapExports;
  var _FunctionStateMap2 = _interopRequireDefault(_FunctionStateMap);
  var _eventNames = eventNamesExports;
  var _eventNames2 = _interopRequireDefault(_eventNames);
  var _functionNames = functionNamesExports;
  var _functionNames2 = _interopRequireDefault(_functionNames);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  const debug = (0, _debug2.default)("youtube-player");
  const YouTubePlayer2 = {};
  YouTubePlayer2.proxyEvents = (emitter) => {
    const events = {};
    for (const eventName of _eventNames2.default) {
      const onEventName = "on" + eventName.slice(0, 1).toUpperCase() + eventName.slice(1);
      events[onEventName] = (event) => {
        debug('event "%s"', onEventName, event);
        emitter.trigger(eventName, event);
      };
    }
    return events;
  };
  YouTubePlayer2.promisifyPlayer = (playerAPIReady, strictState = false) => {
    const functions = {};
    for (const functionName of _functionNames2.default) {
      if (strictState && _FunctionStateMap2.default[functionName]) {
        functions[functionName] = (...args) => {
          return playerAPIReady.then((player) => {
            const stateInfo = _FunctionStateMap2.default[functionName];
            const playerState = player.getPlayerState();
            const value = player[functionName].apply(player, args);
            if (stateInfo.stateChangeRequired || // eslint-disable-next-line no-extra-parens
            Array.isArray(stateInfo.acceptableStates) && !stateInfo.acceptableStates.includes(playerState)) {
              return new Promise((resolve) => {
                const onPlayerStateChange = () => {
                  const playerStateAfterChange = player.getPlayerState();
                  let timeout;
                  if (typeof stateInfo.timeout === "number") {
                    timeout = setTimeout(() => {
                      player.removeEventListener("onStateChange", onPlayerStateChange);
                      resolve();
                    }, stateInfo.timeout);
                  }
                  if (Array.isArray(stateInfo.acceptableStates) && stateInfo.acceptableStates.includes(playerStateAfterChange)) {
                    player.removeEventListener("onStateChange", onPlayerStateChange);
                    clearTimeout(timeout);
                    resolve();
                  }
                };
                player.addEventListener("onStateChange", onPlayerStateChange);
              }).then(() => {
                return value;
              });
            }
            return value;
          });
        };
      } else {
        functions[functionName] = (...args) => {
          return playerAPIReady.then((player) => {
            return player[functionName].apply(player, args);
          });
        };
      }
    }
    return functions;
  };
  exports.default = YouTubePlayer2;
  module.exports = exports["default"];
})(YouTubePlayer$1, YouTubePlayer$1.exports);
var YouTubePlayerExports = YouTubePlayer$1.exports;
var loadYouTubeIframeApi = { exports: {} };
var loadScript = function load(src, opts, cb) {
  var head = document.head || document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  cb = cb || function() {
  };
  script.type = opts.type || "text/javascript";
  script.charset = opts.charset || "utf8";
  script.async = "async" in opts ? !!opts.async : true;
  script.src = src;
  if (opts.attrs) {
    setAttributes(script, opts.attrs);
  }
  if (opts.text) {
    script.text = "" + opts.text;
  }
  var onend = "onload" in script ? stdOnEnd : ieOnEnd;
  onend(script, cb);
  if (!script.onload) {
    stdOnEnd(script, cb);
  }
  head.appendChild(script);
};
function setAttributes(script, attrs) {
  for (var attr in attrs) {
    script.setAttribute(attr, attrs[attr]);
  }
}
function stdOnEnd(script, cb) {
  script.onload = function() {
    this.onerror = this.onload = null;
    cb(null, script);
  };
  script.onerror = function() {
    this.onerror = this.onload = null;
    cb(new Error("Failed to load " + this.src), script);
  };
}
function ieOnEnd(script, cb) {
  script.onreadystatechange = function() {
    if (this.readyState != "complete" && this.readyState != "loaded")
      return;
    this.onreadystatechange = null;
    cb(null, script);
  };
}
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _loadScript = loadScript;
  var _loadScript2 = _interopRequireDefault(_loadScript);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  exports.default = (emitter) => {
    const iframeAPIReady = new Promise((resolve) => {
      if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
        resolve(window.YT);
        return;
      } else {
        const protocol = window.location.protocol === "http:" ? "http:" : "https:";
        (0, _loadScript2.default)(protocol + "//www.youtube.com/iframe_api", (error) => {
          if (error) {
            emitter.trigger("error", error);
          }
        });
      }
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previous) {
          previous();
        }
        resolve(window.YT);
      };
    });
    return iframeAPIReady;
  };
  module.exports = exports["default"];
})(loadYouTubeIframeApi, loadYouTubeIframeApi.exports);
var loadYouTubeIframeApiExports = loadYouTubeIframeApi.exports;
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _sister = sister;
  var _sister2 = _interopRequireDefault(_sister);
  var _YouTubePlayer = YouTubePlayerExports;
  var _YouTubePlayer2 = _interopRequireDefault(_YouTubePlayer);
  var _loadYouTubeIframeApi = loadYouTubeIframeApiExports;
  var _loadYouTubeIframeApi2 = _interopRequireDefault(_loadYouTubeIframeApi);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  let youtubeIframeAPI;
  exports.default = (maybeElementId, options = {}, strictState = false) => {
    const emitter = (0, _sister2.default)();
    if (!youtubeIframeAPI) {
      youtubeIframeAPI = (0, _loadYouTubeIframeApi2.default)(emitter);
    }
    if (options.events) {
      throw new Error("Event handlers cannot be overwritten.");
    }
    if (typeof maybeElementId === "string" && !document.getElementById(maybeElementId)) {
      throw new Error('Element "' + maybeElementId + '" does not exist.');
    }
    options.events = _YouTubePlayer2.default.proxyEvents(emitter);
    const playerAPIReady = new Promise((resolve) => {
      if (typeof maybeElementId === "object" && maybeElementId.playVideo instanceof Function) {
        const player = maybeElementId;
        resolve(player);
      } else {
        youtubeIframeAPI.then((YT) => {
          const player = new YT.Player(maybeElementId, options);
          emitter.on("ready", () => {
            resolve(player);
          });
          return null;
        });
      }
    });
    const playerApi = _YouTubePlayer2.default.promisifyPlayer(playerAPIReady, strictState);
    playerApi.on = emitter.on;
    playerApi.off = emitter.off;
    return playerApi;
  };
  module.exports = exports["default"];
})(dist, dist.exports);
var distExports = dist.exports;
const YouTubePlayer = /* @__PURE__ */ getDefaultExportFromCjs(distExports);
/*! @vimeo/player v2.21.0 | (c) 2024 Vimeo | MIT License | https://github.com/vimeo/player.js */
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function() {
    return exports;
  };
  var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function(obj, key, desc) {
    obj[key] = desc.value;
  }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self2, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self2, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {
  }
  function GeneratorFunction() {
  }
  function GeneratorFunctionPrototype() {
  }
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function() {
    return this;
  });
  var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg, value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function(value2) {
          invoke("next", value2, resolve, reject);
        }, function(err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function(unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function(error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self2, context) {
    var state = "suspendedStart";
    return function(method, arg) {
      if ("executing" === state)
        throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method)
          throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg; ; ) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel)
              continue;
            return delegateResult;
          }
        }
        if ("next" === context.method)
          context.sent = context._sent = context.arg;
        else if ("throw" === context.method) {
          if ("suspendedStart" === state)
            throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else
          "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self2, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel)
            continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method, method = delegate.iterator[methodName];
    if (void 0 === method)
      return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = void 0, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type)
      return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = void 0), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(true);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod)
        return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next)
        return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1, next = function next2() {
          for (; ++i < iterable.length; )
            if (hasOwn.call(iterable, i))
              return next2.value = iterable[i], next2.done = false, next2;
          return next2.value = void 0, next2.done = true, next2;
        };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: void 0,
      done: true
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: true
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: true
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function(genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function(genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function(arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function() {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function(innerFn, outerFn, self2, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self2, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function() {
    return this;
  }), define(Gp, "toString", function() {
    return "[object Generator]";
  }), exports.keys = function(val) {
    var object = Object(val), keys = [];
    for (var key in object)
      keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length; ) {
        var key2 = keys.pop();
        if (key2 in object)
          return next.value = key2, next.done = false, next;
      }
      return next.done = true, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = false, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(resetTryEntry), !skipTempReset)
        for (var name in this)
          "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = void 0);
    },
    stop: function() {
      this.done = true;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type)
        throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function(exception) {
      if (this.done)
        throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = void 0), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i], record = entry.completion;
        if ("root" === entry.tryLoc)
          return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc)
              return handle(entry.catchLoc, true);
            if (this.prev < entry.finallyLoc)
              return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc)
              return handle(entry.catchLoc, true);
          } else {
            if (!hasFinally)
              throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc)
              return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function(record, afterLoc) {
      if ("throw" === record.type)
        throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc)
          return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName,
        nextLoc
      }, "next" === this.method && (this.arg = void 0), ContinueSentinel;
    }
  }, exports;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function() {
    var self2 = this, args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self2, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass)
    _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2)
        _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2))
      return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2))
        return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
function _assertThisInitialized(self2) {
  if (self2 === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self2;
}
function _possibleConstructorReturn(self2, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self2);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
var isNode = typeof global !== "undefined" && {}.toString.call(global) === "[object global]";
function getMethodName(prop, type) {
  if (prop.indexOf(type.toLowerCase()) === 0) {
    return prop;
  }
  return "".concat(type.toLowerCase()).concat(prop.substr(0, 1).toUpperCase()).concat(prop.substr(1));
}
function isDomElement(element) {
  return Boolean(element && element.nodeType === 1 && "nodeName" in element && element.ownerDocument && element.ownerDocument.defaultView);
}
function isInteger(value) {
  return !isNaN(parseFloat(value)) && isFinite(value) && Math.floor(value) == value;
}
function isVimeoUrl(url) {
  return /^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(url);
}
function isVimeoEmbed(url) {
  var expr = /^https:\/\/player\.vimeo\.com\/video\/\d+/;
  return expr.test(url);
}
function getVimeoUrl() {
  var oEmbedParameters2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var id = oEmbedParameters2.id;
  var url = oEmbedParameters2.url;
  var idOrUrl = id || url;
  if (!idOrUrl) {
    throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");
  }
  if (isInteger(idOrUrl)) {
    return "https://vimeo.com/".concat(idOrUrl);
  }
  if (isVimeoUrl(idOrUrl)) {
    return idOrUrl.replace("http:", "https:");
  }
  if (id) {
    throw new TypeError("“".concat(id, "” is not a valid video id."));
  }
  throw new TypeError("“".concat(idOrUrl, "” is not a vimeo.com url."));
}
var subscribe = function subscribe2(target, eventName, callback) {
  var onName = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "addEventListener";
  var offName = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : "removeEventListener";
  var eventNames2 = typeof eventName === "string" ? [eventName] : eventName;
  eventNames2.forEach(function(evName) {
    target[onName](evName, callback);
  });
  return {
    cancel: function cancel() {
      return eventNames2.forEach(function(evName) {
        return target[offName](evName, callback);
      });
    }
  };
};
var arrayIndexOfSupport = typeof Array.prototype.indexOf !== "undefined";
var postMessageSupport = typeof window !== "undefined" && typeof window.postMessage !== "undefined";
if (!isNode && (!arrayIndexOfSupport || !postMessageSupport)) {
  throw new Error("Sorry, the Vimeo Player API is not available in this browser.");
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}
/*!
 * weakmap-polyfill v2.0.4 - ECMAScript6 WeakMap polyfill
 * https://github.com/polygonplanet/weakmap-polyfill
 * Copyright (c) 2015-2021 polygonplanet <polygon.planet.aqua@gmail.com>
 * @license MIT
 */
(function(self2) {
  if (self2.WeakMap) {
    return;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasDefine = Object.defineProperty && function() {
    try {
      return Object.defineProperty({}, "x", {
        value: 1
      }).x === 1;
    } catch (e) {
    }
  }();
  var defineProperty = function(object, name, value) {
    if (hasDefine) {
      Object.defineProperty(object, name, {
        configurable: true,
        writable: true,
        value
      });
    } else {
      object[name] = value;
    }
  };
  self2.WeakMap = function() {
    function WeakMap2() {
      if (this === void 0) {
        throw new TypeError("Constructor WeakMap requires 'new'");
      }
      defineProperty(this, "_id", genId("_WeakMap"));
      if (arguments.length > 0) {
        throw new TypeError("WeakMap iterable is not supported");
      }
    }
    defineProperty(WeakMap2.prototype, "delete", function(key) {
      checkInstance(this, "delete");
      if (!isObject2(key)) {
        return false;
      }
      var entry = key[this._id];
      if (entry && entry[0] === key) {
        delete key[this._id];
        return true;
      }
      return false;
    });
    defineProperty(WeakMap2.prototype, "get", function(key) {
      checkInstance(this, "get");
      if (!isObject2(key)) {
        return void 0;
      }
      var entry = key[this._id];
      if (entry && entry[0] === key) {
        return entry[1];
      }
      return void 0;
    });
    defineProperty(WeakMap2.prototype, "has", function(key) {
      checkInstance(this, "has");
      if (!isObject2(key)) {
        return false;
      }
      var entry = key[this._id];
      if (entry && entry[0] === key) {
        return true;
      }
      return false;
    });
    defineProperty(WeakMap2.prototype, "set", function(key, value) {
      checkInstance(this, "set");
      if (!isObject2(key)) {
        throw new TypeError("Invalid value used as weak map key");
      }
      var entry = key[this._id];
      if (entry && entry[0] === key) {
        entry[1] = value;
        return this;
      }
      defineProperty(key, this._id, [key, value]);
      return this;
    });
    function checkInstance(x, methodName) {
      if (!isObject2(x) || !hasOwnProperty.call(x, "_id")) {
        throw new TypeError(methodName + " method called on incompatible receiver " + typeof x);
      }
    }
    function genId(prefix) {
      return prefix + "_" + rand() + "." + rand();
    }
    function rand() {
      return Math.random().toString().substring(2);
    }
    defineProperty(WeakMap2, "_polyfill", true);
    return WeakMap2;
  }();
  function isObject2(x) {
    return Object(x) === x;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : commonjsGlobal);
var npo_src = createCommonjsModule(function(module) {
  /*! Native Promise Only
      v0.8.1 (c) Kyle Simpson
      MIT License: http://getify.mit-license.org
  */
  (function UMD(name, context, definition) {
    context[name] = context[name] || definition();
    if (module.exports) {
      module.exports = context[name];
    }
  })("Promise", typeof commonjsGlobal != "undefined" ? commonjsGlobal : commonjsGlobal, function DEF() {
    var builtInProp, cycle, scheduling_queue, ToString = Object.prototype.toString, timer = typeof setImmediate != "undefined" ? function timer2(fn) {
      return setImmediate(fn);
    } : setTimeout;
    try {
      Object.defineProperty({}, "x", {});
      builtInProp = function builtInProp2(obj, name, val, config) {
        return Object.defineProperty(obj, name, {
          value: val,
          writable: true,
          configurable: config !== false
        });
      };
    } catch (err) {
      builtInProp = function builtInProp2(obj, name, val) {
        obj[name] = val;
        return obj;
      };
    }
    scheduling_queue = function Queue() {
      var first, last, item;
      function Item(fn, self2) {
        this.fn = fn;
        this.self = self2;
        this.next = void 0;
      }
      return {
        add: function add(fn, self2) {
          item = new Item(fn, self2);
          if (last) {
            last.next = item;
          } else {
            first = item;
          }
          last = item;
          item = void 0;
        },
        drain: function drain() {
          var f = first;
          first = last = cycle = void 0;
          while (f) {
            f.fn.call(f.self);
            f = f.next;
          }
        }
      };
    }();
    function schedule(fn, self2) {
      scheduling_queue.add(fn, self2);
      if (!cycle) {
        cycle = timer(scheduling_queue.drain);
      }
    }
    function isThenable(o) {
      var _then, o_type = typeof o;
      if (o != null && (o_type == "object" || o_type == "function")) {
        _then = o.then;
      }
      return typeof _then == "function" ? _then : false;
    }
    function notify() {
      for (var i = 0; i < this.chain.length; i++) {
        notifyIsolated(this, this.state === 1 ? this.chain[i].success : this.chain[i].failure, this.chain[i]);
      }
      this.chain.length = 0;
    }
    function notifyIsolated(self2, cb, chain) {
      var ret, _then;
      try {
        if (cb === false) {
          chain.reject(self2.msg);
        } else {
          if (cb === true) {
            ret = self2.msg;
          } else {
            ret = cb.call(void 0, self2.msg);
          }
          if (ret === chain.promise) {
            chain.reject(TypeError("Promise-chain cycle"));
          } else if (_then = isThenable(ret)) {
            _then.call(ret, chain.resolve, chain.reject);
          } else {
            chain.resolve(ret);
          }
        }
      } catch (err) {
        chain.reject(err);
      }
    }
    function resolve(msg) {
      var _then, self2 = this;
      if (self2.triggered) {
        return;
      }
      self2.triggered = true;
      if (self2.def) {
        self2 = self2.def;
      }
      try {
        if (_then = isThenable(msg)) {
          schedule(function() {
            var def_wrapper = new MakeDefWrapper(self2);
            try {
              _then.call(msg, function $resolve$() {
                resolve.apply(def_wrapper, arguments);
              }, function $reject$() {
                reject.apply(def_wrapper, arguments);
              });
            } catch (err) {
              reject.call(def_wrapper, err);
            }
          });
        } else {
          self2.msg = msg;
          self2.state = 1;
          if (self2.chain.length > 0) {
            schedule(notify, self2);
          }
        }
      } catch (err) {
        reject.call(new MakeDefWrapper(self2), err);
      }
    }
    function reject(msg) {
      var self2 = this;
      if (self2.triggered) {
        return;
      }
      self2.triggered = true;
      if (self2.def) {
        self2 = self2.def;
      }
      self2.msg = msg;
      self2.state = 2;
      if (self2.chain.length > 0) {
        schedule(notify, self2);
      }
    }
    function iteratePromises(Constructor, arr, resolver, rejecter) {
      for (var idx = 0; idx < arr.length; idx++) {
        (function IIFE(idx2) {
          Constructor.resolve(arr[idx2]).then(function $resolver$(msg) {
            resolver(idx2, msg);
          }, rejecter);
        })(idx);
      }
    }
    function MakeDefWrapper(self2) {
      this.def = self2;
      this.triggered = false;
    }
    function MakeDef(self2) {
      this.promise = self2;
      this.state = 0;
      this.triggered = false;
      this.chain = [];
      this.msg = void 0;
    }
    function Promise2(executor) {
      if (typeof executor != "function") {
        throw TypeError("Not a function");
      }
      if (this.__NPO__ !== 0) {
        throw TypeError("Not a promise");
      }
      this.__NPO__ = 1;
      var def = new MakeDef(this);
      this["then"] = function then(success, failure) {
        var o = {
          success: typeof success == "function" ? success : true,
          failure: typeof failure == "function" ? failure : false
        };
        o.promise = new this.constructor(function extractChain(resolve2, reject2) {
          if (typeof resolve2 != "function" || typeof reject2 != "function") {
            throw TypeError("Not a function");
          }
          o.resolve = resolve2;
          o.reject = reject2;
        });
        def.chain.push(o);
        if (def.state !== 0) {
          schedule(notify, def);
        }
        return o.promise;
      };
      this["catch"] = function $catch$(failure) {
        return this.then(void 0, failure);
      };
      try {
        executor.call(void 0, function publicResolve(msg) {
          resolve.call(def, msg);
        }, function publicReject(msg) {
          reject.call(def, msg);
        });
      } catch (err) {
        reject.call(def, err);
      }
    }
    var PromisePrototype = builtInProp(
      {},
      "constructor",
      Promise2,
      /*configurable=*/
      false
    );
    Promise2.prototype = PromisePrototype;
    builtInProp(
      PromisePrototype,
      "__NPO__",
      0,
      /*configurable=*/
      false
    );
    builtInProp(Promise2, "resolve", function Promise$resolve(msg) {
      var Constructor = this;
      if (msg && typeof msg == "object" && msg.__NPO__ === 1) {
        return msg;
      }
      return new Constructor(function executor(resolve2, reject2) {
        if (typeof resolve2 != "function" || typeof reject2 != "function") {
          throw TypeError("Not a function");
        }
        resolve2(msg);
      });
    });
    builtInProp(Promise2, "reject", function Promise$reject(msg) {
      return new this(function executor(resolve2, reject2) {
        if (typeof resolve2 != "function" || typeof reject2 != "function") {
          throw TypeError("Not a function");
        }
        reject2(msg);
      });
    });
    builtInProp(Promise2, "all", function Promise$all(arr) {
      var Constructor = this;
      if (ToString.call(arr) != "[object Array]") {
        return Constructor.reject(TypeError("Not an array"));
      }
      if (arr.length === 0) {
        return Constructor.resolve([]);
      }
      return new Constructor(function executor(resolve2, reject2) {
        if (typeof resolve2 != "function" || typeof reject2 != "function") {
          throw TypeError("Not a function");
        }
        var len = arr.length, msgs = Array(len), count = 0;
        iteratePromises(Constructor, arr, function resolver(idx, msg) {
          msgs[idx] = msg;
          if (++count === len) {
            resolve2(msgs);
          }
        }, reject2);
      });
    });
    builtInProp(Promise2, "race", function Promise$race(arr) {
      var Constructor = this;
      if (ToString.call(arr) != "[object Array]") {
        return Constructor.reject(TypeError("Not an array"));
      }
      return new Constructor(function executor(resolve2, reject2) {
        if (typeof resolve2 != "function" || typeof reject2 != "function") {
          throw TypeError("Not a function");
        }
        iteratePromises(Constructor, arr, function resolver(idx, msg) {
          resolve2(msg);
        }, reject2);
      });
    });
    return Promise2;
  });
});
var callbackMap = /* @__PURE__ */ new WeakMap();
function storeCallback(player, name, callback) {
  var playerCallbacks = callbackMap.get(player.element) || {};
  if (!(name in playerCallbacks)) {
    playerCallbacks[name] = [];
  }
  playerCallbacks[name].push(callback);
  callbackMap.set(player.element, playerCallbacks);
}
function getCallbacks(player, name) {
  var playerCallbacks = callbackMap.get(player.element) || {};
  return playerCallbacks[name] || [];
}
function removeCallback(player, name, callback) {
  var playerCallbacks = callbackMap.get(player.element) || {};
  if (!playerCallbacks[name]) {
    return true;
  }
  if (!callback) {
    playerCallbacks[name] = [];
    callbackMap.set(player.element, playerCallbacks);
    return true;
  }
  var index = playerCallbacks[name].indexOf(callback);
  if (index !== -1) {
    playerCallbacks[name].splice(index, 1);
  }
  callbackMap.set(player.element, playerCallbacks);
  return playerCallbacks[name] && playerCallbacks[name].length === 0;
}
function shiftCallbacks(player, name) {
  var playerCallbacks = getCallbacks(player, name);
  if (playerCallbacks.length < 1) {
    return false;
  }
  var callback = playerCallbacks.shift();
  removeCallback(player, name, callback);
  return callback;
}
function swapCallbacks(oldElement, newElement) {
  var playerCallbacks = callbackMap.get(oldElement);
  callbackMap.set(newElement, playerCallbacks);
  callbackMap.delete(oldElement);
}
function parseMessageData(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.warn(error);
      return {};
    }
  }
  return data;
}
function postMessage(player, method, params) {
  if (!player.element.contentWindow || !player.element.contentWindow.postMessage) {
    return;
  }
  var message = {
    method
  };
  if (params !== void 0) {
    message.value = params;
  }
  var ieVersion = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, "$1"));
  if (ieVersion >= 8 && ieVersion < 10) {
    message = JSON.stringify(message);
  }
  player.element.contentWindow.postMessage(message, player.origin);
}
function processData(player, data) {
  data = parseMessageData(data);
  var callbacks = [];
  var param;
  if (data.event) {
    if (data.event === "error") {
      var promises = getCallbacks(player, data.data.method);
      promises.forEach(function(promise) {
        var error = new Error(data.data.message);
        error.name = data.data.name;
        promise.reject(error);
        removeCallback(player, data.data.method, promise);
      });
    }
    callbacks = getCallbacks(player, "event:".concat(data.event));
    param = data.data;
  } else if (data.method) {
    var callback = shiftCallbacks(player, data.method);
    if (callback) {
      callbacks.push(callback);
      param = data.value;
    }
  }
  callbacks.forEach(function(callback2) {
    try {
      if (typeof callback2 === "function") {
        callback2.call(player, param);
        return;
      }
      callback2.resolve(param);
    } catch (e) {
    }
  });
}
var oEmbedParameters = ["airplay", "audio_tracks", "autopause", "autoplay", "background", "byline", "cc", "chapters", "chromecast", "color", "colors", "controls", "dnt", "fullscreen", "height", "id", "interactive_params", "keyboard", "loop", "maxheight", "maxwidth", "muted", "play_button_position", "playsinline", "portrait", "progress_bar", "quality_selector", "responsive", "speed", "texttrack", "title", "transcript", "transparent", "url", "vimeo_logo", "volume", "width"];
function getOEmbedParameters(element) {
  var defaults = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return oEmbedParameters.reduce(function(params, param) {
    var value = element.getAttribute("data-vimeo-".concat(param));
    if (value || value === "") {
      params[param] = value === "" ? 1 : value;
    }
    return params;
  }, defaults);
}
function createEmbed(_ref, element) {
  var html = _ref.html;
  if (!element) {
    throw new TypeError("An element must be provided");
  }
  if (element.getAttribute("data-vimeo-initialized") !== null) {
    return element.querySelector("iframe");
  }
  var div = document.createElement("div");
  div.innerHTML = html;
  element.appendChild(div.firstChild);
  element.setAttribute("data-vimeo-initialized", "true");
  return element.querySelector("iframe");
}
function getOEmbedData(videoUrl) {
  var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var element = arguments.length > 2 ? arguments[2] : void 0;
  return new Promise(function(resolve, reject) {
    if (!isVimeoUrl(videoUrl)) {
      throw new TypeError("“".concat(videoUrl, "” is not a vimeo.com url."));
    }
    var url = "https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(videoUrl));
    for (var param in params) {
      if (params.hasOwnProperty(param)) {
        url += "&".concat(param, "=").concat(encodeURIComponent(params[param]));
      }
    }
    var xhr = "XDomainRequest" in window ? new XDomainRequest() : new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function() {
      if (xhr.status === 404) {
        reject(new Error("“".concat(videoUrl, "” was not found.")));
        return;
      }
      if (xhr.status === 403) {
        reject(new Error("“".concat(videoUrl, "” is not embeddable.")));
        return;
      }
      try {
        var json = JSON.parse(xhr.responseText);
        if (json.domain_status_code === 403) {
          createEmbed(json, element);
          reject(new Error("“".concat(videoUrl, "” is not embeddable.")));
          return;
        }
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    xhr.onerror = function() {
      var status = xhr.status ? " (".concat(xhr.status, ")") : "";
      reject(new Error("There was an error fetching the embed code from Vimeo".concat(status, ".")));
    };
    xhr.send();
  });
}
function initializeEmbeds() {
  var parent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  var elements = [].slice.call(parent.querySelectorAll("[data-vimeo-id], [data-vimeo-url]"));
  var handleError = function handleError2(error) {
    if ("console" in window && console.error) {
      console.error("There was an error creating an embed: ".concat(error));
    }
  };
  elements.forEach(function(element) {
    try {
      if (element.getAttribute("data-vimeo-defer") !== null) {
        return;
      }
      var params = getOEmbedParameters(element);
      var url = getVimeoUrl(params);
      getOEmbedData(url, params, element).then(function(data) {
        return createEmbed(data, element);
      }).catch(handleError);
    } catch (error) {
      handleError(error);
    }
  });
}
function resizeEmbeds() {
  var parent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  if (window.VimeoPlayerResizeEmbeds_) {
    return;
  }
  window.VimeoPlayerResizeEmbeds_ = true;
  var onMessage = function onMessage2(event) {
    if (!isVimeoUrl(event.origin)) {
      return;
    }
    if (!event.data || event.data.event !== "spacechange") {
      return;
    }
    var iframes = parent.querySelectorAll("iframe");
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow !== event.source) {
        continue;
      }
      var space = iframes[i].parentElement;
      space.style.paddingBottom = "".concat(event.data.data[0].bottom, "px");
      break;
    }
  };
  window.addEventListener("message", onMessage);
}
function initAppendVideoMetadata() {
  var parent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  if (window.VimeoSeoMetadataAppended) {
    return;
  }
  window.VimeoSeoMetadataAppended = true;
  var onMessage = function onMessage2(event) {
    if (!isVimeoUrl(event.origin)) {
      return;
    }
    var data = parseMessageData(event.data);
    if (!data || data.event !== "ready") {
      return;
    }
    var iframes = parent.querySelectorAll("iframe");
    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i];
      var isValidMessageSource = iframe.contentWindow === event.source;
      if (isVimeoEmbed(iframe.src) && isValidMessageSource) {
        var player = new Player(iframe);
        player.callMethod("appendVideoMetadata", window.location.href);
      }
    }
  };
  window.addEventListener("message", onMessage);
}
function checkUrlTimeParam() {
  var parent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document;
  if (window.VimeoCheckedUrlTimeParam) {
    return;
  }
  window.VimeoCheckedUrlTimeParam = true;
  var handleError = function handleError2(error) {
    if ("console" in window && console.error) {
      console.error("There was an error getting video Id: ".concat(error));
    }
  };
  var onMessage = function onMessage2(event) {
    if (!isVimeoUrl(event.origin)) {
      return;
    }
    var data = parseMessageData(event.data);
    if (!data || data.event !== "ready") {
      return;
    }
    var iframes = parent.querySelectorAll("iframe");
    var _loop = function _loop2() {
      var iframe = iframes[i];
      var isValidMessageSource = iframe.contentWindow === event.source;
      if (isVimeoEmbed(iframe.src) && isValidMessageSource) {
        var player = new Player(iframe);
        player.getVideoId().then(function(videoId) {
          var matches = new RegExp("[?&]vimeo_t_".concat(videoId, "=([^&#]*)")).exec(window.location.href);
          if (matches && matches[1]) {
            var sec = decodeURI(matches[1]);
            player.setCurrentTime(sec);
          }
          return;
        }).catch(handleError);
      }
    };
    for (var i = 0; i < iframes.length; i++) {
      _loop();
    }
  };
  window.addEventListener("message", onMessage);
}
function initializeScreenfull() {
  var fn = function() {
    var val;
    var fnMap = [
      ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
      // New WebKit
      ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
      // Old WebKit
      ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
      ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
      ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
    ];
    var i = 0;
    var l = fnMap.length;
    var ret = {};
    for (; i < l; i++) {
      val = fnMap[i];
      if (val && val[1] in document) {
        for (i = 0; i < val.length; i++) {
          ret[fnMap[0][i]] = val[i];
        }
        return ret;
      }
    }
    return false;
  }();
  var eventNameMap = {
    fullscreenchange: fn.fullscreenchange,
    fullscreenerror: fn.fullscreenerror
  };
  var screenfull2 = {
    request: function request(element) {
      return new Promise(function(resolve, reject) {
        var onFullScreenEntered = function onFullScreenEntered2() {
          screenfull2.off("fullscreenchange", onFullScreenEntered2);
          resolve();
        };
        screenfull2.on("fullscreenchange", onFullScreenEntered);
        element = element || document.documentElement;
        var returnPromise = element[fn.requestFullscreen]();
        if (returnPromise instanceof Promise) {
          returnPromise.then(onFullScreenEntered).catch(reject);
        }
      });
    },
    exit: function exit() {
      return new Promise(function(resolve, reject) {
        if (!screenfull2.isFullscreen) {
          resolve();
          return;
        }
        var onFullScreenExit = function onFullScreenExit2() {
          screenfull2.off("fullscreenchange", onFullScreenExit2);
          resolve();
        };
        screenfull2.on("fullscreenchange", onFullScreenExit);
        var returnPromise = document[fn.exitFullscreen]();
        if (returnPromise instanceof Promise) {
          returnPromise.then(onFullScreenExit).catch(reject);
        }
      });
    },
    on: function on2(event, callback) {
      var eventName = eventNameMap[event];
      if (eventName) {
        document.addEventListener(eventName, callback);
      }
    },
    off: function off2(event, callback) {
      var eventName = eventNameMap[event];
      if (eventName) {
        document.removeEventListener(eventName, callback);
      }
    }
  };
  Object.defineProperties(screenfull2, {
    isFullscreen: {
      get: function get() {
        return Boolean(document[fn.fullscreenElement]);
      }
    },
    element: {
      enumerable: true,
      get: function get() {
        return document[fn.fullscreenElement];
      }
    },
    isEnabled: {
      enumerable: true,
      get: function get() {
        return Boolean(document[fn.fullscreenEnabled]);
      }
    }
  });
  return screenfull2;
}
var defaultOptions = {
  role: "viewer",
  autoPlayMuted: true,
  allowedDrift: 0.3,
  maxAllowedDrift: 1,
  minCheckInterval: 0.1,
  maxRateAdjustment: 0.2,
  maxTimeToCatchUp: 1
};
var TimingSrcConnector = /* @__PURE__ */ function(_EventTarget) {
  _inherits(TimingSrcConnector2, _EventTarget);
  var _super = _createSuper(TimingSrcConnector2);
  function TimingSrcConnector2(_player, timingObject) {
    var _this;
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var logger = arguments.length > 3 ? arguments[3] : void 0;
    _classCallCheck(this, TimingSrcConnector2);
    _this = _super.call(this);
    _defineProperty(_assertThisInitialized(_this), "logger", void 0);
    _defineProperty(_assertThisInitialized(_this), "speedAdjustment", 0);
    _defineProperty(_assertThisInitialized(_this), "adjustSpeed", /* @__PURE__ */ function() {
      var _ref = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee(player, newAdjustment) {
        var newPlaybackRate;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1)
            switch (_context.prev = _context.next) {
              case 0:
                if (!(_this.speedAdjustment === newAdjustment)) {
                  _context.next = 2;
                  break;
                }
                return _context.abrupt("return");
              case 2:
                _context.next = 4;
                return player.getPlaybackRate();
              case 4:
                _context.t0 = _context.sent;
                _context.t1 = _this.speedAdjustment;
                _context.t2 = _context.t0 - _context.t1;
                _context.t3 = newAdjustment;
                newPlaybackRate = _context.t2 + _context.t3;
                _this.log("New playbackRate:  ".concat(newPlaybackRate));
                _context.next = 12;
                return player.setPlaybackRate(newPlaybackRate);
              case 12:
                _this.speedAdjustment = newAdjustment;
              case 13:
              case "end":
                return _context.stop();
            }
        }, _callee);
      }));
      return function(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
    _this.logger = logger;
    _this.init(timingObject, _player, _objectSpread2(_objectSpread2({}, defaultOptions), options));
    return _this;
  }
  _createClass(TimingSrcConnector2, [{
    key: "disconnect",
    value: function disconnect() {
      this.dispatchEvent(new Event("disconnect"));
    }
    /**
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @param {TimingSrcConnectorOptions} options
     * @return {Promise<void>}
     */
  }, {
    key: "init",
    value: function() {
      var _init = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee2(timingObject, player, options) {
        var _this2 = this;
        var playerUpdater, positionSync, timingObjectUpdater;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1)
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.waitForTOReadyState(timingObject, "open");
              case 2:
                if (!(options.role === "viewer")) {
                  _context2.next = 10;
                  break;
                }
                _context2.next = 5;
                return this.updatePlayer(timingObject, player, options);
              case 5:
                playerUpdater = subscribe(timingObject, "change", function() {
                  return _this2.updatePlayer(timingObject, player, options);
                });
                positionSync = this.maintainPlaybackPosition(timingObject, player, options);
                this.addEventListener("disconnect", function() {
                  positionSync.cancel();
                  playerUpdater.cancel();
                });
                _context2.next = 14;
                break;
              case 10:
                _context2.next = 12;
                return this.updateTimingObject(timingObject, player);
              case 12:
                timingObjectUpdater = subscribe(player, ["seeked", "play", "pause", "ratechange"], function() {
                  return _this2.updateTimingObject(timingObject, player);
                }, "on", "off");
                this.addEventListener("disconnect", function() {
                  return timingObjectUpdater.cancel();
                });
              case 14:
              case "end":
                return _context2.stop();
            }
        }, _callee2, this);
      }));
      function init(_x3, _x4, _x5) {
        return _init.apply(this, arguments);
      }
      return init;
    }()
    /**
     * Sets the TimingObject's state to reflect that of the player
     *
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @return {Promise<void>}
     */
  }, {
    key: "updateTimingObject",
    value: function() {
      var _updateTimingObject = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee3(timingObject, player) {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1)
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.t0 = timingObject;
                _context3.next = 3;
                return player.getCurrentTime();
              case 3:
                _context3.t1 = _context3.sent;
                _context3.next = 6;
                return player.getPaused();
              case 6:
                if (!_context3.sent) {
                  _context3.next = 10;
                  break;
                }
                _context3.t2 = 0;
                _context3.next = 13;
                break;
              case 10:
                _context3.next = 12;
                return player.getPlaybackRate();
              case 12:
                _context3.t2 = _context3.sent;
              case 13:
                _context3.t3 = _context3.t2;
                _context3.t4 = {
                  position: _context3.t1,
                  velocity: _context3.t3
                };
                _context3.t0.update.call(_context3.t0, _context3.t4);
              case 16:
              case "end":
                return _context3.stop();
            }
        }, _callee3);
      }));
      function updateTimingObject(_x6, _x7) {
        return _updateTimingObject.apply(this, arguments);
      }
      return updateTimingObject;
    }()
    /**
     * Sets the player's timing state to reflect that of the TimingObject
     *
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @param {TimingSrcConnectorOptions} options
     * @return {Promise<void>}
     */
  }, {
    key: "updatePlayer",
    value: function() {
      var _updatePlayer = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee5(timingObject, player, options) {
        var _timingObject$query, position, velocity;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1)
            switch (_context5.prev = _context5.next) {
              case 0:
                _timingObject$query = timingObject.query(), position = _timingObject$query.position, velocity = _timingObject$query.velocity;
                if (typeof position === "number") {
                  player.setCurrentTime(position);
                }
                if (!(typeof velocity === "number")) {
                  _context5.next = 25;
                  break;
                }
                if (!(velocity === 0)) {
                  _context5.next = 11;
                  break;
                }
                _context5.next = 6;
                return player.getPaused();
              case 6:
                _context5.t0 = _context5.sent;
                if (!(_context5.t0 === false)) {
                  _context5.next = 9;
                  break;
                }
                player.pause();
              case 9:
                _context5.next = 25;
                break;
              case 11:
                if (!(velocity > 0)) {
                  _context5.next = 25;
                  break;
                }
                _context5.next = 14;
                return player.getPaused();
              case 14:
                _context5.t1 = _context5.sent;
                if (!(_context5.t1 === true)) {
                  _context5.next = 19;
                  break;
                }
                _context5.next = 18;
                return player.play().catch(/* @__PURE__ */ function() {
                  var _ref2 = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee4(err) {
                    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                      while (1)
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            if (!(err.name === "NotAllowedError" && options.autoPlayMuted)) {
                              _context4.next = 5;
                              break;
                            }
                            _context4.next = 3;
                            return player.setMuted(true);
                          case 3:
                            _context4.next = 5;
                            return player.play().catch(function(err2) {
                              return console.error("Couldn't play the video from TimingSrcConnector. Error:", err2);
                            });
                          case 5:
                          case "end":
                            return _context4.stop();
                        }
                    }, _callee4);
                  }));
                  return function(_x11) {
                    return _ref2.apply(this, arguments);
                  };
                }());
              case 18:
                this.updatePlayer(timingObject, player, options);
              case 19:
                _context5.next = 21;
                return player.getPlaybackRate();
              case 21:
                _context5.t2 = _context5.sent;
                _context5.t3 = velocity;
                if (!(_context5.t2 !== _context5.t3)) {
                  _context5.next = 25;
                  break;
                }
                player.setPlaybackRate(velocity);
              case 25:
              case "end":
                return _context5.stop();
            }
        }, _callee5, this);
      }));
      function updatePlayer(_x8, _x9, _x10) {
        return _updatePlayer.apply(this, arguments);
      }
      return updatePlayer;
    }()
    /**
     * Since video players do not play with 100% time precision, we need to closely monitor
     * our player to be sure it remains in sync with the TimingObject.
     *
     * If out of sync, we use the current conditions and the options provided to determine
     * whether to re-sync via setting currentTime or adjusting the playbackRate
     *
     * @param {TimingObject} timingObject
     * @param {PlayerControls} player
     * @param {TimingSrcConnectorOptions} options
     * @return {{cancel: (function(): void)}}
     */
  }, {
    key: "maintainPlaybackPosition",
    value: function maintainPlaybackPosition(timingObject, player, options) {
      var _this3 = this;
      var allowedDrift = options.allowedDrift, maxAllowedDrift = options.maxAllowedDrift, minCheckInterval = options.minCheckInterval, maxRateAdjustment = options.maxRateAdjustment, maxTimeToCatchUp = options.maxTimeToCatchUp;
      var syncInterval = Math.min(maxTimeToCatchUp, Math.max(minCheckInterval, maxAllowedDrift)) * 1e3;
      var check = /* @__PURE__ */ function() {
        var _ref3 = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee6() {
          var diff, diffAbs, min, max, adjustment;
          return _regeneratorRuntime().wrap(function _callee6$(_context6) {
            while (1)
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.t0 = timingObject.query().velocity === 0;
                  if (_context6.t0) {
                    _context6.next = 6;
                    break;
                  }
                  _context6.next = 4;
                  return player.getPaused();
                case 4:
                  _context6.t1 = _context6.sent;
                  _context6.t0 = _context6.t1 === true;
                case 6:
                  if (!_context6.t0) {
                    _context6.next = 8;
                    break;
                  }
                  return _context6.abrupt("return");
                case 8:
                  _context6.t2 = timingObject.query().position;
                  _context6.next = 11;
                  return player.getCurrentTime();
                case 11:
                  _context6.t3 = _context6.sent;
                  diff = _context6.t2 - _context6.t3;
                  diffAbs = Math.abs(diff);
                  _this3.log("Drift: ".concat(diff));
                  if (!(diffAbs > maxAllowedDrift)) {
                    _context6.next = 22;
                    break;
                  }
                  _context6.next = 18;
                  return _this3.adjustSpeed(player, 0);
                case 18:
                  player.setCurrentTime(timingObject.query().position);
                  _this3.log("Resync by currentTime");
                  _context6.next = 29;
                  break;
                case 22:
                  if (!(diffAbs > allowedDrift)) {
                    _context6.next = 29;
                    break;
                  }
                  min = diffAbs / maxTimeToCatchUp;
                  max = maxRateAdjustment;
                  adjustment = min < max ? (max - min) / 2 : max;
                  _context6.next = 28;
                  return _this3.adjustSpeed(player, adjustment * Math.sign(diff));
                case 28:
                  _this3.log("Resync by playbackRate");
                case 29:
                case "end":
                  return _context6.stop();
              }
          }, _callee6);
        }));
        return function check2() {
          return _ref3.apply(this, arguments);
        };
      }();
      var interval = setInterval(function() {
        return check();
      }, syncInterval);
      return {
        cancel: function cancel() {
          return clearInterval(interval);
        }
      };
    }
    /**
     * @param {string} msg
     */
  }, {
    key: "log",
    value: function log(msg) {
      var _this$logger;
      (_this$logger = this.logger) === null || _this$logger === void 0 ? void 0 : _this$logger.call(this, "TimingSrcConnector: ".concat(msg));
    }
  }, {
    key: "waitForTOReadyState",
    value: (
      /**
       * @param {TimingObject} timingObject
       * @param {TConnectionState} state
       * @return {Promise<void>}
       */
      function waitForTOReadyState(timingObject, state) {
        return new Promise(function(resolve) {
          var check = function check2() {
            if (timingObject.readyState === state) {
              resolve();
            } else {
              timingObject.addEventListener("readystatechange", check2, {
                once: true
              });
            }
          };
          check();
        });
      }
    )
  }]);
  return TimingSrcConnector2;
}(/* @__PURE__ */ _wrapNativeSuper(EventTarget));
var playerMap = /* @__PURE__ */ new WeakMap();
var readyMap = /* @__PURE__ */ new WeakMap();
var screenfull = {};
var Player = /* @__PURE__ */ function() {
  function Player2(element) {
    var _this = this;
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    _classCallCheck(this, Player2);
    if (window.jQuery && element instanceof jQuery) {
      if (element.length > 1 && window.console && console.warn) {
        console.warn("A jQuery object with multiple elements was passed, using the first element.");
      }
      element = element[0];
    }
    if (typeof document !== "undefined" && typeof element === "string") {
      element = document.getElementById(element);
    }
    if (!isDomElement(element)) {
      throw new TypeError("You must pass either a valid element or a valid id.");
    }
    if (element.nodeName !== "IFRAME") {
      var iframe = element.querySelector("iframe");
      if (iframe) {
        element = iframe;
      }
    }
    if (element.nodeName === "IFRAME" && !isVimeoUrl(element.getAttribute("src") || "")) {
      throw new Error("The player element passed isn’t a Vimeo embed.");
    }
    if (playerMap.has(element)) {
      return playerMap.get(element);
    }
    this._window = element.ownerDocument.defaultView;
    this.element = element;
    this.origin = "*";
    var readyPromise = new npo_src(function(resolve, reject) {
      _this._onMessage = function(event) {
        if (!isVimeoUrl(event.origin) || _this.element.contentWindow !== event.source) {
          return;
        }
        if (_this.origin === "*") {
          _this.origin = event.origin;
        }
        var data = parseMessageData(event.data);
        var isError = data && data.event === "error";
        var isReadyError = isError && data.data && data.data.method === "ready";
        if (isReadyError) {
          var error = new Error(data.data.message);
          error.name = data.data.name;
          reject(error);
          return;
        }
        var isReadyEvent = data && data.event === "ready";
        var isPingResponse = data && data.method === "ping";
        if (isReadyEvent || isPingResponse) {
          _this.element.setAttribute("data-ready", "true");
          resolve();
          return;
        }
        processData(_this, data);
      };
      _this._window.addEventListener("message", _this._onMessage);
      if (_this.element.nodeName !== "IFRAME") {
        var params = getOEmbedParameters(element, options);
        var url = getVimeoUrl(params);
        getOEmbedData(url, params, element).then(function(data) {
          var iframe2 = createEmbed(data, element);
          _this.element = iframe2;
          _this._originalElement = element;
          swapCallbacks(element, iframe2);
          playerMap.set(_this.element, _this);
          return data;
        }).catch(reject);
      }
    });
    readyMap.set(this, readyPromise);
    playerMap.set(this.element, this);
    if (this.element.nodeName === "IFRAME") {
      postMessage(this, "ping");
    }
    if (screenfull.isEnabled) {
      var exitFullscreen = function exitFullscreen2() {
        return screenfull.exit();
      };
      this.fullscreenchangeHandler = function() {
        if (screenfull.isFullscreen) {
          storeCallback(_this, "event:exitFullscreen", exitFullscreen);
        } else {
          removeCallback(_this, "event:exitFullscreen", exitFullscreen);
        }
        _this.ready().then(function() {
          postMessage(_this, "fullscreenchange", screenfull.isFullscreen);
        });
      };
      screenfull.on("fullscreenchange", this.fullscreenchangeHandler);
    }
    return this;
  }
  _createClass(Player2, [{
    key: "callMethod",
    value: function callMethod(name) {
      var _this2 = this;
      var args = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return new npo_src(function(resolve, reject) {
        return _this2.ready().then(function() {
          storeCallback(_this2, name, {
            resolve,
            reject
          });
          postMessage(_this2, name, args);
        }).catch(reject);
      });
    }
    /**
     * Get a promise for the value of a player property.
     *
     * @param {string} name The property name
     * @return {Promise}
     */
  }, {
    key: "get",
    value: function get(name) {
      var _this3 = this;
      return new npo_src(function(resolve, reject) {
        name = getMethodName(name, "get");
        return _this3.ready().then(function() {
          storeCallback(_this3, name, {
            resolve,
            reject
          });
          postMessage(_this3, name);
        }).catch(reject);
      });
    }
    /**
     * Get a promise for setting the value of a player property.
     *
     * @param {string} name The API method to call.
     * @param {mixed} value The value to set.
     * @return {Promise}
     */
  }, {
    key: "set",
    value: function set(name, value) {
      var _this4 = this;
      return new npo_src(function(resolve, reject) {
        name = getMethodName(name, "set");
        if (value === void 0 || value === null) {
          throw new TypeError("There must be a value to set.");
        }
        return _this4.ready().then(function() {
          storeCallback(_this4, name, {
            resolve,
            reject
          });
          postMessage(_this4, name, value);
        }).catch(reject);
      });
    }
    /**
     * Add an event listener for the specified event. Will call the
     * callback with a single parameter, `data`, that contains the data for
     * that event.
     *
     * @param {string} eventName The name of the event.
     * @param {function(*)} callback The function to call when the event fires.
     * @return {void}
     */
  }, {
    key: "on",
    value: function on2(eventName, callback) {
      if (!eventName) {
        throw new TypeError("You must pass an event name.");
      }
      if (!callback) {
        throw new TypeError("You must pass a callback function.");
      }
      if (typeof callback !== "function") {
        throw new TypeError("The callback must be a function.");
      }
      var callbacks = getCallbacks(this, "event:".concat(eventName));
      if (callbacks.length === 0) {
        this.callMethod("addEventListener", eventName).catch(function() {
        });
      }
      storeCallback(this, "event:".concat(eventName), callback);
    }
    /**
     * Remove an event listener for the specified event. Will remove all
     * listeners for that event if a `callback` isn’t passed, or only that
     * specific callback if it is passed.
     *
     * @param {string} eventName The name of the event.
     * @param {function} [callback] The specific callback to remove.
     * @return {void}
     */
  }, {
    key: "off",
    value: function off2(eventName, callback) {
      if (!eventName) {
        throw new TypeError("You must pass an event name.");
      }
      if (callback && typeof callback !== "function") {
        throw new TypeError("The callback must be a function.");
      }
      var lastCallback = removeCallback(this, "event:".concat(eventName), callback);
      if (lastCallback) {
        this.callMethod("removeEventListener", eventName).catch(function(e) {
        });
      }
    }
    /**
     * A promise to load a new video.
     *
     * @promise LoadVideoPromise
     * @fulfill {number} The video with this id or url successfully loaded.
     * @reject {TypeError} The id was not a number.
     */
    /**
     * Load a new video into this embed. The promise will be resolved if
     * the video is successfully loaded, or it will be rejected if it could
     * not be loaded.
     *
     * @param {number|string|object} options The id of the video, the url of the video, or an object with embed options.
     * @return {LoadVideoPromise}
     */
  }, {
    key: "loadVideo",
    value: function loadVideo(options) {
      return this.callMethod("loadVideo", options);
    }
    /**
     * A promise to perform an action when the Player is ready.
     *
     * @todo document errors
     * @promise LoadVideoPromise
     * @fulfill {void}
     */
    /**
     * Trigger a function when the player iframe has initialized. You do not
     * need to wait for `ready` to trigger to begin adding event listeners
     * or calling other methods.
     *
     * @return {ReadyPromise}
     */
  }, {
    key: "ready",
    value: function ready() {
      var readyPromise = readyMap.get(this) || new npo_src(function(resolve, reject) {
        reject(new Error("Unknown player. Probably unloaded."));
      });
      return npo_src.resolve(readyPromise);
    }
    /**
     * A promise to add a cue point to the player.
     *
     * @promise AddCuePointPromise
     * @fulfill {string} The id of the cue point to use for removeCuePoint.
     * @reject {RangeError} the time was less than 0 or greater than the
     *         video’s duration.
     * @reject {UnsupportedError} Cue points are not supported with the current
     *         player or browser.
     */
    /**
     * Add a cue point to the player.
     *
     * @param {number} time The time for the cue point.
     * @param {object} [data] Arbitrary data to be returned with the cue point.
     * @return {AddCuePointPromise}
     */
  }, {
    key: "addCuePoint",
    value: function addCuePoint(time) {
      var data = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.callMethod("addCuePoint", {
        time,
        data
      });
    }
    /**
     * A promise to remove a cue point from the player.
     *
     * @promise AddCuePointPromise
     * @fulfill {string} The id of the cue point that was removed.
     * @reject {InvalidCuePoint} The cue point with the specified id was not
     *         found.
     * @reject {UnsupportedError} Cue points are not supported with the current
     *         player or browser.
     */
    /**
     * Remove a cue point from the video.
     *
     * @param {string} id The id of the cue point to remove.
     * @return {RemoveCuePointPromise}
     */
  }, {
    key: "removeCuePoint",
    value: function removeCuePoint(id) {
      return this.callMethod("removeCuePoint", id);
    }
    /**
     * A representation of a text track on a video.
     *
     * @typedef {Object} VimeoTextTrack
     * @property {string} language The ISO language code.
     * @property {string} kind The kind of track it is (captions or subtitles).
     * @property {string} label The human‐readable label for the track.
     */
    /**
     * A promise to enable a text track.
     *
     * @promise EnableTextTrackPromise
     * @fulfill {VimeoTextTrack} The text track that was enabled.
     * @reject {InvalidTrackLanguageError} No track was available with the
     *         specified language.
     * @reject {InvalidTrackError} No track was available with the specified
     *         language and kind.
     */
    /**
     * Enable the text track with the specified language, and optionally the
     * specified kind (captions or subtitles).
     *
     * When set via the API, the track language will not change the viewer’s
     * stored preference.
     *
     * @param {string} language The two‐letter language code.
     * @param {string} [kind] The kind of track to enable (captions or subtitles).
     * @return {EnableTextTrackPromise}
     */
  }, {
    key: "enableTextTrack",
    value: function enableTextTrack(language, kind) {
      if (!language) {
        throw new TypeError("You must pass a language.");
      }
      return this.callMethod("enableTextTrack", {
        language,
        kind
      });
    }
    /**
     * A promise to disable the active text track.
     *
     * @promise DisableTextTrackPromise
     * @fulfill {void} The track was disabled.
     */
    /**
     * Disable the currently-active text track.
     *
     * @return {DisableTextTrackPromise}
     */
  }, {
    key: "disableTextTrack",
    value: function disableTextTrack() {
      return this.callMethod("disableTextTrack");
    }
    /**
     * A promise to pause the video.
     *
     * @promise PausePromise
     * @fulfill {void} The video was paused.
     */
    /**
     * Pause the video if it’s playing.
     *
     * @return {PausePromise}
     */
  }, {
    key: "pause",
    value: function pause() {
      return this.callMethod("pause");
    }
    /**
     * A promise to play the video.
     *
     * @promise PlayPromise
     * @fulfill {void} The video was played.
     */
    /**
     * Play the video if it’s paused. **Note:** on iOS and some other
     * mobile devices, you cannot programmatically trigger play. Once the
     * viewer has tapped on the play button in the player, however, you
     * will be able to use this function.
     *
     * @return {PlayPromise}
     */
  }, {
    key: "play",
    value: function play() {
      return this.callMethod("play");
    }
    /**
     * Request that the player enters fullscreen.
     * @return {Promise}
     */
  }, {
    key: "requestFullscreen",
    value: function requestFullscreen() {
      if (screenfull.isEnabled) {
        return screenfull.request(this.element);
      }
      return this.callMethod("requestFullscreen");
    }
    /**
     * Request that the player exits fullscreen.
     * @return {Promise}
     */
  }, {
    key: "exitFullscreen",
    value: function exitFullscreen() {
      if (screenfull.isEnabled) {
        return screenfull.exit();
      }
      return this.callMethod("exitFullscreen");
    }
    /**
     * Returns true if the player is currently fullscreen.
     * @return {Promise}
     */
  }, {
    key: "getFullscreen",
    value: function getFullscreen() {
      if (screenfull.isEnabled) {
        return npo_src.resolve(screenfull.isFullscreen);
      }
      return this.get("fullscreen");
    }
    /**
     * Request that the player enters picture-in-picture.
     * @return {Promise}
     */
  }, {
    key: "requestPictureInPicture",
    value: function requestPictureInPicture() {
      return this.callMethod("requestPictureInPicture");
    }
    /**
     * Request that the player exits picture-in-picture.
     * @return {Promise}
     */
  }, {
    key: "exitPictureInPicture",
    value: function exitPictureInPicture() {
      return this.callMethod("exitPictureInPicture");
    }
    /**
     * Returns true if the player is currently picture-in-picture.
     * @return {Promise}
     */
  }, {
    key: "getPictureInPicture",
    value: function getPictureInPicture() {
      return this.get("pictureInPicture");
    }
    /**
     * A promise to prompt the viewer to initiate remote playback.
     *
     * @promise RemotePlaybackPromptPromise
     * @fulfill {void}
     * @reject {NotFoundError} No remote playback device is available.
     */
    /**
     * Request to prompt the user to initiate remote playback.
     *
     * @return {RemotePlaybackPromptPromise}
     */
  }, {
    key: "remotePlaybackPrompt",
    value: function remotePlaybackPrompt() {
      return this.callMethod("remotePlaybackPrompt");
    }
    /**
     * A promise to unload the video.
     *
     * @promise UnloadPromise
     * @fulfill {void} The video was unloaded.
     */
    /**
     * Return the player to its initial state.
     *
     * @return {UnloadPromise}
     */
  }, {
    key: "unload",
    value: function unload() {
      return this.callMethod("unload");
    }
    /**
     * Cleanup the player and remove it from the DOM
     *
     * It won't be usable and a new one should be constructed
     *  in order to do any operations.
     *
     * @return {Promise}
     */
  }, {
    key: "destroy",
    value: function destroy() {
      var _this5 = this;
      return new npo_src(function(resolve) {
        readyMap.delete(_this5);
        playerMap.delete(_this5.element);
        if (_this5._originalElement) {
          playerMap.delete(_this5._originalElement);
          _this5._originalElement.removeAttribute("data-vimeo-initialized");
        }
        if (_this5.element && _this5.element.nodeName === "IFRAME" && _this5.element.parentNode) {
          if (_this5.element.parentNode.parentNode && _this5._originalElement && _this5._originalElement !== _this5.element.parentNode) {
            _this5.element.parentNode.parentNode.removeChild(_this5.element.parentNode);
          } else {
            _this5.element.parentNode.removeChild(_this5.element);
          }
        }
        if (_this5.element && _this5.element.nodeName === "DIV" && _this5.element.parentNode) {
          _this5.element.removeAttribute("data-vimeo-initialized");
          var iframe = _this5.element.querySelector("iframe");
          if (iframe && iframe.parentNode) {
            if (iframe.parentNode.parentNode && _this5._originalElement && _this5._originalElement !== iframe.parentNode) {
              iframe.parentNode.parentNode.removeChild(iframe.parentNode);
            } else {
              iframe.parentNode.removeChild(iframe);
            }
          }
        }
        _this5._window.removeEventListener("message", _this5._onMessage);
        if (screenfull.isEnabled) {
          screenfull.off("fullscreenchange", _this5.fullscreenchangeHandler);
        }
        resolve();
      });
    }
    /**
     * A promise to get the autopause behavior of the video.
     *
     * @promise GetAutopausePromise
     * @fulfill {boolean} Whether autopause is turned on or off.
     * @reject {UnsupportedError} Autopause is not supported with the current
     *         player or browser.
     */
    /**
     * Get the autopause behavior for this player.
     *
     * @return {GetAutopausePromise}
     */
  }, {
    key: "getAutopause",
    value: function getAutopause() {
      return this.get("autopause");
    }
    /**
     * A promise to set the autopause behavior of the video.
     *
     * @promise SetAutopausePromise
     * @fulfill {boolean} Whether autopause is turned on or off.
     * @reject {UnsupportedError} Autopause is not supported with the current
     *         player or browser.
     */
    /**
     * Enable or disable the autopause behavior of this player.
     *
     * By default, when another video is played in the same browser, this
     * player will automatically pause. Unless you have a specific reason
     * for doing so, we recommend that you leave autopause set to the
     * default (`true`).
     *
     * @param {boolean} autopause
     * @return {SetAutopausePromise}
     */
  }, {
    key: "setAutopause",
    value: function setAutopause(autopause) {
      return this.set("autopause", autopause);
    }
    /**
     * A promise to get the buffered property of the video.
     *
     * @promise GetBufferedPromise
     * @fulfill {Array} Buffered Timeranges converted to an Array.
     */
    /**
     * Get the buffered property of the video.
     *
     * @return {GetBufferedPromise}
     */
  }, {
    key: "getBuffered",
    value: function getBuffered() {
      return this.get("buffered");
    }
    /**
     * @typedef {Object} CameraProperties
     * @prop {number} props.yaw - Number between 0 and 360.
     * @prop {number} props.pitch - Number between -90 and 90.
     * @prop {number} props.roll - Number between -180 and 180.
     * @prop {number} props.fov - The field of view in degrees.
     */
    /**
     * A promise to get the camera properties of the player.
     *
     * @promise GetCameraPromise
     * @fulfill {CameraProperties} The camera properties.
     */
    /**
     * For 360° videos get the camera properties for this player.
     *
     * @return {GetCameraPromise}
     */
  }, {
    key: "getCameraProps",
    value: function getCameraProps() {
      return this.get("cameraProps");
    }
    /**
     * A promise to set the camera properties of the player.
     *
     * @promise SetCameraPromise
     * @fulfill {Object} The camera was successfully set.
     * @reject {RangeError} The range was out of bounds.
     */
    /**
     * For 360° videos set the camera properties for this player.
     *
     * @param {CameraProperties} camera The camera properties
     * @return {SetCameraPromise}
     */
  }, {
    key: "setCameraProps",
    value: function setCameraProps(camera) {
      return this.set("cameraProps", camera);
    }
    /**
     * A representation of a chapter.
     *
     * @typedef {Object} VimeoChapter
     * @property {number} startTime The start time of the chapter.
     * @property {object} title The title of the chapter.
     * @property {number} index The place in the order of Chapters. Starts at 1.
     */
    /**
     * A promise to get chapters for the video.
     *
     * @promise GetChaptersPromise
     * @fulfill {VimeoChapter[]} The chapters for the video.
     */
    /**
     * Get an array of all the chapters for the video.
     *
     * @return {GetChaptersPromise}
     */
  }, {
    key: "getChapters",
    value: function getChapters() {
      return this.get("chapters");
    }
    /**
     * A promise to get the currently active chapter.
     *
     * @promise GetCurrentChaptersPromise
     * @fulfill {VimeoChapter|undefined} The current chapter for the video.
     */
    /**
     * Get the currently active chapter for the video.
     *
     * @return {GetCurrentChaptersPromise}
     */
  }, {
    key: "getCurrentChapter",
    value: function getCurrentChapter() {
      return this.get("currentChapter");
    }
    /**
     * A promise to get the accent color of the player.
     *
     * @promise GetColorPromise
     * @fulfill {string} The hex color of the player.
     */
    /**
     * Get the accent color for this player. Note this is deprecated in place of `getColorTwo`.
     *
     * @return {GetColorPromise}
     */
  }, {
    key: "getColor",
    value: function getColor() {
      return this.get("color");
    }
    /**
     * A promise to get all colors for the player in an array.
     *
     * @promise GetColorsPromise
     * @fulfill {string[]} The hex colors of the player.
     */
    /**
     * Get all the colors for this player in an array: [colorOne, colorTwo, colorThree, colorFour]
     *
     * @return {GetColorPromise}
     */
  }, {
    key: "getColors",
    value: function getColors() {
      return npo_src.all([this.get("colorOne"), this.get("colorTwo"), this.get("colorThree"), this.get("colorFour")]);
    }
    /**
     * A promise to set the accent color of the player.
     *
     * @promise SetColorPromise
     * @fulfill {string} The color was successfully set.
     * @reject {TypeError} The string was not a valid hex or rgb color.
     * @reject {ContrastError} The color was set, but the contrast is
     *         outside of the acceptable range.
     * @reject {EmbedSettingsError} The owner of the player has chosen to
     *         use a specific color.
     */
    /**
     * Set the accent color of this player to a hex or rgb string. Setting the
     * color may fail if the owner of the video has set their embed
     * preferences to force a specific color.
     * Note this is deprecated in place of `setColorTwo`.
     *
     * @param {string} color The hex or rgb color string to set.
     * @return {SetColorPromise}
     */
  }, {
    key: "setColor",
    value: function setColor(color) {
      return this.set("color", color);
    }
    /**
     * A promise to set all colors for the player.
     *
     * @promise SetColorsPromise
     * @fulfill {string[]} The colors were successfully set.
     * @reject {TypeError} The string was not a valid hex or rgb color.
     * @reject {ContrastError} The color was set, but the contrast is
     *         outside of the acceptable range.
     * @reject {EmbedSettingsError} The owner of the player has chosen to
     *         use a specific color.
     */
    /**
     * Set the colors of this player to a hex or rgb string. Setting the
     * color may fail if the owner of the video has set their embed
     * preferences to force a specific color.
     * The colors should be passed in as an array: [colorOne, colorTwo, colorThree, colorFour].
     * If a color should not be set, the index in the array can be left as null.
     *
     * @param {string[]} colors Array of the hex or rgb color strings to set.
     * @return {SetColorsPromise}
     */
  }, {
    key: "setColors",
    value: function setColors(colors) {
      if (!Array.isArray(colors)) {
        return new npo_src(function(resolve, reject) {
          return reject(new TypeError("Argument must be an array."));
        });
      }
      var nullPromise = new npo_src(function(resolve) {
        return resolve(null);
      });
      var colorPromises = [colors[0] ? this.set("colorOne", colors[0]) : nullPromise, colors[1] ? this.set("colorTwo", colors[1]) : nullPromise, colors[2] ? this.set("colorThree", colors[2]) : nullPromise, colors[3] ? this.set("colorFour", colors[3]) : nullPromise];
      return npo_src.all(colorPromises);
    }
    /**
     * A representation of a cue point.
     *
     * @typedef {Object} VimeoCuePoint
     * @property {number} time The time of the cue point.
     * @property {object} data The data passed when adding the cue point.
     * @property {string} id The unique id for use with removeCuePoint.
     */
    /**
     * A promise to get the cue points of a video.
     *
     * @promise GetCuePointsPromise
     * @fulfill {VimeoCuePoint[]} The cue points added to the video.
     * @reject {UnsupportedError} Cue points are not supported with the current
     *         player or browser.
     */
    /**
     * Get an array of the cue points added to the video.
     *
     * @return {GetCuePointsPromise}
     */
  }, {
    key: "getCuePoints",
    value: function getCuePoints() {
      return this.get("cuePoints");
    }
    /**
     * A promise to get the current time of the video.
     *
     * @promise GetCurrentTimePromise
     * @fulfill {number} The current time in seconds.
     */
    /**
     * Get the current playback position in seconds.
     *
     * @return {GetCurrentTimePromise}
     */
  }, {
    key: "getCurrentTime",
    value: function getCurrentTime() {
      return this.get("currentTime");
    }
    /**
     * A promise to set the current time of the video.
     *
     * @promise SetCurrentTimePromise
     * @fulfill {number} The actual current time that was set.
     * @reject {RangeError} the time was less than 0 or greater than the
     *         video’s duration.
     */
    /**
     * Set the current playback position in seconds. If the player was
     * paused, it will remain paused. Likewise, if the player was playing,
     * it will resume playing once the video has buffered.
     *
     * You can provide an accurate time and the player will attempt to seek
     * to as close to that time as possible. The exact time will be the
     * fulfilled value of the promise.
     *
     * @param {number} currentTime
     * @return {SetCurrentTimePromise}
     */
  }, {
    key: "setCurrentTime",
    value: function setCurrentTime(currentTime) {
      return this.set("currentTime", currentTime);
    }
    /**
     * A promise to get the duration of the video.
     *
     * @promise GetDurationPromise
     * @fulfill {number} The duration in seconds.
     */
    /**
     * Get the duration of the video in seconds. It will be rounded to the
     * nearest second before playback begins, and to the nearest thousandth
     * of a second after playback begins.
     *
     * @return {GetDurationPromise}
     */
  }, {
    key: "getDuration",
    value: function getDuration() {
      return this.get("duration");
    }
    /**
     * A promise to get the ended state of the video.
     *
     * @promise GetEndedPromise
     * @fulfill {boolean} Whether or not the video has ended.
     */
    /**
     * Get the ended state of the video. The video has ended if
     * `currentTime === duration`.
     *
     * @return {GetEndedPromise}
     */
  }, {
    key: "getEnded",
    value: function getEnded() {
      return this.get("ended");
    }
    /**
     * A promise to get the loop state of the player.
     *
     * @promise GetLoopPromise
     * @fulfill {boolean} Whether or not the player is set to loop.
     */
    /**
     * Get the loop state of the player.
     *
     * @return {GetLoopPromise}
     */
  }, {
    key: "getLoop",
    value: function getLoop() {
      return this.get("loop");
    }
    /**
     * A promise to set the loop state of the player.
     *
     * @promise SetLoopPromise
     * @fulfill {boolean} The loop state that was set.
     */
    /**
     * Set the loop state of the player. When set to `true`, the player
     * will start over immediately once playback ends.
     *
     * @param {boolean} loop
     * @return {SetLoopPromise}
     */
  }, {
    key: "setLoop",
    value: function setLoop(loop) {
      return this.set("loop", loop);
    }
    /**
     * A promise to set the muted state of the player.
     *
     * @promise SetMutedPromise
     * @fulfill {boolean} The muted state that was set.
     */
    /**
     * Set the muted state of the player. When set to `true`, the player
     * volume will be muted.
     *
     * @param {boolean} muted
     * @return {SetMutedPromise}
     */
  }, {
    key: "setMuted",
    value: function setMuted(muted) {
      return this.set("muted", muted);
    }
    /**
     * A promise to get the muted state of the player.
     *
     * @promise GetMutedPromise
     * @fulfill {boolean} Whether or not the player is muted.
     */
    /**
     * Get the muted state of the player.
     *
     * @return {GetMutedPromise}
     */
  }, {
    key: "getMuted",
    value: function getMuted() {
      return this.get("muted");
    }
    /**
     * A promise to get the paused state of the player.
     *
     * @promise GetLoopPromise
     * @fulfill {boolean} Whether or not the video is paused.
     */
    /**
     * Get the paused state of the player.
     *
     * @return {GetLoopPromise}
     */
  }, {
    key: "getPaused",
    value: function getPaused() {
      return this.get("paused");
    }
    /**
     * A promise to get the playback rate of the player.
     *
     * @promise GetPlaybackRatePromise
     * @fulfill {number} The playback rate of the player on a scale from 0 to 2.
     */
    /**
     * Get the playback rate of the player on a scale from `0` to `2`.
     *
     * @return {GetPlaybackRatePromise}
     */
  }, {
    key: "getPlaybackRate",
    value: function getPlaybackRate() {
      return this.get("playbackRate");
    }
    /**
     * A promise to set the playbackrate of the player.
     *
     * @promise SetPlaybackRatePromise
     * @fulfill {number} The playback rate was set.
     * @reject {RangeError} The playback rate was less than 0 or greater than 2.
     */
    /**
     * Set the playback rate of the player on a scale from `0` to `2`. When set
     * via the API, the playback rate will not be synchronized to other
     * players or stored as the viewer's preference.
     *
     * @param {number} playbackRate
     * @return {SetPlaybackRatePromise}
     */
  }, {
    key: "setPlaybackRate",
    value: function setPlaybackRate(playbackRate) {
      return this.set("playbackRate", playbackRate);
    }
    /**
     * A promise to get the played property of the video.
     *
     * @promise GetPlayedPromise
     * @fulfill {Array} Played Timeranges converted to an Array.
     */
    /**
     * Get the played property of the video.
     *
     * @return {GetPlayedPromise}
     */
  }, {
    key: "getPlayed",
    value: function getPlayed() {
      return this.get("played");
    }
    /**
     * A promise to get the qualities available of the current video.
     *
     * @promise GetQualitiesPromise
     * @fulfill {Array} The qualities of the video.
     */
    /**
     * Get the qualities of the current video.
     *
     * @return {GetQualitiesPromise}
     */
  }, {
    key: "getQualities",
    value: function getQualities() {
      return this.get("qualities");
    }
    /**
     * A promise to get the current set quality of the video.
     *
     * @promise GetQualityPromise
     * @fulfill {string} The current set quality.
     */
    /**
     * Get the current set quality of the video.
     *
     * @return {GetQualityPromise}
     */
  }, {
    key: "getQuality",
    value: function getQuality() {
      return this.get("quality");
    }
    /**
     * A promise to set the video quality.
     *
     * @promise SetQualityPromise
     * @fulfill {number} The quality was set.
     * @reject {RangeError} The quality is not available.
     */
    /**
     * Set a video quality.
     *
     * @param {string} quality
     * @return {SetQualityPromise}
     */
  }, {
    key: "setQuality",
    value: function setQuality(quality) {
      return this.set("quality", quality);
    }
    /**
     * A promise to get the remote playback availability.
     *
     * @promise RemotePlaybackAvailabilityPromise
     * @fulfill {boolean} Whether remote playback is available.
     */
    /**
     * Get the availability of remote playback.
     *
     * @return {RemotePlaybackAvailabilityPromise}
     */
  }, {
    key: "getRemotePlaybackAvailability",
    value: function getRemotePlaybackAvailability() {
      return this.get("remotePlaybackAvailability");
    }
    /**
     * A promise to get the current remote playback state.
     *
     * @promise RemotePlaybackStatePromise
     * @fulfill {string} The state of the remote playback: connecting, connected, or disconnected.
     */
    /**
     * Get the current remote playback state.
     *
     * @return {RemotePlaybackStatePromise}
     */
  }, {
    key: "getRemotePlaybackState",
    value: function getRemotePlaybackState() {
      return this.get("remotePlaybackState");
    }
    /**
     * A promise to get the seekable property of the video.
     *
     * @promise GetSeekablePromise
     * @fulfill {Array} Seekable Timeranges converted to an Array.
     */
    /**
     * Get the seekable property of the video.
     *
     * @return {GetSeekablePromise}
     */
  }, {
    key: "getSeekable",
    value: function getSeekable() {
      return this.get("seekable");
    }
    /**
     * A promise to get the seeking property of the player.
     *
     * @promise GetSeekingPromise
     * @fulfill {boolean} Whether or not the player is currently seeking.
     */
    /**
     * Get if the player is currently seeking.
     *
     * @return {GetSeekingPromise}
     */
  }, {
    key: "getSeeking",
    value: function getSeeking() {
      return this.get("seeking");
    }
    /**
     * A promise to get the text tracks of a video.
     *
     * @promise GetTextTracksPromise
     * @fulfill {VimeoTextTrack[]} The text tracks associated with the video.
     */
    /**
     * Get an array of the text tracks that exist for the video.
     *
     * @return {GetTextTracksPromise}
     */
  }, {
    key: "getTextTracks",
    value: function getTextTracks() {
      return this.get("textTracks");
    }
    /**
     * A promise to get the embed code for the video.
     *
     * @promise GetVideoEmbedCodePromise
     * @fulfill {string} The `<iframe>` embed code for the video.
     */
    /**
     * Get the `<iframe>` embed code for the video.
     *
     * @return {GetVideoEmbedCodePromise}
     */
  }, {
    key: "getVideoEmbedCode",
    value: function getVideoEmbedCode() {
      return this.get("videoEmbedCode");
    }
    /**
     * A promise to get the id of the video.
     *
     * @promise GetVideoIdPromise
     * @fulfill {number} The id of the video.
     */
    /**
     * Get the id of the video.
     *
     * @return {GetVideoIdPromise}
     */
  }, {
    key: "getVideoId",
    value: function getVideoId() {
      return this.get("videoId");
    }
    /**
     * A promise to get the title of the video.
     *
     * @promise GetVideoTitlePromise
     * @fulfill {number} The title of the video.
     */
    /**
     * Get the title of the video.
     *
     * @return {GetVideoTitlePromise}
     */
  }, {
    key: "getVideoTitle",
    value: function getVideoTitle() {
      return this.get("videoTitle");
    }
    /**
     * A promise to get the native width of the video.
     *
     * @promise GetVideoWidthPromise
     * @fulfill {number} The native width of the video.
     */
    /**
     * Get the native width of the currently‐playing video. The width of
     * the highest‐resolution available will be used before playback begins.
     *
     * @return {GetVideoWidthPromise}
     */
  }, {
    key: "getVideoWidth",
    value: function getVideoWidth() {
      return this.get("videoWidth");
    }
    /**
     * A promise to get the native height of the video.
     *
     * @promise GetVideoHeightPromise
     * @fulfill {number} The native height of the video.
     */
    /**
     * Get the native height of the currently‐playing video. The height of
     * the highest‐resolution available will be used before playback begins.
     *
     * @return {GetVideoHeightPromise}
     */
  }, {
    key: "getVideoHeight",
    value: function getVideoHeight() {
      return this.get("videoHeight");
    }
    /**
     * A promise to get the vimeo.com url for the video.
     *
     * @promise GetVideoUrlPromise
     * @fulfill {number} The vimeo.com url for the video.
     * @reject {PrivacyError} The url isn’t available because of the video’s privacy setting.
     */
    /**
     * Get the vimeo.com url for the video.
     *
     * @return {GetVideoUrlPromise}
     */
  }, {
    key: "getVideoUrl",
    value: function getVideoUrl() {
      return this.get("videoUrl");
    }
    /**
     * A promise to get the volume level of the player.
     *
     * @promise GetVolumePromise
     * @fulfill {number} The volume level of the player on a scale from 0 to 1.
     */
    /**
     * Get the current volume level of the player on a scale from `0` to `1`.
     *
     * Most mobile devices do not support an independent volume from the
     * system volume. In those cases, this method will always return `1`.
     *
     * @return {GetVolumePromise}
     */
  }, {
    key: "getVolume",
    value: function getVolume() {
      return this.get("volume");
    }
    /**
     * A promise to set the volume level of the player.
     *
     * @promise SetVolumePromise
     * @fulfill {number} The volume was set.
     * @reject {RangeError} The volume was less than 0 or greater than 1.
     */
    /**
     * Set the volume of the player on a scale from `0` to `1`. When set
     * via the API, the volume level will not be synchronized to other
     * players or stored as the viewer’s preference.
     *
     * Most mobile devices do not support setting the volume. An error will
     * *not* be triggered in that situation.
     *
     * @param {number} volume
     * @return {SetVolumePromise}
     */
  }, {
    key: "setVolume",
    value: function setVolume(volume) {
      return this.set("volume", volume);
    }
    /** @typedef {import('./lib/timing-object.types').TimingObject} TimingObject */
    /** @typedef {import('./lib/timing-src-connector.types').TimingSrcConnectorOptions} TimingSrcConnectorOptions */
    /** @typedef {import('./lib/timing-src-connector').TimingSrcConnector} TimingSrcConnector */
    /**
     * Connects a TimingObject to the video player (https://webtiming.github.io/timingobject/)
     *
     * @param {TimingObject} timingObject
     * @param {TimingSrcConnectorOptions} options
     *
     * @return {Promise<TimingSrcConnector>}
     */
  }, {
    key: "setTimingSrc",
    value: function() {
      var _setTimingSrc = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee(timingObject, options) {
        var _this6 = this;
        var connector;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1)
            switch (_context.prev = _context.next) {
              case 0:
                if (timingObject) {
                  _context.next = 2;
                  break;
                }
                throw new TypeError("A Timing Object must be provided.");
              case 2:
                _context.next = 4;
                return this.ready();
              case 4:
                connector = new TimingSrcConnector(this, timingObject, options);
                postMessage(this, "notifyTimingObjectConnect");
                connector.addEventListener("disconnect", function() {
                  return postMessage(_this6, "notifyTimingObjectDisconnect");
                });
                return _context.abrupt("return", connector);
              case 8:
              case "end":
                return _context.stop();
            }
        }, _callee, this);
      }));
      function setTimingSrc(_x, _x2) {
        return _setTimingSrc.apply(this, arguments);
      }
      return setTimingSrc;
    }()
  }]);
  return Player2;
}();
if (!isNode) {
  screenfull = initializeScreenfull();
  initializeEmbeds();
  resizeEmbeds();
  initAppendVideoMetadata();
  checkUrlTimeParam();
}
function initYoutubePlayer(videoWrapper, options) {
  const defaultOptions2 = {
    autoplay: 0,
    controls: 0,
    showinfo: 0,
    rel: 0,
    playsinline: 1
  };
  const settings = { ...defaultOptions2, ...options };
  const player = YouTubePlayer(videoWrapper, {
    videoId: videoWrapper.dataset.videoId,
    playerVars: {
      ...settings,
      playlist: videoWrapper.dataset.videoId
    }
  });
  player.setPlaybackQuality("hd720");
  return player;
}
function initVimeoPlayer(videoWrapper, options) {
  const defaultOptions2 = {
    controls: true,
    muted: true,
    autopause: false
  };
  const settings = { ...defaultOptions2, ...options };
  return new Player(videoWrapper, {
    id: videoWrapper.dataset.videoId,
    ...settings
  });
}
const Video = ({ videoContainer, options }) => {
  const VIDEO_TYPES2 = window.themeCore.utils.VIDEO_TYPES;
  const selectors2 = {
    videoElement: ".js-video",
    nodeToSetYoutubeIframe: ".js-video-youtube"
  };
  function createVideos(videoContainer2) {
    const videoElements = [
      ...videoContainer2.querySelectorAll(selectors2.videoElement)
    ];
    return videoElements.map((videoElement) => {
      const { type, device } = videoElement.dataset;
      return {
        device,
        type,
        videoWrapper: videoElement,
        player: initPlayer(videoElement, type)
      };
    });
  }
  function initPlayer(videoElement, type) {
    switch (type) {
      case VIDEO_TYPES2.html: {
        return videoElement;
      }
      case VIDEO_TYPES2.vimeo: {
        return initVimeoPlayer(videoElement, options && options.vimeo);
      }
      case VIDEO_TYPES2.youtube: {
        const nodeToSetYoutubeIframe = videoElement.querySelector(
          selectors2.nodeToSetYoutubeIframe
        );
        return initYoutubePlayer(
          nodeToSetYoutubeIframe,
          options && options.youtube
        );
      }
      default:
        return;
    }
  }
  function init() {
    try {
      return createVideos(videoContainer);
    } catch (e) {
      console.error(new Error("Could not find video container"));
    }
  }
  return Object.freeze({
    init
  });
};
const DOMContentLoadedPromise = new Promise((resolve) => {
  document.addEventListener("DOMContentLoaded", async () => {
    window.theme = window.theme || {};
    window.themeCore = window.themeCore || {};
    window.themeCore.libs = window.themeCore.libs || {};
    window.themeCore.utils = window.themeCore.utils || {};
    window.themeCore.sections = {};
    window.themeCore.externalUtils = {};
    window.themeCore.utils.bodyScrollLock = bodyScrollLock;
    Swiper.use([A11y, Pagination, Navigation, Thumb, Zoom]);
    window.themeCore.utils.Swiper = Swiper;
    window.themeCore.utils.swiperA11y = A11y;
    window.themeCore.utils.swiperPagination = Pagination;
    window.themeCore.utils.swiperZoom = Zoom;
    window.themeCore.utils.ProductForm = ProductForm;
    window.themeCore.utils.getUrlWithVariant = getUrlWithVariant;
    window.themeCore.utils.overlay = overlay;
    window.themeCore.utils.images = images();
    window.themeCore.utils.cssClasses = cssClasses;
    window.themeCore.utils.extendDefaults = extendDefaults;
    window.themeCore.utils.on = on;
    window.themeCore.utils.off = off;
    window.themeCore.utils.isElementInViewport = isElementInViewport;
    window.themeCore.utils.formToJSON = formToJSON;
    window.themeCore.utils.arrayIncludes = arrayIncludes;
    window.themeCore.utils.convertFormData = convertFormData;
    window.themeCore.utils.throttle = throttle;
    window.themeCore.utils.debounce = debounce;
    window.themeCore.utils.icons = icons;
    window.themeCore.utils.isElement = isElement;
    window.themeCore.utils.focusable = focusable;
    window.themeCore.utils.updateTabindexOnElement = updateTabindexOnElement;
    window.themeCore.utils.removeTrapFocus = removeTrapFocus;
    window.themeCore.utils.handleTabulationOnSlides = handleTabulationOnSlides;
    window.themeCore.utils.handleTabulationOnSlidesWithMultipleVisibleSlides = handleTabulationOnSlidesWithMultipleVisibleSlides;
    window.themeCore.utils.parseJSONfromMarkup = parseJSONfromMarkup;
    window.themeCore.utils.trapFocus = trapFocus;
    window.themeCore.utils.bind = bind;
    window.themeCore.utils.formatMoney = formatMoney;
    window.themeCore.utils.setCookie = setCookie;
    window.themeCore.utils.getCookie = getCookie;
    window.themeCore.utils.deleteCookie = deleteCookie;
    window.themeCore.utils.VIDEO_TYPES = VIDEO_TYPES;
    window.themeCore.utils.register = register;
    window.themeCore.utils.registerExternalUtil = registerExternalUtil;
    window.themeCore.utils.getExternalUtil = getExternalUtil;
    window.themeCore.utils.QuantityWidget = QuantityWidget;
    window.themeCore.utils.CartUpsell = CartUpsell;
    window.themeCore.utils.Preloder = Preloder;
    window.themeCore.utils.Toggle = Toggle;
    window.themeCore.utils.Timer = Timer;
    window.themeCore.utils.Video = Video;
    window.themeCore.ProductCountDownTimer = window.themeCore.ProductCountDownTimer || ProductCountDownTimer();
    window.themeCore.EventBus = window.themeCore.EventBus || EventBus();
    window.themeCore.Accordion = window.themeCore.Accordion || Accordion();
    window.themeCore.Popover = window.themeCore.Popover || Popover();
    window.themeCore.BackToTop = window.themeCore.BackToTop || BackToTop();
    window.themeCore.Tabs = window.themeCore.Tabs || Tabs();
    window.themeCore.ProductCard = window.themeCore.ProductCard || ProductCard();
    window.themeCore.QuickView = window.themeCore.QuickView || QuickView();
    window.themeCore.LazyLoadImages = window.themeCore.LazyLoadImages || LazyLoadImages();
    window.themeCore.ScrollDirection = window.themeCore.ScrollDirection || ScrollDirection();
    window.themeCore.LocalizationForm = window.themeCore.LocalizationForm || localizationForm;
    window.themeCore.CartApi = window.themeCore.CartApi || CartApi();
    window.themeCore.Challenge = window.themeCore.Challenge || Challenge();
    window.themeCore.AddToCart = window.themeCore.AddToCart || AddToCart();
    window.themeCore.ShareButton = window.themeCore.ShareButton || ShareButton();
    window.themeCore.Challenge.init();
    window.themeCore.ProductCard.init();
    window.themeCore.QuickView.init();
    window.themeCore.Tabs.init();
    window.themeCore.LazyLoadImages.init();
    window.themeCore.Accordion.init();
    window.themeCore.ScrollDirection.init();
    window.themeCore.LocalizationForm.init;
    window.themeCore.AddToCart.init();
    window.themeCore.ProductCountDownTimer.init();
    window.themeCore.BackToTop.init();
    window.themeCore.ShareButton.init();
    window.themeCore.Popover.init();
    resolve();
  });
});
(async () => {
  const selectors2 = {
    script: "script[src]",
    appBlock: ".shopify-app-block",
    section: (id) => `#shopify-section-${id}`,
    shopifySection: ".shopify-section"
  };
  const attributes2 = {
    sectionData: "data-shopify-editor-section"
  };
  const sectionsToRerenderByType = [
    "age-check-popup",
    "geo-location",
    "announcement-bar",
    "blog-template",
    "cart-template",
    "cart-drawer",
    "collection-body",
    "cookie-bar",
    "newsletter-popup",
    "password-header",
    "promotion-banner",
    "search-template"
  ];
  try {
    await Promise.resolve(DOMContentLoadedPromise);
    const getLoadedScripts = () => {
      return [...document.querySelectorAll(selectors2.script)];
    };
    let loadedScripts = getLoadedScripts();
    const getNewLoadedScripts = () => {
      return getLoadedScripts().filter((script) => !loadedScripts.includes(script));
    };
    const addScripts = (scripts) => {
      scripts.forEach((script) => {
        const element = document.createElement("script");
        element.setAttribute("type", script.getAttribute("type"));
        element.setAttribute("src", script.getAttribute("src"));
        document.body.append(element);
      });
      loadedScripts = [...loadedScripts, ...scripts];
    };
    const rewriteElementsExcept = (parent, exceptSelector) => {
      const hasAppBlock = `:has(${exceptSelector})`;
      const appBlockOrParent = `${hasAppBlock}, ${exceptSelector}`;
      Array.from(parent.children).forEach((element) => {
        if (!element.matches(appBlockOrParent)) {
          const newElement = element.cloneNode(true);
          element.parentNode.replaceChild(newElement, element);
        }
      });
      const elementsWithAppBlocks = Array.from(parent.children).filter((element) => element.matches(hasAppBlock));
      elementsWithAppBlocks.forEach((element) => rewriteElementsExcept(element, exceptSelector));
    };
    const removePageBlur = (type) => {
      const blurTargets = {
        "age-check-popup": ["AgeCheckPopupToggle"],
        "geo-location-popup": ["GeoLocationPopupToggle"],
        "newsletter-popup": ["NewsletterPopupToggle"],
        "cart-drawer": ["CartUpsellDrawer", "CartDrawer"],
        "header": ["headerToggleMenuDrawer"],
        "pickup-availability": ["productAvailability-"],
        "promotion-banner": ["promotion-products-popup-toggle"],
        "password-header": ["password-popup"],
        "product": ["product-ask-question-popup-", "ProductNotifyMePopup", "productSizeGuideDrawer"],
        "featured-product": ["product-ask-question-popup-", "ProductNotifyMePopup", "productSizeGuideDrawer"],
        "collection-body": ["filterMenuDrawer", "filterMenuToggler"],
        "search-template": ["filterMenuDrawer", "filterMenuToggler"]
      };
      const createSelector = (array) => array.map((item) => `[data-js-overlay^="${item}"]`).join(", ");
      const overlays = blurTargets[type];
      if (overlays) {
        const popupOverlays = [...document.querySelectorAll(createSelector(overlays))];
        if (!popupOverlays.length) {
          return;
        }
        document.body.classList.remove("blur-content");
        document.body.style.overflow = "";
        popupOverlays.forEach((overlay2) => overlay2.remove());
      }
    };
    const getSectionData = (element) => {
      try {
        return JSON.parse(element.getAttribute(attributes2.sectionData));
      } catch (error) {
        console.log("Error trying to parse section data: ", error, " element: ", element);
        return null;
      }
    };
    const getSectionTypeFromId = (sectionId) => {
      var _a;
      const section = document.querySelector(selectors2.section(sectionId));
      if (!section) {
        return null;
      }
      return ((_a = getSectionData(section)) == null ? void 0 : _a.type) ?? null;
    };
    const rewriteSections = ({ method, type, sectionId }) => {
      if (Shopify.visualPreviewMode) {
        return;
      }
      const selector = method === "type" ? selectors2.shopifySection : selectors2.section(sectionId);
      const sections = [...document.querySelectorAll(selector)];
      const appropriateSections = sections.filter((section) => {
        try {
          const sectionData = JSON.parse(section.getAttribute(attributes2.sectionData));
          return sectionData.type === type;
        } catch {
          return false;
        }
      });
      appropriateSections.forEach((section) => rewriteElementsExcept(section, selectors2.appBlock));
    };
    const reinitGlobalComponents = () => {
      window.themeCore.LazyLoadImages.init();
      window.themeCore.initAnimateObserver();
      window.themeCore.Accordion.init();
      window.themeCore.EventBus.emit(`product:count-down-timer-reinit`);
    };
    const customizerChangesHandler = (e) => {
      var _a;
      addScripts(getNewLoadedScripts());
      const sectionId = (_a = e.detail) == null ? void 0 : _a.sectionId;
      if (!sectionId) {
        return;
      }
      const type = getSectionTypeFromId(sectionId);
      if (!type) {
        return;
      }
      removePageBlur(type);
      let eventOptions = {};
      if (sectionsToRerenderByType.includes(type)) {
        rewriteSections({ method: "type", type });
      } else {
        rewriteSections({ method: "id", type, sectionId });
        eventOptions = { detail: { sectionId, type } };
      }
      delete window.themeCore.sections[type];
      reinitGlobalComponents();
      document.dispatchEvent(new CustomEvent("theme:customizer:loaded", eventOptions));
    };
    document.addEventListener("shopify:section:load", customizerChangesHandler);
    document.addEventListener(
      "shopify:section:unload",
      (e) => {
        var _a;
        addScripts(getNewLoadedScripts());
        const sectionId = (_a = e.detail) == null ? void 0 : _a.sectionId;
        if (!sectionId) {
          return;
        }
        const type = getSectionTypeFromId(sectionId);
        if (!type) {
          return;
        }
        removePageBlur(sectionId);
      }
    );
    document.dispatchEvent(new CustomEvent("theme:all:loaded"));
    window.themeCore.loaded = true;
    let resizeTimer;
    window.addEventListener(
      "resize",
      function() {
        document.body.classList.add("no-transition");
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          document.body.classList.remove("no-transition");
        }, 300);
      },
      {
        passive: true
      }
    );
  } catch (error) {
    console.error(error);
  }
})();
