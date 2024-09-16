import { formatDate } from '../formDate';

export function createVideoWidget(latitude, longitude, videoId) {
    const videoWidget = document.createElement('div');
    videoWidget.classList.add('video-widget');
    videoWidget.dataset.videoId = videoId;

    const videoDate = document.createElement('div');
    videoDate.classList.add('date');
    videoDate.textContent = formatDate(new Date());

    const videoPlay = document.createElement('button');
    videoPlay.classList.add('video-play-btn');
    videoPlay.innerHTML = `<i class="fa fa-play"></i>`;

    const userGeo = document.createElement('div');
    userGeo.classList.add('user-geolocation');
    userGeo.textContent = `[${latitude}, ${longitude}]`;

    videoWidget.appendChild(videoDate);
    videoWidget.appendChild(videoPlay);
    videoWidget.appendChild(userGeo);

    videoPlay.addEventListener('click', () => {
        const videoElement = document.querySelector(`video[data-video-id="${videoId}"]`);
        videoElement.play();
        videoWidget.style.display = 'none';
    });

    videoWidget.style.display = 'flex';

    return videoWidget;
}
