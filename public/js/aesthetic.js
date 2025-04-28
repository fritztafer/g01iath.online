// aesthetic.js

var index = 0;
var amount = 12;
var images = [];
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
            loading: "lazy",
            onload: () => {
                img.classList.add('loaded');
                setImageSpan(img);
            }
        })
        return img;
    });

    for (let item of chunk) {
        let img = new Image();
        img.item = item;
    }

    parent.append(...chunk);
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
    let gap = 6; // grid-auto-rows + gap, properties of .aesthetic
    let imgHeight = img.height;
    let span = Math.floor((imgHeight + gap) / gap);
    let remainder = (imgHeight + gap) % gap;
    if (remainder > 0) {span += 1;}
    img.style.setProperty('--span', span);
}

var onScroll = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        let bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 450;
        if (bottom && index < images.length && !loading) {loadImages(document.querySelector(".aesthetic"));}
        else if (index >= images.length && !loading) {window.removeEventListener("scroll", onScroll);}
    }, 100);
}
window.addEventListener("scroll", onScroll);