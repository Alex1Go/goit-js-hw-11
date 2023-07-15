import { PixabayAPI } from "./js/pixabay-api";
import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const inputEl = searchForm.firstElementChild;
const galleryEl = document.querySelector('.gallery');
const btnMore = document.querySelector('.load-more');

const pixabayInctance = new PixabayAPI();
btnMore.style.display = 'none';

function createMarkup(images) {
 
  const markup = images.map(image => {
    const {
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
          <div class="gallery-item" >          
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" width="300" height="200" loading="lazy" />
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
  //console.log(markup);
  galleryEl.insertAdjacentHTML('beforeend', markup);

};
 
const onSearchForm = async evt => {
    evt.preventDefault();

  const searchQuery = inputEl.value.trim();
  if (!searchQuery) {
    return;
  }
    pixabayInctance.query = searchQuery;
    pixabayInctance.page = 1;
    galleryEl.innerHTML = '';
  
    try {
        const { data } = await pixabayInctance.getImages();
        if (!data.hits.length) {
           Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.", '');
            throw new Error();
        }
        createMarkup(data.hits);
        Notiflix.Notify.success(`We found ${data.totalHits} images.`);
        btnMore.style.display = 'block';
      
    } catch (err) {
        console.log(err.message);
    }
     
};
const per_page = 40;
const showMore = async () => {
  pixabayInctance.page += 1;
  
  try {
    const { data } = await pixabayInctance.getImages();

    const totalPages = Math.ceil(data.totalHits / per_page);

    if (pixabayInctance.page === totalPages) {
      btnMore.style.display = 'none';
       Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
        );
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
searchForm.style.marginBottom = '10px';

btnMore.style.marginLeft = '100px';
btnMore.style.backgroundColor = '#0000FF';
btnMore.style.color = '#ffffff'
btnMore.style.marginBottom = '50px';

galleryEl.style.display = 'flex';
galleryEl.style.flexWrap = 'wrap';
galleryEl.style.justifyContent = 'space-around'; 
