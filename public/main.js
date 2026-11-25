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

function init() {
    U.getElement("header").innerHTML += [
        '<div class="header-item-parent hidden"></div>',
        '<hr class="header-hr hidden">'
    ].join('');
    U.newElement("main", {}, document.body);
    U.newElement("footer", {innerHTML: [
        '<div class="footer-item hidden" style="opacity: 0;">',
            '//G01IATH.ONLINE/2026/',
        '</div>'
    ].join('')}, document.body);

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
}

window.onscroll = U.scrollTop(document.documentElement);

window.addEventListener("load", () => {
    init();
    run(Object.hasOwn(R.paths, window.location.pathname) ? R.paths[window.location.pathname] : R.paths["error"]);
    U.newResource("link", {href: `//${window.location.hostname}/css/before.css`, rel: "stylesheet"});
}, {once: true});