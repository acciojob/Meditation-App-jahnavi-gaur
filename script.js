const song = document.querySelector('.song');
const play = document.querySelector('.play');
const video = document.querySelector('.vid-container video');
const timeDisplay = document.querySelector('.time-display');
const timeButtons = document.querySelectorAll('.time-select button');
const soundButtons = document.querySelectorAll('.sound-picker button');

let fakeDuration = 600; // 10 min default
let timerInterval = null;

timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:0`;

// helper: update timer text
function updateTimerDisplay(secondsLeft) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = Math.floor(secondsLeft % 60);
  timeDisplay.textContent = `${minutes}:${seconds}`;
}

// play/pause handler
function togglePlay() {
  if (song.paused) {
    song.muted = false;
    video.muted = true; // avoid Cypress “no user gesture” error
    song.play().then(() => {
      video.play();
      play.src = './svg/pause.svg';
      startCountdown();
    });
  } else {
    song.pause();
    video.pause();
    play.src = './svg/play.svg';
    stopCountdown();
  }
}

play.addEventListener('click', togglePlay);

// countdown logic
function startCountdown() {
  stopCountdown();
  timerInterval = setInterval(() => {
    const elapsed = song.currentTime;
    const remaining = fakeDuration - elapsed;
    if (remaining <= 0) {
      song.pause();
      video.pause();
      song.currentTime = 0;
      play.src = './svg/play.svg';
      updateTimerDisplay(fakeDuration);
      stopCountdown();
    } else {
      updateTimerDisplay(remaining);
    }
  }, 1000);
}

function stopCountdown() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// change meditation time
timeButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    fakeDuration = parseInt(this.getAttribute('data-time'));
    updateTimerDisplay(fakeDuration);
  });
});

// change sound + video
soundButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    const isRain = this.classList.contains('rain');
    song.src = `./Sounds/${isRain ? 'rain' : 'beach'}.mp3`;
    video.src = `./Video/${isRain ? 'rain' : 'beach'}.mp4`;
    if (!song.paused) {
      song.play();
      video.play();
    }
  });
});
