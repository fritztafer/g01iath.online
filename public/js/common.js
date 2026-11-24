const U = {
/**
@param {string} query
@returns {Element | null} */
getElement(query) {return document.querySelector(query)},
/**
@param {string} query
@returns {NodeListOf<Element>} */
getElements(query) {return document.querySelectorAll(query)},
/**
@template {keyof HTMLElementTagNameMap} T
@param {T} tag
@param {Object} attributes
@param {HTMLElement} [parent]
@returns {HTMLElementTagNameMap[T]} */
newElement(tag, attributes={}, parent=undefined) {
    const element = Object.assign(document.createElement(tag), attributes);
    if (!parent) return element;
    parent.appendChild(element);
},
/**
@template {keyof HTMLElementTagNameMap} T
@param {T} tag
@param {Object} attributes
@param {HTMLElement} parent
@returns {Promise<HTMLElementTagNameMap[T]>} */
newResource(tag, attributes, parent=document.head) {
    return new Promise((resolve, reject) => {
        const element = Object.assign(document.createElement(tag), attributes);
        element.onload = () => resolve();
        element.onerror = (e) => reject(e);
        parent.appendChild(element);
    });
},

};

const R = {
time: 2501,
transitioning: false,
paths: {
"/": undefined,
"/socials": {name: "socials", header: true},
"/listen": {name: "listen", header: true},
"/aesthetic": {name: "aesthetic", header: true},
"/about": {name: "about", header: true},
error: {name: "error"}
},
async loadContent(path) {
    const script = import(`./${path.name}.js`);
    const [module, parent] = await Promise.all([
        script,
        script.then(module => module[path.name]()),
        U.newResource("link", {href: `//${window.location.hostname}/css/${path.name}.css`, rel: "stylesheet"})
    ]);
    path.module = path.module ?? module;
    return parent;
},
unloadCurrent(current) {
    try {R.paths[`/${current.className}`].module.cleanup()} catch (e) {};
    U.getElement(`link[href="//${window.location.hostname}/css/${current.className}.css"]`).remove();
    current.remove();
},
fadeElements(elements, type, ready=Promise.resolve()) {
    elements.forEach(async (el) => {
        const activeFade = el.className === "header-item active";
        el.setAttribute("style", (() => {
            if (type === "out")
                return activeFade ? "color: var(--color); transition: color calc(var(--time) / 2) ease;" :
                    "animation: fadeOut calc(var(--time) / 2) forwards;";
            if (type === "in")
                return activeFade ? "transition: color calc(var(--time) / 2) ease;" :
                    "animation: fadeIn calc(var(--time) / 2) forwards;";
        })());
        await ready;
        setTimeout(() => el.removeAttribute("style"), R.time / 2);
    });
},
removeActive() {
    const active = U.getElement(".header-item.active");
    if (active) {
        delete R.paths[`/${active.textContent.toLowerCase()}`].active;
        active.classList.remove("active");
    }
},
transitionHandler(parent, current=null) {
    if (current) R.unloadCurrent(current);
    parent.classList.remove("hidden");
    U.getElements(".header-item").forEach(el => {
        if (el.textContent.toLowerCase() === parent.className) {
            R.paths[`/${el.textContent.toLowerCase()}`].active = true;
            el.classList.add("active");
        }
    });
},

};

const P = {

};

const G = {

};

export default U;
export {R, P, G};