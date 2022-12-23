/**
 * Advent of Code solution 2022/day23
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day23 {

    const adjacent = Utils.multiDimOffsets(2, false);

    const deltas = [
        [[-1, -1], [-1, 0], [-1, 1]],
        [[1, -1], [1, 0], [1, 1]],
        [[-1, -1], [0, -1], [1, -1]],
        [[-1, 1], [0, 1], [1, 1]]
    ];

    class Elve {
        x: number;
        y: number;
        intendedDeltaStep: number[];
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    const ROUNDS = 1000;

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const elves: Elve[] = [];

            input.forEach((l, li) => {
                l.split('').forEach((c, ci) => {
                    if (c === "#") {
                        elves.push(new Elve(ci + ROUNDS / 4, li + ROUNDS / 4));
                    }
                });
            });

            let processContinues = true;

            let answerPart2 = 0;

            for (var round = 0; processContinues && round < ROUNDS; round++) {

                const currPos = Array(input.length + .5 * ROUNDS).fill(0).map(() => Array(input[0].length + .5 * ROUNDS).fill(false));
                elves.forEach(e => { currPos[e.y][e.x] = true; });

                const proposal = Array(input.length + .5 * ROUNDS).fill(0).map(() => Array(input[0].length + .5 * ROUNDS).fill(0));

                // first half: speak out intentions
                processContinues = false;
                for (var elve of elves) {

                    elve.intendedDeltaStep = [0, 0];

                    if (adjacent.every(offset => !currPos[elve.y + offset[0]][elve.x + offset[1]])) {
                        continue;
                    }

                    processContinues = true;

                    for (var i = 0; i < 4; i++) {
                        const delta = deltas[(round + i) % deltas.length];
                        if (delta.every(offset => !currPos[elve.y + offset[0]][elve.x + offset[1]])) {
                            elve.intendedDeltaStep = [delta[1][0], delta[1][1]];
                            proposal[elve.y + elve.intendedDeltaStep[0]][elve.x + elve.intendedDeltaStep[1]]++;
                            break;
                        }
                    }

                }

                // console.log(`Round ${round}\n` + currPos.map((row,ri) => `'000' + ${ri}`.slice(-3) + ' ' + row.map((c,ci) => c ? '#' :  proposal[ri][ci] === 0 ? '.' : proposal[ri][ci]).join('')).join("\n"));
                if (!processContinues) {
                    answerPart2 = round + 1;
                    continue;
                }

                // second half: move where allowed
                for (var elve of elves) {
                    if (proposal[elve.y + elve.intendedDeltaStep[0]][elve.x + elve.intendedDeltaStep[1]] === 1) {
                        elve.y += elve.intendedDeltaStep[0];
                        elve.x += elve.intendedDeltaStep[1];
                    }
                }

                if (part === Part.One && round === 9) {
                    processContinues = false;
                }

            }

            if (part == Part.One) {

                const extremes = [
                    Math.min(...elves.map(e => e.x)),
                    Math.max(...elves.map(e => e.x)),
                    Math.min(...elves.map(e => e.y)),
                    Math.max(...elves.map(e => e.y)),
                ];

                let answerPart1 = (extremes[1] - extremes[0] + 1) * (extremes[3] - extremes[2] + 1) - elves.length;

                return answerPart1;

            } else {

                return answerPart2;

            }

        }, "2022", "day23",
        // set this switch to Part.Two once you've finished part one.
        Part.One,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}