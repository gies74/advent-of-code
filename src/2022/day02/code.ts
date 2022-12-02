/**
 * Advent of Code solution 2022/day02
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day02 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const elveTurn = { "A": "Rock", "B": "Paper", "C": "Scissors" }
            const game = {
                "Rock": { "beats": "Scissors", "score": 1 },
                "Paper": { "beats": "Rock", "score": 2 },
                "Scissors": { "beats": "Paper", "score": 3 }
            };

            let score = 0;
            if (part == Part.One) {
                const myTurn = { "X": "Rock", "Y": "Paper", "Z": "Scissors" }
                for (var line of input) {
                    const [elve, my] = line.split(' ');
                    const eHand = elveTurn[elve];
                    const mHand = myTurn[my];
                    score += game[mHand].score;
                    score += (mHand == eHand) ? 3 : game[mHand].beats == eHand ? 6 : 0;
                }
            } else {
                const winscore = { "X": 0, "Y": 3, "Z": 6 };
                for (var line of input) {
                    const [elve, my] = line.split(' ');
                    const eHand = elveTurn[elve];
                    const mWinscore = winscore[my];
                    score += mWinscore == 3 ? game[eHand].score : mWinscore == 0 ? game[game[eHand].beats].score : game[game[game[eHand].beats].beats].score;
                    score += mWinscore;
                }
            }
            return score;            

        }, "2022", "day02",
        // set this switch to Part.Two once you've finished part one.
        Part.Two);
}
