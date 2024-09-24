import { switchBtnMode } from './switchBtnMode';
import { getGeolocation } from './geolocation/getGeolocation';
import { formatDate } from './formDate';

export class Video {
    constructor(containerSelector) {
        this.media = document.querySelector(containerSelector);
        this.videoButton = document.querySelector('.video-btn');
        this.okButton = document.querySelector('.ok-record-btn');
        this.cancelButton = document.querySelector('.cancel-record-btn');
        this.timerElement = document.querySelector('.timer');
        this.recorder;
        this.chunks = [];
        this.stream;
        this.timerInterval;
        this.videoMedia;
        this.videoURL;
        this.isRecordingCancelled = false;
    }

    init() {
        this.videoButton.addEventListener('click', this.startRecording.bind(this));
    }

    async startRecording() {
        switchBtnMode();
        this.isRecordingCancelled = false;
    
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
            this.createVideoPlayer();
            this.media.appendChild(this.videoMedia);
    
            let seconds = 0;
            this.timerInterval = setInterval(() => {
                seconds++;
                this.timerElement.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
            }, 1000);
    
            this.videoPlayer.srcObject = this.stream;
    
            this.videoPlayer.addEventListener('canplay', () => {
                this.videoPlayer.play();
            });
    
            this.recorder = new MediaRecorder(this.stream);
    
            this.recorder.addEventListener('start', () => {
                console.log('Запись видео началась');
            });
    
            this.recorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                    this.chunks.push(event.data);
                    console.log('Чанк данных записан:', event.data);
                }
            });
    
            this.recorder.addEventListener('stop', () => {
                console.log('Запись видео остановлена');
                clearInterval(this.timerInterval);
                this.timerElement.textContent = '0:00';

                const blob = new Blob(this.chunks, { type: 'video/webm' });
                this.videoURL = URL.createObjectURL(blob);
                console.log(this.videoURL );

                this.videoPlayer.remove();
                this.stream.getTracks().forEach(track => track.stop());
                this.createRecordedVideo(this.videoURL);   
                
                this.chunks = [];
                switchBtnMode();
            });
    
            this.recorder.start();
    
            this.okButton.removeEventListener('click', this.handleOkClick.bind(this));
            this.cancelButton.removeEventListener('click', this.handleCancelClick.bind(this));
    
            this.okButton.addEventListener('click', this.handleOkClick.bind(this));
            this.cancelButton.addEventListener('click', this.handleCancelClick.bind(this));
    
        } catch (error) {
            console.error('Ошибка доступа к камере:', error);
            switchBtnMode(); 
        }
    }

    handleOkClick() {
        if (this.recorder && this.recorder.state === 'recording') {
            this.recorder.stop(); 
        }
    }

    handleCancelClick() {
        if (this.recorder && this.recorder.state === 'recording') {
            this.recorder.stop();
        }

        this.isRecordingCancelled = true;
    
        if (this.videoMedia) {
            this.videoMedia.remove();
        }
    }

    createVideoPlayer() {
        if (this.isRecordingCancelled) {
            return; 
        }

        this.videoMedia = document.createElement('div');  
        this.videoMedia.classList.add('media-video');

        this.videoPlayer = document.createElement('video');  
        this.videoPlayer.classList.add('video-player');
        this.uniqueId = Date.now();  
        this.videoMedia.dataset.videoId = this.uniqueId;

        this.videoMedia.appendChild(this.videoPlayer);

    }

    createRecordedVideo(videoURL) {
        const recordedVideo = document.createElement('video');
        recordedVideo.classList.add('video-content');
        recordedVideo.src = videoURL;
        recordedVideo.setAttribute('controls', true);
        recordedVideo.dataset.videoId = this.uniqueId;
    
        this.videoMedia.appendChild(recordedVideo);
    
        getGeolocation(({ latitude, longitude }) => {
            const videoWidget = this.createVideoWidget(latitude, longitude, this.uniqueId);
            this.videoMedia.appendChild(videoWidget);
        });
    }

    createVideoWidget(latitude, longitude, videoId) {
        const videoWidget = document.createElement('div');
        videoWidget.classList.add('video-widget');
        videoWidget.dataset.videoId = videoId;
    
        const videoDate = document.createElement('div');
        videoDate.classList.add('date');
        videoDate.textContent = formatDate(new Date());
    
        const playBtn = document.createElement('button');
        playBtn.classList.add('play-btn');
        playBtn.innerHTML = `<i class="fa fa-play"></i>`;
    
        const userGeo = document.createElement('div');
        userGeo.classList.add('user-geolocation');
        userGeo.textContent = `[${latitude}, ${longitude}]`;
    
        videoWidget.appendChild(videoDate);
        videoWidget.appendChild(playBtn);
        videoWidget.appendChild(userGeo);
    
        this.setupVideoPlayback(videoId, videoWidget);
    
        videoWidget.style.display = 'flex';
    
        return videoWidget;
    }

    setupVideoPlayback(videoId, videoWidget) {
        if (this.isRecordingCancelled) {
            return; 
        }

        const videoElement = document.querySelector(`video[data-video-id="${videoId}"]`);
    
        videoWidget.querySelector('.play-btn').addEventListener('click', () => {
            videoElement.play();
            videoWidget.style.display = 'none';
            videoElement.style.display = 'block';

            videoElement.addEventListener('ended', () => {
                videoWidget.style.display = 'flex';  
                videoElement.style.display = 'none'; 
            });
        });
    }
}

