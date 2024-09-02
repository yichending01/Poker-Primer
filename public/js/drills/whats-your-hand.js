let score;
const FLOP = 0;
const TURN = 1;
const RIVER = 2;
const BLITZ = 0;
const SURVIVAL = 1;
const TWENTYHANDS = 2;
const ZEN = 3;
let currentStreet;
let boardCards = [];
let yourCards = [];
let deck;
let yourHand;
let yourHandPlace;
let deckIndex = 0;
let gameMode = BLITZ;
let countdown;
let duration;
let minutes;
let seconds;
let gameOver = false;

let howToStreet = FLOP;

window.onload = function() {

    // add hand button event listeners
    document.getElementById("high-card").addEventListener("click", () => { selectHand(9, "high-card");});
    document.getElementById("pair").addEventListener("click", () => { selectHand(8, "pair");});
    document.getElementById("two-pair").addEventListener("click", () => { selectHand(7, "two-pair");});
    document.getElementById("three-of-a-kind").addEventListener("click", () => { selectHand(6, "three-of-a-kind");});
    document.getElementById("straight").addEventListener("click", () => { selectHand(5, "straight");});
    document.getElementById("flush").addEventListener("click", () => { selectHand(4, "flush");});
    document.getElementById("full-house").addEventListener("click", () => { selectHand(3, "full-house");});
    document.getElementById("four-of-a-kind").addEventListener("click", () => { selectHand(2, "four-of-a-kind");});
    document.getElementById("straight-flush").addEventListener("click", () => { selectHand(1, "straight-flush");});
    document.getElementById("royal-flush").addEventListener("click", () => { selectHand(0, "royal-flush");});
    
    // add other basic event listeners
    document.getElementById("next").addEventListener("click", gameRound);
    document.getElementById("exit").addEventListener("click", exit);
    document.getElementById("survival-next").addEventListener("click", gameOverScreen);
    document.getElementById("game-mode-back").addEventListener("click", gameModeBack);
    document.getElementById("start").addEventListener("click", startGame);
    document.getElementById("start-screen-back").addEventListener("click", pickGameModeScreen);

    // add how to play event listeners
    document.getElementById("how-to-play").addEventListener("click", howToPlay);
    document.getElementById("how-to-play-close").addEventListener("click", howToPlayClose);
    document.getElementById("whats-your-hand-backdrop").addEventListener("click", howToPlayClose);
    document.getElementById("howto-next").addEventListener("click", howToNext);

    document.getElementById("high-card-howto").addEventListener("click", () => { selectHandHowTo(9, "high-card-howto");});
    document.getElementById("pair-howto").addEventListener("click", () => { selectHandHowTo(8, "pair-howto");});
    document.getElementById("two-pair-howto").addEventListener("click", () => { selectHandHowTo(7, "two-pair-howto");});
    document.getElementById("three-of-a-kind-howto").addEventListener("click", () => { selectHandHowTo(6, "three-of-a-kind-howto");});
    document.getElementById("straight-howto").addEventListener("click", () => { selectHandHowTo(5, "straight-howto");});
    document.getElementById("flush-howto").addEventListener("click", () => { selectHandHowTo(4, "flush-howto");});
    document.getElementById("full-house-howto").addEventListener("click", () => { selectHandHowTo(3, "full-house-howto");});
    document.getElementById("four-of-a-kind-howto").addEventListener("click", () => { selectHandHowTo(2, "four-of-a-kind-howto");});
    document.getElementById("straight-flush-howto").addEventListener("click", () => { selectHandHowTo(1, "straight-flush-howto");});
    document.getElementById("royal-flush-howto").addEventListener("click", () => { selectHandHowTo(0, "royal-flush-howto");});


    // add game mode event listeners
    document.getElementById("blitz").addEventListener("click", blitzStartScreen);
    document.getElementById("survival").addEventListener("click", survivalStartScreen);
    document.getElementById("zen").addEventListener("click", zenStartScreen);
}

