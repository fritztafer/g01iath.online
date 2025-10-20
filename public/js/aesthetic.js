var galleryIndex = 0, // track which files loaded
    galleryAmount = 16, // amount of files per load
    galleryFiles = [], // holds file names
    galleryTimeout, // debounce scrollHandler()
    galleryLoading = false, // debounce loadItems()
    galleryReady = fetch(`//${window.location.hostname}/gallery/.file-list.json`)
        .then(response => response.json())
        .then(array => galleryFiles = shuffleArray(array))
        .catch(error => console.error(error));

async function aesthetic() {
    let parent = Object.assign(document.createElement("div"), {className: "aesthetic", style: "visibility: hidden; max-height: 0; overflow: hidden;"}),
        colAmt = (() => {
            if (window.innerWidth >= 1280) return 4;
            if (window.innerWidth >= 960) return 3;
            if (window.innerWidth >= 640) return 2;
            if (window.innerWidth < 640) return 1;
        })();
    loadColumns(colAmt, parent);

    await galleryReady;
    loadItems(parent);

    return parent;
}

function loadItems(parent) {
    if (galleryLoading || galleryIndex > galleryFiles.length) return;
    galleryLoading = true;
    let columns = parent.childNodes;
    galleryFiles.slice(galleryIndex, galleryIndex + galleryAmount).map(filename => {
        if (filename.lastIndexOf(".txt") == filename.length - 4) {
            !async function() {
                let item = Object.assign(document.createElement("div"), {className: "aesthetic-item"}),
                    quote = Object.assign(document.createElement("div"), {className: "aesthetic-item-quote"}),
                    person = Object.assign(document.createElement("div"), {className: "aesthetic-item-person"}),
                    text = await fetch(`//${window.location.hostname}/gallery/${filename}`)
                        .then(response => response.text())
                        .then((data) => {return data.split("\r\n")}) // txt file formatting!
                        .catch(error => console.error(error));
                quote.innerHTML = text[0];
                person.innerHTML = text[1];
                item.append(quote, person);
                renderItem(item, columns);
            }();
        } else {
            let item = Object.assign(document.createElement("img"), {
                className: "aesthetic-item",
                src: `//${window.location.hostname}/gallery/${filename}`,
                alt: "",
                onload: () => renderItem(item, columns)
            });
        }
    });
    galleryIndex += galleryAmount;
    galleryLoading = false;
}

function renderItem(file, columns) {
    let lengths = Array.from(columns).map(col => col.offsetHeight),
        column = lengths.indexOf(Math.min(...lengths));
    columns[column].appendChild(file);
    setTimeout(() => file.classList.add("loaded"), 100); // timeout for animation bug
}

function adoptItems(colAmt) {
    let parent = document.getElementsByClassName("aesthetic")[0],
        columns = document.getElementsByClassName("aesthetic-column"),
        galleryAmount = Math.max(...Array.from(columns).map(col => col.childNodes.length)),
        foster = [],
        ratio = window.scrollY / document.body.scrollHeight;

    parent.style.visibility = "hidden";

    // get currently loaded files by rough display order and push them to foster
    for (let i = 0; i < galleryAmount; i++) {
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
        let lengths = Array.from(columns).map(col => col.offsetHeight),
            column = lengths.indexOf(Math.min(...lengths));
        columns[column].appendChild(child);
    }

    // scroll roughly to files that were displayed
    window.scrollTo({top: ratio * document.body.scrollHeight, behavior: "auto"});

    parent.style.visibility = "visible";
}

function loadColumns(colAmt, parent) {
    parent.innerHTML = "";
    for (let i = 0; i < colAmt; i++) {
        parent.appendChild(Object.assign(document.createElement("div"), {className: "aesthetic-column"}));
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
    let columns = document.getElementsByClassName("aesthetic-column");
    if (columns.length != 4 && window.innerWidth >= 1280) adoptItems(4);
    else if (columns.length != 3 && window.innerWidth >= 960 && window.innerWidth < 1280) adoptItems(3);
    else if (columns.length != 2 && window.innerWidth >= 640 && window.innerWidth < 960) adoptItems(2);
    else if (columns.length != 1 && window.innerWidth < 640) adoptItems(1);
}

function scrollHandler() {
    clearTimeout(galleryTimeout);
    galleryTimeout = setTimeout(() => {
        let bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
        if (bottom && galleryIndex < galleryFiles.length && !galleryLoading) loadItems(document.getElementsByClassName("aesthetic")[0]);
        else if (galleryIndex >= galleryFiles.length && !galleryLoading) window.removeEventListener("scroll", scrollHandler);
    }, 100);
}

window.addEventListener("resize", resizeHandler);
window.addEventListener("scroll", scrollHandler);