import "../pages/index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import PencilIcon from "../images/pencil.svg";
import PlusIcon from "../images/plusicon.svg";
import ProfileAvatar from "../images/avatar.jpg";
import HeaderLogo from "../images/spotslogo.svg";
import Api from "../utils/Api.js";
import AvatarBtn from "../images/pencilLight.svg";
/*const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
    alt: "Val Thorens",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
    alt: "Restaurant terrace",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
    alt: "An outdoor cafe",
  },
  {
    name: "A very long bridge, over the forest and through the treesjsjsjsjsjsjsjsjsjs",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
    alt: "A very long bridge, over the forest and through the trees",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
    alt: "Tunnel with morning light",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
    alt: "Mountain house",
  },
];*/
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "924751a2-426f-4bc5-ab74-ba7e42f02748",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardList.append(cardElement);
    });
  })
  .catch(console.error);

const avatarBtn = document.getElementById("avatar-btn");
avatarBtn.src = AvatarBtn;
const headerLogo = document.getElementById("header-logo");
headerLogo.src = HeaderLogo;
const profileAvatar = document.getElementById("profile-avatar");
profileAvatar.src = ProfileAvatar;
const plusIcon = document.getElementById("add-card-btn");
plusIcon.src = PlusIcon;
const pencilIcon = document.getElementById("edit-profile-btn");
pencilIcon.src = PencilIcon;

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalOpenButton = document.querySelector(".profile__post-btn");
const profileName = document.querySelector(".profile__name");
const avatarModalOpenButton = document.querySelector(".profile__avatar-btn");

const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-profile-modal");
const editFormElement = editModal.querySelector(".modal__form");
const closeModalButton = editModal.querySelector(".modal__close-btn");
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");
const cardTemplate = document.querySelector("#card-template");

const cardList = document.querySelector(".cards__list");
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseButton = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");
const avatarModal = document.querySelector("#avatar-modal");
const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previwModalCaptionElement = previewModal.querySelector(".modal__caption");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageElement.src = data.link;
    previewModalImageElement.alt = data.name;
    previwModalCaptionElement.textContent = data.name;
  });

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });
  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");

  // Add Escape key functionality to close the modal only when it's open
  const closeModalOnEscape = (evt) => {
    if (evt.key === "Escape") {
      closeModal(modal);
      document.removeEventListener("keydown", closeModalOnEscape);
    }
  };
  document.addEventListener("keydown", closeModalOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({ name: nameInput.value, about: descriptionInput.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
      evt.target.reset();
      disableButton(settings);
    })
    .catch(console.error);
}

function handleAddCardFormSubmit(evt) {
  console.log("Form submitted");
  evt.preventDefault();
  api
    .addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardList.prepend(cardElement);
      closeModal(cardModal);
      evt.target.reset();
      disableButton(cardSubmitButton, settings);
    })
    .catch(console.error);
}
profileEditButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, [nameInput, descriptionInput], settings);
  openModal(editModal);
});

closeModalButton.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalOpenButton.addEventListener("click", () => {
  const inputList = [cardNameInput, cardLinkInput];

  openModal(cardModal);
});
cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});
const avatarModalCloseButton = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarModalOpenButton.addEventListener("click", () => {
  openModal(avatarModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardFormSubmit);

const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-btn_preview"
);
avatarForm.addEventListener("submit", handleAvatarSubmit);
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      console.log(data.avatar);
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
      evt.target.reset();
      disableButton(avatarSubmitButton, settings);
    })
    .catch(console.error);
}

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

// Add overlay click functionality to close modals
const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});
enableValidation(settings);
