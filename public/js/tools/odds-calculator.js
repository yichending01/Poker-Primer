let BOARD = 0;
let PLAYER1 = 1;
let PLAYER2 = 2;

let boardCards = [];
let p1Cards = [];
let p2Cards = [];

let duplicateCards = false;

window.onload = function() {

    let boardInput = document.getElementById("board-input");
    let p1Input = document.getElementById("player-1-input");
    let p2Input = document.getElementById("player-2-input");

    boardInput.addEventListener("input", () => {
        parseInput(boardInput.value, p1Input.value, p2Input.value, BOARD);
    });

    p1Input.addEventListener("input", () => {
        parseInput(boardInput.value, p1Input.value, p2Input.value, PLAYER1);
    });

    p2Input.addEventListener("input", () => {
        parseInput(boardInput.value, p1Input.value, p2Input.value, PLAYER2);
    });

    document.getElementById("calculate").addEventListener("click", calculateButton);

    document.getElementById("clear-all").addEventListener("click", clearAll);
    document.getElementById("clear-board").addEventListener("click", clearBoard);
    document.getElementById("clear-player-1").addEventListener("click", clearP1);
    document.getElementById("clear-player-2").addEventListener("click", clearP2);

}


function parseInput(boardVal, p1Val, p2Val, cardLoc) {
    errorMessage("");
    clearOdds();
    duplicateCards = false;

    boardCards = parseInputToCards(boardVal, BOARD);
    p1Cards = parseInputToCards(p1Val, PLAYER1);
    p2Cards = parseInputToCards(p2Val, PLAYER2);

    // check size requirements
    if (boardCards.length > 5) {
        errorMessage("Too many board cards. Only the first five will be used.");
    } else if (p1Cards.length > 2) {
        errorMessage("Too many Player 1 cards. Only the first two will be used.");
    } else if (p2Cards.length > 2) {
        errorMessage("Too many Player 2 cards. Only the first two will be used.");
    }

    p1Cards = p1Cards.slice(0, 2);
    p2Cards = p2Cards.slice(0, 2);
    boardCards = boardCards.slice(0, 5);

    let p1CardsNames = p1Cards.map(card => card.name);
    let p2CardsNames = p2Cards.map(card => card.name);
    let boardCardNames = boardCards.map(card => card.name);

    const allSelectedCards = [...p1CardsNames, ...p2CardsNames, ...boardCardNames];
    const allSelectedSet = new Set(allSelectedCards);
    if (allSelectedSet.size !== allSelectedCards.length) {
        errorMessage("Do not enter duplicate cards.");
        duplicateCards = true;
        return;
    }

    // remove card images
    clearImages();

    // add card images
    let p1CardsElement = document.getElementById("player-1-cards");
    let p2CardsElement = document.getElementById("player-2-cards");
    let boardCardsElement = document.getElementById("board-cards");
    for (let i=0; i<p1Cards.length; i++) {
        let cardImg = document.createElement("img");
        cardImg.src = "/assets/cards/" + p1Cards[i].name + ".png";
        p1CardsElement.append(cardImg);
    }
    for (let i=0; i<p2Cards.length; i++) {
        let cardImg = document.createElement("img");
        cardImg.src = "/assets/cards/" + p2Cards[i].name + ".png";
        p2CardsElement.append(cardImg);
    }
    for (let i=0; i<boardCards.length; i++) {
        let cardImg = document.createElement("img");
        cardImg.src = "/assets/cards/" + boardCards[i].name + ".png";
        boardCardsElement.append(cardImg);
    }


}


function calculateButton() {
    if (p1Cards.length < 2 || p2Cards.length < 2) {
        errorMessage("Input two cards for each player.");
        return;
    } else if (duplicateCards) {
        errorMessage("Do not enter duplicate cards.");
        return;
    }

    if (boardCards.length >= 3) {
        calculateOdds();
        return;
    } else {
        document.getElementById("calculate").innerText = "LOADING...";
        document.getElementById("calculate").classList.add("flashing");
        setTimeout(calculateOddsHeavy, 100);
    }
}


