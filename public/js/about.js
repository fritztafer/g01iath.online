import U from "./common.js"

async function about() {
    const parent = U.newElement("div", {className: "about hidden"}),
        aboutContact = U.newElement("div", {
            className: "about-contact",
            innerHTML: 'CONTACT: <a href="mailto:fritz@g01iath.online">fritz@g01iath.online</a>'
        }),
        aboutImage = U.newElement("div", {
            className: "about-image",
            innerHTML: `<img src="//${window.location.hostname}/img/2011.jpg">`
        }),
        aboutBio = U.newElement("div", {
            className: "about-bio",
            innerHTML: "<div>GØ1IATH</div>"
        }),
        children = [aboutContact, aboutImage, aboutBio];

    parent.append(...children);

    return parent;
}

export {about};