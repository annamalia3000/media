import { formatDate } from '../formDate';

const mediaContent = document.querySelector('.media-content');
const textInput = document.querySelector('.text-input');

export function createTextWidget(latitude, longitude) {
    const textWidget = document.createElement('div');
    textWidget.classList.add('media-text');

    const textDate = document.createElement('div');
    textDate.classList.add('date');
    textDate.textContent = formatDate(new Date()); 
    
    const textContent = document.createElement('div');
    textContent.classList.add('text-content');
    textContent.textContent = textInput.value;

    const userGeo = document.createElement('div');
    userGeo.classList.add('user-geolocation');
    userGeo.textContent = `[${latitude}, ${longitude}]`;

    textWidget.appendChild(textDate);
    textWidget.appendChild(textContent);
    textWidget.appendChild(userGeo);
    mediaContent.appendChild(textWidget);

    textInput.value = '';
}