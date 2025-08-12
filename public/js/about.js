function about() {
    let parent = Object.assign(document.createElement("div"),{className: "about", style: "visibility: hidden; max-height: 0; overflow: hidden;"}),
        aboutContact = Object.assign(document.createElement("div"),{
            className: "about-contact",
            innerHTML: `Contact: <a href="mailto:fritz@g01iath.online">fritz@g01iath.online</a>`
        }),
        aboutImage = Object.assign(document.createElement("div"),{
            className: "about-image",
            innerHTML: `<img src="//${window.location.hostname}/img/2011.jpg" alt="16 year old fritz" style="height: auto; width: inherit;">`
        }),
        aboutBio = Object.assign(document.createElement("div"),{
            className: "about-bio",
            innerHTML: `<div style="font-size: 36px; letter-spacing: 24px; margin-right: -24px; line-height: 1; margin-bottom: 24px;">GØ1IATH</div>`
        }),
        children = [aboutContact, aboutImage, aboutBio];

    parent.append(...children);

    return parent;
}