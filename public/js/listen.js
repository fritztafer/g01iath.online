// listen.js

function listen() {
    return new Promise(resolve => {
        let main = document.querySelector("main"),
            parent = Object.assign(document.createElement("div"),{className: "listen"}),
            sources = [
                "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1354507834&show_artwork=true&show_comments=false",
                "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1289073427&show_artwork=true&show_comments=false",
                "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1242933133&show_artwork=true&show_comments=false",
                "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1237324432&show_artwork=true&show_comments=false",
                "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1215322066&show_artwork=true&show_comments=false",
                "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F948315661&show_artwork=true&show_comments=false"
            ];

        for (let src of sources) {
            let iframe = Object.assign(document.createElement("iframe"),{
                src: src,
                style: "top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0; visibility: hidden;",
                allowFullscreen: false,
                scrolling: "no"
            });
            let div = Object.assign(document.createElement("div"), {
                className: "listen-item",
                style: "display: contents;"});
            div.appendChild(iframe);
            parent.appendChild(div);
        }

        main.appendChild(parent);
        setTimeout(() => {
            parent.querySelectorAll('iframe').forEach(iframe => {
                iframe.style.visibility = "visible";
                iframe.parentElement.style.display = "block";
            });
            main.firstElementChild.remove();
        }, time);

        resolve();
    });
}