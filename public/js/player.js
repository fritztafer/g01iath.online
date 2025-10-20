document.body.appendChild(Object.assign(document.createElement("div"), {
    className: "player hidden",
    style: "max-height: 0; overflow: hidden;",
    innerHTML: [
        '<div id="player-info-parent">',
            '<span id="player-info-text" class="player-item"></span>',
        '</div>',
        '<div id="player-time-parent">',
            '<span id="player-time-current" class="player-time player-item">0:00</span>',
            '<span id="player-time-seek-parent" class="player-item">',
                '<span id="player-time-seek-progress-parent">',
                    '<span id="player-time-seek-progress" class="player-item"></span>',
                '</span>',
            '</span>',
            '<span id="player-time-total" class="player-time player-item">0:00</span>',
        '</div>',
        '<div id="player-button-parent">',
            '<button id="player-play" class="player-button">▶</button>',
            '<button id="player-skip-prev" class="player-button player-item">⏮</button>',
            '<button id="player-skip-next" class="player-button player-item">⏭</button>',
            '<span id="player-volume-parent">',
                '<button id="player-volume-mute" class="player-button player-item">🕪</button>',
                '<input id="player-volume-range" type="range" min="0" max="1" step=".05" value="1">',
            '</span>',
        '</div>'
    ].join('')
}));

const audio = new Audio(),
    playerParent = document.querySelector(".player"),
    volumeInput = document.getElementById("player-volume-range"),
    seekProgress = document.getElementById("player-time-seek-progress"),
    seekInput = document.getElementById("player-time-seek-parent"),
    infoText = document.getElementById("player-info-text"),
    timeCurrentText = document.getElementById("player-time-current"),
    timeTotalText = document.getElementById("player-time-total"),
    playBtn = document.getElementById("player-play"),
    skipPrevBtn = document.getElementById("player-skip-prev"),
    skipNextBtn = document.getElementById("player-skip-next"),
    muteBtn = document.getElementById("player-volume-mute");
let volumeState = 1,
    trackIndex = 0,
    keyDown = {};

audio.volume = volumeState;
volumeInput.value = volumeState;

(async () => {
    await new Promise((resolve) => {
        const link = Object.assign(document.createElement("link"), {
            href: `//${window.location.hostname}/css/player.css`,
            rel: "stylesheet"
        });
        link.onload = () => resolve(link);
        document.head.appendChild(link);
    });
    playerParent.removeAttribute("style");
    playerParent.classList.remove("hidden");
})();

function select(track) {
    trackIndex = tracks.indexOf(track); // tracks declared by listen.js
    load(track);
}

function load(track) {
    audio.src = track.url;
    audio.play();

    playBtn.classList.add('pulse');
    playBtn.addEventListener('animationend', function removePulse() {
        playBtn.classList.remove('pulse');
        playBtn.removeEventListener('animationend', removePulse);
    });

    audio.addEventListener("loadedmetadata", function getMetaData() {
        const totalMins = Math.floor(audio.duration / 60);
        const totalSecs = Math.floor(audio.duration % 60)
            .toString()
            .padStart(2, "0");
        infoText.textContent = track.title;
        timeTotalText.textContent = `${totalMins}:${totalSecs}`;
        audio.removeEventListener("loadedmetadata", getMetaData);
    });
}

function skip(direction) {
    switch (direction) {
        case "prev":
            trackIndex -= 1;
            if (trackIndex < 0) trackIndex = tracks.length - 1;
            load(tracks[trackIndex]);
            break;
        case "next":
            trackIndex += 1;
            if (trackIndex > tracks.length - 1) trackIndex = 0;
            load(tracks[trackIndex])
            break;
    }
}

function mute() {
    if (volumeInput.value < .05) {
        volume(volumeState);
        volumeInput.value = volumeState;
    } else if (volumeInput.value >= .05) {
        volumeState = volumeInput.value;
        volume(0);
        volumeInput.value = 0;
    }
}

function volume(level) {
    audio.volume = level;
    if (level < .05) {
        muteBtn.textContent = "🛇";
    } else if (level >= .05 && level < .55) {
        muteBtn.textContent = "🕩";
    } else if (level >= .55) {
        muteBtn.textContent = "🕪";
    }
}

function predicate(e) { // left click only
    if (e.button === 0) return true;
    return false;
}

function timeUpdate() {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        const currentMins = Math.floor(audio.currentTime / 60);
        const currentSecs = Math.floor(audio.currentTime % 60).toString().padStart(2, "0");
        seekProgress.style.width = `${progressPercent}%`;
        timeCurrentText.textContent = `${currentMins}:${currentSecs}`;
    } else {
        seekProgress.style.width = "0%";
        timeCurrentText.textContent = "0:00";
    }
}

function seekClick(event) {
    const width = seekInput.offsetWidth;
    const clickX = event.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
}

document.addEventListener("keydown", (e) => {
    keyDown[e.key] = true;
    if (keyDown[" "]) {
        audio.paused ? audio.play() : audio.pause();
        if (e.target !== playerParent) e.preventDefault();
    }
    if (keyDown["ArrowLeft"]) audio.currentTime -= 5;
    if (keyDown["ArrowRight"]) audio.currentTime += 5;
    if (keyDown["Control"] && keyDown["ArrowLeft"]) skip("prev");
    if (keyDown["Control"] && keyDown["ArrowRight"]) skip("next");
});
document.addEventListener("keyup", (e) => {delete keyDown[e.key];});

playBtn.addEventListener("mouseup", (e) => {if (predicate(e)) audio.paused ? audio.play() : audio.pause()});
audio.addEventListener("play", () => {playBtn.textContent = "⏸"});
audio.addEventListener("pause", () => {playBtn.textContent = "▶"});

skipPrevBtn.addEventListener("mouseup", (e) => {if (predicate(e)) audio.currentTime = 0});
skipPrevBtn.addEventListener("dblclick", (e) => {if (predicate(e)) {skip("prev")}});
skipNextBtn.addEventListener("mouseup", (e) => {if (predicate(e)) skip("next")});
audio.addEventListener("ended", () => {skip("next")});

audio.addEventListener("timeupdate", timeUpdate);
seekInput.addEventListener("click", (e) => {if (predicate(e)) seekClick(e)});
seekInput.addEventListener("touchstart", (e) => {if (predicate(e)) seekClick(e)});

volumeInput.addEventListener("input", () => {volume(volumeInput.value)});
volumeInput.addEventListener("mouseup", () => {if (volumeInput.value > 0) volumeState = volumeInput.value});
muteBtn.addEventListener("mouseup", (e) => {if (predicate(e)) mute()});