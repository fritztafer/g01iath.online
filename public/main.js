// main.js

title = Object.assign(document.createElement("title"),{textContent: "GØ1IATH.ONLINE"});
style = Object.assign(document.createElement("link"),{href: "style.css", rel: "stylesheet"});
header = Object.assign(document.createElement("header"));
main = Object.assign(document.createElement("main"));
footer = Object.assign(document.createElement("footer"));
document.head.prepend(title);
document.head.append(style);
document.body = document.createElement("body");
document.body.append(header, main, footer);
for (let v of ["title", "style", "header", "main", "footer"]) {delete window[v];}
document.querySelector("header").innerHTML = 
    '<div class="title">GØ1IATH</div>' +
    '<a class="header-item" href="javascript:" onclick="run(\'socials\');">SOCIALS</a>' +
    '<a class="header-item" href="javascript:" onclick="run(\'listen\');">LISTEN</a>' +
    '<a class="header-item" href="javascript:" onclick="run(\'aesthetic\');">AESTHETIC</a>' +
    '<a class="header-item" href="javascript:" onclick="run(\'about\');">ABOUT</a>' +
    '<hr>';
document.querySelector("footer").innerHTML = 
    '<div class="footer-item">//G01IATH.ONLINE/2025/</div>';

time = 2501; // out + in transition time, used in all other scripts. Can we set value of :root property in style.css?

let transitioning = false;
function run(content) {
    if (transitioning) return; // prevent interrupting transition, below prevents active & allows initialization
    if (content?.toUpperCase() === document.getElementById("active")?.textContent && content != null) return;

    transitioning = true;

    if (content === undefined) { // initialization
        content = "socials";
        fadeGroup(selectElements(".header-item, hr, .footer-item"), "in");
    } else {
        fadeGroup(selectElements("main, #active"), "out");
    }

    document.head.querySelector("script:nth-of-type(2)")?.remove();
    let js = Object.assign(document.createElement("script"),{
        src: "js/" + content + ".js",
        onload: async () => {
            // start transition
            await runContent(content);

            // mid transition
            setTimeout(() => { 
                let items = Object.values(selectElements(".header-item"));
                for (let item of items) { // change active
                    if (item.textContent === content.toUpperCase()) {item.id = "active";}
                    else {item.removeAttribute("id");}
                }
                fadeGroup(selectElements("main, #active"), "in");
            }, time);

            // end transition
            setTimeout(() => {
                transitioning = false;
            }, time * 2);
        }});
    document.head.appendChild(js);
}

function selectElements(elements) {
    return document.querySelectorAll(elements);
}

function fadeElement(el, type) {
    let outClass = "fade-out";
    let inClass = "fade-in";

    if (el.id === "active") {
        outClass = "active-out";
        inClass = "active-in";
    }

    if (type === "out") {
        el.classList.remove(inClass);
        el.classList.add(outClass);
    } else if (type === "in") {
        el.classList.remove(outClass);
        el.classList.add(inClass);
    }
}

function fadeGroup(elements, type) {
    elements.forEach(el => fadeElement(el, type));
}

function runContent(content) {
    if (content === "socials") {return socials();}
    else if (content === "listen") {return listen();}
    else if (content === "aesthetic") {return aesthetic();}
    else if (content === "about") {return about();}
}

window.onload = function() {
    window.scrollTo(0, 0);
};