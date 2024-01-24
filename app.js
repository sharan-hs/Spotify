let currentSong = new Audio();
let currentFolder;
let songs;



function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currentFolder = folder;

    let songsFolder = await fetch(`/${currentFolder}/`);

    let response = await songsFolder.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let songTitles = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < songTitles.length; index++) {
        const element = songTitles[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1].replace("/", ""));
        }
    }

    let songUL = document
        .querySelector(".songList")
        .getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `<li>
        <div class="playlist-song p-1 flex  align">
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

    Array.from(
        document.querySelector(".songList").getElementsByTagName("li")
    ).forEach((e) => {
        e.addEventListener("click", (element) => {
            playMusic(element.target.innerHTML.trim());
        });
    });

    return songs;
}

async function displayAlbums() {
    let songsFolder = await fetch(`/songs/`);

    let response = await songsFolder.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs/")) {
            let albumFolder = e.href.split("/").splice(-1)[0];

            let albumresponse = await fetch(
                `/songs/${albumFolder}/info.json`
            );
            let cardContainer = document.querySelector(".card-container");

            let response = await albumresponse.json();

            cardContainer.innerHTML += `
            <div data-folder="${albumFolder}" class="card m-2 p-1">
                <img src="/songs/${albumFolder}/cover.jpg" alt="">
                <div class="play-icon flex align">
                    <img class="play-icon-img" src="svg/playicon.svg" alt="">
                 </div>
                <h2 class="song-title white">${response.title}</h2>
                <p class="song-desc white">${response.description}</p>
        </div>`;
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async(item) => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        });
    });
}

const playMusic = (track, pause = false, count) => {
    if (count == 1) {
        currentSong.src = `/${currentFolder}/` + track;
    }

    if (!pause) {
        currentSong.src = `/${currentFolder}/` + track;
        currentSong.play();
        play.src = "svg/pause.svg";
    }

    document.querySelector(".songname>span").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function main() {
    await getSongs("songs/focus");

    playMusic(songs[0], true, 1);

    displayAlbums();

    document.querySelector(".playIcon").addEventListener("click", (element) => {
        if (currentSong.paused) {
            currentSong.play();

            play.src = "svg/pause.svg";
        } else {
            currentSong.pause();
            play.src = "svg/playicon.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let seekPercent =
            (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = seekPercent + "%";
        currentSong.currentTime = (currentSong.duration * seekPercent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left-panel").style.left = 0 + "%";
    });

    document.querySelector(".close").addEventListener("click", (e) => {
        console.log("clicked");
        document.querySelector(".left-panel").style.left = -100 + "%";
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);

        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        }
    });



    document
        .querySelector(".range")
        .getElementsByTagName("input")[0]
        .addEventListener("change", (e) => {
            currentSong.volume = parseInt(e.target.value) / 100;
            if (currentSong.volume > 0) {
                document.querySelector(".volume-img").src = document.querySelector(".volume-img").src.replace("mute.svg", "volume.svg");
            } else {
                document.querySelector(".volume-img").src = document.querySelector(".volume-img").src.replace("volume.svg", "mute.svg");
            }
        });

    document.querySelector(".volume-img").addEventListener("click", (e) => {
        if (e.target.src.includes("volume")) {
            e.target.src = "/svg/mute.svg";
            currentSong.volume = 0;
            document
                .querySelector(".range")
                .getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = "/svg/volume.svg";
            currentSong.volume = 0.2;
            document
                .querySelector(".range")
                .getElementsByTagName("input")[0].value = 20;
        }
    });
}

main();