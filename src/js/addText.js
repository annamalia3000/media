import { getGeolocation } from './getGeolocation';
import { createTextWidget} from './createTextWidget';

const textInput = document.querySelector('.text-input');

textInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && textInput.value.trim() !== '') {
        getGeolocation(({ latitude, longitude }) => {
            createTextWidget(latitude, longitude);
        });
    }
});
