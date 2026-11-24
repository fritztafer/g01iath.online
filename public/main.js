import U, {R} from "./js/common.js"

async function run(path=R.paths["/socials"]) {
    if (R.transitioning) return;
    const current = U.getElement("main").firstElementChild;
    if (current && current.className === path.name) return;
    R.transitioning = true;

    const ready = R.loadContent(path).then(parent => {
        U.getElement("main").appendChild(parent);
        return parent;
    });

    if (current === null) {
        const parent = await ready;
        U.getElements(".header-item-parent, .header-hr, .footer-item").forEach(el => el.classList.remove("hidden"));
        R.transitionHandler(parent);
        R.fadeElements([...U.getElements(".header-item-parent, .header-hr, .header-item.active"), parent], "in");
        setTimeout(() => R.fadeElements([U.getElement(".footer-item")], "in"), 940);
        setTimeout(() => R.transitioning = false, R.time / 2);
    } else {
        R.fadeElements([...U.getElements(".header-item.active"), current], "out", ready);
        R.removeActive();
        const parent = await ready;
        setTimeout(() => {
            R.transitionHandler(parent, current);
            R.fadeElements([...U.getElements(".header-item.active"), parent], "in");
        }, R.time / 2);
        setTimeout(() => R.transitioning = false, R.time);
    }
}

window.onscroll = () => {
    const scrollTop = U.getElement(".scroll-top");
    if (!scrollTop && document.documentElement.scrollTop >= 100) {
        const button = U.newElement("button", {
            className: "scroll-top loading",
            onclick: () => window.scrollTo({top: 0, behavior: "smooth"}),
            innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24"><path d="M12 0 6 6A1 1 0 007 7L11 5 11 24 13 24 13 5 17 7A1 1 0 0018 6" fill="currentcolor"/></svg>'
        });
        document.body.appendChild(button);
        setTimeout(() => button.classList.remove("loading"), 0);
    } else if (scrollTop && document.documentElement.scrollTop < 100) {
        scrollTop.setAttribute("style", "opacity: 0; pointer-events: none;");
        setTimeout(() => scrollTop.remove(), R.time / 4);
    }
}

window.addEventListener("load", () => {
    document.body.append(
        U.newElement("header", {
            innerHTML: [
                '<div class="title">GØ1IATH</div>',
                '<div class="header-item-parent hidden"></div>',
                '<hr class="header-hr hidden">'
            ].join('')
        }),
        U.newElement("main"),
        U.newElement("footer", {
            innerHTML: '<div class="footer-item hidden" style="opacity: 0;">//G01IATH.ONLINE/2026/</div>'
        })
    );
    const headerItems = [];
    Object.values(R.paths).forEach(path => {if (path && path.header) {
        const item = U.newElement("a", {
            className: "header-item",
            href: "javascript:",
            onclick: () => run(path),
            textContent: path.name.toUpperCase()
        });
        headerItems.push(item);
    }});
    U.getElement(".header-item-parent").append(...headerItems);

    run(Object.hasOwn(R.paths, window.location.pathname) ? R.paths[window.location.pathname] : R.paths["error"]);
    U.newResource("link", {href: `//${window.location.hostname}/css/before.css`, rel: "stylesheet"});
}, {once: true});