async function socials() {
    const parent = Object.assign(document.createElement("div"), {className: "socials hidden"}),
        children = {
            "Bandcamp": {
                "href": "//fritztafer.bandcamp.com/",
                "img": "bc"
            }, "YouTube": {
                "href": "//youtube.com/@fritztafer",
                "img": "yt"
            }, "SoundCloud": {
                "href": "//soundcloud.com/fritztafer",
                "img": "sc"
            }, "Discord": {
                "href": "//discord.gg/cSuzxF6ece",
                "img": "dc"
            }, "GitHub": {
                "href": "//github.com/fritztafer",
                "img": "gh"
            }
        };

    let cascade = 340;
    for (const child in children) {
        const a = Object.assign(document.createElement("a"), {
            className: "socials-item",
            target: "_blank",
            href: children[child].href
        }),
        delay = cascade,
        img = Object.assign(document.createElement("img"), {
            className: "loading",
            src: `//${window.location.hostname}/img/${children[child].img}.png`,
            alt: child,
            onload: () => setTimeout(() => img.removeAttribute("class"), delay) // timeout for animation
        });
        cascade += 100;
        a.appendChild(img);
        parent.appendChild(a);
    }

    return parent;
}