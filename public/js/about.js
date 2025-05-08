// about.js

function about() {
    return new Promise(resolve => {
        let main = document.querySelector("main"),
            parent = Object.assign(document.createElement("div"),{className: "about", style: "max-width: 315px; margin: auto;"}),
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

        for (let child of children) {parent.append(child);}
        setTimeout(() => {
            main.append(parent);
            main.firstElementChild.remove();
        }, time);

        resolve();
    });
}