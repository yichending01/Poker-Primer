let deck;
let cardList;
let bestHand;
let bestHandPlace;

window.onload = function () {
    cardList = [];

    createButtonGrid();

    document.getElementById("clear").addEventListener("click", clear);

    document.getElementById("use-keyboard").addEventListener("click", useKeyboard);

    document.getElementById("use-buttons").addEventListener("click", useButtons);


    let pokerInput = document.getElementById('poker-hand-input');
    pokerInput.addEventListener("input", () => {
        const inputValue = pokerInput.value;
        pokerHandFromInput(inputValue);
    });

}

function createButtonGrid() {
    let ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let suits = ["C", "D", "H", "S"];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < ranks.length; j++) {
            let btnId = ranks[j] + "-" + suits[i]
            let btnImg = document.createElement("img");
            btnImg.src = "/assets/cards/" + btnId + ".png";
            btnImg.id = btnId;
            btnImg.classList.add("cardBtn","not-selected")
            btnImg.addEventListener("click", () => { cardBtn(btnImg) })
            document.getElementById("button-grid").append(btnImg);
        }
    }
}


function cardBtn(btnImg) {
    let btnId = btnImg.id;
    if (btnImg.classList.contains("not-selected")) {
        if (cardList.length >= 10) {
            maxMsg = document.getElementById("max-msg");
            maxMsg.style.display="block";
            maxMsg.classList.remove("flashing");
            void maxMsg.offsetWidth;
            maxMsg.classList.add("flashing");
            return;
        }
        document.getElementById("max-msg").style.display="none";
        btnImg.classList.remove("not-selected");
        btnImg.classList.add("selected");

        let cardImg = document.createElement("img");
        cardImg.id = btnId + "-card";
        cardImg.src = "/assets/cards/" + btnId + ".png";
        cardImg.classList.add("in-best-hand");
        document.getElementById("card-grid").append(cardImg);

        cardList.push({
            name: btnId,
            rank: PokerUtils.rankMap[btnId.split("-")[0]],
            suit: PokerUtils.suitsMap[btnId.split("-")[1]]
        })

    } else {
        document.getElementById("max-msg").style.display="none";

        btnImg.classList.remove("selected");
        btnImg.classList.add("not-selected");
        let cardImg = document.getElementById(btnId + "-card")
        document.getElementById("card-grid").removeChild(cardImg);

        removeItem(cardList, btnId);
    }

    setInputVal();

    if (cardList.length >= 5) {
        clearBestHandClass();
        [bestHand, bestHandPlace] = PokerUtils.findBestHand(cardList);
        document.getElementById("best-hand-eval").innerText = PokerUtils.handTypes[bestHandPlace];
        for (let i=0; i < bestHand.length; i++) {
            card = bestHand[i];
            cardElement = document.getElementById(card.name + "-card");
            cardElement.classList.remove("not-in-best-hand");
            cardElement.classList.add("in-best-hand");
        }
    } else {
        document.getElementById("best-hand-eval").innerText = "";
    }

}


function removeItem(arr, name) {
    for (let i=0; i<arr.length; i++) {
        if (arr[i].name == name) {
            arr.splice(i, 1);
            return;
        }
    }
}


function clearBestHandClass() {
    for (let i=0; i < cardList.length; i++) {
        card = cardList[i];
        cardElement = document.getElementById(card.name + "-card");
        cardElement.classList.remove("in-best-hand");
        cardElement.classList.add("not-in-best-hand");
    }
}


function clear() {

    cardGrid = document.getElementById("card-grid")

    while (cardGrid.firstChild) {
        cardGrid.removeChild(cardGrid.firstChild);
    }

    for (let i=0; i<cardList.length; i++) {
        card = cardList[i];
        cardBtnElement = document.getElementById(card.name);
        cardBtnElement.classList.remove("selected");
        cardBtnElement.classList.add("not-selected");
    }

    cardList = [];

    document.getElementById("best-hand-eval").innerText = "";
    document.getElementById("max-msg").style.display="none";

    document.getElementById('poker-hand-input').value = "";

}

function clearForInput() {

    cardGrid = document.getElementById("card-grid")
    btnGrid = document.getElementById("button-grid");

    for (const child of btnGrid.children) {
        child.classList.remove("selected");
        child.classList.add("not-selected");
    }

    while (cardGrid.firstChild) {
        cardGrid.removeChild(cardGrid.firstChild);
    }

    for (let i=0; i<cardList.length; i++) {
        card = cardList[i];
        cardBtnElement = document.getElementById(card.name);
        cardBtnElement.classList.remove("selected");
        cardBtnElement.classList.add("not-selected");
    }

    document.getElementById("best-hand-eval").innerText = "";
    document.getElementById("max-msg").style.display="none";
}


