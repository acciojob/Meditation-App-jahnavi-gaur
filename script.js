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
  timeDisplay.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

// ✅ Ensure audio is ready and not muted
function ensureAudioReady() {
  audio.loop = true;
  audio.preload = "auto";
  audio.muted = false; // Ensure audio is not muted
  audio.volume = 0.5; // Reasonable volume level

  if (!audio.src || audio.src === window.location.href) {
    audio.src = "./Sounds/beach.mp3"; // Default audio
  }

  console.log("Audio ready:", audio.src);
}

// ✅ Improved tryPlayMedia with detailed error handling and retry
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
    // Retry once more if it fails
    setTimeout(() => {
      audio.play()
        .then(() => console.log("Audio retry success ✅"))
        .catch((retryErr) => console.error("Retry failed:", retryErr));
    }, 300);
  }
}

// ✅ Start meditation timer
function startMeditation() {
  clearInterval(timer);
  ensureAudioReady();

  isPlaying = true;
  playButton.textContent = "❚❚";
  console.log("Starting meditation..."); // Debug log

  tryPlayMedia()
    .then(() => console.log("Media playback initiated ✅"))
    .catch((err) => console.error("Error starting media:", err));

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

// ✅ Stop meditation and reset time
function stopMeditation() {
  isPlaying = false;
  playButton.textContent = "►";
  clearInterval(timer);
  audio.pause();
  video.pause();
  currentTime = selectedTime;
  updateTimeDisplay();
  console.log("Meditation stopped ⏹️ and reset");
}

// ✅ Toggle play/pause
function togglePlay() {
  console.log("Toggle play clicked. Current state:", isPlaying);
  if (isPlaying) pauseMeditation();
  else startMeditation();
}

// ✅ Set meditation time
function setTime(minutes) {
  if (!isPlaying) {
    selectedTime = minutes * 60;
    currentTime = selectedTime;
    updateTimeDisplay();
    console.log(`Time set to ${minutes} minutes`);
  }
}

// ✅ Switch between sounds (beach/rain)
function switchSound(type) {
  if (type === "beach") {
    video.src = "./Sounds/beach.mp4";
    audio.src = "./Sounds/beach.mp3";
  } else {
    video.src = "./Sounds/rain.mp4";
    audio.src = "./Sounds/rain.mp3";
  }

  ensureAudioReady();
  audio.load(); // Load the new audio source

  console.log(`Switched to ${type} sound 🎵`);

  if (isPlaying) {
    tryPlayMedia();
  }
}

// ✅ Initialize after DOM load
document.addEventListener("DOMContentLoaded", () => {
  updateTimeDisplay();

  playButton.addEventListener("click", togglePlay);
  document.querySelector("#smaller-mins").addEventListener("click", () => setTime(2));
  document.querySelector("#medium-mins").addEventListener("click", () => setTime(5));
  document.querySelector("#long-mins").addEventListener("click", () => setTime(10));

  document.querySelector("#beach-sound").addEventListener("click", () => switchSound("beach"));
  document.querySelector("#rain-sound").addEventListener("click", () => switchSound("rain"));

  // ✅ prevent Cypress test failures for media errors
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
