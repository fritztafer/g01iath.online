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

function switchScene(content, parent) { // start transition
    document.querySelector("main").append(parent);
    fadeGroup(document.querySelectorAll("main, #active"), "out");

    setTimeout(() => { // mid transition
        Object.values(document.querySelectorAll(".header-item")).forEach(item => {
            if (item.textContent.toLowerCase() === content) item.id = "active";
            else item.removeAttribute("id");
        });
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
    elements.forEach(el => {
        const outClass = el.id === "active" ? "active-out" : "fade-out",
            inClass = el.id === "active" ? "active-in" : "fade-in";

        if (type === "out") {
            el.classList.remove(inClass);
            el.classList.add(outClass);
        } else if (type === "in") {
            el.classList.remove(outClass);
            el.classList.add(inClass);
        }
    });
}

function transitionHandler(parent) {
    const main = document.querySelector("main");

    switch (parent.className) {
        default:
            if (parent.className !== main.firstElementChild.className) {
                main.firstElementChild.remove();
            }
            parent.removeAttribute("style");
    }
}

function player(track) {
    if (document.querySelector(".player")) return select(track);

    document.body.append(Object.assign(document.createElement("script"), {
        src: `//${window.location.hostname}/js/player.js`,
        onload: () => select(track)
    }));
}

window.onscroll = () => {
    const scrollTop = document.querySelector(".scroll-top");
    if (!scrollTop && document.documentElement.scrollTop >= 100) {
        const button = Object.assign(document.createElement("button"), {
            className: "scroll-top hidden",
            onclick: () => window.scrollTo({top: 0, behavior: "smooth"}),
            innerHTML: [
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24">',
                    '<path d="M12 0 6 6A1 1 0 007 7L11 5 11 24 13 24 13 5 17 7A1 1 0 0018 6" fill="currentcolor"/>',
                '</svg>'
            ].join('')
        });
        document.body.appendChild(button);
        setTimeout(() => button.classList.remove("hidden"), 0);
    } else if (scrollTop && document.documentElement.scrollTop < 100) {
        scrollTop.classList.add("hidden");
        setTimeout(() => scrollTop.remove(), time / 4);
    }
}