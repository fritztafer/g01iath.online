import U, {P} from "./common.js"
import {iconsP} from "./listen.js"

U.newElement("div", {
    className: "player hidden",
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
                iconsP.play,
            '</button>',
            '<button id="player-skip-prev" class="player-button player-item">',
                iconsP.prev,
            '</button>',
            '<button id="player-skip-next" class="player-button player-item">',
                iconsP.next,
            '</button>',
            '<span id="player-volume-parent">',
                '<button id="player-volume-mute" class="player-button player-item">',
                    iconsP.speak3,
                '</button>',
                '<input id="player-volume-range" type="range" min="0" max="1" step=".05" value="1">',
            '</span>',
        '</div>'
    ].join('')
}, document.body);

const audio = new Audio();
    P.parent = U.getElement(".player"),
    P.volume = U.getElement("#player-volume-range"),
    P.progress = U.getElement("#player-time-seek-progress"),
    P.seek = U.getElement("#player-time-seek-parent"),
    P.title = U.getElement("#player-info-text"),
    P.current = U.getElement("#player-time-current"),
    P.total = U.getElement("#player-time-total"),
    P.play = U.getElement("#player-play"),
    P.prev = U.getElement("#player-skip-prev"),
    P.next = U.getElement("#player-skip-next"),
    P.mute = U.getElement("#player-volume-mute"),
    P.ready = (async () => {
        await Promise.all([
            U.newResource("link", {
                href: `//${window.location.hostname}/css/player.css`,
                rel: "stylesheet"
            }),
            audio.canPlayType("application/vnd.apple.mpegurl") ? Promise.resolve()
            : U.newResource("script", {src: `//${window.location.hostname}/js/hls.min.js`})
        ]);
        P.parent.classList.remove("hidden");
    })();
let volumeState = 1,
    trackIndex,
    wakeLock = null;

audio.volume = volumeState;
P.volume.value = volumeState;

export async function select(track) {
    await P.ready;
    const selectionIndex = P.tracks.indexOf(track);
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

    P.play.classList.add('pulse');
    P.play.addEventListener('animationend', function removePulse() {
        P.play.classList.remove('pulse');
    }, {once: true});

    audio.addEventListener("loadedmetadata", function getMetaData() {
        const totalMinutes = Math.floor(audio.duration / 60),
            totalSeconds = Math.floor(audio.duration % 60).toString().padStart(2, "0");
        P.total.textContent = `${totalMinutes}:${totalSeconds}`;
        P.title.textContent = track.title;
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: "GØ1IATH",
                album: "",
                artwork: [{src: track.cover}]
            });
        }
    }, {once: true});
}

function skip(direction) {
    switch (direction) {
        case "prev":
            trackIndex -= 1;
            if (trackIndex < 0) trackIndex = P.tracks.length - 1;
            break;
        case "next":
            trackIndex += 1;
            if (trackIndex > P.tracks.length - 1) trackIndex = 0;
            break;
    }
    load(P.tracks[trackIndex]);
}

function mute() {
    if (P.volume.value == 0) {
        if (volumeState === 0) volumeState = .05;
        volume(volumeState);
        P.volume.value = volumeState;
    } else if (P.volume.value > 0) {
        volume(0);
        P.volume.value = 0;
    }
}

function volume(level) {
    if (level < .05) P.mute.innerHTML = iconsP.speak0;
    else if (level >= .05 && level < .40) P.mute.innerHTML = iconsP.speak1;
    else if (level >= .40 && level < .70) P.mute.innerHTML = iconsP.speak2; 
    else if (level >= .70) P.mute.innerHTML = iconsP.speak3;
    audio.volume = level;
}

function nudgeVolume(delta) {
    P.volume.value = Math.min(1, Math.max(0, +P.volume.value + delta)).toFixed(2);
    volumeState = +P.volume.value;
    volume(P.volume.value);
}

function timeUpdate() {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100,
            currentMins = Math.floor(audio.currentTime / 60),
            currentSecs = Math.floor(audio.currentTime % 60).toString().padStart(2, "0");
        P.progress.style.width = `${progressPercent}%`;
        P.current.textContent = `${currentMins}:${currentSecs}`;
    } else {
        P.progress.style.width = "0%";
        P.current.textContent = "0:00";
    }
}

function seekEvent(event) {
    const width = P.seek.offsetWidth,
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

P.play.addEventListener("mouseup", (e) => {if (predicate(e)) audio.paused ? audio.play() : audio.pause()});
audio.addEventListener("play", () => {
    P.play.innerHTML = iconsP.pause;
    if (document.visibilityState === 'visible') requestWakeLock();
});
audio.addEventListener("pause", () => {
    P.play.innerHTML = iconsP.play;
    releaseWakeLock();
});

P.prev.addEventListener("mouseup", (e) => {if (predicate(e)) audio.currentTime = 0});
P.prev.addEventListener("dblclick", (e) => {if (predicate(e)) skip("prev")});
P.next.addEventListener("mouseup", (e) => {if (predicate(e)) skip("next")});
if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler('previoustrack', () => skip("prev"));
    navigator.mediaSession.setActionHandler('nexttrack', () => skip("next"));
}
audio.addEventListener("ended", () => {skip("next")});

audio.addEventListener("timeupdate", timeUpdate);
P.seek.addEventListener("click", (e) => {if (predicate(e)) seekEvent(e)});
P.seek.addEventListener("touchstart", (e) => {if (predicate(e)) seekEvent(e)}, {passive: true});

P.volume.addEventListener("input", () => {volume(P.volume.value)});
P.volume.addEventListener("mouseup", () => {if (P.volume.value > 0) volumeState = +P.volume.value});
P.mute.addEventListener("mouseup", (e) => {if (predicate(e)) mute()});