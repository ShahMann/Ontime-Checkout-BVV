(function () {
  const PHONE_PREFIX = "+965";
  const PHONE_SELECTOR = ".js-recipient-form-phone";
  const PHONE_ERROR_SELECTOR = ".js-recipient-form-phone-error";
  const RECIPIENT_CHECKBOX_SELECTOR = ".js-recipient-form-checkbox";
  const PHONE_PATTERN = /^[0-9]{8}$/;

  function getPhoneErrorMessage() {
    if (
      window.themeCore &&
      window.themeCore.translations &&
      typeof window.themeCore.translations.get === "function"
    ) {
      return window.themeCore.translations.get(
        "products.product.recipient.form.phone_error"
      );
    }

    return "Please enter a valid 8-digit phone number";
  }

  function showPhoneError(phoneField) {
    const errorElement = phoneField
      .closest(".recipient-form__field")
      ?.querySelector(PHONE_ERROR_SELECTOR);

    phoneField.setAttribute("aria-invalid", "true");
    phoneField.classList.add("error");

    if (errorElement) {
      errorElement.textContent = getPhoneErrorMessage();
      errorElement.classList.remove("is-hidden");
    }
  }

  function clearPhoneError(phoneField) {
    const errorElement = phoneField
      .closest(".recipient-form__field")
      ?.querySelector(PHONE_ERROR_SELECTOR);

    phoneField.removeAttribute("aria-invalid");
    phoneField.classList.remove("error");

    if (errorElement) {
      errorElement.classList.add("is-hidden");
    }
  }

  function isRecipientPhoneRequired(form) {
    const recipientCheckbox = form.querySelector(RECIPIENT_CHECKBOX_SELECTOR);
    const phoneField = form.querySelector(PHONE_SELECTOR);

    return Boolean(
      recipientCheckbox &&
        recipientCheckbox.checked &&
        phoneField &&
        !phoneField.disabled
    );
  }

  function getLocalPhoneNumber(phoneField) {
    return phoneField.value.trim().replace(/^\+965/, "");
  }

  document.addEventListener(
    "input",
    function (event) {
      const phoneField = event.target;

      if (!phoneField.matches(PHONE_SELECTOR)) {
        return;
      }

      clearPhoneError(phoneField);
    },
    true
  );

  document.addEventListener(
    "change",
    function (event) {
      const checkbox = event.target;

      if (!checkbox.matches(RECIPIENT_CHECKBOX_SELECTOR)) {
        return;
      }

      const form = checkbox.closest("[data-js-product-form]");
      const phoneField = form?.querySelector(PHONE_SELECTOR);

      if (phoneField) {
        clearPhoneError(phoneField);
      }
    },
    true
  );

  document.addEventListener(
    "submit",
    function (event) {
      const form = event.target;

      if (!form.matches("[data-js-product-form]")) {
        return;
      }

      const phoneField = form.querySelector(PHONE_SELECTOR);

      if (!phoneField) {
        return;
      }

      if (!isRecipientPhoneRequired(form)) {
        clearPhoneError(phoneField);
        return;
      }

      const localNumber = getLocalPhoneNumber(phoneField);

      if (!localNumber || !PHONE_PATTERN.test(localNumber)) {
        event.preventDefault();
        event.stopPropagation();
        showPhoneError(phoneField);
        phoneField.focus({ preventScroll: true });
        phoneField.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      clearPhoneError(phoneField);
      phoneField.value = PHONE_PREFIX + localNumber;
    },
    true
  );
})();
