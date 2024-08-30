let deck;
let cardList;
let bestHand;
let bestHandPlace;

window.onload = function () {
    cardList = [];

    createButtonGrid();

    document.getElementById("clear").addEventListener("click", clear);
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
  window.addEventListener('resize', updateBtnGridWidth);