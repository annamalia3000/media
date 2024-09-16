import { showGeoError } from './showGeoError';

export function getGeolocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (data) => {
                const { latitude, longitude } = data.coords;
                callback({ latitude,
                    longitude });
            },
            (error) => {
                showGeoError(callback);
            },
            { enableHighAccuracy: true }
        );
    } else {
        showGeoError(callback);
    }
}
