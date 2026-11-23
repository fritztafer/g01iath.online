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
@param {Object} [attributes]
@param {HTMLElement} parent
@returns {HTMLElementTagNameMap[T]} */
newElement(tag, attributes={}, parent=undefined) {
    const element = Object.assign(document.createElement(tag), attributes);
    if (!parent) return element;
    parent.appendChild(element);
},
/**
@template {keyof HTMLElementTagNameMap} T
@param {T} tag
@param {Object} [attributes]
@param {HTMLElement} parent
@returns {Promise<HTMLElementTagNameMap[T]>} */
newResource(tag, attributes, parent=document.head) {
    return new Promise((resolve, reject) => {
        const element = Object.assign(document.createElement(tag), attributes);
        element.onload = () => resolve();
        element.onerror = (error) => reject(error);
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
unloadCurrent(current) {
    try {R.paths[`/${current.className}`].module.cleanup()} catch (e) {};
    delete R.paths[`/${current.className}`].module;
    document.head.querySelector(`link[href="//${window.location.hostname}/css/${current.className}.css"]`).remove();
    document.head.querySelector(`script[src="//${window.location.hostname}/js/${current.className}.js"]`).remove();
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
removeActive() {U.getElement(".header-item.active")?.classList.remove("active")},
transitionHandler(parent, current=null) {
    if (current) R.unloadCurrent(current);
    parent.classList.remove("hidden");
    U.getElements(".header-item").forEach(item => {
        if (item.textContent.toLowerCase() === parent.className) item.classList.add("active");
    });
},
async loadJS(path) {
    const script = import(`./${path.name}.js`);
    const [module, parent, _] = await Promise.all([
        script,
        script.then(parent => parent[path.name]()),
        U.newResource("script", {src: `//${window.location.hostname}/js/${path.name}.js`, type: "module"})
    ]);
    path.module = path.module ?? module;
    return parent;
},
loadCSS(path) {return U.newResource("link", {href: `//${window.location.hostname}/css/${path.name}.css`, rel: "stylesheet"})},

};



const P = {

};



const G = {

};



export default U;
export {R, P, G};