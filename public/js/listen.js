var titleObserver = titleObserver ?? null,
    playObserver = playObserver ?? null,
    musicFiles = musicFiles ?? [],
    musicReady = musicReady ?? fetch(`//${window.location.hostname}/music/.file-list.json`)
        .then(response => response.json())
        .then(array => musicFiles = array)
        .catch(error => console.error(error));
window.svg = window.svg ?? {
    play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 24 12" fill="currentColor"/></svg>',
    pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 5 24 5 0M12 0 12 24 17 24 17 0" fill="currentColor"/></svg>',
    prev: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 2 24 2 0M13 0 2 12 13 24M24 0 13 12 24 24" fill="currentcolor"/></svg>',
    next: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 11 12M11 0 11 24 22 12M22 0 22 24 24 24 24 0" fill="currentcolor"/></svg>',
    speak0: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M20 12 24 16 23 17 19 13M15 17 24 8 23 7 14 16M19 11 15 7 14 8 18 12" fill="currentcolor"/></svg>',
    speak1: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M14 15A1 1 0 0015 16Q19 12 15 8A1 1 0 0014 9Q17 12 14 15" fill="currentcolor"/></svg>',
    speak2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M14 15A1 1 0 0015 16Q19 12 15 8A1 1 0 0014 9Q17 12 14 15M17 18A1 1 0 0018 19Q23 12 18 5A1 1 0 0017 6Q21 12 17 18" fill="currentcolor"/></svg>',
    speak3: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M14 15A1 1 0 0015 16Q19 12 15 8A1 1 0 0014 9Q17 12 14 15M17 18A1 1 0 0018 19Q23 12 18 5A1 1 0 0017 6Q21 12 17 18M20 21A1 1 0 0021 22Q27 12 21 2A1 1 0 0020 3Q25 12 20 21" fill="currentcolor"/></svg>'
};

async function listen() {
    const parent = Object.assign(document.createElement("div"), {className: "listen", style: "visibility: hidden; max-height: 0; overflow: hidden;"}),
        current = Object.assign(document.createElement("div"), {className: "listen-current", innerHTML: '<div class="pos0" style="font-size: 10em; pointer-events: none; -webkit-user-select: none; user-select: none;">♫</div>'}),
        playlist = Object.assign(document.createElement("div"), {className: "listen-playlist"}),
        infoText = document.getElementById("player-info-text");

    parent.append(current, playlist);
    await musicReady;

    window.tracks = window.tracks ?? musicFiles.map(file => ({
        title: file.replace("_", " "),
        stream: `//${window.location.hostname}/music/${file}/stream.m3u8`,
        cover: `//${window.location.hostname}/music/${file}/cover.jpg`
    }));

    const tracks = window.tracks;
    for (const track of tracks) {
        const item = Object.assign(document.createElement("div"), {
            onclick: () => {
                player(track);
                waitForPlayer();
                activateItem(item);
            },
            href: "javascript:",
            className: "listen-item inactive"
        }),
        img = Object.assign(document.createElement("img"), {
            src: track.cover,
            className: "listen-item-image",
            alt: ""
        }),
        btn = Object.assign(document.createElement("span"), {
            innerHTML: window.svg.play,
            className: "listen-item-button"
        }),
        title = Object.assign(document.createElement("span"), {
            textContent: track.title,
            className: "listen-item-title"
        }),
        time = Object.assign(document.createElement("span"), {
            textContent: "0:00",
            className: "listen-item-time"
        }),
        children = [img, btn, title, time];

        if (infoText && infoText.textContent === title.textContent) {
            setTimeout(() => { // timeout for animation
                activateItem(item);
                btn.innerHTML = document.getElementById("player-play").innerHTML;
            }, 0);
        }

        item.append(...children);

        playlist.appendChild(item);
    }

    return parent;
}

function activateItem(item) {
    const current = document.querySelector(".listen-current");
    const items = document.getElementsByClassName("listen-item");
    const time = document.querySelector("#player-time-total")?.textContent ?? null;

    for (let i = 0; i < items.length; i++) {
        const btn = items[i].children[1];

        if (item === items[i]) {
            btn.innerHTML = window.svg.pause;
            items[i].classList.replace("inactive", "active");
            current.replaceChild(Object.assign(document.createElement("img"), {
                className: "pos0",
                src: tracks[i].cover,
                alt: ""
            }), current.firstChild);
            items[i].children[3].textContent = time ?? "0:00";
        } else {
            btn.innerHTML = window.svg.play;
            items[i].classList.replace("active", "inactive");
        }
    }
}

function observeTitleMutation() {
    if (titleObserver) return;
    const infoText = document.getElementById("player-info-text");

    titleObserver = new MutationObserver(() => {
        const item = (() => {
            const items = document.getElementsByClassName("listen-item");
            for (const item of items) if (item.children[2].textContent === infoText.textContent) return item;
        })();
        if (item !== undefined) activateItem(item);
    });

    titleObserver.observe(infoText, {childList: true});
}

function observePlayMutation() {
    if (playObserver) return;
    const playBtn = document.getElementById("player-play");
    const infoText = document.getElementById("player-info-text");

    playObserver = new MutationObserver(() => {
        const btn = (() => {
            const items = document.getElementsByClassName("listen-item");
            for (const item of items) if (item.children[2].textContent === infoText.textContent) return item.children[1];
        })();
        if (btn !== undefined) btn.innerHTML = playBtn.innerHTML;
    });

    playObserver.observe(playBtn, {childList: true});
}

function waitForPlayer() {
    if (!document.querySelector(".player")) {
        const target = document.body;
        const tempObserver = new MutationObserver((_, observer) => {
            const infoText = document.getElementById("player-info-text");
            if (infoText) {
                observeTitleMutation();
                observePlayMutation();
                observer.disconnect();
            }
        });

        tempObserver.observe(target, {childList: true});
    }
}