function socials() {
    let parent = Object.assign(document.createElement("div"),{className: "socials", style: "visibility: hidden; max-height: 0; overflow: hidden;"}),
        socialItem1 = Object.assign(document.createElement("a"),{className: "socials-item one", href: "//soundcloud.com/g01iathonline", innerHTML: `<img src="//${window.location.hostname}/img/sc.png">`}),
        socialItem2 = Object.assign(document.createElement("a"),{className: "socials-item two", href: "//discord.gg/cSuzxF6ece", innerHTML: `<img src="//${window.location.hostname}/img/dc.png">`}),
        socialItem3 = Object.assign(document.createElement("a"),{className: "socials-item three", href: "//g01iath.bandcamp.com", innerHTML: `<img src="//${window.location.hostname}/img/bc.png">`}),
        socialItem4 = Object.assign(document.createElement("a"),{className: "socials-item four", href: "//youtube.com/@g01iath", innerHTML: `<img src="//${window.location.hostname}/img/yt.png">`}),
        children = [socialItem1, socialItem2, socialItem3, socialItem4];

    parent.append(...children)

    return parent;
}