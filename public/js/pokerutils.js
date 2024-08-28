class PokerUtils {
    static suitsMap = {"S": 1, "C": 2, "H": 4, "D": 8};
    static rankMap = {"2": 2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "10":10, "J": 11, "Q": 12, "K":13, "A":14};
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
}