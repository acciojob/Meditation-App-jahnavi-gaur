let timer;
    const playButton = document.querySelector(".play");
    let currentTime = 600;
    let selectedTime = 600;
    const timeDisplay = document.querySelector(".time-display");
    const video = document.querySelector("#meditation-video");
    let isPlaying = false;
    const audio = document.querySelector("audio");

    function updateTime() {
      const minutes = Math.floor(currentTime / 60);
      const seconds = currentTime % 60;
      timeDisplay.textContent = `${minutes}:${seconds}`;
    }

    function startMeditation() {
      if (timer) clearInterval(timer);
      isPlaying = true;
      playButton.textContent = "||";
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
    }

    function stopMeditation() {
      isPlaying = false;
      playButton.textContent = "►";
      clearInterval(timer);
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
      if (type === "beach")
        video.src =
          "https://cdn.pixabay.com/video/2023/04/28/160767-822213540_large.mp4";
      else
        video.src =
          "https://cdn.pixabay.com/video/2017/08/30/11722-231759069_large.mp4";
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