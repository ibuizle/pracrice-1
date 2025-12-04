import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

import { getImagesByQuery } from "./js/pixabay-api.js";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
const PER_PAGE = 15;

// ✅ При старті кнопка прихована
hideLoadMoreButton();

form.addEventListener("submit", onSubmit);
loadMoreBtn.addEventListener("click", onLoadMore);

// ✅ Пошук
async function onSubmit(e) {
  e.preventDefault();

  const value = e.target.elements["search-text"].value.trim();

  if (!value) {
    iziToast.error({
      message: "Enter search query!",
      position: "topRight",
    });
    return;
  }

  query = value;
  page = 1;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.warning({
        message:
          "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
      return;
    }

    createGallery(data.hits);

    if (data.totalHits > PER_PAGE) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    }

    // ✅ reset ТІЛЬКИ якщо є результат
    form.reset();
  } catch (error) {
    iziToast.error({
      message: "Error fetching images",
      position: "topRight",
    });
    console.error(error);
  } finally {
    hideLoader();
  }
}

// ✅ Load more
async function onLoadMore() {
  page += 1;

  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    createGallery(data.hits);
    smoothScroll();

    if (page * PER_PAGE >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: "Error fetching images",
      position: "topRight",
    });
    console.error(error);
  } finally {
    hideLoader();
  }
}

// ✅ Плавний скрол
function smoothScroll() {
  const card = document.querySelector(".gallery-item");
  const { height } = card.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: "smooth",
  });
}
