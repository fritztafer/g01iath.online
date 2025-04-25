// main.js

let time = 2501;
let transitioning = false;
let elements = [];

function run(content) {
    if (transitioning) return;
    transitioning = true;

    if (content === undefined) {
        content = "socials";
        elements = selectElements(".header-item, hr, .footer-item");
        fadeGroup(elements, "in");
    } else {
        elements = selectElements("main, #active");
        fadeGroup(elements, "out");
    }

    let items = Object.values(document.getElementsByClassName("header-item"));
    for (let item of items) {
        if (item.textContent === content.toUpperCase()) {item.id = "active";}
        else {item.removeAttribute("id");}
    }

    setTimeout(() => {
        try {document.head.querySelector("script:nth-of-type(2)").remove();} catch {}
        let js = Object.assign(document.createElement("script"),{
            src: "js/" + content + ".js",
            onload: () => {
                runContent(content)
                elements = selectElements("main, #active");
                fadeGroup(elements, "in");
                setTimeout(() => {transitioning = false;}, time);
            }});
        document.head.appendChild(js);
    }, time);
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