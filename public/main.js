document.body = Object.assign(document.createElement("body"),{className: "dark-mode"});
document.body.append(
    Object.assign(document.createElement("header")),
    Object.assign(document.createElement("main")),
    Object.assign(document.createElement("footer"))
);
document.querySelector("header").innerHTML =
    '<div class="title">GØ1IATH</div>' +
    '<a class="header-item" href="javascript:" onclick="run(\'socials\')">SOCIALS</a>' +
    '<a class="header-item" href="javascript:" onclick="run(\'listen\')">LISTEN</a>' +
    '<a class="header-item" href="javascript:" onclick="run(\'aesthetic\')">AESTHETIC</a>' +
    '<a class="header-item" href="javascript:" onclick="run(\'about\')">ABOUT</a>' +
    '<hr class="header-hr">';
document.querySelector("footer").innerHTML =
    '<div class="footer-item">//G01IATH.ONLINE/2025/</div>';

let time = 2501;
let transitioning = false;

function run(content) {
    if (transitioning) return; // prevent interrupting transition, below prevents active & allows initialization
    else if (content?.toUpperCase() === document.getElementById("active")?.textContent && content !== undefined) return;

    if (content === undefined) { // initialization
        content = "socials";
        fadeGroup(selectElements(".header-item, .header-hr, .footer-item"), "in");
    } else if (content === "error") { // error handling
        fadeGroup(selectElements(".header-item, .header-hr, .footer-item"), "in");
    } else if (document.querySelector("main").firstChild.className === "aesthetic") { // clean up
        window.removeEventListener("resize", resizeHandler);
        window.removeEventListener("scroll", scrollHandler);
    }

    document.head.querySelector("script:nth-of-type(2)")?.remove();
    document.head.appendChild(Object.assign(document.createElement("script"),{
        src: `//${window.location.hostname}/js/${content}.js`,
        onload: async () => switchScene(content, await loadContent(content))
    }));
}

function selectElements(elements) {
    return document.querySelectorAll(elements);
}

function fadeElement(el, type) {
    let outClass = "fade-out",
        inClass = "fade-in";

    if (el.id === "active") {
        outClass = "active-out";
        inClass = "active-in";
    }

    if (type === "out") {
        el.classList.remove(inClass);
        el.classList.add(outClass);
    } else if (type === "in") {
        el.classList.remove(outClass);
        el.classList.add(inClass);
    }
}

function fadeGroup(elements, type) {
    elements.forEach(el => fadeElement(el, type));
}

function switchScene(content, parent) {
    // start transition
    transitioning = true;
    document.querySelector("main").append(parent);
    fadeGroup(selectElements("main, #active"), "out");

    setTimeout(() => { // mid transition
        let items = Object.values(selectElements(".header-item"));
        for (let item of items) { // change active
            if (item.textContent === content.toUpperCase()) item.id = "active";
            else item.removeAttribute("id");
        }
        transitionHandler(parent);
        fadeGroup(selectElements("main, #active"), "in");
    }, time);

    setTimeout(() => { // end transition
        transitioning = false;
    }, time * 2);
}

function loadContent(content) {
    if (content === "socials") return socials();
    else if (content === "listen") return listen();
    else if (content === "aesthetic") return aesthetic();
    else if (content === "about") return about();
    else if (content === "error") return error();
}

function transitionHandler(parent) {
    let main = document.querySelector("main");

    if (parent.className === main.firstElementChild.className) { // initialization
        parent.style.visibility = "visible";
        parent.style.maxHeight = "none";
        parent.style.overflow = "visible";
    }
    else if (parent.className === "socials") {
        parent.style.visibility = "visible";
        parent.style.maxHeight = "none";
        parent.style.overflow = "visible";
        main.firstElementChild.remove();
    }
    else if (parent.className === "listen") {
        parent.querySelectorAll('iframe').forEach(iframe => {
            iframe.style.visibility = "visible";
            iframe.parentElement.style.display = "block";
        });
        main.firstElementChild.remove();
    }
    else if (parent.className === "aesthetic") {
        parent.style.visibility = "visible";
        parent.style.maxHeight = "none";
        parent.style.overflow = "visible";
        main.firstElementChild.remove();
    }
    else if (parent.className === "about") {
        parent.style.visibility = "visible";
        parent.style.maxHeight = "none";
        parent.style.overflow = "visible";
        main.firstElementChild.remove();
    }
    else if (parent.className === "error") { // error handling
        parent.style.visibility = "visible";
        parent.style.maxHeight = "none";
        parent.style.overflow = "visible";
    }
}

window.onload = function() {window.scrollTo(0, 0)}