async function about() {
    let parent = Object.assign(document.createElement("div"), {className: "about hidden"}),
        aboutContact = Object.assign(document.createElement("div"), {
            className: "about-contact",
            innerHTML: `Contact: <a href="mailto:fritz@g01iath.online">fritz@g01iath.online</a>`
        }),
        aboutImage = Object.assign(document.createElement("div"), {
            className: "about-image",
            innerHTML: `<img src="//${window.location.hostname}/img/2011.jpg">`
        }),
        aboutBio = Object.assign(document.createElement("div"), {
            className: "about-bio",
            innerHTML: "<div>GØ1IATH</div>"
        }),
        children = [aboutContact, aboutImage, aboutBio];

    parent.append(...children);

    return parent;
}