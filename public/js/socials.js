async function socials() {
    const parent = Object.assign(document.createElement("div"), {className: "socials", style: "visibility: hidden; max-height: 0; overflow: hidden;"}),
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

    for (const child in children) {
        const a = Object.assign(document.createElement("a"), {
            className: "socials-item",
            target: "_blank",
            href: children[child].href,
            innerHTML: `<img src="//${window.location.hostname}/img/${children[child].img}.png" alt="${child}">`
        });
        parent.append(a);
    }

    return parent;
}