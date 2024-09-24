import { switchBtnMode } from './switchBtnMode';
import { getGeolocation } from './geolocation/getGeolocation';
import { formatDate } from './formDate';

export class Audio {
    constructor(containerSelector) {
        this.media = document.querySelector(containerSelector);
        this.audioButton = document.querySelector('.audio-btn');
        this.okButton = document.querySelector('.ok-record-btn');
        this.cancelButton = document.querySelector('.cancel-record-btn');
        this.timerElement = document.querySelector('.timer');
        this.recorder;
        this.chunks = [];
        this.stream;
        this.timerInterval;
        this.audioMedia;
        this.audioURL;
        this.isRecordingCancelled = false;
    }

    init() {
        this.audioButton.addEventListener('click', this.startRecording.bind(this));
    }

    async startRecording() {
        switchBtnMode();
        this.isRecordingCancelled = false;
    
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
            this.createAudioPlayer();
            this.media.appendChild(this.audioMedia);
    
            let seconds = 0;
            this.timerInterval = setInterval(() => {
                seconds++;
                this.timerElement.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
            }, 1000);
    
            this.audioPlayer.srcObject = this.stream;
            /////
            this.audioPlayer.addEventListener('canplay', () => {
                this.audioPlayer.play();
            });
    
            this.recorder = new MediaRecorder(this.stream);
    
            this.recorder.addEventListener('start', () => {
                console.log('Запись аудио началась');
            });
    
            this.recorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                    this.chunks.push(event.data);
                    console.log('Чанк данных записан:', event.data);
                }
            });
    
            this.recorder.addEventListener('stop', () => {
                console.log('Запись аудио остановлена');
                clearInterval(this.timerInterval);
                this.timerElement.textContent = '0:00';

                const blob = new Blob(this.chunks);
                this.audioURL = URL.createObjectURL(blob);
                console.log(this.audioURL );

                this.audioPlayer.remove();
                this.audioVisualizerCanvas.remove();
                this.stream.getTracks().forEach(track => track.stop());
                this.createRecordedAudio(this.audioURL);   
                
                this.chunks = [];
                switchBtnMode();
            });
    
            this.recorder.start();
    
            this.okButton.removeEventListener('click', this.handleOkClick.bind(this));
            this.cancelButton.removeEventListener('click', this.handleCancelClick.bind(this));
    
            this.okButton.addEventListener('click', this.handleOkClick.bind(this));
            this.cancelButton.addEventListener('click', this.handleCancelClick.bind(this));
    
        } catch (error) {
            console.error('Ошибка доступа к микрофону:', error);
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
    
        if (this.audioMedia) {
            this.audioMedia.remove();
            this.audioVisualizerCanvas.remove();
        }
    }

    createAudioPlayer() {
        if (this.isRecordingCancelled) {
            return; 
        }
    
        this.audioMedia = document.createElement('div');  
        this.audioMedia.classList.add('media-audio');
    
        this.audioPlayer = document.createElement('audio');  
        this.audioPlayer.classList.add('audio-player');
        this.uniqueId = Date.now();  
        this.audioMedia.dataset.audioId = this.uniqueId;
        this.audioPlayer.muted = true;
    
        this.audioVisualizerCanvas = document.createElement('canvas');
        this.audioVisualizerCanvas.classList.add('audio-visualizer');
    
        this.audioMedia.appendChild(this.audioPlayer);
        this.audioMedia.appendChild(this.audioVisualizerCanvas);
    
        this.initAudioVisualizer();
    
        this.media.appendChild(this.audioMedia);
    }

    initAudioVisualizer() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(this.stream);
    
        source.connect(analyser);
    
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
    
        const canvasCtx = this.audioVisualizerCanvas.getContext('2d');
    
        const draw = () => {
            const WIDTH = this.audioVisualizerCanvas.width;
            const HEIGHT = this.audioVisualizerCanvas.height;
    
            requestAnimationFrame(draw);
    
            analyser.getByteTimeDomainData(dataArray);
    
            canvasCtx.fillStyle = 'rgb(255, 255, 255)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    
            canvasCtx.beginPath();
    
            const sliceWidth = WIDTH * 1.0 / bufferLength;
            let x = 0;
    
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * HEIGHT / 2;
    
                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
    
                x += sliceWidth;
            }
    
            canvasCtx.lineTo(WIDTH, HEIGHT / 2);
            canvasCtx.stroke();
        };
    
        draw();
    }    
    
    createRecordedAudio(audioURL) {
        const recordedAudio = document.createElement('audio');
        recordedAudio.classList.add('audio-content');
        recordedAudio.src = audioURL;
        recordedAudio.setAttribute('controls', true);
        recordedAudio.dataset.audioId = this.uniqueId;
    
        this.audioMedia.appendChild(recordedAudio);
    
        getGeolocation(({ latitude, longitude }) => {
            const audioWidget = this.createVideoWidget(latitude, longitude, this.uniqueId);
            this.audioMedia.appendChild(audioWidget);
        });
    }

    createVideoWidget(latitude, longitude, audioId) {
        const audioWidget = document.createElement('div');
        audioWidget.classList.add('audio-widget');
        audioWidget.dataset.audioId = audioId;
    
        const audioDate = document.createElement('div');
        audioDate.classList.add('date');
        audioDate.textContent = formatDate(new Date());
    
        const playBtn = document.createElement('button');
        playBtn.classList.add('play-btn');
        playBtn.innerHTML = `<i class="fa fa-play"></i>`;
    
        const userGeo = document.createElement('div');
        userGeo.classList.add('user-geolocation');
        userGeo.textContent = `[${latitude}, ${longitude}]`;
    
        audioWidget.appendChild(audioDate);
        audioWidget.appendChild(playBtn);
        audioWidget.appendChild(userGeo);
    
        this.setupAudioPlayback(audioId, audioWidget);
    
        audioWidget.style.display = 'flex';
    
        return audioWidget;
    }

    setupAudioPlayback(audioId, audioWidget) {
        if (this.isRecordingCancelled) {
            return; 
        }

        const audioElement = document.querySelector(`audio[data-audio-id="${audioId}"]`);
    
        audioWidget.querySelector('.play-btn').addEventListener('click', () => {
            audioElement.play();
            audioWidget.style.display = 'none';
            audioElement.style.display = 'block';

            audioElement.addEventListener('ended', () => {
                audioWidget.style.display = 'flex';  
                audioElement.style.display = 'none'; 
            });
        });
    }

}