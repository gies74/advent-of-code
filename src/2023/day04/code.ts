/**
 * Advent of Code solution 2023/day04
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day04 {

    class Card {
        id: number;
        intersect: number;
        constructor(line) {
            const [_n, _0, sId, _1, sWin, _2, sNum] = line.split(/(Card +|: +| \| +)/);
            this.id = parseInt(sId.replace(/Card +/, ""));
            const winning = sWin.split(/ +/g).map(n => parseInt(n));
            const numbers = sNum.split(/ +/g).map(n => parseInt(n));
            this.intersect = Utils.getIntersection(new Set(winning), new Set(numbers)).size;
        }

        score() {
            return this.intersect === 0 ? 0 : Math.pow(2, this.intersect - 1);
        }

        score2(deck) {

            return 1 + Utils.sum(Array(this.intersect).fill(0).map((c,ci) => {
                return (this.id + ci >= deck.length) ? 0 : deck[this.id + ci].score2(deck);
            }, this));

        }
    }
    
    /** ADD 2023-day04 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            const deck = input.map(l => new Card(l));

            if (part == Part.One) {

                let answerPart1 = Utils.sum(deck.map(c => c.score()));

                return answerPart1;

            } else {

                let answerPart2 = Utils.sum(deck.map(c => c.score2(deck)));

                // part 2 specific code here

                return answerPart2;

            }

        }, "2023", "day04", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}