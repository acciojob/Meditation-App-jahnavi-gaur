let timer;
        const playButton = document.querySelector('.play');
        let currentTime = 600;
        let selectedTime= 600;
        const timeDisplay = document.querySelector('.time-display');
        const video = document.querySelector('#meditation-video')
        let isPlaying = false;
        const timeButtons = document.querySelectorAll('#time-select button');
        
        
        function togglePlay(){
            if(isPlaying){
                pauseMeditation();
            } else {
                startMeditation();
            }
        }
        
        function pauseMeditation(){
            isPlaying = false;
            playButton.textContent = '►';
            clearInterval(timer);
        }
        
        function updateTime(){
            const minutes = Math.floor(currentTime/60);
            const seconds = currentTime % 60;
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        function startMeditation(){
            // Prevent multiple timers
            if(timer) clearInterval(timer);
            
            isPlaying = true;
            playButton.textContent = '||';
            
            timer = setInterval(() => {
                currentTime--;
                updateTime();
        
                if(currentTime <= 0){
                    stopMeditation();
                    alert("Meditation Complete!");
                }
            }, 1000);
        }
        
        function stopMeditation(){
            isPlaying = false;
            playButton.textContent = '►';
            clearInterval(timer);
            currentTime = selectedTime; 
            updateTime(); // Update display with reset time
        }
        
        function switchVideo(videoType, buttonElement){
            if(videoType=='beach') video.src="https://cdn.pixabay.com/video/2023/04/28/160767-822213540_large.mp4"
            else video.src="https://cdn.pixabay.com/video/2017/08/30/11722-231759069_large.mp4"
        }
        
        document.addEventListener('DOMContentLoaded', function(){
            playButton.addEventListener('click', togglePlay);
            updateTime(); 
        
            function setTime(minutes, buttonElement){
                if(!isPlaying){
                    selectedTime = minutes*60;
                    currentTime=selectedTime || 600;
                    updateTime();
                }
            }
        
            //Time buttons
            document.querySelector('#smaller-mins').addEventListener('click', function(){
                setTime(2, this);
            })
            document.querySelector('#medium-mins').addEventListener('click', function(){
                setTime(5, this);
            })
            document.querySelector('#long-mins').addEventListener('click', function(){
                setTime(10, this);
            })
        
            document.querySelector('#beach-sound').addEventListener('click', function(){
                switchVideo('beach', this)
        
            })
        
            document.querySelector('#rain-sound').addEventListener('click', function(){
                switchVideo('rain', this)
            })
        });