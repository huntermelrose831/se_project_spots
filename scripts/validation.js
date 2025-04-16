const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgID = inputEl.id + "-error";
  const errorMsgEl = document.querySelector("#" + errorMsgID);
  inputEl.classList.add("modalinput_type_error");
  errorMsgEl.classList.add("modalerror_visible");
  errorMsgEl.textContent = errorMsg;
};

const hideInputError = (formEl, inputEl) => {
  const errorMsgID = inputEl.id + "-error";
  const errorMsgEl = document.querySelector("#" + errorMsgID);
  inputEl.classList.remove("modalinput_type_error");
  errorMsgEl.classList.remove("modalerror_visible");
  errorMsgEl.textContent = "";
};

const checkInputValidity = (formEl, inputEl) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};

const setEventListener = (formEl) => {
  const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
  const buttonElement = formEl.querySelector(".modal__submit-btn");

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formEl, inputElement);
      //toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formEl) => {
    setEventListener(formEl);
  });
};

enableValidation();
