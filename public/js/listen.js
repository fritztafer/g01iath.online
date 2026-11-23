import U, {P} from "./common.js"

var musicFiles = musicFiles ?? [],
    musicReady = musicReady ?? fetch(`//${window.location.hostname}/music/.file-list.json`)
        .then(response => response.json())
        .then(array => musicFiles = array)
        .catch(error => console.error(error));

export const iconsP = {
    play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 24 12" fill="currentColor"/></svg>',
    pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 5 24 5 0M12 0 12 24 17 24 17 0" fill="currentColor"/></svg>',
    prev: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 2 24 2 0M13 0 2 12 13 24M24 0 13 12 24 24" fill="currentcolor"/></svg>',
    next: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0 0 24 11 12M11 0 11 24 22 12M22 0 22 24 24 24 24 0" fill="currentcolor"/></svg>',
    speak0: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M20 12 24 16 23 17 19 13M15 17 24 8 23 7 14 16M19 11 15 7 14 8 18 12" fill="currentcolor"/></svg>',
    speak1: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M14 15A1 1 0 0015 16Q19 12 15 8A1 1 0 0014 9Q17 12 14 15" fill="currentcolor"/></svg>',
    speak2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M14 15A1 1 0 0015 16Q19 12 15 8A1 1 0 0014 9Q17 12 14 15M17 18A1 1 0 0018 19Q23 12 18 5A1 1 0 0017 6Q21 12 17 18" fill="currentcolor"/></svg>',
    speak3: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 6 0 18 5 18 13 24 13 0 5 6M14 15A1 1 0 0015 16Q19 12 15 8A1 1 0 0014 9Q17 12 14 15M17 18A1 1 0 0018 19Q23 12 18 5A1 1 0 0017 6Q21 12 17 18M20 21A1 1 0 0021 22Q27 12 21 2A1 1 0 0020 3Q25 12 20 21" fill="currentcolor"/></svg>'
};

export async function listen() {
    const parent = U.newElement("div", {className: "listen hidden"}),
        current = U.newElement("div", {className: "listen-current", innerHTML: '<div class="pos0" style="font-size: 10em; pointer-events: none; -webkit-user-select: none; user-select: none;">♫</div>'}),
        playlist = U.newElement("div", {className: "listen-playlist"}),
        infoText = U.getElement("#player-info-text");

    parent.append(current, playlist);
    await musicReady;

    P.tracks = P.tracks ?? musicFiles.map(file => ({
        title: file.replace("_", " "),
        stream: `//${window.location.hostname}/music/${file}/stream.m3u8`,
        cover: `//${window.location.hostname}/music/${file}/cover.jpg`
    }));

    const tracks = P.tracks;
    for (const track of tracks) {
        const item = U.newElement("div", {
            onclick: () => {
                player(track);
                // waitForPlayer();
                activateItem(item);
            },
            href: "javascript:",
            className: "listen-item inactive"
        }),
        img = U.newElement("img", {
            src: track.cover,
            className: "listen-item-image",
            alt: ""
        }),
        btn = U.newElement("span", {
            innerHTML: iconsP.play,
            className: "listen-item-button"
        }),
        title = U.newElement("span", {
            textContent: track.title,
            className: "listen-item-title"
        }),
        time = U.newElement("span", {
            textContent: "0:00",
            className: "listen-item-time"
        }),
        children = [img, btn, title, time];

        if (infoText && infoText.textContent === title.textContent) {
            setTimeout(() => { // timeout for animation
                activateItem(item);
                btn.innerHTML = U.getElement("#player-play").innerHTML;
            }, 0);
        }

        item.append(...children);
        playlist.appendChild(item);
    }

    // if (document.querySelector(".player")) {
    //     observeTitleMutation();
    //     observePlayMutation();
    // }

    return parent;
}

async function player(track) {
    if (U.getElement(".player")) return P.module.select(track);

    U.newResource("script", {
        src: `//${window.location.hostname}/js/player.js`,
        type: "module",
    });

    P.module = P.module ?? await import("./player.js");
    P.module.select(track);
}

// function waitForPlayer() {
//     if (!U.getElement(".player")) {
//         const target = document.body;
//         const tempObserver = new MutationObserver((_, observer) => {
//             const infoText = U.getElement("#player-info-text");
//             if (infoText) {
//                 observeTitleMutation();
//                 observePlayMutation();
//                 observer.disconnect();
//             }
//         });

//         tempObserver.observe(target, {childList: true});
//     }
// }

function activateItem(item) {
//     const current = U.getElement(".listen-current"),
//         items = U.getElements(".listen-item"),
//         time = U.getElement("#player-time-total")?.textContent ?? null;

//     for (let i = 0; i < items.length; i++) {
//         const btn = items[i].children[1];

//         if (item === items[i]) {
//             const cover = U.newElement("img", {className: "pos0", src: tracks[i].cover, alt: ""});
//             if (cover.src !== current.firstChild.src) current.replaceChild(cover, current.firstChild);
//             items[i].classList.replace("inactive", "active");
//             items[i].children[3].textContent = time ?? "0:00";
//             btn.innerHTML = iconsP.pause;
//         } else {
//             items[i].classList.replace("active", "inactive");
//             btn.innerHTML = iconsP.play;
//         }
//     }
}

// function observeTitleMutation() {
//     if (titleObserver) return;
//     const infoText = U.getElement("#player-info-text");

//     titleObserver = new MutationObserver(() => {
//         const item = (() => {
//             const items = U.getElements(".listen-item");
//             for (const item of items) if (item.children[2].textContent === infoText.textContent) return item;
//         })();
//         if (item !== undefined) activateItem(item);
//     });

//     titleObserver.observe(infoText, {childList: true});
// }

// function observePlayMutation() {
//     if (playObserver) return;
//     const infoText = U.getElement("#player-info-text");
//     const playBtn = U.getElement("#player-play"); // P needs some work

//     playObserver = new MutationObserver(() => {
//         const btn = (() => {
//             const items = U.getElements(".listen-item");
//             for (const item of items) if (item.children[2].textContent === infoText.textContent) return item.children[1];
//         })();
//         if (btn !== undefined) btn.innerHTML = U.getElement("#player-play").innerHTML;
//     });

//     playObserver.observe(playBtn, {childList: true});
// }