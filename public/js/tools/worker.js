// worker.js
importScripts('/js/pokerutils.js');

// worker.js
self.onmessage = function (event) {
    try {
        const { startIndex, endIndex, boardFillers, boardCards, p1Cards, p2Cards } = event.data;
        let p1Win = 0, p2Win = 0, tie = 0, total = 0;

        for (let i = startIndex; i < endIndex; i++) {
            const possibleBoard = boardCards.concat(boardFillers[i-startIndex]);
            const possibleP1Cards = p1Cards.concat(possibleBoard);
            const possibleP2Cards = p2Cards.concat(possibleBoard);

            const possibleP1Hand = PokerUtils.findBestHand(possibleP1Cards);
            const possibleP2Hand = PokerUtils.findBestHand(possibleP2Cards);

            if (possibleP1Hand[1] < possibleP2Hand[1]) {
                p1Win++;
            } else if (possibleP1Hand[1] > possibleP2Hand[1]) {
                p2Win++;
            } else {
                const winner = PokerUtils.breakTie(possibleP1Hand[0], possibleP2Hand[0])[1];
                if (winner === 0) {
                    tie++;
                } else if (winner === 1) {
                    p1Win++;
                } else if (winner === 2) {
                    p2Win++;
                }
            }
            total++;
        }

        self.postMessage({ p1Win, p2Win, tie, total });

    } catch (error) {
        console.error('Error in worker:', error.message, error.stack);
        self.postMessage({ error: error.message });
    }
};
