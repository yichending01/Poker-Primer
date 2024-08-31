let countdown; // for blitz timer
let stopwatch; // for 20 hands timer
let duration, minutes, seconds; // for running the clocks;
const BLITZ = 0;
const SURVIVAL = 1;
const TWENTYHANDS = 2;
const ZEN = 3;
let score;
let zenMessage;
let sameHandType = false;


window.onload = function() {
    
    document.getElementById("blitz").addEventListener("click", blitzStartScreen);
    document.getElementById("survival").addEventListener("click", survivalStartScreen);
    document.getElementById("20-hands").addEventListener("click", twentyHandsStartScreen);
    document.getElementById("zen").addEventListener("click", zenStartScreen);

    document.getElementById("start-screen-back").addEventListener("click", pickGameModeScreen);
    document.getElementById("game-mode-back").addEventListener("click", gameModeBack);
    document.getElementById("how-to-play").addEventListener("click", howToPlay);
    document.getElementById("how-to-play-close").addEventListener("click", howToPlayClose);
    document.getElementById("player-1-cards-howto").addEventListener("click", p1HowTo);
    document.getElementById("player-2-cards-howto").addEventListener("click", p2HowTo);
    document.getElementById("tie-howto").addEventListener("click", tieHowTo);
    document.getElementById("showdown-backdrop").addEventListener("click", howToPlayClose);

}


function startGame(gameMode) {
    // clear the canvas
    document.getElementById("start-screen").style.display="none";
    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById("timer").style.display = "none";

    // reveal game area
    document.getElementById("game-area").style.display = "block";

    // change background color
    document.body.style.backgroundColor = "var(--off-green-color)";

    // build deck
    let deck = PokerUtils.buildDeck();

    // reset score
    score = 0;

    // handle different game modes
    if (gameMode === BLITZ) { // blitz
        document.getElementById("score").style.display="block";
        document.getElementById("timer").textContent = "";
        document.getElementById("timer").style.display="block";
        duration = 120;
        clearInterval(countdown);
        startTimer();
    }
    else if (gameMode === SURVIVAL) { // survival
        document.getElementById("score").style.display="block";
    }
    else if (gameMode === TWENTYHANDS) { // 20 hands
        document.getElementById("score").style.display="block";
        document.getElementById("timer").textContent = "";
        document.getElementById("timer").style.display="block";
        duration = 0;
        clearInterval(stopwatch);
        startStopwatch();
    }
    else if (gameMode === ZEN) { // zen
        document.getElementById("score").style.display="none";
    }

    // start a round
    gameRound(gameMode, deck);

}

function gameRound(gameMode, deck) {

    let winner;
    let boardCards = [];
    let p1Cards = [];
    let p2Cards = [];
    let p1Hand;
    let p2Hand;

    sameHandType = false;
    zenMessage = "";

    document.getElementById("player-2-label").classList.remove("selected");
    document.getElementById("tie").classList.remove("selected");
    document.getElementById("player-1-label").classList.remove("selected");

    if (gameMode === BLITZ) {
        document.getElementById("score").innerText = "Score: " + score;
    }
    else if (gameMode === SURVIVAL) {
        document.getElementById("score").innerText = "Score: " + score;
    }
    else if (gameMode === TWENTYHANDS) {
        document.getElementById("score").innerText = score;
    }
    else if (gameMode === ZEN) {
        document.getElementById("next").style.display = "none";
        document.getElementById("result").style.display = "none";
    }

    // clear previous card images

    let div1 = document.getElementById("board-cards");
    let div2 = document.getElementById("player-1-cards");
    let div3 = document.getElementById("player-2-cards");

    if (div1.firstChild) {

        for (let i=0; i < 5; i++) {
            div1.removeChild(div1.firstChild);
        }

        for (let i=0; i < 2; i++) {
            div2.removeChild(div2.firstChild);
            div3.removeChild(div3.firstChild)
        }
    }

    // reshuffle and deal cards 

    deck = PokerUtils.shuffleDeck(deck);
    let deckIndex = 0;

    for (let i=0; i < 5; i++) { // deal board cards
        let card = deck[deckIndex];
        let cardImg = document.createElement("img");
        cardImg.src = "/assets/cards/" + card.name + ".png";
        document.getElementById("board-cards").append(cardImg);
        boardCards.push(card);
        deckIndex++;
    }
    for (let i=0; i<2; i++) { // deal player 1 cards
        let card = deck[deckIndex];
        let cardImg = document.createElement("img");
        cardImg.src = "/assets/cards/" + card.name + ".png";
        document.getElementById("player-1-cards").append(cardImg);
        p1Cards.push(card);
        deckIndex++;
    }
    for (let i=0; i < 2; i++) { // deal player 2 cards
        let card = deck[deckIndex];
        let cardImg = document.createElement("img");
        cardImg.src = "../assets/cards/" + card.name + ".png";
        document.getElementById("player-2-cards").append(cardImg);
        p2Cards.push(card);
        deckIndex++;
    }

    // calculate player hands

    p1Hand = PokerUtils.findBestHand(p1Cards.concat(boardCards));
    p2Hand = PokerUtils.findBestHand(p2Cards.concat(boardCards));


    // determine winner

    if (p1Hand[1] < p2Hand[1]) {
        winner = 1;
    }
    else if (p1Hand[1] > p2Hand[1] ) {
        winner = 2;
    }
    else {
        winner = PokerUtils.breakTie(p1Hand[0], p2Hand[0])[1];
        sameHandType = true;
        zenMessage = PokerUtils.breakTieMsg(p1Hand[1], p1Hand[0], p2Hand[0]);
    }

    document.getElementById("player-1-cards").onclick = () => { p1Win(gameMode, deck, winner, p1Hand, p2Hand) };
    document.getElementById("player-2-cards").onclick = () => { p2Win(gameMode, deck, winner, p1Hand, p2Hand) };
    document.getElementById("tie").onclick = () => { tiebtn(gameMode, deck, winner) };
    document.getElementById("next").onclick =  () => { gameRound(gameMode, deck) };


}



