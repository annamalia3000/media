import { getGeolocation } from './geolocation/getGeolocation';
import { formatDate } from './formDate';

export class Text {
    constructor(containerSelector) {
        this.media = document.querySelector(containerSelector);
        this.textInput = document.querySelector('.text-input');
    }

    init() {
        this.textInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && this.textInput.value.trim() !== '') {
                event.preventDefault();  
                this.addText(); 
            }
        });
    }

    createTextItem(latitude, longitude) {
        const textItem = document.createElement('div');
        textItem.classList.add('media-text');

        const textDate = document.createElement('div');
        textDate.classList.add('date');
        textDate.textContent = formatDate(new Date()); 
    
        const textContent = document.createElement('div');
        textContent.classList.add('text-content');
        textContent.textContent = this.textInput.value;

        const userGeo = document.createElement('div');
        userGeo.classList.add('user-geolocation');
        userGeo.textContent = `[${latitude}, ${longitude}]`;

        textItem.appendChild(textDate);
        textItem.appendChild(textContent);
        textItem.appendChild(userGeo);

        this.textInput.value = '';

        return textItem;
    }

    addText() {
        getGeolocation(({ latitude, longitude }) => {
            const textItem = this.createTextItem(latitude, longitude);  
            this.media.appendChild(textItem);  
        });
    }
}

