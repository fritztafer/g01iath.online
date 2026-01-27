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
                window.svg.play,
            '</button>',
            '<button id="player-skip-prev" class="player-button player-item">',
                window.svg.prev,
            '</button>',
            '<button id="player-skip-next" class="player-button player-item">',
                window.svg.next,
            '</button>',
            '<span id="player-volume-parent">',
                '<button id="player-volume-mute" class="player-button player-item">',
                    window.svg.speak3,
                '</button>',
                '<input id="player-volume-range" type="range" min="0" max="1" step=".05" value="1">',
            '</span>',
        '</div>'
    ].join('')
}));

const audio = new Audio(),
    tracks = window.tracks,
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
    muteBtn = document.getElementById("player-volume-mute"),
    playerReady = (async () => {
        const getResource = (tag, attrs, parent) =>
            new Promise(resolve => {
                const element = Object.assign(document.createElement(tag), attrs);
                element.onload = () => resolve(element);
                parent.appendChild(element);
            });
        await Promise.all([
            getResource("link", {
                href: `//${window.location.hostname}/css/player.css`,
                rel: "stylesheet"
            }, document.head),
            audio.canPlayType("application/vnd.apple.mpegurl") ? Promise.resolve()
            : getResource("script", {
                src: "https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js"
            }, document.body)
        ]);
        playerParent.removeAttribute("style");
        playerParent.classList.remove("hidden");
    })();
let volumeState = 1,
    trackIndex,
    wakeLock = null;

audio.volume = volumeState;
volumeInput.value = volumeState;

async function select(track) {
    await playerReady;
    const selectionIndex = tracks.indexOf(track);
    if (selectionIndex === trackIndex) audio.paused ? audio.play() : audio.pause();
    else {
        trackIndex = selectionIndex;
        load(track);
    }
}

function load(track) {
    if (window.hls) {
        window.hls.destroy();
        window.hls = null;
    }

    if (audio.canPlayType("application/vnd.apple.mpegurl")) {
        audio.src = track.stream;
        audio.play();
    } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(track.stream);
        hls.attachMedia(audio);
        window.hls = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
    }

    playBtn.classList.add('pulse');
    playBtn.addEventListener('animationend', function removePulse() {
        playBtn.classList.remove('pulse');
        playBtn.removeEventListener('animationend', removePulse);
    });

    audio.addEventListener("loadedmetadata", function getMetaData() {
        const totalMinutes = Math.floor(audio.duration / 60),
            totalSeconds = Math.floor(audio.duration % 60).toString().padStart(2, "0");
        timeTotalText.textContent = `${totalMinutes}:${totalSeconds}`;
        infoText.textContent = track.title;
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: "GØ1IATH",
                album: "",
                artwork: [{src: track.cover}]
            });
        }
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
    if (volumeInput.value == 0) {
        if (volumeState === 0) volumeState = .05;
        volume(volumeState);
        volumeInput.value = volumeState;
    } else if (volumeInput.value > 0) {
        volume(0);
        volumeInput.value = 0;
    }
}

function volume(level) {
    if (level < .05) muteBtn.innerHTML = window.svg.speak0;
    else if (level >= .05 && level < .40) muteBtn.innerHTML = window.svg.speak1;
    else if (level >= .40 && level < .70) muteBtn.innerHTML = window.svg.speak2; 
    else if (level >= .70) muteBtn.innerHTML = window.svg.speak3;
    audio.volume = level;
}

function nudgeVolume(delta) {
    volumeInput.value = Math.min(1, Math.max(0, +volumeInput.value + delta)).toFixed(2);
    volumeState = +volumeInput.value;
    volume(volumeInput.value);
}

function timeUpdate() {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100,
            currentMins = Math.floor(audio.currentTime / 60),
            currentSecs = Math.floor(audio.currentTime % 60).toString().padStart(2, "0");
        seekProgress.style.width = `${progressPercent}%`;
        timeCurrentText.textContent = `${currentMins}:${currentSecs}`;
    } else {
        seekProgress.style.width = "0%";
        timeCurrentText.textContent = "0:00";
    }
}

function seekEvent(event) {
    const width = seekInput.offsetWidth,
        clickX = event.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
}

function predicate(e) { // left click only
    if (e.button === 0) return true;
    return false;
}

async function requestWakeLock() {
    if (wakeLock) return;
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => wakeLock = null);
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
    }
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible' && !wakeLock && !audio.paused) requestWakeLock();
    else if (document.visibilityState === 'hidden' && wakeLock) releaseWakeLock();
});

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case " ":
            e.preventDefault();
            audio.paused ? audio.play() : audio.pause();
            break;
        case "ArrowLeft":
            e.preventDefault();
            e.ctrlKey ? skip("prev") : (audio.currentTime -= 5);
            break;
        case "ArrowRight":
            e.preventDefault();
            e.ctrlKey ? skip("next") : (audio.currentTime += 5);
            break;
        case "ArrowDown":
            e.preventDefault();
            nudgeVolume(-.05);
            break;
        case "ArrowUp":
            e.preventDefault();
            nudgeVolume(.05);
            break;
        case "m":
        case "M":
            if (!e.ctrlKey) {
                e.preventDefault();
                mute();
            }
            break;
    }
});

playBtn.addEventListener("mouseup", (e) => {if (predicate(e)) audio.paused ? audio.play() : audio.pause()});
audio.addEventListener("play", () => {
    playBtn.innerHTML = window.svg.pause;
    if (document.visibilityState === 'visible') requestWakeLock();
});
audio.addEventListener("pause", () => {
    playBtn.innerHTML = window.svg.play;
    releaseWakeLock();
});

skipPrevBtn.addEventListener("mouseup", (e) => {if (predicate(e)) audio.currentTime = 0});
skipPrevBtn.addEventListener("dblclick", (e) => {if (predicate(e)) skip("prev")});
skipNextBtn.addEventListener("mouseup", (e) => {if (predicate(e)) skip("next")});
if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler('previoustrack', () => skip("prev"));
    navigator.mediaSession.setActionHandler('nexttrack', () => skip("next"));
}
audio.addEventListener("ended", () => {skip("next")});

audio.addEventListener("timeupdate", timeUpdate);
seekInput.addEventListener("click", (e) => {if (predicate(e)) seekEvent(e)});
seekInput.addEventListener("touchstart", (e) => {if (predicate(e)) seekEvent(e)}, {passive: true});

volumeInput.addEventListener("input", () => {volume(volumeInput.value)});
volumeInput.addEventListener("mouseup", () => {if (volumeInput.value > 0) volumeState = +volumeInput.value});
muteBtn.addEventListener("mouseup", (e) => {if (predicate(e)) mute()});