function p1Win(gameMode, deck, winner, p1Hand, p2Hand) {
    document.getElementById("player-1-label").classList.add("selected");
    document.getElementById("player-2-label").classList.remove("selected");
    document.getElementById("tie").classList.remove("selected");
    if (winner === 1) {
        if (gameMode != ZEN) {
            score++;
            document.getElementById("indicator").innerText = "CORRECT!";
            document.getElementById("indicator").style.color = "var(--main-yellow-color)";
            flash();
            if (gameMode === 2 && score === 20) {
                gameOverScreen(gameMode);
            }
            else {
                gameRound(gameMode, deck);
            }
        }
        else {
            document.getElementById("result").style.display="block";
            if (sameHandType) {
                document.getElementById("result").innerText = "You're correct! " + zenMessage;
            } else {
                document.getElementById("result").innerText = "You're correct! " + PokerUtils.handTypes[p1Hand[1]] + " beats " + PokerUtils.handTypes[p2Hand[1]];
            }
            document.getElementById("next").style.display = "inline-block";
        }
    }
    else {
        if (gameMode === BLITZ) {
            duration = duration - 10;
            document.getElementById("indicator").innerText = "INCORRECT! -10s";
            document.getElementById("indicator").style.color = "var(--card-red-color)";
            flash();
            flashTimer();
            gameRound(gameMode, deck);
        }
        else if (gameMode === SURVIVAL) {
            gameOverScreen(gameMode);
        }
        else if (gameMode === TWENTYHANDS) {
            duration = duration + 10;
            document.getElementById("indicator").innerText = "INCORRECT! +10s";
            document.getElementById("indicator").style.color = "var(--card-red-color)";
            flash();
            flashTimer();
            gameRound(gameMode, deck);
        }
        else if (gameMode === ZEN) {
            document.getElementById("result").style.display="block";
            document.getElementById("result").innerText = "You're incorrect! Try again!";
        }
    }
}



function p2Win(gameMode, deck, winner, p1Hand, p2Hand) {
    document.getElementById("player-2-label").classList.add("selected");
    document.getElementById("tie").classList.remove("selected");
    document.getElementById("player-1-label").classList.remove("selected");
    if (winner === 2) {
        if (gameMode != ZEN) {
            score++;
            document.getElementById("indicator").innerText = "CORRECT!";
            document.getElementById("indicator").style.color = "var(--main-yellow-color)";
            flash();
            if (gameMode === 2 && score === 20) {
                gameOverScreen(gameMode);
            }
            else {
                gameRound(gameMode, deck);
            }
        }
        else {
            document.getElementById("result").style.display="block";
            document.getElementById("next").style.display = "inline-block";
            if (sameHandType) {
                document.getElementById("result").innerText = "You're correct! " + zenMessage;
            } else {
                document.getElementById("result").innerText = "You're correct! " + PokerUtils.handTypes[p2Hand[1]] + " beats " + PokerUtils.handTypes[p1Hand[1]];
            }        
        }
    }
    else {
        if (gameMode === BLITZ) {
            duration = duration - 10;
            document.getElementById("indicator").innerText = "INCORRECT! -10s";
            document.getElementById("indicator").style.color = "var(--card-red-color)";
            flash();
            flashTimer();
            gameRound(gameMode, deck);
        }
        else if (gameMode === SURVIVAL) {
            gameOverScreen(gameMode);
        }
        else if (gameMode === TWENTYHANDS) {
            duration = duration + 10;
            document.getElementById("indicator").innerText = "INCORRECT! +10s";
            document.getElementById("indicator").style.color = "var(--card-red-color)";
            flash();
            flashTimer();
            gameRound(gameMode, deck);
        }
        else if (gameMode === ZEN) {
            document.getElementById("result").style.display="block";
            document.getElementById("result").innerText = "You're incorrect! Try again!"; 
        }
    }
}



