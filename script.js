// Select DOM elements
const song = document.querySelector('.song');
const play = document.querySelector('.play');
const video = document.querySelector('.vid-container video');
const timeDisplay = document.querySelector('.time-display');
const timeSelectButtons = document.querySelectorAll('.time-select button');
const soundPicker = document.querySelectorAll('.sound-picker button');

// Default duration (10 minutes)
let fakeDuration = 600;

// Update time display on load
timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${fakeDuration % 60}`;

// Play/pause functionality
play.addEventListener('click', () => {
  if (song.paused) {
    song.play();
    video.play();
    play.src = './svg/pause.svg';
  } else {
    song.pause();
    video.pause();
    play.src = './svg/play.svg';
  }
});

// Update timer every second
song.ontimeupdate = () => {
  const currentTime = song.currentTime;
  const remainingTime = fakeDuration - currentTime;
  let minutes = Math.floor(remainingTime / 60);
  let seconds = Math.floor(remainingTime % 60);
  timeDisplay.textContent = `${minutes}:${seconds}`;

  // Stop when timer ends
  if (currentTime >= fakeDuration) {
    song.pause();
    video.pause();
    song.currentTime = 0;
    play.src = './svg/play.svg';
  }
};

// Time select buttons
timeSelectButtons.forEach((btn) => {
  btn.addEventListener('click', function () {
    fakeDuration = this.getAttribute('data-time');
    let minutes = Math.floor(fakeDuration / 60);
    let seconds = Math.floor(fakeDuration % 60);
    timeDisplay.textContent = `${minutes}:${seconds}`;
  });
});

// Sound switching
soundPicker.forEach((btn) => {
  btn.addEventListener('click', function () {
    const soundSrc = `./Sounds/${this.classList.contains('rain') ? 'rain' : 'beach'}.mp3`;
    const videoSrc = `./Video/${this.classList.contains('rain') ? 'rain' : 'beach'}.mp4`;
    song.src = soundSrc;
    video.src = videoSrc;
    if (!song.paused) {
      song.play();
      video.play();
    }
  });
});
