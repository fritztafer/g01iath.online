document.body = Object.assign(document.createElement("body"), {className: "dark-mode"});
document.body.append(
    Object.assign(document.createElement("header"), {
        innerHTML: [
            '<div class="title">GØ1IATH</div>',
            '<div class="header-item-parent">',
                '<a class="header-item" href="javascript:" onclick="run(\'socials\')">SOCIALS</a>',
                '<a class="header-item" href="javascript:" onclick="run(\'listen\')">LISTEN</a>',
                '<a class="header-item" href="javascript:" onclick="run(\'aesthetic\')">AESTHETIC</a>',
                '<a class="header-item" href="javascript:" onclick="run(\'about\')">ABOUT</a>',
            '</div>',
            '<hr class="header-hr">'
        ].join('')
    }),
    document.createElement("main"),
    Object.assign(document.createElement("footer"), {
        innerHTML: '<div class="footer-item">//G01IATH.ONLINE/2026/</div>'
    })
);

const time = 2501;
let initialize = true;
let transitioning;

function run(content="socials") {
    if (transitioning) return;
    const current = document.querySelector("main").firstElementChild;
    if (current && current.className === content) return;
    transitioning = true;

    if (current) {
        document.head.querySelector("script:nth-of-type(2)").remove();
        if (current.className === "aesthetic") {
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("scroll", scrollHandler);
        } else if (current.className === "listen") {
            if (titleObserver) titleObserver.disconnect();
            if (playObserver) playObserver.disconnect();
        }
    }

    document.head.appendChild(Object.assign(document.createElement("script"), {
        src: `//${window.location.hostname}/js/${content}.js`,
        onload: async () => {
            const parent = await loadContent(content);
            document.querySelector("main").appendChild(parent);

            if (initialize) {
                transitionHandler(parent);
                fadeGroup(document.querySelectorAll(".header-item-parent, .header-hr, .footer-item, main, #active"), "in");
                setTimeout(() => {
                    initialize = false;
                    transitioning = false;
                }, time / 2);
            } else {
                fadeGroup(document.querySelectorAll("main, #active"), "out");
                setTimeout(() => {
                    transitionHandler(parent);
                    fadeGroup(document.querySelectorAll("main, #active"), "in");
                }, time / 2);
                setTimeout(() => {
                    transitioning = false;
                }, time);
            }
        }
    }));
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
    const current = document.querySelector("main").firstElementChild;
    if (parent.className !== current.className) current.remove();
    parent.classList.remove("hidden");

    Object.values(document.querySelectorAll(".header-item")).forEach(item => {
        if (item.textContent.toLowerCase() === parent.className) item.id = "active";
        else item.removeAttribute("id");
    });
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
            className: "scroll-top",
            style: "opacity: 0; visibility: hidden;",
            onclick: () => window.scrollTo({top: 0, behavior: "smooth"}),
            innerHTML: [
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24">',
                    '<path d="M12 0 6 6A1 1 0 007 7L11 5 11 24 13 24 13 5 17 7A1 1 0 0018 6" fill="currentcolor"/>',
                '</svg>'
            ].join('')
        });
        document.body.appendChild(button);
        setTimeout(() => button.removeAttribute("style"), 0);
    } else if (scrollTop && document.documentElement.scrollTop < 100) {
        scrollTop.style = "opacity: 0; visibility: hidden;";
        setTimeout(() => scrollTop.remove(), time / 4);
    }
}