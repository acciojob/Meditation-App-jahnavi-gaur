let timer;
let isPlaying = false;
let selectedTime = 600;
let currentTime = 600;

const playButton = document.querySelector(".play");
const timeDisplay = document.querySelector(".time-display");
const video = document.querySelector("#meditation-video");
const audio = document.querySelector("audio");

function updateTimeDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  timeDisplay.textContent = `${minutes}:${seconds}`;
}

function startMeditation() {
  clearInterval(timer);
  ensureAudioReady();

  isPlaying = true;
  playButton.textContent = "❚❚";

  video.play().catch(() => {});
  const promise = audio.play();
  if (promise !== undefined) {
    promise.catch(() => {
      setTimeout(() => audio.play().catch(() => {}), 200);
    });
  }

  timer = setInterval(() => {
    currentTime--;
    updateTimeDisplay();
    if (currentTime <= 0) stopMeditation();
  }, 1000);
}

function pauseMeditation() {
  isPlaying = false;
  playButton.textContent = "►";
  clearInterval(timer);
  audio.pause();
  video.pause();
}

function stopMeditation() {
  isPlaying = false;
  playButton.textContent = "►";
  clearInterval(timer);
  audio.pause();
  video.pause();
  currentTime = selectedTime;
  updateTimeDisplay();
}

function ensureAudioReady() {
  audio.loop = true;
  audio.muted = false;
  audio.volume = 0.6;
  if (!audio.src || audio.src === window.location.href) {
    audio.src = "./Sounds/beach.mp3";
  }
}

function togglePlay() {
  if (isPlaying) pauseMeditation();
  else startMeditation();
}

function setTime(minutes) {
  if (!isPlaying) {
    selectedTime = minutes * 60;
    currentTime = selectedTime;
    updateTimeDisplay();
  }
}

function switchSound(type) {
  if (type === "beach") {
    video.src = "./Sounds/beach.mp4";
    audio.src = "./Sounds/beach.mp3";
  } else {
    video.src = "./Sounds/rain.mp4";
    audio.src = "./Sounds/rain.mp3";
  }
  ensureAudioReady();
  if (isPlaying) {
    video.play();
    audio.play();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateTimeDisplay();

  playButton.addEventListener("click", togglePlay);
  document.querySelector("#smaller-mins").addEventListener("click", () => setTime(2));
  document.querySelector("#medium-mins").addEventListener("click", () => setTime(5));
  document.querySelector("#long-mins").addEventListener("click", () => setTime(10));

  document.querySelector("#beach-sound").addEventListener("click", () => switchSound("beach"));
  document.querySelector("#rain-sound").addEventListener("click", () => switchSound("rain"));

  // Prevent test crashes from unsupported formats
  window.addEventListener("unhandledrejection", (e) => {
    if (
      e.reason &&
      e.reason.message &&
      e.reason.message.includes("supported sources")
    ) {
      e.preventDefault();
    }
  });
});
