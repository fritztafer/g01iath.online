// about.js

function about() {
    let parent = Object.assign(document.createElement("div"),{className: "aesthetic", style: "width: 900px; margin: auto;"}),
        aboutImg = Object.assign(document.createElement("div"),{
            style: "float: left; text-align: center; width: 300px; padding-right: 16px;",
            innerHTML: '<img src="img/2012.jpg" style="height: auto; width: inherit; margin-bottom: -10px;"><div style="width: inherit;">circa 2012</div>'
        }),
        aboutBio = Object.assign(document.createElement("span"),{className: "about-bio", style: "width: 600px; margin: auto;", innerText: 
            `Music has always made me feel deeply, espicially in my childhood. If you are reading this I wouldn't doubt if it means a lot to you. The dreamer lost in imagination; self-image becoming skewed. Get real. Why spend so much time on something that gives so little in return?

            When no one is there for you that song can pick you up. Those lyrics speak to your soul, the chords and that melody make you cry. You play your favorite song and feel inspired to be the best version of yourself. I hope my music makes at least someone feel this way, then it'll all have been worth it.
            
            Figuratively speaking, music is the Goliath to my David. This journey has brought more pain than joy, I won't lie...but if you're reading this...I slayed the giant and the beast's head lay severed at my feet. If you are familiar with the story you know what happens next...`
        }),
        children = [aboutImg, aboutBio],
        main = document.querySelector("main");

    for (let child of children) {parent.append(child);}
    setTimeout(() => {
        main.innerHTML = "";
        main.append(parent);
    }, time);
}