import axios from "axios";

export class PixabayAPI {
    #API_KEY = '38225262-d1745fccc0f8e035d7be8e954';
    #BASE_URL = 'https://pixabay.com/api/';

    query = null;
    page = 1;

    async getImages() {
        return await axios.get(`${this.#BASE_URL}?key=${this.#API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`)
            // .then((response) => { 
            //     if (!response.ok) {
            //         throw new Error(response.status);
            //     }
            //     return response.json();
            //  })
    }
}

