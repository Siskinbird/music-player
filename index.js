const wrapper = document.querySelector('.wrapper'),
musicImg = wrapper.querySelector('.img-area img'),
musicName = wrapper.querySelector('.song-details .name'),
musicArtist = wrapper.querySelector('.song-details .artist'),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close"),
bodyBg = document.querySelector("body");
 

let musicIndex = 1;

window.addEventListener('load', () => {
    loadMusic(musicIndex);
    playingNow();
})

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `./assets/img/${allMusic[indexNumb - 1].img}.jpg`
    mainAudio.src = `./assets/music/${allMusic[indexNumb - 1].src}.m4a`
    bodyBg.style.backgroundImage = `url(./assets/img/${allMusic[indexNumb - 1].img}.jpg)`
}

//Play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//Pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//Next track function 
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

//Previos track function 
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

//Play pause button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
})

//Next track button event 
nextBtn.addEventListener("click", () => {
    nextMusic();
})
//Previos track button event 
prevBtn.addEventListener("click", () => {
    prevMusic();
})
//progress bar

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    mainAudio.addEventListener("loadeddata", () => {
        musicDuration = wrapper.querySelector(".duration");
        //update total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    })

    //Обновитель каррентТайма
    let musicCurrentTime = wrapper.querySelector(".current")
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10) {
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
})
// реализуем возможность бегать ползунком по прогрессбару
progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth; // получаем ширину прогрессбара
    let clickedOffSetX = e.offsetX; // получаем значение кликнутого бара
    let songDuration = mainAudio.duration; // Записываем общцую продолжительность песни

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    playMusic()
})

/* ------------------------------------------------------------------------------------------ */

// Заводим кнопку повтора трека
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch(getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped")
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle")
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat"
            repeatBtn.setAttribute("title", "Playlist looped")
            break;
    }
})
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch(getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex)
            playMusic()
            break;
        case "shuffle":
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while(musicIndex == randomIndex);
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
})

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
})

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
})

const ulTag = wrapper.querySelector("ul");

// Итрерация по плейлисту, строим динамичный список
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                    </div>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                    <audio class="${allMusic[i].src}" src="./assets/music/${allMusic[i].src}.m4a"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
}

function playingNow() {
    const allLiTags = ulTag.querySelectorAll("li")
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration")
        if(allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing")
            audioTag.innerText = ""
        }

        if(allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing")
            audioTag.innerText = "Playing"
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)")
    }
}
// Загружаем трек по клику на список
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex)
    playMusic();
    playingNow();
}