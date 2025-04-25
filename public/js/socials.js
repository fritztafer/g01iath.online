// socials.js

function socials() {
    document.querySelector("main").innerHTML = 
        '<div class="social" style="height: 75vh; display: flex; flex-direction: column; justify-content: center; align-items: center; filter: brightness(.7);">' +
            '<a href="#" style="width: 339px; margin: auto;"><img src="img/sc.png" class="social-item"></a>' +
            '<a href="#" style="width: 252px; margin: auto;"><img src="img/bc.png" class="social-item"></a>' +
            '<a href="#" style="width: 160px; margin: auto;"><img src="img/yt.png" class="social-item"></a>' +
        '</div>';
}