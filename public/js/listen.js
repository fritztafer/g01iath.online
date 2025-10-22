var titleObserver = titleObserver ?? null,
    playObserver = playObserver ?? null,
    musicFiles = musicFiles ?? [],
    musicReady = musicReady ?? fetch(`//${window.location.hostname}/music/.file-list.json`)
        .then(response => response.json())
        .then(array => musicFiles = array)
        .catch(error => console.error(error));

async function listen() {
    const parent = Object.assign(document.createElement("div"), {className: "listen", style: "visibility: hidden; max-height: 0; overflow: hidden;"}),
        infoText = document.getElementById("player-info-text");

    await musicReady;

    window.tracks = window.tracks ?? musicFiles.map(file => ({ // used by player.js
        title: file.replace("_", " "),
        url: `//${window.location.hostname}/music/${file}.mp3`,
        img: `//${window.location.hostname}/music/${file}.jpg`
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
            className: "listen-item"
        }),
        img = Object.assign(document.createElement("img"), {
            src: track.img,
            className: "listen-item-image",
            alt: ""
        }),
        btn = Object.assign(document.createElement("span"), {
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 24 12" fill="currentColor"/></svg>',
            className: "listen-item-button active-out"
        }),
        title = Object.assign(document.createElement("span"), {
            textContent: track.title,
            className: "listen-item-title active-out"
        });
        item.append(img, btn, title);

        if (infoText && infoText.textContent === title.textContent) {
            setTimeout(() => { // timeout for animation
                activateItem(item)
                btn.textContent = document.getElementById("player-play").textContent;
            }, 0);
        }

        parent.appendChild(item);
    }

    return parent;
}

function activateItem(item) {
    const items = document.getElementsByClassName("listen-item");

    for (let i = 0; i < items.length; i++) {
        const btn = items[i].children[1];
        const title = items[i].children[2];

        if (item === items[i]) {
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 0 2 24 8 24 8 0M16 0 16 24 22 24 22 0" fill="currentColor"/></svg>';
            btn.classList.replace("active-out", "active-in");
            title.classList.replace("active-out", "active-in");
        } else {
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 24 12" fill="currentColor"/></svg>';
            btn.classList.replace("active-in", "active-out");
            title.classList.replace("active-in", "active-out");
        }
    }
}

function observeTitleMutation() {
    if (titleObserver) return;

    const infoText = document.getElementById("player-info-text");
    titleObserver = new MutationObserver(() => {
        const update = infoText.textContent;
        const item = (() => {
            const items = document.getElementsByClassName("listen-item");
            for (const item of items) if (item.children[2].textContent === update) return item;
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
        const update = playBtn.innerHTML;
        const btn = (() => {
            const items = document.getElementsByClassName("listen-item");
            for (const item of items) if (item.children[2].textContent === infoText.textContent) return item.children[1];
        })();
        if (btn !== undefined) btn.innerHTML = update;
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