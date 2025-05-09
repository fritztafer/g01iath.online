// about.js

function about() {
    let parent = Object.assign(document.createElement("div"),{className: "about", style: "margin: auto; visibility: hidden; max-height: 0; overflow: hidden;"}),
        aboutContact = Object.assign(document.createElement("div"),{
            style: "text-align: center; width: 300px; margin: auto; font-size: 21px; margin-bottom: 24px;",
            innerHTML: 'Contact: <a href="mailto:fritz@g01iath.online">fritz@g01iath.online</a>'
        }),
        aboutImg = Object.assign(document.createElement("div"),{
            style: "text-align: center; width: 300px; margin: auto;",
            innerHTML: '<img src="img/2012.jpg" style="height: auto; width: inherit;">'
        }),
        aboutBio = Object.assign(document.createElement("div"),{className: "about-bio", style: "text-align: center; margin: auto;", innerHTML: 
            `
            <div style="font-size: 36px; letter-spacing: 24px; margin-right: -24px; line-height: 1; margin-bottom: 24px;">GØ1IATH</div>
            `
        }),
        children = [aboutContact, aboutImg, aboutBio];

    parent.append(...children);

    return parent;
}