function calculateOdds() {

    let deck = PokerUtils.buildDeck();

    // remove player cards
    for (let i=0; i<2; i++) {
        let cardToRemove = p1Cards[i].name;
        deck = deck.filter(card => card.name !== cardToRemove);
    }
    for (let i=0; i<2; i++) {
        let cardToRemove = p2Cards[i].name;
        deck = deck.filter(card => card.name !== cardToRemove);
    }

    // remove board cards
    for (let i=0; i<boardCards.length; i++) {
        let cardToRemove = boardCards[i].name;
        deck = deck.filter(card => card.name !== cardToRemove);
    }

    let total=0;
    let tie=0;
    let p1Win = 0;
    let p2Win = 0;

    let i=0;

    const possibleBoardFillers = PokerUtils.kCombinations(deck, 5-boardCards.length);
    do {
        let possibleBoard = boardCards.concat(possibleBoardFillers[i]);
        let possibleP1Cards = p1Cards.concat(possibleBoard);
        let possibleP2Cards = p2Cards.concat(possibleBoard);

        let possibleP1Hand = PokerUtils.findBestHand(possibleP1Cards);
        let possibleP2Hand = PokerUtils.findBestHand(possibleP2Cards);


        if (possibleP1Hand[1] < possibleP2Hand[1]) { // P1 wins
            p1Win++;
        } else if (possibleP1Hand[1] > possibleP2Hand[1]) { // P2 wins
            p2Win++;
        } else {
            let winner = PokerUtils.breakTie(possibleP1Hand[0], possibleP2Hand[0])[1];
            if (winner === 0) { // tie
                tie++;
            } else if (winner === 1) {
                p1Win++;
            } else if (winner === 2) {
                p2Win++;
            }
        }
        total++;
        i++
    } while (i<possibleBoardFillers.length);

    let p1Prob = roundToHundredth(100*(p1Win/total));
    let p2Prob = roundToHundredth(100*(p2Win/total));
    let tieProb = roundToHundredth(100 - p1Prob - p2Prob);

    document.getElementById("player-1-prob").innerText = `${p1Prob}%`;
    document.getElementById("player-2-prob").innerText = `${p2Prob}%`;
    document.getElementById("tie1").innerText = `Tie: ${tieProb}%`;
    document.getElementById("tie2").innerText = `Tie: ${tieProb}%`;

    document.getElementById("calculate").innerText = "CALCULATE ODDS";
}


function calculateOddsHeavy() {
    let deck = PokerUtils.buildDeck();

    // remove board and player cards
    let cardsToRemove = [...p1Cards, ...p2Cards, ...boardCards].map(card => card.name);
    deck = deck.filter(card => !cardsToRemove.includes(card.name));

    const possibleBoardFillers = PokerUtils.kCombinations(deck, 5 - boardCards.length);
    const numWorkers = navigator.hardwareConcurrency || 4; // Use the number of logical processors
    const workers = [];
    const chunkSize = Math.ceil(possibleBoardFillers.length / numWorkers);
    let completedWorkers = 0;

    let p1Win = 0, p2Win = 0, tie = 0, total = 0;

    // Function to handle worker completion and aggregate results
    function handleWorkerCompletion(event) {
        const { p1Win: wP1Win, p2Win: wP2Win, tie: wTie, total: wTotal } = event.data;

        p1Win += wP1Win;
        p2Win += wP2Win;
        tie += wTie;
        total += wTotal;

        completedWorkers++;

        // Check if all workers are done
        if (completedWorkers === numWorkers) {
            // Clean up workers
            workers.forEach(worker => worker.terminate());

            // Perform final calculations and update UI
            let p1Prob = roundToHundredth(100 * (p1Win / total));
            let p2Prob = roundToHundredth(100 * (p2Win / total));
            let tieProb = roundToHundredth(100 - p1Prob - p2Prob);

            document.getElementById("player-1-prob").innerText = `${p1Prob}%`;
            document.getElementById("player-2-prob").innerText = `${p2Prob}%`;
            document.getElementById("tie1").innerText = `Tie: ${tieProb}%`;
            document.getElementById("tie2").innerText = `Tie: ${tieProb}%`;

            document.getElementById("calculate").innerText = "CALCULATE ODDS";
            document.getElementById("calculate").classList.remove("flashing");
        }
    }

    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker('/js/tools/worker.js');
        workers.push(worker);

        // Determine the slice of work for each worker
        const startIndex = i * chunkSize;
        const endIndex = Math.min(startIndex + chunkSize, possibleBoardFillers.length);

        worker.postMessage({
            startIndex,
            endIndex,
            boardFillers: possibleBoardFillers.slice(startIndex, endIndex),
            boardCards,
            p1Cards,
            p2Cards
        });

        // Listen for messages from the worker
        worker.onmessage = handleWorkerCompletion;

        // Handle worker errors
        worker.onerror = function (error) {
            console.error('Worker error:', error.message, error.filename, error.lineno, error.colno);
        };
    }
}



