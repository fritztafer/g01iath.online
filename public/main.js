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

function run(content="socials") {
    if (transitioning) return;
    const current = document.querySelector("main").firstElementChild;
    if (current && current.className === content) return;
    transitioning = true;

    document.head.appendChild(Object.assign(document.createElement("script"), {
        src: `//${window.location.hostname}/js/${content}.js`,
        onload: async () => {
            const parent = await loadContent(content);
            document.querySelector("main").appendChild(parent);

            if (current === null) {
                document.querySelectorAll(".header-item-parent, .header-hr, .footer-item").forEach(el => el.classList.remove("hidden"));
                transitionHandler(parent);
                fadeGroup(document.querySelectorAll(".header-item-parent, .header-hr, #active, main"), "in");
                setTimeout(() => {
                    const footer = document.querySelector(".footer-item");
                    footer.removeAttribute("style");
                    fadeGroup([footer], "in");
                }, 840);
                setTimeout(() => transitioning = false, time / 2);
            } else {
                fadeGroup(document.querySelectorAll("#active, main"), "out");
                document.querySelector("#active")?.removeAttribute("id");
                setTimeout(() => {
                    transitionHandler(parent, current);
                    fadeGroup(document.querySelectorAll("#active, main"), "in");
                }, time / 2);
                setTimeout(() => transitioning = false, time);
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
    document.head.querySelector(`script[src="//${window.location.hostname}/js/${current.className}.js"]`).remove();
    current.remove();
}

function fadeGroup(elements, type) {
    elements.forEach(el => {
        switch (type) {
            case "out":
                el.setAttribute("style", el.id === "active" ?
                    "color: var(--color); transition: color calc(var(--time) / 2) ease;" :
                    "animation: fadeOut calc(var(--time) / 2) forwards;"
                );
                break;
            case "in":
                el.setAttribute("style", el.id === "active" ?
                    "transition: color calc(var(--time) / 2) ease;" :
                    "animation: fadeIn calc(var(--time) / 2) forwards;"
                );
                break;
        }
        setTimeout(() => {
            el.removeAttribute("style");
        }, time / 2);
    });
}

function transitionHandler(parent, current=null) {
    if (current) unloadCurrent(current);
    parent.classList.remove("hidden");

    document.querySelectorAll(".header-item").forEach(item => {
        if (item.textContent.toLowerCase() === parent.className) item.setAttribute("id", "active");
    });
}

window.onscroll = () => {
    const scrollTop = document.querySelector(".scroll-top");
    if (!scrollTop && document.documentElement.scrollTop >= 100) {
        const button = Object.assign(document.createElement("button"), {
            className: "scroll-top",
            style: "opacity: 0;",
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
        scrollTop.style = "opacity: 0; pointer-events: none;";
        setTimeout(() => scrollTop.remove(), time / 4);
    }
}

window.addEventListener("load", () => {
    document.head.appendChild(Object.assign(document.createElement("link"), {
        href: `//${window.location.hostname}/css/bg.css`,
        rel: "stylesheet"
    }));
}, {once: true});