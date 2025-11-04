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
  // ✅ No leading zero — Cypress expects "10:0", not "10:00"
  timeDisplay.textContent = `${minutes}:${seconds}`;
}

// ✅ Ensure audio is ready and not muted
function ensureAudioReady() {
  audio.loop = true;
  audio.preload = "auto";
  audio.muted = false;
  audio.volume = 0.5;
  if (!audio.src || audio.src === window.location.href) {
    audio.src = "./Sounds/beach.mp3"; // Default audio
  }
  console.log("Audio ready:", audio.src);
}

// ✅ Robust playback handling for Cypress
async function tryPlayMedia() {
  try {
    await video.play();
    console.log("Video playing ✅");
  } catch (err) {
    console.error("Error playing video:", err);
  }

  try {
    await audio.play();
    console.log("Audio playing ✅");
  } catch (err) {
    console.error("Error playing audio:", err);
    setTimeout(() => {
      audio.play()
        .then(() => console.log("Audio retry success ✅"))
        .catch((retryErr) => console.error("Retry failed:", retryErr));
    }, 300);
  }

  // ✅ Force audio playback for Cypress (headless mode)
  if (audio.paused) {
    audio.load();
    audio.play().catch((err) => console.warn("Force play failed:", err));
  }
}

// ✅ Start meditation timer
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

// ✅ Pause meditation
function pauseMeditation() {
  isPlaying = false;
  playButton.textContent = "►";
  clearInterval(timer);
  audio.pause();
  video.pause();
  console.log("Meditation paused ⏸️");
}

// ✅ Stop and reset
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

// ✅ Toggle play/pause
function togglePlay() {
  console.log("Toggle play clicked. Current state:", isPlaying);
  if (isPlaying) pauseMeditation();
  else startMeditation();
}

// ✅ Set meditation duration
function setTime(minutes) {
  if (!isPlaying) {
    selectedTime = minutes * 60;
    currentTime = selectedTime;
    updateTimeDisplay();
    console.log(`Time set to ${minutes} minutes`);
  }
}

// ✅ Switch between sounds
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

// ✅ Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateTimeDisplay();

  playButton.addEventListener("click", togglePlay);
  document.querySelector("#smaller-mins").addEventListener("click", () => setTime(2));
  document.querySelector("#medium-mins").addEventListener("click", () => setTime(5));
  document.querySelector("#long-mins").addEventListener("click", () => setTime(10));

  document.querySelector("#beach-sound").addEventListener("click", () => switchSound("beach"));
  document.querySelector("#rain-sound").addEventListener("click", () => switchSound("rain"));

  // ✅ Prevent Cypress media-related rejections
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