function tiebtn(gameMode, deck, winner) {
    document.getElementById("player-2-label").classList.remove("selected");
    document.getElementById("tie").classList.add("selected");
    document.getElementById("player-1-label").classList.remove("selected");
    if (winner === 0) {
        if (gameMode != ZEN) {
            score++;
            document.getElementById("indicator").innerText = "CORRECT!";
            document.getElementById("indicator").style.color = "var(--main-yellow-color)";
            flash();
            if (gameMode === 2 && score === 20) {
                gameOverScreen(gameMode);
            }
            else {
                gameRound(gameMode, deck);
            }
        }
        else {
            document.getElementById("result").style.display="block";
            document.getElementById("next").style.display = "inline-block";
            if (sameHandType) {
                document.getElementById("result").innerText = "You're correct! " + zenMessage;
            } else {
                document.getElementById("result").innerText = "You're correct! " + PokerUtils.handTypes[p1Hand[1]] + " ties " + PokerUtils.handTypes[p2Hand[1]];
            }
        }
    }
    else {
        if (gameMode === BLITZ) {
            duration = duration - 10;
            document.getElementById("indicator").innerText = "INCORRECT! -10s";
            document.getElementById("indicator").style.color = "var(--card-red-color)";
            flash();
            flashTimer();
            gameRound(gameMode, deck);
        }
        else if (gameMode === SURVIVAL) {
            gameOverScreen(gameMode);
        } 
        else if (gameMode === TWENTYHANDS) {
            document.getElementById("indicator").innerText = "INCORRECT! +10s";
            document.getElementById("indicator").style.color = "var(--card-red-color)";
            flash();
            flashTimer();
            duration = duration + 10;
            gameRound(gameMode, deck);
        }
        else if (gameMode === ZEN) {
            document.getElementById("result").style.display="block";
            document.getElementById("result").innerText = "You're incorrect! Try again!";
        }
    }
}

function pickGameModeScreen() {
    // clear canvas
    document.getElementById("game-over-screen").style.display="none";
    document.getElementById("game-area").style.display="none";
    document.getElementById("timer").style.display="none";
    document.getElementById("start-screen").style.display="none";

    //change background color
    document.body.style.backgroundColor = "var(--main-medium-grey-color)";

    // display menu
    document.getElementById("game-modes").style.display="block";

}