function clearImages() {
    p1CardsElement = document.getElementById("player-1-cards");
    p2CardsElement = document.getElementById("player-2-cards")
    boardCardsElement = document.getElementById("board-cards")


    while (p1CardsElement.firstChild) {
        p1CardsElement.removeChild(p1CardsElement.firstChild);
    }
    while (p2CardsElement.firstChild) {
        p2CardsElement.removeChild(p2CardsElement.firstChild);
    }
    while (boardCardsElement.firstChild) {
        boardCardsElement.removeChild(boardCardsElement.firstChild);
    }
}

function clearBoard() {
    boardCards = [];

    boardCardsElement = document.getElementById("board-cards")
    while (boardCardsElement.firstChild) {
        boardCardsElement.removeChild(boardCardsElement.firstChild);
    }

    document.getElementById("board-input").value="";
    clearOdds();
}

function clearP1() {
    p1Cards = [];

    p1CardsElement = document.getElementById("player-1-cards");
    while (p1CardsElement.firstChild) {
        p1CardsElement.removeChild(p1CardsElement.firstChild);
    }

    document.getElementById("player-1-input").value="";
    clearOdds();
}

function clearP2() {
    p2Cards = [];

    p2CardsElement = document.getElementById("player-2-cards")
    while (p2CardsElement.firstChild) {
        p2CardsElement.removeChild(p2CardsElement.firstChild);
    }

    document.getElementById("player-2-input").value="";

    clearOdds();
}

function clearAll() {
    clearBoard();
    clearP1();
    clearP2();
}

function clearOdds() {
    document.getElementById("player-1-prob").innerText="";
    document.getElementById("player-2-prob").innerText="";
    document.getElementById("tie1").innerText="";
    document.getElementById("tie2").innerText="";
}


function parseInputToCards(inputVal) {

    inputVal = inputVal.trim();
    let arr = inputVal.split(',');
    arr = arr.map(s => s.trim().toUpperCase());

    const rankSet = new Set(["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "T", "J", "Q", "K"]);
    const suitSet = new Set(["C", "D", "H", "S"]);

    const cardsSet = [];

    for (let i=0; i<arr.length; i++) {
        let pCard = arr[i];
        if (pCard.length == 2) {
            if (rankSet.has(pCard[0]) && suitSet.has(pCard[1])) {
                if (pCard[0] === "T") {
                    cardsSet.push("10" + "-" + pCard[1]);
                } else {
                    cardsSet.push(pCard[0] + "-" + pCard[1]);
                }
            }
        } else if (pCard.length == 3) {
            if (pCard.slice(0, 2) === "10" && suitSet.has(pCard[2])) {
                cardsSet.push("10" + "-" + pCard[2]);
            }
        }
    }

    let cards = [];

    for (const c of cardsSet) {
        let r;
        let s;
        [r, s] = c.split("-");
        r = PokerUtils.rankMap[r];
        s = PokerUtils.suitsMap[s];
        let card = {name: c,
            rank: r,
            suit: s,
        }
        cards.push(card);
    }

    return cards;
}

function errorMessage(string) {
    document.getElementById("error-message").innerText = string;
}

function roundToHundredth(num) {
    return Math.round(num * 100) / 100;
}