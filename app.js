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

async function main() {
    let songs = await getSongs();

    var audio = new Audio(songs[0]);
    // audio.play();

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    console.log(songUL)
    for (const song of songs) {
        songUL.innerHTML += `<li>
        <div class="playlist-song flex  align">
        <img class="music-icon invert " src="svg/music-icon.svg" alt="">
        <div class="song-info">
            <div> ${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playlist-play-icon "> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
        </svg>
        </div>
            </div>
        </li>`;
    }

}

main();