function submitScore(gameMode) {
    let finalScore;

    if (gameMode === TWENTYHANDS) {
        finalScore = minutes*60 + seconds;
    } else {
        finalScore = score;
    }

    fetch('/update-high-score', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({score: finalScore, gameMode: gameMode})
    })
    .then(response => { 
        return response.json();
    })
    .then(data => {
        if (data.newHighScore) {
            document.getElementById("high-score-message").style.display="block";
        } else {
            document.getElementById("high-score-message").style.display="none";
        }
        document.getElementById("high-score").innerText=data.highScore;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function gameOverScreen(gameMode) {

    if (gameMode === BLITZ) {
        clearInterval(countdown);
        document.getElementById("final-score").innerText = score;
    }
    else if (gameMode === SURVIVAL) {
        document.getElementById("final-score").innerText = score;
    }
    else if (gameMode === TWENTYHANDS) {
        clearInterval(stopwatch);
        document.getElementById("final-score").innerText = minutes + ":" + seconds;
        document.getElementById("timer").style.display = "none";

    }

    submitScore(gameMode);

    document.getElementById("game-over-screen").style.display = "block";
    document.getElementById("game-area").style.display = "none";

    document.body.style.backgroundColor = "var(--main-medium-grey-color)";

    document.getElementById("play-again").onclick = () => { startGame(gameMode); };
    document.getElementById("game-over-back").onclick = pickGameModeScreen;

}


function blitzStartScreen() {
    document.getElementById("game-modes").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
    
    document.getElementById("start-screen-body").style.color = "var(--main-yellow-color)";
    document.getElementById("game-mode-name").innerText = "Blitz";
    document.getElementById("game-mode-description").innerText = "A two minute race against the clock";
    document.getElementById("game-mode-instructions").innerHTML = 
    "Choose as many winning hands as you can in two minutes. But <b>don't spam!</b> Every wrong answer carries a <i>-10 second penalty</i>. Get ready to race against the clock!"

    document.getElementById("game-01-start").onclick = () => { startGame(BLITZ) };
    document.getElementById("exit").onclick = () => { exit(BLITZ); };

}


function survivalStartScreen() {
    document.getElementById("game-modes").style.display = "none";
    document.getElementById("start-screen").style.display = "block";

    document.getElementById("start-screen-body").style.color = "var(--main-red-color)";
    document.getElementById("game-mode-name").innerText = "Survival";
    document.getElementById("game-mode-description").innerText = "Keep going as long as you're right.";
    document.getElementById("game-mode-instructions").innerHTML =
    "Choose as many winning hands as possible in a row. See how long you can keep your streak!"

    document.getElementById("game-01-start").onclick = () => { startGame(SURVIVAL) };
    document.getElementById("exit").onclick = () => { exit(SURVIVAL); };

}

function twentyHandsStartScreen() {
    document.getElementById("game-modes").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
    
    document.getElementById("start-screen-body").style.color = "var(--main-blue-color)";
    document.getElementById("game-mode-name").innerText = "20 Hands";
    document.getElementById("game-mode-description").innerText = "Evaluate 20 hands as fast as possible.";
    document.getElementById("game-mode-instructions").innerHTML =
    "Find 20 winning hands as fast as possible. But <b>don't spam!</b> Every wrong answer carries a <i>+10 second penalty</i>. Get ready to race against the clock!"

    document.getElementById("game-01-start").onclick = () => { startGame(TWENTYHANDS) };
    document.getElementById("exit").onclick = () => { exit(TWENTYHANDS); };
}


function zenStartScreen() {
    document.getElementById("game-modes").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
    
    document.getElementById("start-screen-body").style.color = "var(--main-green-color)";
    document.getElementById("game-mode-name").innerText = "Zen";
    document.getElementById("game-mode-description").innerText = "A relaxing, never-ending mode with explanations.";
    document.getElementById("game-mode-instructions").innerHTML =
    "Practice hand rankings without any pressure. Keep trying until you get it right. Explanations included.";

    document.getElementById("game-01-start").onclick = () => { startGame(ZEN) };
    document.getElementById("exit").onclick = () => { exit(ZEN); };
}


function howToPlay() {
    document.getElementById("showdown-backdrop").style.display = "block";
    document.getElementById("how-to-play-popup").style.display = "block";
}

function howToPlayClose() {
    document.getElementById("showdown-backdrop").style.display = "none";
    document.getElementById("how-to-play-popup").style.display = "none";
}


function p1HowTo() {
    document.getElementById("howto-ex-feedback").innerText = "Player 1 is incorrect! Try Again."
    // document.getElementById("howto-ex-feedback").style.display = "block";
}

function p2HowTo() {
    document.getElementById("howto-ex-feedback").innerText = "Player 2 is CORRECT! Three of a kind beats Two Pair."
    // document.getElementById("howto-ex-feedback").style.display = "block";
}

function tieHowTo() {
    document.getElementById("howto-ex-feedback").innerText = "Tie is incorrect! Try Again."
    // document.getElementById("howto-ex-feedback").style.display = "block";
}


// timer for blitz mode
function startTimer() {
    countdown = setInterval(function () {
        minutes = parseInt(duration / 60, 10);
        seconds = parseInt(duration % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("timer").textContent = minutes + ":" + seconds;

        if (--duration < 0) {
            duration = 0;
            document.getElementById("timer").textContent = "0:00";
            clearInterval(countdown);
            gameOverScreen(BLITZ);
        }

    }, 1000);
}

// stopwatch for 20 hands
function startStopwatch() {
    minutes = 0, seconds = 0;
    stopwatch = setInterval(function () {
        minutes = parseInt(duration / 60, 10);
        seconds = parseInt(duration % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("timer").textContent = minutes + ":" + seconds;

        duration++;

    }, 1000);
}

function exit(gameMode) {
    if (gameMode === BLITZ) {
        clearInterval(countdown);
    }
    else if (gameMode === TWENTYHANDS) {
        clearInterval(stopwatch);
    }
    else if (gameMode == ZEN) {
        document.getElementById("result").style.display="none";
        document.getElementById("next").style.display = "none";
    }

    pickGameModeScreen();
}


function gameModeBack() {
    window.location.href = "/";
}


function flash() {
    indicator = document.getElementById("indicator");
    // indicator.classList.remove("flashing");
    // void indicator.offsetWidth;
    // indicator.classList.add("flashing");

    indicator.style.display = "block";

    setTimeout(() => {
        indicator.style.display = "none";
      }, 500);
    return;
}

function flashTimer() {
    const element = document.getElementById('timer');

    // Remove the class if it exists to restart the animation

    // Force reflow to restart the animation
    void element.offsetWidth;

    // Add the class to trigger the flash
    element.classList.add('flash');

    setTimeout(() => {
        element.classList.remove('flash');
    }, 600);
}