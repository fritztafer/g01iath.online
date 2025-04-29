// aesthetic.js

var index = 0;
var count = 0; // index of current .aesthetic
var amount = 12; // amount of files per load
var images = []; // hold img file names
var loading = false;
var timeout;
var ready = fetch("gallery/.file-list.json")
    .then(res => res.json())
    .then(array => {
        images = shuffleArray(array);
    })
    .catch(err => {
        console.error("error loading gallery", err);
    });

async function aesthetic() {
    await ready;
    let parent = Object.assign(document.createElement("div"), {className: "aesthetic"}),
        main = document.querySelector("main");

    loadImages(parent);

    setTimeout(() => {
        main.innerHTML = "";
        main.appendChild(parent);
    }, time);
}

function loadImages(parent) {
    if (loading || index > images.length) return;
    loading = true;
    let chunk = images.slice(index, index + amount).map(filename => {
        let img = Object.assign(document.createElement("img"),{
                className: "aesthetic-item",
                src: `gallery/${filename}`,
                alt: "",
                onload: () => {
                    let preload = new Image();
                    preload.src = img.src;
                    setImageSpan(img);
                    img.classList.add('loaded');
                }
            });
        return img;
    });

    parent.append(...chunk);
    parent.style.gridTemplateColumns = parent.style.gridTemplateColumns;
    index += amount;
    loading = false;
}

function shuffleArray(array) { // Durstenfeld shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setImageSpan(img) {
    let gap = 2; // 2px gap
    let imgHeight = ((360 / img.naturalWidth) * img.naturalHeight); // scaled to 360px wide
    let span = Math.ceil((imgHeight + gap) / (gap + 1)); // +1px row height
    img.style.setProperty('--span', span);
}

var onScroll = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        let bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 450;
        if (bottom && index < images.length && !loading) {
            let parent = document.querySelectorAll(".aesthetic")[count];
            if (parent.offsetHeight < 25000) {loadImages(parent);} // should probably handle this in load images
            else {
                count += 1;
                parent = document.querySelectorAll(".aesthetic")[count];
                let main = document.querySelector("main");
                main.appendChild(Object.assign(document.createElement("div"), {className: "aesthetic"}));
            }
        }
        else if (index >= images.length && !loading) {window.removeEventListener("scroll", onScroll);}
    }, 100);
}
window.addEventListener("scroll", onScroll);