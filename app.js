let currentSong = new Audio();



function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);


    const formattedMinutes = String(minutes).padStart(2, '0');

    const formattedSeconds = String(remainingSeconds).padStart(2, '0');


    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let songsFolder = await fetch("http://127.0.0.1:5500/songs/");
    let response = await songsFolder.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let songTitles = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < songTitles.length; index++) {
        const element = songTitles[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs")[1].replace("/", ""));
        }
    }

    return songs;
}

const playMusic = (track, pause = false, count) => {

    if (count == 1) {
        currentSong.src = "songs/" + track;
    }

    if (!pause) {
        currentSong.src = "songs/" + track;
        currentSong.play();
        play.src = "svg/pause.svg";
    }

    document.querySelector(".songname").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function main() {
    let songs = await getSongs();


    playMusic(songs[0], true, 1);


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs) {
        songUL.innerHTML += `<li>
        <div class="playlist-song flex  align">
        <img class="music-icon invert " src="svg/music-icon.svg" alt="">
        <div class="song-info">
            <div> ${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playlist-play-icon "> 
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
        </svg>
        </div>
            </div>
        </li>`;
    }

    // Attaching events to all songs

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", (element) => {
            playMusic(element.target.innerHTML.trim());
        })
    });

    document.querySelector(".playIcon").addEventListener("click", (element) => {


        if (currentSong.paused) {
            currentSong.play();

            play.src = "svg/pause.svg";


        } else {
            currentSong.pause();
            play.src = "svg/playicon.svg";

        }
    })




    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let seekPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = seekPercent + "%";
        currentSong.currentTime = (currentSong.duration * seekPercent) / 100;
    })


}

main();