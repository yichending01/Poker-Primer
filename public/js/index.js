function goToDrill(url) {
    window.location.href = url;
}

window.onload = function() {

    document.getElementById("game-01").addEventListener("click", () => { goToDrill('/game-01') });
    document.getElementById("hand-evaluator").addEventListener("click", () => { goToDrill('/hand-evaluator') });

}