function pokerHandFromInput(inputVal) {

    parseInputToCards(inputVal);

    if (cardList.length > 10) {
        maxMsg = document.getElementById("max-msg");
        maxMsg.style.display="block";
        maxMsg.classList.remove("flashing");
        void maxMsg.offsetWidth;
        maxMsg.classList.add("flashing");
        return;
    }

    clearForInput();

    document.getElementById("max-msg").style.display="none";

    for (let i=0; i<cardList.length; i++) {
        let card = cardList[i];
        let cardImg = document.createElement("img");
        cardImg.id = card.name + "-card";
        cardImg.src = "/assets/cards/" + card.name + ".png";
        cardImg.classList.add("in-best-hand");
        document.getElementById("card-grid").append(cardImg);

        
        btnElement = document.getElementById(card.name);
        btnElement.classList.add("selected");
        btnElement.classList.remove("not-selected");
    }

    if (cardList.length >= 5) {
        clearBestHandClass();
        [bestHand, bestHandPlace] = PokerUtils.findBestHand(cardList);
        document.getElementById("best-hand-eval").innerText = PokerUtils.handTypes[bestHandPlace];
        for (let i=0; i < bestHand.length; i++) {
            card = bestHand[i];
            cardElement = document.getElementById(card.name + "-card");
            cardElement.classList.remove("not-in-best-hand");
            cardElement.classList.add("in-best-hand");
        }
    } else {
        document.getElementById("best-hand-eval").innerText = "";
    }

}


function parseInputToCards(inputVal) {
    inputVal = inputVal.trim();
    let arr = inputVal.split(',');
    arr = arr.map(s => s.trim().toUpperCase());

    const rankSet = new Set(["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "T", "J", "Q", "K"]);
    const suitSet = new Set(["C", "D", "H", "S"]);

    const cardsSet = new Set();

    for (let i=0; i<arr.length; i++) {
        pCard = arr[i];
        if (pCard.length == 2) {
            if (rankSet.has(pCard[0]) && suitSet.has(pCard[1])) {
                if (pCard[0] === "T") {
                    cardsSet.add("10" + "-" + pCard[1]);
                } else {
                    cardsSet.add(pCard[0] + "-" + pCard[1]);
                }
            }
        } else if (pCard.length == 3) {
            if (pCard.slice(0, 2) === "10" && suitSet.has(pCard[2])) {
                cardsSet.add("10" + "-" + pCard[2]);
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

    cardList = cards;
}

function useKeyboard() {
    inputWrapper = document.getElementById("input-wrapper");
    inputWrapper.style.width = 'var(--btn-grid-width)';
    inputWrapper.style.display="flex";
    document.getElementById('button-grid').style.display = 'none';
    document.getElementById('use-keyboard').style.display="none";
    document.getElementById('use-buttons').style.display="block";
}

function useButtons() {
    document.getElementById('button-grid').style.display = 'grid';
    document.getElementById('use-keyboard').style.display="block";
    document.getElementById('use-buttons').style.display="none";
    document.getElementById('input-wrapper').style.display="none";
}


function setInputVal() {
    let inputElement = document.getElementById('poker-hand-input');
    let valString = "";

    if (cardList.length > 0) {
        for (let i=0; i< cardList.length-1; i++) {
            let card = cardList[i];
            let r;
            let s;
            [r,s] = card.name.split("-");
            valString += r + s + ", ";
        }
        let card = cardList[cardList.length-1];
        let r;
        let s;
        [r,s] = card.name.split("-");
        valString += r + s;
    }

    inputElement.value = valString;
}


// styling code

function updateBtnGridWidth() {
    const btnGrid = document.getElementById('button-grid')
    const computedWidth = btnGrid.scrollWidth; // Get the full width including content

    // Update the CSS variable with the computed width
    document.documentElement.style.setProperty('--btn-grid-width', `${computedWidth}px`);
  }

  // Run the function on load and whenever the window resizes (optional)
  window.addEventListener('load', updateBtnGridWidth);


function updateMobileView() {
    var screenWidth = window.innerWidth;

    if (screenWidth < 900) {
        useKeyboard();
        document.getElementById("use-keyboard").style.display="none";
        document.getElementById("use-buttons").style.display="none";
        inputWrapper.style.width = '90%';
        document.getElementById("instructions-text").innerText = "Type 5-10 cards to begin."
    } else {
        document.getElementById("instructions-text").innerText = "Select or type 5-10 cards. The best hand will be highlighted and shown at the top."
        if (document.getElementById("input-wrapper").style.display === "none") {
            document.getElementById("use-keyboard").style.display="block";
        } else {
            document.getElementById("use-buttons").style.display="block";
        }
    }
}


  window.addEventListener('resize', updateMobileView);
  window.addEventListener('load', updateMobileView);
