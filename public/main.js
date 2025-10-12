document.body = Object.assign(document.createElement("body"), {className: "dark-mode"});
document.body.append(
    Object.assign(document.createElement("header"), {
        innerHTML: [
            '<div class="title">GØ1IATH</div>',
            '<a class="header-item" href="javascript:" onclick="run(\'socials\')">SOCIALS</a>',
            '<a class="header-item" href="javascript:" onclick="run(\'listen\')">LISTEN</a>',
            '<a class="header-item" href="javascript:" onclick="run(\'aesthetic\')">AESTHETIC</a>',
            '<a class="header-item" href="javascript:" onclick="run(\'about\')">ABOUT</a>',
            '<hr class="header-hr">'
        ].join('')
    }),
    document.createElement("main"),
    Object.assign(document.createElement("footer"), {
        innerHTML: '<div class="footer-item">//G01IATH.ONLINE/2025/</div>'
    })
);

const time = 2501;
let transitioning;

function run(content="socials") {
    if (transitioning) return; // prevent during transition, prevent currently loaded
    if (content === document.querySelector("main").firstElementChild?.className) return;
    transitioning = true;

    const current = document.head.querySelector("script:nth-of-type(2)");
    if (!current) { // initialize
        fadeGroup(document.querySelectorAll(".header-item, .header-hr, .footer-item"), "in");
    } else { // clean up
        current.remove();
        if (document.querySelector("main").firstChild.className === "aesthetic") {
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("scroll", scrollHandler);
        }
    }

    document.head.appendChild(Object.assign(document.createElement("script"), {
        src: `//${window.location.hostname}/js/${content}.js`,
        onload: async () => switchScene(content, await loadContent(content))
    }));
}

function switchScene(content, parent) {
    // start transition
    document.querySelector("main").append(parent);
    fadeGroup(document.querySelectorAll("main, #active"), "out");

    setTimeout(() => { // mid transition
        for (let item of Object.values(document.querySelectorAll(".header-item"))) {
            if (item.textContent.toLowerCase() === content) item.id = "active";
            else item.removeAttribute("id");
        }
        transitionHandler(parent);
        fadeGroup(document.querySelectorAll("main, #active"), "in");
    }, time / 2);

    setTimeout(() => { // end transition
        transitioning = false;
    }, time);
}

function loadContent(content) {
    switch (content) {
        case "socials": return socials();
        case "listen": return listen();
        case "aesthetic": return aesthetic();
        case "about": return about();
        default: return error();
    }
}

function fadeGroup(elements, type) {
    elements.forEach(el => fadeElement(el, type));
}

function fadeElement(el, type) {
    const outClass = el.id === "active" ? "active-out" : "fade-out",
        inClass = el.id === "active" ? "active-in" : "fade-in";

    if (type === "out") {
        el.classList.remove(inClass);
        el.classList.add(outClass);
    } else if (type === "in") {
        el.classList.remove(outClass);
        el.classList.add(inClass);
    }
}

function transitionHandler(parent) {
    const main = document.querySelector("main");

    switch (parent.className) {
        case "listen":
            main.firstElementChild.remove();
            parent.querySelectorAll('iframe').forEach(iframe => {
                iframe.style.visibility = "visible";
                iframe.parentElement.style.display = "block";
            });
            break
        default:
            if (parent.className !== main.firstElementChild.className) {
                main.firstElementChild.remove();
            }
            parent.style.visibility = "visible";
            parent.style.maxHeight = "none";
            parent.style.overflow = "visible";
    }
}

window.onscroll = () => {
    const scrollTop = document.querySelector(".scroll-top");
    if (!scrollTop && document.documentElement.scrollTop >= 100) {
        const button = Object.assign(document.createElement("button"), {
            className: "scroll-top",
            onclick: () => window.scrollTo({top: 0, behavior: "smooth"}),
            innerHTML: "↑"
        });
        document.body.append(button);
        setTimeout(() => button.classList.add("visible"), 0);
    } else if (scrollTop && document.documentElement.scrollTop < 100) {
        scrollTop.classList.remove("visible");
        setTimeout(() => scrollTop.remove(), time / 4);
    }
}