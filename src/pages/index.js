import "../pages/index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
//import { setButtonText } from "../src/utils/helpers.js";
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
    // Store user data
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    api._userId = userData._id; // Add this line

    // Render all cards
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
//profileAvatar.src = ProfileAvatar;
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

const avatarModalCloseButton = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form-delete");
const deleteModalButton = deleteModal.querySelector(
  ".modal__submit-btn-delete"
);

const deleteModalCancelButton = deleteModal.querySelector(
  ".modal__submit-btn-cancel"
);

function getCardElement(data) {
  console.log("Creating card with data:", data);

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
  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }
  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageElement.src = data.link;
    previewModalImageElement.alt = data.name;
    previwModalCaptionElement.textContent = data.name;
  });

  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));
  console.log("Like button initial state:", {
    cardId: data._id,
    isLiked: data.isLiked,
    hasLikedClass: cardLikeButton.classList.contains("card__like-button_liked"),
  });
  cardDeleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");

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
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  console.log("Form submitted");
  api
    .editUserInfo({ name: nameInput.value, about: descriptionInput.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
      evt.target.reset();
      disableButton(submitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleAddCardFormSubmit(evt) {
  console.log("Form submitted");
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardList.prepend(cardElement);
      closeModal(cardModal);
      evt.target.reset();
      disableButton(cardSubmitButton, settings);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
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

deleteModalCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

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
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  console.log("Avatar URL being submitted:", avatarInput.value); // Add this line

  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      console.log("Response from server:", data); // Add this line

      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
      evt.target.reset();
      disableButton(avatarSubmitButton, settings);
    })
    .catch((error) => {
      console.error("Error updating avatar:", error); // Add this line
    })
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}
let selectedCard;
let selectedCardId;
function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error);
}
deleteModalButton.addEventListener("click", handleDeleteSubmit);
function handleLike(evt, cardId) {
  const likeButton = evt.target;

  const isLiked = evt.target.classList.contains("card__like-button_liked");
  console.log("Before API call - isLiked:", isLiked);

  api
    .changeLikeStatus(cardId, !isLiked)
    .then((res) => {
      if (isLiked) {
        evt.target.classList.remove("card__like-button_liked");
      } else {
        evt.target.classList.add("card__like-button_liked");
      }
    })
    .catch(console.error);
}

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});
enableValidation(settings);
