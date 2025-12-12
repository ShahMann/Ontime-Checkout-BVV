const selectors = {
  geoLocationPopup: "geo-location-popup",
  geoLocationPopupToggle: "GeoLocationPopupToggle",
  confirmButton: ".js-geo-location-popup-confirm"
};
const geoLocationPopup = () => {
  const Toggle = window.themeCore.utils.Toggle;
  const on = window.themeCore.utils.on;
  let geoLocationPopup;
  let geoLocationPopupToggle;
  function init() {
    geoLocationPopup = document.getElementById(selectors.geoLocationPopup);
    if (!geoLocationPopup) {
      return;
    }
    showGeoLocationPopup();
    setEventListeners();
  }
  function showGeoLocationPopup() {
    const cookie = getGeoLocation()
    if (cookie) {
      const confirmButton = document.querySelector(selectors.confirmButton);
      if (confirmButton.dataset.localization == cookie) {
        return;
      }
    }
    geoLocationPopupToggle = Toggle({
      toggleSelector: selectors.geoLocationPopupToggle
    });
    window.themeCore.geoLocationPopupOpen = true;
    geoLocationPopupToggle.init();
    document.body.classList.add("blur-content");
    geoLocationPopupToggle.open(geoLocationPopup);

    on("click", geoLocationPopup, function (e) {
      if (e.target.parentElement.classList.contains("popup-close-icon-button")) {
        geoLocationPopupToggle.close(geoLocationPopup);
        document.body.classList.remove("blur-content");
      }
    });
  }

  function getGeoLocation() {
    return window.localStorage.getItem('geo_location')
  }

  function setEventListeners() {
    const confirmButton = document.querySelector(selectors.confirmButton);
    if (!confirmButton) {
      return;
    }
    confirmButton.addEventListener("click", function (e) {
      const country = confirmButton.dataset.localization;
      setGeoLocation(country);
      document.body.classList.remove("blur-content");
      geoLocationPopupToggle.close(geoLocationPopup);
    });
  }
  function setGeoLocation(country) {
    window.localStorage.setItem('geo_location', country)
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.geoLocationPopup = window.themeCore.geoLocationPopup || geoLocationPopup();
  window.themeCore.utils.register(window.themeCore.geoLocationPopup, "geo-location-popup");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
