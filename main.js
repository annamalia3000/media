/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/geolocation/validation.js
function validateCoordinates(input) {
  const clearInput = input.replace(/[\[\]\s]/g, '');
  const parts = clearInput.split(',');
  if (parts.length !== 2) {
    throw new Error('Координаты должны содержать два числа, разделенные запятой.');
  }
  const latitude = parseFloat(parts[0]);
  console.log(latitude);
  const longitude = parseFloat(parts[1]);
  console.log(longitude);
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Широта и долгота должны быть числами.');
  }
  if (latitude < -90 || latitude > 90) {
    throw new Error('Широта должна быть в диапазоне от -90 до 90.');
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error('Долгота должна быть в диапазоне от -180 до 180.');
  }
  return {
    latitude,
    longitude
  };
}
;// CONCATENATED MODULE: ./src/js/geolocation/showGeoError.js

const container = document.querySelector('.container');
function showGeoError(callback) {
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
      const {
        latitude,
        longitude
      } = validateCoordinates(userCoords);
      container.removeChild(errorWidget);
      callback({
        latitude,
        longitude
      });
    } catch (error) {
      alert('Ошибка: ' + error.message);
    }
  });
  cancelButton.addEventListener('click', () => {
    container.removeChild(errorWidget);
  });
}
;// CONCATENATED MODULE: ./src/js/geolocation/getGeolocation.js

function getGeolocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(data => {
      const {
        latitude,
        longitude
      } = data.coords;
      callback({
        latitude,
        longitude
      });
    }, error => {
      showGeoError(callback);
    }, {
      enableHighAccuracy: true
    });
  } else {
    showGeoError(callback);
  }
}
;// CONCATENATED MODULE: ./src/js/formDate.js
function formatDate(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}
;// CONCATENATED MODULE: ./src/js/Text.js


class Text {
  constructor(containerSelector) {
    this.media = document.querySelector(containerSelector);
    this.textInput = document.querySelector('.text-input');
  }
  init() {
    this.textInput.addEventListener('keydown', event => {
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
    getGeolocation(({
      latitude,
      longitude
    }) => {
      const textItem = this.createTextItem(latitude, longitude);
      this.media.appendChild(textItem);
    });
  }
}
;// CONCATENATED MODULE: ./src/js/switchBtnMode.js
const inputMode = document.querySelector('.input-mode');
const recordMode = document.querySelector('.record-mode');
function switchBtnMode() {
  inputMode.classList.toggle('hidden');
  inputMode.classList.toggle('visible');
  recordMode.classList.toggle('hidden');
  recordMode.classList.toggle('visible');
}
;// CONCATENATED MODULE: ./src/js/Video.js



class Video {
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
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
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
      this.recorder.addEventListener('dataavailable', event => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
          console.log('Чанк данных записан:', event.data);
        }
      });
      this.recorder.addEventListener('stop', () => {
        console.log('Запись видео остановлена');
        clearInterval(this.timerInterval);
        this.timerElement.textContent = '0:00';
        const blob = new Blob(this.chunks, {
          type: 'video/webm'
        });
        this.videoURL = URL.createObjectURL(blob);
        console.log(this.videoURL);
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
    getGeolocation(({
      latitude,
      longitude
    }) => {
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
;// CONCATENATED MODULE: ./src/js/Audio.js



class Audio {
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
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
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
      this.recorder.addEventListener('dataavailable', event => {
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
        console.log(this.audioURL);
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
    getGeolocation(({
      latitude,
      longitude
    }) => {
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
;// CONCATENATED MODULE: ./src/js/app.js



const mediaText = new Text('.media-content');
const mediaVideo = new Video('.media-content');
const mediaAudio = new Audio('.media-content');
mediaText.init();
mediaVideo.init();
mediaAudio.init();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
//# sourceMappingURL=main.js.map