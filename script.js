
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

    // ✅ Safe audio play (mute + catch AbortError)
    audio.muted = true;
    audio
      .play()
      .then(() => {
        // playing successfully
      })
      .catch(() => {
        // ignore AbortError or blocked play()
      });

    timer = setInterval(() => {
      currentTime--;
      updateTime();
      if (currentTime <= 0) {
        stopMeditation();
      }
    }, 1000);
  }

  function pauseMeditation() {
    isPlaying = false;
    playButton.textContent = "►";
    clearInterval(timer);
    try {
      audio.pause();
    } catch (e) {}
  }

  function stopMeditation() {
    isPlaying = false;
    playButton.textContent = "►";
    clearInterval(timer);
    try {
      audio.pause();
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
