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
    audio.src = "./Sounds/beach.mp3";
  } else {
    video.src =
      "https://cdn.pixabay.com/video/2017/08/30/11722-231759069_large.mp4";
    audio.src = "./Sounds/rain.mp3";
  }

  // ✅ reset audio and video
  audio.pause();
  video.pause();
  isPlaying = false;
  playButton.textContent = "►";
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
