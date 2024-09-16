import { validateCoordinates } from './validation.js';

const container = document.querySelector('.container');

export function showGeoError(callback) {
    const errorWidget = document.createElement('div');
    errorWidget.classList.add('error-widget');
    
    const errorText = document.createElement('div');
    errorText.classList.add('error-text');
    errorText.innerHTML = `
    <p>Что-то пошло не так</p>
    <p>К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.</p>
    <p>Широта и долгота через запятую</p>
    `;

    const coordsInput = document.createElement('input');
    coordsInput.classList.add('coords-input');

    const errorWidgetButtons = document.createElement('div');
    errorWidgetButtons.classList.add('error-btns');

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-btn');
    cancelButton.textContent = 'Отмена';

    const okButton = document.createElement('button');
    okButton.classList.add('ok-btn');
    okButton.textContent = 'OK';

    errorWidgetButtons.appendChild(cancelButton);
    errorWidgetButtons.appendChild(okButton);

    errorWidget.appendChild(errorText);
    errorWidget.appendChild(coordsInput);
    errorWidget.appendChild(errorWidgetButtons);
   
    container.appendChild(errorWidget);

    okButton.addEventListener('click', () => {
        try {
            const userCoords = coordsInput.value;
            const { latitude, longitude } = validateCoordinates(userCoords);
            container.removeChild(errorWidget);
            callback({ latitude, 
                longitude });
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    });

    cancelButton.addEventListener('click', () => {
        container.removeChild(errorWidget);
    });
}
