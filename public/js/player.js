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
            '<button id="player-play" class="player-button">',
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 24 12" fill="currentColor"/></svg>',
            '</button>',
            '<button id="player-skip-prev" class="player-button player-item">',
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">',
                    '<path d="M0 0 0 24 2 24 2 0M13 0 2 12 13 24M24 0 13 12 24 24" fill="currentcolor"/>',
                '</svg>',
            '</button>',
            '<button id="player-skip-next" class="player-button player-item">',
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">',
                    '<path d="M0 0 0 24 11 12M11 0 11 24 22 12M22 0 22 24 24 24 24 0" fill="currentcolor"/>',
                '</svg>',
            '</button>',
            '<span id="player-volume-parent">',
                '<button id="player-volume-mute" class="player-button player-item">',
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M14 15A1 1 0 0015 16Q19 12 15 8A1 1 0 0014 9Q17 12 14 15M17 18A1 1 0 0018 19Q23 12 18 5A1 1 0 0017 6Q21 12 17 18M20 21A1 1 0 0021 22Q27 12 21 2A1 1 0 0020 3Q25 12 20 21" fill="currentcolor"/></svg>',
                '</button>',
                '<input id="player-volume-range" type="range" min="0" max="1" step=".05" value="1">',
            '</span>',
        '</div>'
    ].join('')
}));

const audio = new Audio(),
    tracks = window.tracks, // tracks declared by listen.js
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
    trackIndex,
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
    const selectionIndex = tracks.indexOf(track);
    if (selectionIndex === trackIndex) audio.paused ? audio.play() : audio.pause();
    else {
        trackIndex = selectionIndex;
        load(track);
    }
}

function load(track) {
    audio.src = track.url;

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

    audio.play();
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
        muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M20 12 24 16 23 17 19 13M15 17 24 8 23 7 14 16M19 11 15 7 14 8 18 12" fill="currentcolor"/></svg>';
    } else if (level >= .05 && level < .40) {
        muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M14 15A1 1 0 0015 16Q19 12 15 8A1 1 0 0014 9Q17 12 14 15" fill="currentcolor"/></svg>';
    } else if (level >= .40 && level < .70) {
        muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M14 15A1 1 0 0015 16Q19 12 15 8A1 1 0 0014 9Q17 12 14 15M17 18A1 1 0 0018 19Q23 12 18 5A1 1 0 0017 6Q21 12 17 18" fill="currentcolor"/></svg>'; 
    } else if (level >= .70) {
        muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M14 15A1 1 0 0015 16Q19 12 15 8A1 1 0 0014 9Q17 12 14 15M17 18A1 1 0 0018 19Q23 12 18 5A1 1 0 0017 6Q21 12 17 18M20 21A1 1 0 0021 22Q27 12 21 2A1 1 0 0020 3Q25 12 20 21" fill="currentcolor"/></svg>';
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
audio.addEventListener("play", () => {playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 5 24 5 0M12 0 12 24 17 24 17 0" fill="currentColor"/></svg>'});
audio.addEventListener("pause", () => {playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 24 12" fill="currentColor"/></svg>'});

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