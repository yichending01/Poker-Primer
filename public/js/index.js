function goToDrill(url) {
    window.location.href = url;
}

window.onload = function() {

    document.getElementById("game-01").addEventListener("click", () => { goToDrill('/game-01') });
    document.getElementById("whats-your-hand").addEventListener("click", () => { goToDrill('/whats-your-hand') });
    document.getElementById("hand-evaluator").addEventListener("click", () => { goToDrill('/hand-evaluator') });
    document.getElementById("hand-rankings").addEventListener("click", () => { goToDrill('/articles/hand-rankings') });
    document.getElementById("how-to-play-poker").addEventListener("click", () => { goToDrill('/articles/how-to-play-poker') });
    document.getElementById("poker-lingo").addEventListener("click", () => { goToDrill('/articles/poker-lingo') });

}