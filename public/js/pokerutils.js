class PokerUtils {
    static suitsMap = {"S": 1, "C": 2, "H": 4, "D": 8};
    static rankMap = {"2": 2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "10":10, "J": 11, "Q": 12, "K":13, "A":14};
    static rankMapReverse = {2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "Jack", 12: "Queen", 13: "King", 14: "Ace"};
    static handTypes = ["Royal Flush", "Straight Flush", "Four of a Kind", "Full House", "Flush", "Straight", "Three of a Kind", "Two Pair", "Pair", "High Card"];
    static handsMap = {4:9, 5:8, 6:7, 8:6, 2:5, 3:4, 9:3, 0:2, 1:1, 7:0};

    static buildDeck() {
        /* 
        Build deck of cards represented as [str : name, int: rank, str: suit]

        Inputs:
            None
        Outputs:
            array representing deck of cards
        */
        let ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        let suits = ["C", "D", "H", "S"];
        let deck = [];

        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++){
                deck.push({name: ranks[j] + "-" + suits[i],
                           rank: this.rankMap[ranks[j]],
                           suit: this.suitsMap[suits[i]]
                });
            }
        }

        return deck;
    }

    
    static shuffleDeck(deck) {
        /*
        Shuffle the given deck of cards

        Inputs:
            deck: array representing deck of cards
        Outputs:
            shuffled deck
        */
        for (let i=0; i < deck.length; i++) {
            let j = Math.floor(Math.random() * deck.length);
            let temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
        return deck;
    }


    static findBestHand(cards) {
        /*
        Finds best 5-card hand from 7 cards

        Inputs: 
            cards: array containing 7 cards
        Output:
            [arr: hand, int: place] where hand is an array of 5 cards 
            and place is an integer representing the strength of the hand
        */
        let bestHand = [cards[0],cards[1],cards[2],cards[3],cards[4]];
        let bestHandPlace = this.evaluateHand(bestHand);

        let hands = this.kCombinations(cards, 5); // array of all 7C5 total possible hands
        let p;
        for (let i=0; i < hands.length; i++) {
            p = this.evaluateHand(hands[i]) 
            if (p < bestHandPlace) {
                bestHand = hands[i];
                bestHandPlace = p;
            }
            else if (p == bestHandPlace) {
                bestHand = this.breakTie(hands[i], bestHand)[0];
            }
        }

        return [bestHand, bestHandPlace];

    }


    static kCombinations(set, k) {
        /*
        return all possible k-combinations of a set

        Input:
            set: array containing elements of the set
            k: combination number
        Output:
            combs: array containing all possible k-combinations of set
        */
        var combs, head, tailcombs;
        
        // There is no way to take e.g. sets of 5 elements from
        // a set of 4.
        if (k > set.length || k <= 0) {
            return [];
        }
        
        // K-sized set has only one K-sized subset.
        if (k == set.length) {
            return [set];
        }
        
        // There is N 1-sized subsets in a N-sized set.
        if (k == 1) {
            combs = [];
            for (let i = 0; i < set.length; i++) {
                combs.push([set[i]]);
            }
            return combs;
        }

        combs = [];
        for (let i = 0; i < set.length - k + 1; i++) {
            // head is a list that includes only our current element.
            head = set.slice(i, i + 1);
            // We take smaller combinations from the subsequent elements
            tailcombs = this.kCombinations(set.slice(i + 1), k - 1);
            // For each (k-1)-combination we join it with the current
            // and store it to the set of k-combinations.
            for (let j = 0; j < tailcombs.length; j++) {
                combs.push(head.concat(tailcombs[j]));
            }
        }
        return combs;
    }


    static evaluateHand(hand) {
        /* 
        calculates hand place (0 = Royal Flush, ..., 9=High Card)
        
        Inputs:
            hand: array of 5 cards
        Outputs:
            place: int representing hand place
        */
        let cs = [];
        let ss = [];
        for (let k=0; k < 5; k++) {
            cs.push(hand[k].rank);
            ss.push(hand[k].suit);
        }
        let v, i, o, s = 1<<cs[0]|1<<cs[1]|1<<cs[2]|1<<cs[3]|1<<cs[4];
        for (i=-1, v=o=0; i<5; i++, o=Math.pow(2,cs[i]*4)) {v += o*((v/o&15)+1);}
        v = v % 15 - ((s/(s&-s) == 31) || (s == 0x403c) ? 3 : 1);
        v -= (ss[0] == (ss[1]|ss[2]|ss[3]|ss[4])) * ((s == 0x7c00) ? -5 : 1);
        return this.handsMap[v];
    }


    static breakTie(hand1, hand2) {
        /*
        Break ties between same hands

        Inputs:
            hand1: array of 5 cards
            hand2: array of 5 cards
        Outputs:
            hand: winning hand (array of 5 cards)
            winnerInt: 0 if tie, 1 if hand1, 2 if hand2
        */
        let cs1 = [];
        let cs2 = [];
        for (let k=0; k < 5; k++) {
            cs1.push(hand1[k].rank);
            cs2.push(hand2[k].rank);
        }


        let cs1Sorted = this.tieSort(cs1);
        let cs2Sorted = this.tieSort(cs2);

        // check for straight bug
        if (this.arraysEqual(cs1Sorted, [14, 5, 4, 3, 2]) && this.arraysEqual(cs1Sorted, [14, 5, 4, 3, 2])) {
            return [hand1, 0];
        } else if (this.arraysEqual(cs1Sorted, [14, 5, 4, 3, 2])) {
            return [hand2, 2];
        } else if (this.arraysEqual(cs2Sorted, [14, 5, 4, 3, 2])) {
            return [hand1, 1];
        }

        for (let i=0; i < 5; i++) {
            if (cs1Sorted[i] > cs2Sorted[i]) {
                return [hand1, 1];
            }
            else if (cs2Sorted[i] > cs1Sorted[i]) { 
                return [hand2, 2];
            }
        }

        return [hand1, 0];

    }


    static tieSort(ranks) {
        /*
        Sort by frequency then by value to break ties

        Inputs: 
            ranks: array of numbers representing ranks in a hand
        Output:
            sortedRanks: ranks sorted by frequency then value
        */
        const freqMap = new Map();
        for (let num of ranks) {
            freqMap.set(num, (freqMap.get(num) || 0) + 1);
        }

        return ranks.sort(function(x,y) {
            const freqX = freqMap.get(x);
            const freqY = freqMap.get(y);

            if (freqX !== freqY) {
                return freqY - freqX;
            } else {
                return y - x;
            }
        });
    }


    static breakTieMsg(handsPlace, hand1, hand2) {
        /* 
        Takes two hands of the same place and gives a descriptive message about
        how the tie is broken or why it is a tie.

        Inputs:
            handsPlace: int describing the place of the hand in the handsType array
            hand1: array of 5 cards representing a hand
            hand2: array of 5 cards representing a hand of the same type as hand1
        
        Outputs:
            msg: a string containing a descriptive message of the tie(breaker)
        */

        let msg = "no message assigned"; // default for error checking

        let cs1 = [];
        let cs2 = [];
        for (let k=0; k < 5; k++) {
            cs1.push(hand1[k].rank);
            cs2.push(hand2[k].rank);
        }

        let cs1Sorted = this.tieSort(cs1);
        let cs2Sorted = this.tieSort(cs2);

        switch (handsPlace) {
            case 0: // Royal Flush
                msg = "Royal Flush ties Royal Flush";
                break;
            case 1: // Straight Flush
                if (cs1Sorted[0] === cs2Sorted[0]) {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Straight Flush ties ${this.rankMapReverse[cs2Sorted[0]]} high Straight Flush`;
                } else if (cs1Sorted[0] < cs2Sorted[0] && !this.arraysEqual(cs2Sorted, [14, 5, 4, 3, 2])) {
                    msg = `${this.rankMapReverse[cs2Sorted[0]]} high Straight Flush beats ${this.rankMapReverse[cs1Sorted[0]]} high Straight Flush`;
                } else if (cs1Sorted[0] > cs2Sorted[0] && !this.arraysEqual(cs1Sorted, [14, 5, 4, 3, 2])) {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Straight Flush beats ${this.rankMapReverse[cs2Sorted[0]]} high Straight Flush`;
                } else if (cs1Sorted[0] === 14) {
                    msg = `${this.rankMapReverse[cs2Sorted[0]]} high Straight Flush beats ${this.rankMapReverse[cs1Sorted[0]]} high Straight Flush`;
                } else {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Straight Flush beats ${this.rankMapReverse[cs2Sorted[0]]} high Straight Flush`;
                }
                break;
            case 2: // Four of a Kind
                if (cs1Sorted[0] > cs2Sorted[0]) {
                    msg = `Four of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s beats Four of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s`;
                } else if (cs1Sorted[0] < cs2Sorted[0]) {
                    msg = `Four of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s beats Four of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s`;
                } else { // equal, check for kicker
                    if (cs1Sorted[4] > cs2Sorted[4]) {
                        msg = `Four of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[4]]} kicker beats Four of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[4]]} kicker`;
                    } else if (cs1Sorted[4] < cs2Sorted[4]) {
                        msg = `Four of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[4]]} kicker beats Four of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[4]]} kicker`;
                    } else {
                        msg = `Four of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s ties Four of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s`;
                    }
                }
                break;
            case 3: // Full House
                if (cs1Sorted[0] > cs2Sorted[0]) {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]}s full of ${this.rankMapReverse[cs1Sorted[4]]}s Full House beats ${this.rankMapReverse[cs2Sorted[0]]}s full of ${this.rankMapReverse[cs2Sorted[4]]} Full House`;
                } else if (cs1Sorted[0] < cs2Sorted[0]) {
                    msg = `${this.rankMapReverse[cs2Sorted[0]]}s full of ${this.rankMapReverse[cs2Sorted[4]]}s Full House beats ${this.rankMapReverse[cs1Sorted[0]]}s full of ${this.rankMapReverse[cs1Sorted[4]]} Full House`;
                } else if (cs1Sorted[4] > cs2Sorted[4]) { // 3 of a kind equal, look at pair
                    msg = `${this.rankMapReverse[cs1Sorted[0]]}s full of ${this.rankMapReverse[cs1Sorted[4]]}s Full House beats ${this.rankMapReverse[cs2Sorted[0]]}s full of ${this.rankMapReverse[cs2Sorted[4]]} Full House`;
                } else if (cs1Sorted[4] < cs2Sorted[4]) { // 3 of a kind equal, look at pair
                    msg = `${this.rankMapReverse[cs2Sorted[0]]}s full of ${this.rankMapReverse[cs2Sorted[4]]}s Full House beats ${this.rankMapReverse[cs1Sorted[0]]}s full of ${this.rankMapReverse[cs1Sorted[4]]} Full House`;
                } else { // all equal - tie
                    msg = `${this.rankMapReverse[cs2Sorted[0]]}s full of ${this.rankMapReverse[cs2Sorted[4]]}s Full House ties ${this.rankMapReverse[cs1Sorted[0]]}s full of ${this.rankMapReverse[cs1Sorted[4]]} Full House`;
                }
                break;
            case 4: // Flush
                if (cs1Sorted[0] > cs2Sorted[0]) {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Flush beats ${this.rankMapReverse[cs2Sorted[0]]} high Flush`;
                } else if (cs1Sorted[0] < cs2Sorted[0]) {
                    msg = `${this.rankMapReverse[cs2Sorted[0]]} high Flush beats ${this.rankMapReverse[cs1Sorted[0]]} high Flush`;
                } else if (cs1Sorted[1] > cs2Sorted[1]) {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Flush with ${this.rankMapReverse[cs1Sorted[1]]} kicker beats ${this.rankMapReverse[cs2Sorted[0]]} high Flush with ${this.rankMapReverse[cs2Sorted[1]]} kicker`;
                } else if (cs1Sorted[1] < cs2Sorted[1]) {
                    msg = `${this.rankMapReverse[cs2Sorted[0]]} high Flush with ${this.rankMapReverse[cs2Sorted[1]]} kicker beats ${this.rankMapReverse[cs1Sorted[0]]} high Flush with ${this.rankMapReverse[cs1Sorted[1]]} kicker`;
                } else if (cs1Sorted[2] > cs2Sorted[2]) {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Flush with ${this.rankMapReverse[cs1Sorted[2]]} kicker beats ${this.rankMapReverse[cs2Sorted[0]]} high Flush with ${this.rankMapReverse[cs2Sorted[2]]} kicker`;
                } else if (cs1Sorted[2] < cs2Sorted[2]) {
                    msg = `${this.rankMapReverse[cs2Sorted[0]]} high Flush with ${this.rankMapReverse[cs2Sorted[2]]} kicker beats ${this.rankMapReverse[cs1Sorted[0]]} high Flush with ${this.rankMapReverse[cs1Sorted[2]]} kicker`;
                } else if (cs1Sorted[3] > cs2Sorted[3]) {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Flush with ${this.rankMapReverse[cs1Sorted[3]]} kicker beats ${this.rankMapReverse[cs2Sorted[0]]} high Flush with ${this.rankMapReverse[cs2Sorted[3]]} kicker`;
                } else if (cs1Sorted[3] < cs2Sorted[3]) {
                    msg = `${this.rankMapReverse[cs2Sorted[0]]} high Flush with ${this.rankMapReverse[cs2Sorted[3]]} kicker beats ${this.rankMapReverse[cs1Sorted[0]]} high Flush with ${this.rankMapReverse[cs1Sorted[3]]} kicker`;
                } else if (cs1Sorted[4] > cs2Sorted[4]) {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Flush with ${this.rankMapReverse[cs1Sorted[4]]} kicker beats ${this.rankMapReverse[cs2Sorted[0]]} high Flush with ${this.rankMapReverse[cs2Sorted[4]]} kicker`;
                } else if (cs1Sorted[4] < cs2Sorted[4]) {
                    msg = `${this.rankMapReverse[cs2Sorted[0]]} high Flush with ${this.rankMapReverse[cs2Sorted[4]]} kicker beats ${this.rankMapReverse[cs1Sorted[0]]} high Flush with ${this.rankMapReverse[cs1Sorted[4]]} kicker`;
                } else { // equal
                    msg = `${this.rankMapReverse[cs2Sorted[0]]} high Flush ties ${this.rankMapReverse[cs1Sorted[0]]} high Flush`;
                }
                break;
            case 5: // Straight
                if (cs1Sorted[0] === cs2Sorted[0]) {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Straight ties ${this.rankMapReverse[cs2Sorted[0]]} high Straight`;
                } else if (cs1Sorted[0] < cs2Sorted[0] && !this.arraysEqual(cs2Sorted, [14, 5, 4, 3, 2])) {
                    msg = `${this.rankMapReverse[cs2Sorted[0]]} high Straight beats ${this.rankMapReverse[cs1Sorted[0]]} high Straight`;
                } else if (cs1Sorted[0] > cs2Sorted[0] && !this.arraysEqual(cs1Sorted, [14, 5, 4, 3, 2])) {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Straight beats ${this.rankMapReverse[cs2Sorted[0]]} high Straight`;
                } else if (cs1Sorted[0] === 14) {
                    msg = `${this.rankMapReverse[cs2Sorted[0]]} high Straight beats ${this.rankMapReverse[cs1Sorted[0]]} high Straight`;
                } else {
                    msg = `${this.rankMapReverse[cs1Sorted[0]]} high Straight beats ${this.rankMapReverse[cs2Sorted[0]]} high Straight`;
                }
                break;
            case 6: // Three of a Kind
                if (cs1Sorted[0] > cs2Sorted[0]) {
                    msg = `Three of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s beats Three of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s`;
                } else if (cs1Sorted[0] < cs2Sorted[0]) {
                    msg = `Three of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s beats Three of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s`;
                } else if (cs1Sorted[3] > cs2Sorted[3]) { // trips equal, look for kickers
                    msg = `Three of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[3]]} kicker beats Three of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[3]]} kicker`;
                } else if (cs1Sorted[3] < cs2Sorted[3]) { // trips equal, look for kickers
                    msg = `Three of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[3]]} kicker beats Three of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[3]]} kicker`;
                } else if (cs1Sorted[4] > cs2Sorted[4]) { // trips and first kicker equal, look at last kicker
                    msg = `Three of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[4]]} kicker beats Three of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[4]]} kicker`;
                } else if (cs1Sorted[4] < cs2Sorted[4]) { // trips and first kicker equal, look at last kicker
                    msg = `Three of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[4]]} kicker beats Three of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[4]]} kicker`;
                } else { // all cards equal
                    msg = `Three of a Kind ${this.rankMapReverse[cs1Sorted[0]]}s ties Three of a Kind ${this.rankMapReverse[cs2Sorted[0]]}s`;
                }
                break;
            case 7: // Two Pair
                if (cs1Sorted[0] > cs2Sorted[0]) {
                    msg = `Two Pair of ${this.rankMapReverse[cs1Sorted[0]]}s and ${this.rankMapReverse[cs1Sorted[2]]}s beats Two Pair of ${this.rankMapReverse[cs2Sorted[0]]}s and ${this.rankMapReverse[cs2Sorted[2]]}s`;
                } else if (cs1Sorted[0] < cs2Sorted[0]) {
                    msg = `Two Pair of ${this.rankMapReverse[cs2Sorted[0]]}s and ${this.rankMapReverse[cs2Sorted[2]]}s beats Two Pair of ${this.rankMapReverse[cs1Sorted[0]]}s and ${this.rankMapReverse[cs1Sorted[2]]}s`;
                } else if (cs1Sorted[2] > cs2Sorted[2]) {
                    msg = `Two Pair of ${this.rankMapReverse[cs1Sorted[0]]}s and ${this.rankMapReverse[cs1Sorted[2]]}s beats Two Pair of ${this.rankMapReverse[cs2Sorted[0]]}s and ${this.rankMapReverse[cs2Sorted[2]]}s`;
                } else if (cs1Sorted[2] < cs2Sorted[2]) {
                    msg = `Two Pair of ${this.rankMapReverse[cs2Sorted[0]]}s and ${this.rankMapReverse[cs2Sorted[2]]}s beats Two Pair of ${this.rankMapReverse[cs1Sorted[0]]}s and ${this.rankMapReverse[cs1Sorted[2]]}s`;
                } else if (cs1Sorted[4] > cs2Sorted[4]) {
                    msg = `Two Pair of ${this.rankMapReverse[cs1Sorted[0]]}s and ${this.rankMapReverse[cs1Sorted[2]]}s with ${this.rankMapReverse[cs1Sorted[4]]} kicker beats Two Pair of ${this.rankMapReverse[cs2Sorted[0]]}s and ${this.rankMapReverse[cs2Sorted[2]]}s with ${this.rankMapReverse[cs2Sorted[4]]} kicker`;
                } else if (cs1Sorted[4] < cs2Sorted[4]) {
                    msg = `Two Pair of ${this.rankMapReverse[cs2Sorted[0]]}s and ${this.rankMapReverse[cs2Sorted[2]]}s with ${this.rankMapReverse[cs2Sorted[4]]} kicker beats Two Pair of ${this.rankMapReverse[cs1Sorted[0]]}s and ${this.rankMapReverse[cs1Sorted[2]]}s with ${this.rankMapReverse[cs1Sorted[4]]} kicker`;
                } else { // all equal - tie
                    msg = `Two Pair of ${this.rankMapReverse[cs1Sorted[0]]}s and ${this.rankMapReverse[cs1Sorted[2]]}s ties Two Pair of ${this.rankMapReverse[cs2Sorted[0]]}s and ${this.rankMapReverse[cs2Sorted[2]]}s`;
                }
                break;
            case 8: // Pair
                if (cs1Sorted[0] > cs2Sorted[0]) {
                    msg = `Pair of ${this.rankMapReverse[cs1Sorted[0]]}s beats Pair of ${this.rankMapReverse[cs2Sorted[0]]}s`;
                } else if (cs1Sorted[0] < cs2Sorted[0]) {
                    msg = `Pair of ${this.rankMapReverse[cs2Sorted[0]]}s beats Pair of ${this.rankMapReverse[cs1Sorted[0]]}s`;
                } else if (cs1Sorted[2] > cs2Sorted[2]) { // pairs equal, look for kickers
                    msg = `Pair of ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[2]]} kicker beats Pair of ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[2]]} kicker`;
                } else if (cs1Sorted[2] < cs2Sorted[2]) { // pairs equal, look for kickers
                    msg = `Pair of ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[2]]} kicker beats Pair of ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[2]]} kicker`;
                } else if (cs1Sorted[3] > cs2Sorted[3]) { // pairs and first kicker equal, look at next kicker
                    msg = `Pair of ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[3]]} kicker beats Pair of ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[3]]} kicker`;
                } else if (cs1Sorted[3] < cs2Sorted[3]) { // trips and first kicker equal, look at last kicker
                    msg = `Pair of ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[3]]} kicker beats Pair of ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[3]]} kicker`;
                } else if (cs1Sorted[4] > cs2Sorted[4]) {
                    msg = `Pair of ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[4]]} kicker beats Pair of ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[4]]} kicker`;
                } else if(cs1Sorted[4] < cs2Sorted[4]) {
                    msg = `Pair of ${this.rankMapReverse[cs2Sorted[0]]}s with ${this.rankMapReverse[cs2Sorted[4]]} kicker beats Pair of ${this.rankMapReverse[cs1Sorted[0]]}s with ${this.rankMapReverse[cs1Sorted[4]]} kicker`;
                } else { // all cards equal
                    msg = `Pair of ${this.rankMapReverse[cs1Sorted[0]]}s ties Pair of ${this.rankMapReverse[cs2Sorted[0]]}s`;
                }
                break;
            case 9: // High Card
                if (cs1Sorted[0] > cs2Sorted[0]) {
                    msg = `High Card ${this.rankMapReverse[cs1Sorted[0]]} beats High Card ${this.rankMapReverse[cs2Sorted[0]]}`;
                } else if (cs1Sorted[0] < cs2Sorted[0]) {
                    msg = `High Card ${this.rankMapReverse[cs2Sorted[0]]} beats High Card ${this.rankMapReverse[cs1Sorted[0]]}`;
                } else if (cs1Sorted[1] > cs2Sorted[1]) {
                    msg = `High Card ${this.rankMapReverse[cs1Sorted[0]]} with ${this.rankMapReverse[cs1Sorted[1]]} kicker beats High Card ${this.rankMapReverse[cs2Sorted[0]]} with ${this.rankMapReverse[cs2Sorted[1]]} kicker`;
                } else if (cs1Sorted[1] < cs2Sorted[1]) {
                    msg = `High Card ${this.rankMapReverse[cs2Sorted[0]]} with ${this.rankMapReverse[cs2Sorted[1]]} kicker beats High Card ${this.rankMapReverse[cs1Sorted[0]]} with ${this.rankMapReverse[cs1Sorted[1]]} kicker`;
                } else if (cs1Sorted[2] > cs2Sorted[2]) {
                    msg = `High Card ${this.rankMapReverse[cs1Sorted[0]]} with ${this.rankMapReverse[cs1Sorted[2]]} kicker beats High Card ${this.rankMapReverse[cs2Sorted[0]]} with ${this.rankMapReverse[cs2Sorted[2]]} kicker`;
                } else if (cs1Sorted[2] < cs2Sorted[2]) {
                    msg = `High Card ${this.rankMapReverse[cs2Sorted[0]]} with ${this.rankMapReverse[cs2Sorted[2]]} kicker beats High Card ${this.rankMapReverse[cs1Sorted[0]]} with ${this.rankMapReverse[cs1Sorted[2]]} kicker`;
                } else if (cs1Sorted[3] > cs2Sorted[3]) {
                    msg = `High Card ${this.rankMapReverse[cs1Sorted[0]]} with ${this.rankMapReverse[cs1Sorted[3]]} kicker beats High Card ${this.rankMapReverse[cs2Sorted[0]]} with ${this.rankMapReverse[cs2Sorted[3]]} kicker`;
                } else if (cs1Sorted[3] < cs2Sorted[3]) {
                    msg = `High Card ${this.rankMapReverse[cs2Sorted[0]]} with ${this.rankMapReverse[cs2Sorted[3]]} kicker beats High Card ${this.rankMapReverse[cs1Sorted[0]]} with ${this.rankMapReverse[cs1Sorted[3]]} kicker`;
                } else if (cs1Sorted[4] > cs2Sorted[4]) {
                    msg = `High Card ${this.rankMapReverse[cs1Sorted[0]]} with ${this.rankMapReverse[cs1Sorted[4]]} kicker beats High Card ${this.rankMapReverse[cs2Sorted[0]]} with ${this.rankMapReverse[cs2Sorted[4]]} kicker`;
                } else if (cs1Sorted[4] < cs2Sorted[4]) {
                    msg = `High Card ${this.rankMapReverse[cs2Sorted[0]]} with ${this.rankMapReverse[cs2Sorted[4]]} kicker beats High Card ${this.rankMapReverse[cs1Sorted[0]]} with ${this.rankMapReverse[cs1Sorted[4]]} kicker`;
                } else {
                    msg = `High Card ${this.rankMapReverse[cs1Sorted[0]]} ties High Card ${this.rankMapReverse[cs2Sorted[0]]}`;
                }
                break;
        }

        return msg;

    }

    static arraysEqual(arr1, arr2) {
        /*
        Checks if two arrays are equal (have the same entries in the same order)

        Inputs: 
            arr1: array
            arr2: array
        Output:
            equal: bool
        */

        // First check if the arrays have the same length
        if (arr1.length !== arr2.length) {
          return false;
        }
      
        // Then check if every element in the arrays is equal
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) {
            return false;
          }
        }
      
        // If all checks pass, the arrays are equal
        return true;
      }
}



  