function goToDrill(url) {
    window.location.href = url;
}

window.onload = function() {

    document.getElementById("showdown").addEventListener("click", () => { goToDrill('/showdown') });
    document.getElementById("whats-your-hand").addEventListener("click", () => { goToDrill('/whats-your-hand') });
    document.getElementById("hand-evaluator").addEventListener("click", () => { goToDrill('/hand-evaluator') });
    document.getElementById("odds-calculator").addEventListener("click", () => { goToDrill('/odds-calculator') });
    document.getElementById("hand-rankings").addEventListener("click", () => { goToDrill('/articles/hand-rankings') });
    document.getElementById("how-to-play-poker").addEventListener("click", () => { goToDrill('/articles/how-to-play-poker') });
    document.getElementById("poker-lingo").addEventListener("click", () => { goToDrill('/articles/poker-lingo') });

}