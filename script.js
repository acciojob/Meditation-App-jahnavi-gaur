let timer;
const playButton = document.querySelector('.play');
let currentTime = 600;
let selectedTime = 600;
const timeDisplay = document.querySelector('.time-display');
const video = document.querySelector('#meditation-video');
const audio = document.querySelector('#meditation-audio');
let isPlaying = false;

function togglePlay() {
  if (isPlaying) {
    pauseMeditation();
  } else {
    startMeditation();
  }
}

function pauseMeditation() {
  isPlaying = false;
  playButton.textContent = '►';
  clearInterval(timer);
  audio.pause(); // 🔥 Added
}

function updateTime() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  // 🔥 Changed to match Cypress expectation (no zero padding)
  timeDisplay.textContent = `${minutes}:${seconds}`;
}

function startMeditation() {
  if (timer) clearInterval(timer);

  isPlaying = true;
  playButton.textContent = '||';
  audio.play(); // 🔥 Added

  timer = setInterval(() => {
    currentTime--;
    updateTime();

    if (currentTime <= 0) {
      stopMeditation();
      alert("Meditation Complete!");
    }
  }, 1000);
}

function stopMeditation() {
  isPlaying = false;
  playButton.textContent = '►';
  clearInterval(timer);
  currentTime = selectedTime;
  updateTime();
  audio.pause(); // 🔥 Added
}

function switchVideo(videoType) {
  if (videoType === 'beach') {
    video.src = "https://cdn.pixabay.com/video/2023/04/28/160767-822213540_large.mp4";
    audio.src = "./Sounds/beach.mp3";
  } else {
    video.src = "https://cdn.pixabay.com/video/2017/08/30/11722-231759069_large.mp4";
    audio.src = "./Sounds/rain.mp3";
  }
}

document.addEventListener('DOMContentLoaded', function () {
  playButton.addEventListener('click', togglePlay);
  updateTime();

  function setTime(minutes) {
    if (!isPlaying) {
      selectedTime = minutes * 60;
      currentTime = selectedTime || 600;
      updateTime();
    }
  }

  document.querySelector('#smaller-mins').addEventListener('click', () => setTime(2));
  document.querySelector('#medium-mins').addEventListener('click', () => setTime(5));
  document.querySelector('#long-mins').addEventListener('click', () => setTime(10));

  document.querySelector('#beach-sound').addEventListener('click', () => switchVideo('beach'));
  document.querySelector('#rain-sound').addEventListener('click', () => switchVideo('rain'));
});
