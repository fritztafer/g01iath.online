// aesthetic.js

var index = 0, // track which files loaded
    amount = 16, // amount of files per load
    images = [], // hold img file names
    timeout, // debounce scrollHandler()
    loading = false, // debounce loadImages()
    ready = fetch("gallery/.file-list.json")
    .then(res => res.json())
    .then(array => {
        images = shuffleArray(array);
    })
    .catch(err => {
        console.error("error loading gallery", err);
    });

async function aesthetic() {
    await ready;
    let main = document.querySelector("main"),
        parent = Object.assign(document.createElement("div"),{className: "aesthetic", style: "visibility: hidden; max-height: 0; overflow: hidden;"}),
        colAmt = (function() {
                if (window.innerWidth < 640) {return 1;}
            else if (window.innerWidth < 960) {return 2;}
            else if (window.innerWidth < 1280) {return 3;}
            else if (window.innerWidth >= 1280) {return 4;}
        })();
    loadColumns(colAmt, parent);
    loadImages(parent);

    main.appendChild(parent);
    setTimeout(() => {
        parent.style.visibility = "visible";
        parent.style.maxHeight = "none";
        parent.style.overflow = "auto";
        main.firstElementChild.remove();
    }, time);
}

function loadImages(parent) {
    if (loading || index > images.length) return;
    loading = true;
    let columns = parent.childNodes;
    images.slice(index, index + amount).map(filename => {
        let img = Object.assign(document.createElement("img"),{
            className: "aesthetic-item",
            src: `gallery/${filename}`,
            alt: "",
            onload: () => {
                let lengths = Array.from(columns).map(col => col.offsetHeight);
                let column = lengths.indexOf(Math.min(...lengths));
                columns[column].appendChild(img);
                setTimeout(() => {img.classList.add('loaded');}, 100); // timeout for animation
            }
        });
    });
    index += amount;
    loading = false;
}

function adoptImages(colAmt) {
    let parent = document.getElementsByClassName("aesthetic")[0];
    let columns = document.getElementsByClassName("aesthetic-column");
    let amount = Math.max(...Array.from(columns).map(col => col.childNodes.length));
    let foster = [];
    let newScroll = (window.scrollY / document.body.scrollHeight) * document.body.scrollHeight;

    // hide so images don't fly around
    parent.style.visibility = "hidden";

    // get currently loaded images in order and push them to foster
    for (let i = 0; i < amount; i++) {
        for (let column of columns) {
            if (column.childNodes[i]) {
                foster.push(column.childNodes[i]);
            }
        }
    }

    // reset columns
    loadColumns(colAmt, parent)
    columns = document.getElementsByClassName("aesthetic-column");

    // append children to new columns
    for (let child of foster) {
        let lengths = Array.from(columns).map(col => col.offsetHeight);
        let column = lengths.indexOf(Math.min(...lengths));
        columns[column].appendChild(child);
    }

    // scroll roughly to images that were displayed
    window.scrollTo({top: newScroll, behavior: "auto"});

    // unhide
    parent.style.visibility = "visible";
}

function loadColumns(colAmt, parent) {
    parent.innerHTML = "";
    for (let i = 0; i < colAmt; i++) {
        parent.appendChild(Object.assign(document.createElement("div"),{className: "aesthetic-column"}));
    }
}

function shuffleArray(array) { // Durstenfeld shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

 function resizeHandler() {
    let columns = document.getElementsByClassName("aesthetic-column")
         if (window.innerWidth < 640 && columns.length !== 1) {adoptImages(1);}
    else if (window.innerWidth >= 640 && window.innerWidth < 960 && columns.length !== 2) {adoptImages(2);}
    else if (window.innerWidth >= 960 && window.innerWidth < 1280 && columns.length !== 3) {adoptImages(3);}
    else if (window.innerWidth >= 1280 && columns.length !== 4) {adoptImages(4);}
};

function scrollHandler() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        let bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
        if (bottom && index < images.length && !loading) {loadImages(document.getElementsByClassName("aesthetic")[0]);}
        else if (index >= images.length && !loading) {window.removeEventListener("scroll", scrollHandler);}
    }, 100);
}

window.addEventListener("resize", resizeHandler)
window.addEventListener("scroll", scrollHandler)