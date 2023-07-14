import { PixabayAPI } from "./js/pixabay-api";
import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const inputEl = searchForm.firstElementChild;
const galleryEl = document.querySelector('.gallery');
const btnMore = document.querySelector('.load-more')

const pixabayInctance = new PixabayAPI();

function createMarkup(images) {
  if (!galleryEl) {
    return;
  }
  const markup = images.map(image => {
    const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);

};
 
const onSearchForm = async evt => {
    evt.preventDefault();

    const searchQuery = inputEl.value.trim();
    pixabayInctance.query = searchQuery;
    pixabayInctance.page = 1;
    try {
        const { data } = await pixabayInctance.getImages();
        if (!data.hits.length) {
            Notiflix.Report.failure("Sorry, there are no images matching your search query. Please try again.", '');
            throw new Error();
        }
      galleryEl.innerHTML = createMarkup(data.hits);
      btnMore.classList.remove('is-hidden');
    } catch (err) {
        console.log(err.message);
    }
     
};

const showMore = async () => {
  pixabayInctance.page += 1;

  try {
    const { data } = await pixabayInctance.getImages();

    if (pixabayInctance.page === data.totalHits) {
      btnMore.classList.add('is-hidden');
    }

    galleryEl.insertAdjacentHTML(
      'beforeend',
      createMarkup(data.hits)
    );
  } catch (err) {
    console.log(err.message);
  }
};
searchForm.addEventListener('submit', onSearchForm);
btnMore.addEventListener('click', showMore);

searchForm.style.backgroundColor = '#0000FF';
searchForm.style.paddingLeft = '100px';
searchForm.style.paddingTop = '20px';
searchForm.style.paddingBottom = '10px';
