let currentSong = new Audio();
let songs;
let currfolder;


// converting seconds to minute - above the seek bar
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

// ./Projsongs/pr5/Arctic Monkeys - I Wanna Be Yours (Lyrics).mp3
// Transferring songs from the projsong library to the song library
async function getSongs(folder) {
    currfolder = folder;
    // let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let a = await fetch(`${folder}`); //http://127.0.0.1:5501/Projsongs/
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }
    let songUL = document.querySelector(".songslib").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <i class="fa-solid fa-music"></i>
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>DEBABRAT</div>
                            </div>
                            Play now
                            <i class="fa-regular fa-circle-play"></i></li>`;
    }


    // Attaching an eventListener to each song

    Array.from(document.querySelector(".songslib").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });

    return songs;
}

// Making a Function Play Music
const playMusic = (track, pause = false) => {
    let playbar = document.getElementsByClassName("play-bar");
    let play = document.querySelector(".play2");
    // let audio = new Audio("/Projsongs/" + track);
    currentSong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause2.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    //play.src = "pause2.svg";
}


async function main() {
    //getting the list of songs
    await getSongs("./Projsongs/pr2/");
    playMusic(songs[0], true)
    console.log(songs);

    // displaying all the album folders on the page

    // adding sons into the song library


    // Attaching an eventListener to play next and previous song
    let play = document.querySelector(".play2");
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause2.svg";
        } else {
            currentSong.pause();
            play.src = "play2.svg";
        }
    })

    // listening the time update event duration of seekbar
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}  :  ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Adding the eventlistener on the progress bar
    document.querySelector(".prog-bar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Adding an eventlistener for the Hamburger/ to display library in mobile view

    document.querySelector("#hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Adding an eventlistener for the close the left/ to display hamburger in mobile view
    document.querySelector("#closebtn").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })

    // Adding eventlistener to the preveous and to the next
    prev.addEventListener("click", () => {
        console.log("previous clicked");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            // console.log(songs, index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    })
    next.addEventListener("click", () => {
        currentSong.pause();
        console.log("next clicked");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            // console.log(songs, index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }

    })

    // adding eventlistener for the volume change...
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting vol to " + e.target.value + " / 100");
        currentSong.volume = parseInt(e.target.value) / 100;
    })


    // loading the songs  to the libraris 
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`Projsongs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })
    })

    //adding event listener to mute the volume of the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        // console.log(e.target);
        if (e.target.src.includes("volumeon.svg")) {
            e.target.src = e.target.src.replace("volumeon.svg", "volumeoff.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("volumeoff.svg", "volumeon.svg");
            currentSong.volume = .20;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    })



    //playing the first song
    // var audio = new Audio(songs[1]);
    // audio.play();

    // seeing the duration of the song

    // audio.addEventListener("loadeddata", () => {
    //     // let duration = audio.duration;
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // });
}

main();