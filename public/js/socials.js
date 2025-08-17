async function socials() {
    let parent = Object.assign(document.createElement("div"),{className: "socials", style: "visibility: hidden; max-height: 0; overflow: hidden;"}),
        socialItem1 = Object.assign(document.createElement("a"),{className: "socials-item one", target: "_blank", href: "//soundcloud.com/g01iathonline", innerHTML: `<img src="//${window.location.hostname}/img/sc.png" alt="SoundCloud">`}),
        socialItem2 = Object.assign(document.createElement("a"),{className: "socials-item two", target: "_blank", href: "//discord.gg/cSuzxF6ece", innerHTML: `<img src="//${window.location.hostname}/img/dc.png" alt="Discord">`}),
        socialItem3 = Object.assign(document.createElement("a"),{className: "socials-item three", target: "_blank", href: "//g01iath.bandcamp.com", innerHTML: `<img src="//${window.location.hostname}/img/bc.png" alt="Bandcamp">`}),
        socialItem4 = Object.assign(document.createElement("a"),{className: "socials-item four", target: "_blank", href: "//youtube.com/@g01iath", innerHTML: `<img src="//${window.location.hostname}/img/yt.png" alt="YouTube">`}),
        children = [socialItem1, socialItem2, socialItem3, socialItem4];

    parent.append(...children)

    return parent;
}