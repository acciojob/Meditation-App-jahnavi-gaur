let timer;
const playButton = document.querySelector(".play");
let currentTime = 600;
let selectedTime = 600;
const timeDisplay = document.querySelector(".time-display");
const video = document.querySelector("#meditation-video");
const audio = document.querySelector("audio");
let isPlaying = false;

function updateTime() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  timeDisplay.textContent = `${minutes}:${seconds}`;
}

function startMeditation() {
  if (timer) clearInterval(timer);
  isPlaying = true;
  playButton.textContent = "||";

  // ✅ Ensure audio plays (unmuted for test detection)
  try {
    audio.muted = false;
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // fallback in case autoplay blocked
        setTimeout(() => audio.play().catch(() => {}), 300);
      });
    }
  } catch (err) {
    console.warn("Audio play error:", err);
  }

  video.play().catch(() => {});

  timer = setInterval(() => {
    currentTime--;
    updateTime();
    if (currentTime <= 0) stopMeditation();
  }, 1000);
}

function pauseMeditation() {
  isPlaying = false;
  playButton.textContent = "►";
  clearInterval(timer);

  try {
    audio.pause();
    video.pause();
  } catch (e) {}
}

function stopMeditation() {
  isPlaying = false;
  playButton.textContent = "►";
  clearInterval(timer);
  try {
    aud