function startGame() {
    // clear the canvas
    document.getElementById("start-screen").style.display="none";
    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById("timer").style.display = "none";

    // reveal game area
    document.getElementById("game-area").style.display = "block";
    // change background color
    document.body.style.backgroundColor = "var(--off-green-color)";

    // handle different game modes
    if (gameMode === BLITZ) { // blitz
        document.getElementById("score").style.display="block";
        document.getElementById("timer").textContent = "";
        document.getElementById("timer").style.display="block";
        duration = 120;
        clearInterval(countdown);
        startTimer();

        document.querySelector(".result-wrapper").style.display = "none";
    }
    else if (gameMode === SURVIVAL) { // survival
        document.getElementById("score").style.display="block";
        document.querySelector(".result-wrapper").style.display = "none";
    }
    else if (gameMode === ZEN) { // zen
        document.getElementById("score").style.display="none";
        document.querySelector(".game-area-top-bar").style.paddingBottom = "0";
        document.querySelector(".result-wrapper").style.display = "block";
    } 
    else {
        console.log("ERROR! gameMode incorrectly set.")
    }

    // build deck
    deck = PokerUtils.buildDeck();

    // reset score and street
    score = 0;
    currentStreet = FLOP;
    gameOver = false;

    gameRound();
}

function gameRound() {

    clearSelected();

    // handle game modes 
    if (gameMode === BLITZ) {
        document.getElementById("score").innerText = "Score: " + score;
    }
    else if (gameMode === SURVIVAL) {
        document.getElementById("score").innerText = "Score: " + score;
    }
    else if (gameMode === ZEN) {
        document.getElementById("score").display = "none";
        document.getElementById("next").style.display = "none";
        document.getElementById("result").style.display = "none";
    } else {
        console.log("ERROR! gameMode incorrectly set.");
    }

    if (currentStreet === FLOP) {

        // remove all cards
        boardCards = [];
        yourCards = [];
        let boardCardsElement = document.getElementById("board-cards");
        let yourCardsElement = document.getElementById("your-cards");

        while (boardCardsElement.firstChild) {
            boardCardsElement.removeChild(boardCardsElement.firstChild);
        }

        while (yourCardsElement.firstChild) {
            yourCardsElement.removeChild(yourCardsElement.firstChild);
        }

        // re-deal cards
        deck = PokerUtils.shuffleDeck(deck);
        deckIndex = 0;

        for (let i=0; i < 3; i++) { // deal board cards
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
            document.getElementById("your-cards").append(cardImg);
            yourCards.push(card);
            deckIndex++;
        }

        // display the street
        document.getElementById("street").innerText = "FLOP";

    } else if (currentStreet === TURN) {

        // deal turn card 
        let card = deck[deckIndex];
        let cardImg = document.createElement("img");
        cardImg.src = "/assets/cards/" + card.name + ".png";
        document.getElementById("board-cards").append(cardImg);
        boardCards.push(card);
        deckIndex++;

        // display the street
        document.getElementById("street").innerText = "TURN";

    } else if (currentStreet === RIVER) {
        // deal river card 
        let card = deck[deckIndex];
        let cardImg = document.createElement("img");
        cardImg.src = "/assets/cards/" + card.name + ".png";
        document.getElementById("board-cards").append(cardImg);
        boardCards.push(card);
        deckIndex++;

        // display the street
        document.getElementById("street").innerText = "RIVER";
    } else {
        console.log("ERROR! currentStreet not properly defined.");
    }

    [yourHand, yourHandPlace] = PokerUtils.findBestHand(yourCards.concat(boardCards));

    currentStreet = (currentStreet + 1) % 3;

}

