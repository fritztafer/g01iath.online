document.body.append(
    Object.assign(document.createElement("header"), {
        innerHTML: [
            '<div class="title">GØ1IATH</div>',
            '<div class="header-item-parent hidden">',
                '<a class="header-item" href="javascript:" onclick="run(\'socials\')">SOCIALS</a>',
                '<a class="header-item" href="javascript:" onclick="run(\'listen\')">LISTEN</a>',
                '<a class="header-item" href="javascript:" onclick="run(\'aesthetic\')">AESTHETIC</a>',
                '<a class="header-item" href="javascript:" onclick="run(\'about\')">ABOUT</a>',
            '</div>',
            '<hr class="header-hr hidden">'
        ].join('')
    }),
    document.createElement("main"),
    Object.assign(document.createElement("footer"), {
        innerHTML: '<div class="footer-item hidden" style="opacity: 0;">//G01IATH.ONLINE/2026/</div>'
    })
);

const time = 2501;
let transitioning;

async function run(content="socials") {
    if (transitioning) return;
    const current = document.querySelector("main").firstElementChild;
    if (current && current.className === content) return;
    transitioning = true;

    const ready = Promise.all([
        getResource("script", {src: `//${window.location.hostname}/js/${content}.js`}),
        getResource("link", {href: `//${window.location.hostname}/css/${content}.css`, rel: "stylesheet"})
    ]).then(() => loadContent(content)).then(parent => {
        document.querySelector("main").appendChild(parent);
        return parent;
    });

    if (current === null) {
        const parent = await ready;
        document.querySelectorAll(".header-item-parent, .header-hr, .footer-item").forEach(el => el.classList.remove("hidden"));
        transitionHandler(parent);
        fadeGroup(document.querySelectorAll(".header-item-parent, .header-hr, .header-item.active, main"), "in");
        setTimeout(() => fadeGroup([document.querySelector(".footer-item")], "in"), 940);
        setTimeout(() => transitioning = false, time / 2);
    } else {
        fadeGroup(document.querySelectorAll(".header-item.active, main"), "out", ready);
        document.querySelector(".header-item.active").classList.remove("active");
        const parent = await ready;
        setTimeout(() => {
            transitionHandler(parent, current);
            fadeGroup(document.querySelectorAll(".header-item.active, main"), "in");
        }, time / 2);
        setTimeout(() => transitioning = false, time);
    }
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

function unloadCurrent(current) {
    switch (current.className) {
        case "socials": break;
        case "listen":
            if (titleObserver) titleObserver.disconnect();
            if (playObserver) playObserver.disconnect();
            break;
        case "aesthetic":
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("scroll", scrollHandler);
            break;
        case "about": break;
    }
    document.head.querySelector(`link[href="//${window.location.hostname}/css/${current.className}.css"]`).remove();
    document.head.querySelector(`script[src="//${window.location.hostname}/js/${current.className}.js"]`).remove();
    current.remove();
}

 function fadeGroup(elements, type, ready=Promise.resolve()) {
    elements.forEach(async (el) => {
        const activeFade = el.className === "header-item active";
        el.setAttribute("style", (() => {
            if (type === "out")
                return activeFade ? "color: var(--color); transition: color calc(var(--time) / 2) ease;" :
                    "animation: fadeOut calc(var(--time) / 2) forwards;";
            if (type === "in") {
                return activeFade ? "transition: color calc(var(--time) / 2) ease;" :
                    "animation: fadeIn calc(var(--time) / 2) forwards;";
            }
        })());
        await ready;
        setTimeout(() => el.removeAttribute("style"), time / 2);
    });
}

function transitionHandler(parent, current=null) {
    if (current) unloadCurrent(current);
    parent.classList.remove("hidden");
    document.querySelectorAll(".header-item").forEach(item => {
        if (item.textContent.toLowerCase() === parent.className) item.classList.add("active");
    });
}

function getResource(tag, attributes) {
    return new Promise((resolve, reject) => {
        const element = Object.assign(document.createElement(tag), attributes);
        element.onload = () => resolve();
        element.onerror = (error) => reject(error);
        document.head.appendChild(element);
    });
}

window.onscroll = () => {
    const scrollTop = document.querySelector(".scroll-top");
    if (!scrollTop && document.documentElement.scrollTop >= 100) {
        const button = Object.assign(document.createElement("button"), {
            className: "scroll-top loading",
            onclick: () => window.scrollTo({top: 0, behavior: "smooth"}),
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24"><path d="M12 0 6 6A1 1 0 007 7L11 5 11 24 13 24 13 5 17 7A1 1 0 0018 6" fill="currentcolor"/></svg>'
        });
        document.body.appendChild(button);
        setTimeout(() => button.classList.remove("loading"), 0);
    } else if (scrollTop && document.documentElement.scrollTop < 100) {
        scrollTop.setAttribute("style", "opacity: 0; pointer-events: none;");
        setTimeout(() => scrollTop.remove(), time / 4);
    }
}

window.addEventListener("load", () => {
    getResource("link", {href: `//${window.location.hostname}/css/before.css`, rel: "stylesheet"})
}, {once: true});