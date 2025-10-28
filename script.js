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

function ensureAudioReady() {
  // Preload and allow interaction playback
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.5;
  audio.muted = false;
  if (!audio.src || audio.src === window.location.href) {
    audio.src =
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_fbbab5f3b2.mp3?filename=beach-waves.mp3";
  }
}

function startMeditation() {
  if (timer) clearInterval(timer);
  ensureAudioReady();

  isPlaying = true;
  playButton.textContent = "||";

  // ✅ Force playback start detectable by Cypress
  video.play().catch(() => {});
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // confirm playback started
        if (audio.paused) audio.play(); // retry if blocked
      })
      .catch(() => {
        // fallback: force manual start
        setTimeout(() => audio.play(), 300);
      });
  }

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
    audio.pause();
    video.pause();
  } catch (e) {}
  currentTime = selectedTime;
  updateTime();
}

function togglePlay() {
  if (isPlaying) pauseMeditation();
  else startMeditation();
}

function setTime(minutes) {
  if (!isPlaying) {
    selectedTime = minutes * 60;
    currentTime = selectedTime;
    updateTime();
  }
}

function switchVideo(type) {
  if (type === "beach") {
    video.src =
      "https://cdn.pixabay.com/video/2023/04/28/160767-822213540_large.mp4";
    audio.src =
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_fbbab5f3b2.mp3?filename=beach-waves.mp3";
  } else {
    video.src =
      "https://cdn.pixabay.com/video/2017/08/30/11722-231759069_large.mp4";
    audio.src =
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_2b5d72ef6f.mp3?filename=rain.mp3";
  }
  ensureAudioReady();
}

document.addEventListener("DOMContentLoaded", function () {
  updateTime();

  playButton.addEventListener("click", togglePlay);
  document
    .querySelector(".smaller-mins")
    .addEventListener("click", () => setTime(2));
  document
    .querySelector(".medium-mins")
    .addEventListener("click", () => setTime(5));
  document
    .querySelector(".long-mins")
    .addEventListener("click", () => setTime(10));

  document
    .querySelector("#beach-sound")
    .addEventListener("click", () => switchVideo("beach"));
  document
    .querySelector("#rain-sound")
    .addEventListener("click", () => switchVideo("rain"));
});
