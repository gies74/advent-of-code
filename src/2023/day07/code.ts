/**
 * Advent of Code solution 2023/day07
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day07 {

    enum HandType {
        five_of_a_kind = 0,
        four_of_a_kind = 1,
        full_house = 2,
        three_of_a_kind = 3,
        two_pair = 4,
        one_pair = 5,
        high_card = 6,
    }

    const cardRank = {
        "A": 'a',
        "K": 'b',
        "Q": 'c',
        "J": 'd',
        "T": 'e',
        "9": 'f',
        "8": 'g',
        "7": 'h',
        "6": 'i',
        "5": 'j',
        "4": 'k',
        "3": 'l',
        "2": 'm',
    };

    const cardRank2 = {
        "A": 'a',
        "K": 'b',
        "Q": 'c',
        "T": 'd',
        "9": 'e',
        "8": 'f',
        "7": 'g',
        "6": 'h',
        "5": 'i',
        "4": 'j',
        "3": 'k',
        "2": 'l',
        "J": 'm',
    };

    class Hand {
        deal:string;
        type:HandType;
        sort:string;

        constructor(deal:string, part:Part) {
            this.deal = deal;
            if (part === Part.One) {
                this.type = this.assessHandType();
                this.sort = this.sortMap();
            } else {
                this.type = this.assessHandType2();
                this.sort = this.sortMap2();
            }
        }

        assessHandType() {
            const counts = this.deal.split("").reduce((cnts, card) => {
                cnts[card] = cnts[card] ? cnts[card] + 1 : 1;
                return cnts;
            }, {});
            const amounts = Object.values(counts);
            if (amounts.includes(5))
                return HandType.five_of_a_kind;
            if (amounts.includes(4))
                return HandType.four_of_a_kind;
            if (amounts.includes(3) && amounts.includes(2))
                return HandType.full_house;
            if (amounts.includes(3))
                return HandType.three_of_a_kind;
            if (amounts.filter(a => a == 2).length === 2)
                return HandType.two_pair;
            if (amounts.includes(2))
                return HandType.one_pair;
            return HandType.high_card;
        }

        assessHandType2() {
            const counts = this.deal.split("").filter(c => c !== 'J').reduce((cnts, card) => {
                cnts[card] = cnts[card] ? cnts[card] + 1 : 1;
                return cnts;
            }, {});
            const jokerCount = this.deal.split("").filter(c => c === 'J').length;

            const amounts:number[] = Object.values(counts);
            if (jokerCount === 5 || Math.max(...amounts) + jokerCount === 5)
                return HandType.five_of_a_kind;
            if (Math.max(...amounts) + jokerCount === 4)
                return HandType.four_of_a_kind;
            if (amounts.includes(3) && amounts.includes(2) || amounts.filter(a => a == 2).length === 2 && jokerCount == 1)
                return HandType.full_house;
            if (Math.max(...amounts) + jokerCount === 3)
                return HandType.three_of_a_kind;
            if (amounts.filter(a => a == 2).length === 2)
                return HandType.two_pair;
            if (amounts.includes(2) || jokerCount == 1)
                return HandType.one_pair;
            return HandType.high_card;
        }        

        sortMap() {
            return this.deal.split("").map(c => cardRank[c]).join('');
        }

        sortMap2() {
            return this.deal.split("").map(c => cardRank2[c]).join('');
        }

    }

    class HandBid {
        bid: number;
        hand: Hand;
        constructor(line:string, part:Part) {
            const [handp, bidp] = line.split(" ");
            this.bid = parseInt(bidp);
            this.hand = new Hand(handp, part);
        }
    }

    const sortDeck = (hb1:HandBid, hb2:HandBid) => {
        return hb1.hand.type === hb2.hand.type ? hb2.hand.sort === hb1.hand.sort ? 0 : (hb1.hand.sort > hb2.hand.sort ? -1 : 1) : hb1.hand.type > hb2.hand.type ? -1 : 1;
    }
    

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const deck = input.map(line => new HandBid(line, part));

            deck.sort(sortDeck);
            let answer = deck.reduce((cum, hb, idx) => cum + (idx + 1) * hb.bid, 0);
            return answer;

        }, "2023", "day07", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}