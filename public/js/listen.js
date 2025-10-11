async function listen() {
    let parent = Object.assign(document.createElement("div"),{className: "listen"}),
        sources = [
            "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F2109535224&show_artwork=true&show_comments=false&secret_token=s-64sQfsfzWkM",
            "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1289073427&show_artwork=true&show_comments=false",
            "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1272412966&show_artwork=true&show_comments=false&secret_token=s-GV2pE8tDz90",
            "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1242933133&show_artwork=true&show_comments=false&secret_token=s-8HKfbEp2mur"
        ];

    for (let src of sources) {
        let iframe = Object.assign(document.createElement("iframe"),{
            src: src,
            style: "top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0; visibility: hidden;",
            allowFullscreen: false,
            scrolling: "no"
        });
        let div = Object.assign(document.createElement("div"),{
            className: "listen-item",
            style: "display: contents;"
        });
        div.appendChild(iframe);
        parent.appendChild(div);
    }

    return parent;
}