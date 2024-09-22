import { switchBtnMode } from '../switchBtnMode';
import { getGeolocation } from '../geolocation/getGeolocation';
import { createVideoWidget } from './createVideoWidget';

const videoButton = document.querySelector('.video-btn');
const mediaContent = document.querySelector('.media-content');
const okButton = document.querySelector('.ok-record-btn');
const cancelButton = document.querySelector('.cancel-record-btn');
const timerElement = document.querySelector('.timer');

let recorder;
let chunks = [];
let stream;
let timerInterval;
let videoMedia;

export async function startRecording() {
    switchBtnMode();

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        videoMedia = document.createElement('div');
        videoMedia.classList.add('media-video');

        const videoPlayer = document.createElement('video');
        videoPlayer.classList.add('video-player');
        const uniqueId = Date.now();
        videoMedia.dataset.videoId = uniqueId;

        videoMedia.appendChild(videoPlayer);
        mediaContent.appendChild(videoMedia);

        let seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            timerElement.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
        }, 1000);

        videoPlayer.srcObject = stream;

        videoPlayer.addEventListener('canplay', () => {
            videoPlayer.play();
        });

        recorder = new MediaRecorder(stream);

        recorder.addEventListener('start', () => {
            console.log('Запись видео началась');
        });

        recorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
                console.log('Чанк данных записан:', event.data);
            }
        });

        recorder.addEventListener('stop', () => {
            clearInterval(timerInterval);
            timerElement.textContent = '0:00';

            const blob = new Blob(chunks, { type: 'video/webm' });
            console.log(blob);
            const videoURL = URL.createObjectURL(blob);

            videoPlayer.remove();
            stream.getTracks().forEach(track => track.stop());

            const recordedVideo = document.createElement('video');
            recordedVideo.classList.add('video-content');
            recordedVideo.src = videoURL;
            recordedVideo.setAttribute('controls', true);
            recordedVideo.dataset.videoId = uniqueId;

            videoMedia.appendChild(recordedVideo);

            getGeolocation(({ latitude, longitude }) => {
                const videoWidget = createVideoWidget(latitude, longitude, uniqueId);
                videoMedia.appendChild(videoWidget);
            });

            chunks = [];
        });

        recorder.start();

        okButton.removeEventListener('click', handleOkClick);
        cancelButton.removeEventListener('click', handleCancelClick);

        okButton.addEventListener('click', handleOkClick);
        cancelButton.addEventListener('click', handleCancelClick);

    } catch (error) {
        console.error('Ошибка доступа к камере:', error);
        switchBtnMode(); 
    }
};

function handleOkClick() {
    if (recorder && recorder.state === 'recording') {
        recorder.stop(); 
    }

    switchBtnMode(); 
}

function handleCancelClick() {
    if (recorder && recorder.state === 'recording') {
        recorder.stop();
    }

    if (videoMedia) videoMedia.remove();
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    clearInterval(timerInterval);
    timerElement.textContent = '0:00';

    switchBtnMode(); 
}

videoButton.addEventListener('click', startRecording);