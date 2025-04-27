// aesthetic.js

var index = 0;
var amount = 12;
var images = [];
var loading = false;
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
    document.querySelector("main").innerHTML =
        '<div class="aesthetic"></div>';
    loadImages()
}

function loadImages() {
    if (loading) return;
    loading = true;
    let gallery = document.querySelector(".aesthetic");
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
    gallery.append(...chunk);
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
    let gap = 8;
    let imgHeight = img.height;
    let span = Math.floor((imgHeight + gap) / gap);
    let remainder = (imgHeight + gap) % gap;
    if (remainder > 0) {span += 1;}
    img.style.setProperty('--span', span);
}

window.addEventListener("scroll", async () => {
    await ready;
    let bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
    if (bottom && index < images.length) {
        loadImages();
    }
});