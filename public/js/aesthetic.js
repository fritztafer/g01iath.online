import U, {G} from "./common.js"

G.amount = 16;
G.timeout;
G.loading = false;
G.files = [];
G.ready = fetch(`//${window.location.hostname}/gallery/.file-list.json`)
    .then(response => response.json())
    .then(array => G.files = array)
    .catch(error => console.error(error));

async function aesthetic() {
    const parent = U.newElement("div", {className: "aesthetic hidden"});

    loadColumns((() => {
        if (window.innerWidth >= 1280) return 4;
        if (window.innerWidth >= 960) return 3;
        if (window.innerWidth >= 640) return 2;
        if (window.innerWidth < 640) return 1;
    })(), parent);

    await G.ready;
    G.files = shuffleArray(G.files);
    G.index = 0;
    loadItems(parent);

    window.addEventListener("resize", resizeHandler);
    window.addEventListener("scroll", scrollHandler);

    return parent;
}

function cleanup() {
    window.removeEventListener("resize", resizeHandler);
    window.removeEventListener("scroll", scrollHandler);
}

async function loadItems(parent) {
    if (G.loading || G.index >= G.files.length) return;
    G.loading = true;
    const columns = parent.childNodes;
    await Promise.all(G.files.slice(G.index, G.index + G.amount).map(filename => {
        if (filename.endsWith(".txt")) {
            return fetch(`//${window.location.hostname}/gallery/${filename}`)
                .then(response => response.text())
                .then(data => {
                    const [quoteText, personText] = data.split("\r\n");
                    const item = U.newElement("div", {className: "aesthetic-item loading"});
                    const quote = U.newElement("div", {className: "aesthetic-item-quote", innerHTML: quoteText});
                    const person = U.newElement("div", {className: "aesthetic-item-person", innerHTML: personText});
                    item.append(quote, person);
                    renderItem(item, columns);
                }).catch(e => console.error(e));
        } else {
            return new Promise(resolve => {
                const item = U.newElement("img", {
                    className: "aesthetic-item loading",
                    src: `//${window.location.hostname}/gallery/${filename}`,
                    alt: "",
                    onload: () => {
                        renderItem(item, columns);
                        resolve();
                    },
                    onerror: () => resolve()
                });
            });
        }
    }));
    G.index += G.amount;
    G.loading = false;
}

function renderItem(file, columns) {
    const lengths = Array.from(columns).map(col => col.offsetHeight),
        column = lengths.indexOf(Math.min(...lengths));
    columns[column].appendChild(file);
    setTimeout(() => file.classList.remove("loading"), 100); // timeout for animation
}

function adoptItems(colAmt) {
    let columns = U.getElements(".aesthetic-column");
    const parent = U.getElement(".aesthetic"),
        mostNodes = Math.max(...Array.from(columns).map(col => col.childNodes.length)),
        foster = [],
        ratio = window.scrollY / document.body.scrollHeight;

    parent.setAttribute("style", "visibility: hidden;");

    // get currently loaded files by rough display order and push them to foster
    for (let i = 0; i < mostNodes; i++) {
        for (let column of columns) {
            if (column.childNodes[i]) {
                foster.push(column.childNodes[i]);
            }
        }
    }

    // reset columns
    loadColumns(colAmt, parent)
    columns = U.getElements(".aesthetic-column");

    // append children to new columns
    for (let child of foster) {
        const lengths = Array.from(columns).map(col => col.offsetHeight),
            column = lengths.indexOf(Math.min(...lengths));
        columns[column].appendChild(child);
    }

    // scroll roughly to files that were displayed
    window.scrollTo({top: ratio * document.body.scrollHeight, behavior: "auto"});

    parent.removeAttribute("style");
}

function loadColumns(colAmt, parent) {
    parent.innerHTML = "";
    for (let i = 0; i < colAmt; i++) {
        U.newElement("div", {className: "aesthetic-column"}, parent);
    }
}

function shuffleArray(array) { // Durstenfeld shuffle
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function resizeHandler() {
    const columns = U.getElements(".aesthetic-column");
    if (columns.length != 4 && window.innerWidth >= 1280) adoptItems(4);
    else if (columns.length != 3 && window.innerWidth >= 960 && window.innerWidth < 1280) adoptItems(3);
    else if (columns.length != 2 && window.innerWidth >= 640 && window.innerWidth < 960) adoptItems(2);
    else if (columns.length != 1 && window.innerWidth < 640) adoptItems(1);
}

function scrollHandler() {
    clearTimeout(G.timeout);
    G.Timeout = setTimeout(() => {
        const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
        if (bottom && G.index < G.files.length && !G.loading) loadItems(U.getElements(".aesthetic")[0]);
        else if (G.index >= G.files.length && !G.loading) window.removeEventListener("scroll", scrollHandler);
    }, 100);
}

export {aesthetic, cleanup};