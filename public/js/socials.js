async function socials() {
    let parent = Object.assign(document.createElement("div"),{className: "socials", style: "visibility: hidden; max-height: 0; overflow: hidden;"}),
        children = [
            Object.assign(document.createElement("a"),{className: "socials-item", target: "_blank", href: "//soundcloud.com/fritztafer", innerHTML: `<img src="//${window.location.hostname}/img/sc.png" alt="SoundCloud">`}),
            Object.assign(document.createElement("a"),{className: "socials-item", target: "_blank", href: "//youtube.com/@fritztafer", innerHTML: `<img src="//${window.location.hostname}/img/yt.png" alt="YouTube">`}),
            Object.assign(document.createElement("a"),{className: "socials-item", target: "_blank", href: "//fritztafer.bandcamp.com/", innerHTML: `<img src="//${window.location.hostname}/img/bc.png" alt="Bandcamp">`}),
            Object.assign(document.createElement("a"),{className: "socials-item", target: "_blank", href: "//discord.gg/cSuzxF6ece", innerHTML: `<img src="//${window.location.hostname}/img/dc.png" alt="Discord">`}),
            Object.assign(document.createElement("a"),{className: "socials-item", target: "_blank", href: "//github.com/fritztafer", innerHTML: `<img src="//${window.location.hostname}/img/gh.png" alt="GitHub">`})
        ];

    parent.append(...children);

    return parent;
}