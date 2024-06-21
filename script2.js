let currentSong = new Audio();
let songs;
let currfolder;

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

async function getSongs(folder) {
    currfolder = folder;
    console.log(`Fetching songs from ${folder}/songs.json`);

    try {
        let response = await fetch(`${folder}/songs.json`);
        if (!response.ok) {
            console.error(`Failed to fetch songs.json: ${response.status}`);
            return [];
        }
        let data = await response.json();
        songs = data.songs;

        console.log(`Fetched songs:`, songs);

        let songUL = document.querySelector(".songslib ul");
        songUL.innerHTML = "";
        for (const song of songs) {
            songUL.innerHTML += `<li>
                <i class="fa-solid fa-music"></i>
                <div class="info">
                    <div>${song}</div>
                    <div>DEBABRAT</div>
                </div>
                Play now
                <i class="fa-regular fa-circle-play"></i></li>`;
        }

        Array.from(document.querySelectorAll(".songslib li")).forEach(e => {
            e.addEventListener("click", () => {
                playMusic(e.querySelector(".info div").innerHTML.trim());
            });
        });

        return songs;
    } catch (error) {
        console.error(`Error fetching songs:`, error);
    }
}

const playMusic = (track, pause = false) => {
    let play = document.querySelector(".play2");
    currentSong.src = `${currfolder}/` + track;
    currentSong.load();
    if (!pause) {
        currentSong.play().catch(error => console.error('Error playing song:', error));
        play.src = "pause2.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
    await getSongs("Projsongs/pr2");
    if (songs.length > 0) {
        playMusic(songs[0], true);
    }

    let play = document.querySelector(".play2");
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play().catch(error => console.error('Error playing song:', error));
            play.src = "pause2.svg";
        } else {
            currentSong.pause();
            play.src = "play2.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".prog-bar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector("#hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector("#closebtn").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });

    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").pop());
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").pop());
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`Projsongs/${item.currentTarget.dataset.folder}`);
            if (songs.length > 0) {
                playMusic(songs[0]);
            }
        });
    });

    document.querySelector(".volume > img").addEventListener("click", e => {
        if (e.target.src.includes("volumeon.svg")) {
            e.target.src = e.target.src.replace("volumeon.svg", "volumeoff.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("volumeoff.svg", "volumeon.svg");
            currentSong.volume = 0.20;
            document.querySelector(".range input").value = 20;
        }
    });
}

main();