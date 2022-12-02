/**
 * Advent of Code solution 2022/day02
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day02 {

    /** ADD 2022-day02 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

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


            if (part == Part.One) {
                const myTurn = { "X": "Rock", "Y": "Paper", "Z": "Scissors" }
                let score = 0;
                for (var line of input) {
                    const [elve, my] = line.split(' ');
                    const eO = elveTurn[elve];
                    const mO = myTurn[my];
                    score += game[mO].score;
                    score += (mO == eO) ? 3 : game[mO].beats == eO ? 6 : 0;
                }
                let answerPart1 = score;
                return answerPart1;
            } else {
                let score = 0;
                const myWinscore = { "X": 0, "Y": 3, "Z": 6 };
                for (var line of input) {
                    const [elve, my] = line.split(' ');
                    const eO = elveTurn[elve];
                    const mWs = myWinscore[my];
                    score += mWs == 3 ? game[eO].score : mWs == 0 ? game[game[eO].beats].score : game[game[game[eO].beats].beats].score;
                    score += myWinscore[my];
                }
                let answerPart2 = score;
                return answerPart2;
            }

        }, "2022", "day02",
        // set this switch to Part.Two once you've finished part one.
        Part.Two);
}