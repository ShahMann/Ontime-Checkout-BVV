const selectors = {
  container: ".js-our-team",
  popupButton: ".js-team-card-open-popup"
};
const OurTeamSlider = () => {
  const Toggle = window.themeCore.utils.Toggle;
  let Slider;
  const sliderOptions = {
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: {
      575: {
        slidesPerView: 2,
        spaceBetween: 16
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 16
      }
    }
  };
  async function init(sectionId) {
    Slider = await window.themeCore.utils.getExternalUtil(
      "FeaturedContentSlider"
    );
    const sections = [...document.querySelectorAll(selectors.container)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      let isDynamicBullets = section.getAttribute("data-dynamic-pagination");
      isDynamicBullets = isDynamicBullets === "true";
      Slider(section, sliderOptions, "991.98px", false, isDynamicBullets).init();
      let popupButtons = section.querySelectorAll(selectors.popupButton);
      if (!popupButtons.length) {
        return;
      }
      initPopupToggle(popupButtons);
    });
  }
  function initPopupToggle(popupButtons) {
    popupButtons.forEach((button) => {
      const teamPopup = Toggle({
        toggleSelector: button.getAttribute("data-js-toggle")
      });
      teamPopup.init();
      const teamPopupElem = document.getElementById(button.getAttribute("data-target"));
      teamPopupElem.addEventListener("click", function(e) {
        if (e.target == this) {
          teamPopup.close(teamPopupElem);
        }
      });
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.OurTeamSlider = window.themeCore.OurTeamSlider || OurTeamSlider();
  window.themeCore.utils.register(window.themeCore.OurTeamSlider, "our-team");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