function selectHand(selectedHandPlace, id) {
    if (gameOver) {
        return;
    }

    clearSelected();

    if (selectedHandPlace === yourHandPlace) { //player correctly selected hand

        if (gameMode === BLITZ) {
            // flash indicator
            document.getElementById("indicator").innerText = "CORRECT!";
            document.getElementById("indicator").style.color = "var(--main-yellow-color)";
            flash();

            // increase score
            score++;

            // start next game roun
            gameRound();

        } else if (gameMode === SURVIVAL) {
            // flash indicator
            document.getElementById("indicator").innerText = "CORRECT!";
            document.getElementById("indicator").style.color = "var(--main-yellow-color)";
            flash();
            
            // increase score
            score++;

            // start next game roun
            gameRound();

        } else if (gameMode === ZEN) {
            document.getElementById(id).classList.add("selected");
            document.getElementById("result").innerText = PokerUtils.handTypes[yourHandPlace] + " is CORRECT!";
            document.getElementById("result").style.display = "inline-block";
            document.getElementById("next").style.display = "inline-block";
        }


    } else { // player incorrectly selected hand
        if (gameMode === BLITZ) {
            // flash indicator
            document.getElementById("indicator").innerText = "INCORRECT! -10s";
            document.getElementById("indicator").style.color = "var(--main-red-color)";
            flash();
            flashTimer();

            duration = duration - 10;
        } else if (gameMode === SURVIVAL) {
            document.getElementById(id).classList.add("selected");

            document.getElementById("survival-message").innerText = "Incorrect! Your hand is a " + PokerUtils.handTypes[yourHandPlace] + ".";
            document.getElementById("survival-message-wrapper").style.display = "block";

            gameOver = true;
        } else if (gameMode === ZEN) {
            document.getElementById(id).classList.add("selected");
            document.getElementById("result").innerText = capitalizeFirstLetter(id) + " is incorrect. Try Again!";
            document.getElementById("result").style.display = "inline-block";
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

function blitzStartScreen() {
    document.getElementById("game-modes").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
    
    document.getElementById("start-screen-body").style.color = "var(--main-yellow-color)";
    document.getElementById("game-mode-name").innerText = "Blitz";
    document.getElementById("game-mode-description").innerText = "A two minute race against the clock";
    document.getElementById("game-mode-instructions").innerHTML = 
    "Identify as many hands correctly as you can in two minutes. But <b>don't spam!</b> Every wrong answer carries a <i>-10 second penalty</i>. Get ready to race against the clock!"

    gameMode = BLITZ;

}


function survivalStartScreen() {
    document.getElementById("game-modes").style.display = "none";
    document.getElementById("start-screen").style.display = "block";

    document.getElementById("start-screen-body").style.color = "var(--main-red-color)";
    document.getElementById("game-mode-name").innerText = "Survival";
    document.getElementById("game-mode-description").innerText = "Keep going as long as you're right.";
    document.getElementById("game-mode-instructions").innerHTML =
    "Identify as many hands correctly as you can in a row. See how long you can keep your streak!"

    gameMode = SURVIVAL;

}

function zenStartScreen() {
    document.getElementById("game-modes").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
    
    document.getElementById("start-screen-body").style.color = "var(--main-green-color)";
    document.getElementById("game-mode-name").innerText = "Zen";
    document.getElementById("game-mode-description").innerText = "A relaxing, never-ending mode.";
    document.getElementById("game-mode-instructions").innerHTML =
    "Practice identifying hands without any pressure. Keep trying until you get it right.";

    gameMode = ZEN;

}


function gameOverScreen() {

    if (gameMode === BLITZ) {
        clearInterval(countdown);
        document.getElementById("final-score").innerText = score;
    }
    else if (gameMode === SURVIVAL) {
        document.getElementById("final-score").innerText = score;
        document.getElementById("survival-message-wrapper").style.display="none";
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

    document.getElementById("play-again").onclick = () => { startGame(); };
    document.getElementById("game-over-back").onclick = pickGameModeScreen;

}


function submitScore(gameMode) {
    fetch('/whats-your-hand/update-high-score', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({score: score, gameMode: gameMode})
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
            gameOverScreen();
        }

    }, 1000);
}

function exit() {
    if (gameMode === BLITZ) {
        clearInterval(countdown);
    } else if (gameMode === SURVIVAL) {
        document.getElementById("survival-message-wrapper").style.display = "none";
    }
    else if (gameMode == ZEN) {
        document.getElementById("result").style.display="none";
        document.getElementById("next").style.display = "none";
    }

    pickGameModeScreen();
}


function howToPlay() {
    document.getElementById("whats-your-hand-backdrop").style.display = "block";
    document.getElementById("how-to-play-popup").style.display = "block";
}

function howToPlayClose() {
    document.getElementById("whats-your-hand-backdrop").style.display = "none";
    document.getElementById("how-to-play-popup").style.display = "none";
}

function selectHandHowTo(handPlace, id) {

    clearSelectedHowTo();

    document.getElementById(id).classList.add("selected");

    if (howToStreet === FLOP) {
        if (handPlace === 6) { // three of a kind
            document.getElementById("howto-ex-feedback").innerText = "Three of a Kind if CORRECT!"
            document.getElementById("howto-next").style.display = "inline";
        } else {
            document.getElementById("howto-next").style.display = "none";
            document.getElementById("howto-ex-feedback").innerText = PokerUtils.handTypes[handPlace] + " is incorrect. Try again."
        }
    } else if (howToStreet == TURN) {
        if (handPlace === 6) { // three of a kind
            document.getElementById("howto-ex-feedback").innerText = "Three of a Kind if CORRECT!"
            document.getElementById("howto-next").style.display = "inline";
        } else {
            document.getElementById("howto-next").style.display = "none";
            document.getElementById("howto-ex-feedback").innerText = PokerUtils.handTypes[handPlace] + " is incorrect. Try again."
        }
    } else { // RIVER
        if (handPlace === 3) { // full house
            document.getElementById("howto-ex-feedback").innerText = "Full House is CORRECT! (End of example.)"
        } else {
            document.getElementById("howto-ex-feedback").innerText = PokerUtils.handTypes[handPlace] + " is incorrect. Try again."
        }
    }

}

function howToNext() {
    clearSelectedHowTo();
    if (howToStreet == FLOP) {
        howToStreet++;

        document.getElementById("street-howto").innerText = "TURN";

        let cardImg = document.createElement("img");
        cardImg.src = "/assets/cards/2-H.png";
        document.getElementById("board-cards-howto").append(cardImg);

        document.getElementById("howto-ex-feedback").innerText = "";
        document.getElementById("howto-next").style.display = "none";
    } else if (howToStreet == TURN) {
        howToStreet++;

        document.getElementById("street-howto").innerText = "RIVER";

        let cardImg = document.createElement("img");
        cardImg.src = "/assets/cards/J-C.png";
        document.getElementById("board-cards-howto").append(cardImg);

        document.getElementById("howto-ex-feedback").innerText = "";
        document.getElementById("howto-next").style.display = "none";
    }
}


function flash() {
    indicator = document.getElementById("indicator");

    indicator.style.display = "block";

    setTimeout(() => {
        indicator.style.display = "none";
      }, 500);
    return;
}

function flashTimer() {
    const element = document.getElementById('timer');

    // Force reflow to restart the animation
    void element.offsetWidth;

    // Add the class to trigger the flash
    element.classList.add('flash');

    setTimeout(() => {
        element.classList.remove('flash');
    }, 600);
}

function clearSelected() {
    
    // clear selected 

    let handGrid = document.getElementById("hand-grid");
    let selectedElements = handGrid.querySelectorAll('.selected');
    selectedElements.forEach(element => {
        element.classList.remove('selected');
    });
}

function clearSelectedHowTo() {
    
    // clear selected 

    let handGrid = document.getElementById("hand-grid-howto");
    let selectedElements = handGrid.querySelectorAll('.selected');
    selectedElements.forEach(element => {
        element.classList.remove('selected');
    });
}

function gameModeBack() {
    window.location.href = "/";
}

function capitalizeFirstLetter(string) {
    if (!string) return ''; // Check if the string is empty or undefined
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  

