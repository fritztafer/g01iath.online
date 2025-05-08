// socials.js

function socials() {
    return new Promise(resolve => {
        let main = document.querySelector("main"),
            parent = Object.assign(document.createElement("div"), {className: "social"}),
            socialItem1 = Object.assign(document.createElement("a"), {className: "social-item one", href: "//soundcloud.com/g01iathonline", innerHTML: "<img src=\"img/sc.png\">"}),
            socialItem2 = Object.assign(document.createElement("a"), {className: "social-item two", href: "//discord.gg/cSuzxF6ece", innerHTML: "<img src=\"img/dc.png\">"}),
            socialItem3 = Object.assign(document.createElement("a"), {className: "social-item three", href: "//g01iath.bandcamp.com", innerHTML: "<img src=\"img/bc.png\">"}),
            socialItem4 = Object.assign(document.createElement("a"), {className: "social-item four", href: "//youtube.com/@g01iath", innerHTML: "<img src=\"img/yt.png\">"}),
            children = [socialItem1, socialItem2, socialItem3, socialItem4],
            sources = [
                "img/sc.png",
                "img/dc.png",
                "img/bc.png",
                "img/yt.png"
            ];

        for (let src of sources) {
            let img = new Image();
            img.src = src;
        }

        for (let child of children) {parent.append(child);}

        setTimeout(() => {
            main.innerHTML = "";
            main.appendChild(parent);
        }, time);

        resolve();
    });
}