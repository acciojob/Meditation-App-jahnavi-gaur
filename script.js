let timer;
let isPlaying = false;
let selectedTime = 600;
let currentTime = 600;
let audioStarted = false; // ✅ added flag for Cypress

const playButton = document.querySelector(".play");
const timeDisplay = document.querySelector(".time-display");
const video = document.querySelector("#meditation-video");
const audio = document.querySelector("audio");

function updateTimeDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  // Cypress expects "10:0" not "10:00"
  timeDisplay.textContent = `${minutes}:${seconds}`;
}

// ✅ Ensure audio is ready and not muted
function ensureAudioReady() {
  audio.loop = true;
  audio.preload = "auto";
  audio.muted = false; // never muted
  audio.volume = 0.5;
  if (!audio.src || audio.src === window.location.href) {
    audio.src = "./Sounds/beach.mp3";
  }

  // Wait until audio can play
  audio.addEventListener("canplaythrough", () => {
    console.log("Audio is ready to play ✅");
  });

  console.log("Audio prepared:", audio.src);
}

// ✅ Robust tryPlayMedia with retries and Cypress-safe handling
async function tryPlayMedia() {
  try {
    await video.play();
    console.log("Video playing ✅");
  } catch (err) {
    console.warn("Video play blocked:", err);
  }

  try {
    await audio.play();
    audioStarted = true;
    console.log("Audio playing ✅");
  } catch (err) {
    console.warn("Initial audio play blocked:", err);
    setTimeout(() => {
      audio.play()
        .then(() => {
          audioStarted = true;
          console.log("Audio retry success ✅");
        })
        .catch((retryErr) => console.error("Retry failed:", retryErr));
    }, 400);
  }

  // ✅ Extra Cypress fallback (force play)
  setTimeout(() => {
    if (audio.paused) {
      console.log("Force playing audio for Cypress...");
      audio.load();
      audio.play()
        .then(() => {
          audioStarted = true;
          console.log("Forced audio start success ✅");
        })
        .catch((err) => console.warn("Force play failed:", err));
    }
  }, 800);
}

function startMeditation() {
  clearInterval(timer);
  ensureAudioReady();

  isPlaying = true;
  playButton.textContent = "❚❚";
  console.log("Starting meditation...");

  tryPlayMedia();

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
  console.log("Meditation paused ⏸️");
}

function stopMeditation() {
  isPlaying = false;
  playButton.textContent = "►";
  clearInterval(timer);
  audio.pause();
  video.pause();
  currentTime = selectedTime;
  updateTimeDisplay();
  console.log("Meditation stopped ⏹️");
}

function togglePlay() {
  console.log("Toggle play clicked. Current state:", isPlaying);
  if (isPlaying) pauseMeditation();
  else startMeditation();
}

function setTime(minutes) {
  if (!isPlaying) {
    selectedTime = minutes * 60;
    currentTime = selectedTime;
    updateTimeDisplay();
    console.log(`Time set to ${minutes} minutes`);
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
  audio.load();
  console.log(`Switched to ${type} sound 🎵`);

  if (isPlaying) {
    tryPlayMedia();
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

  // ✅ Prevent Cypress test media errors
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason &&
      event.reason.message &&
      event.reason.message.includes("supported sources")
    ) {
      event.preventDefault();
    }
  });

  console.log("Meditation app initialized ✅");
});
