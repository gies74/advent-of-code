/**
 * Advent of Code solution 2020/day11
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day11 {
    
    /** ADD 2020-day11 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // split input in empty line delimited subparts
            // var parts = generic.Utils.splitInput(input);

            let answerPart1 = 0;
            let answerPart2 = 0;
            
            const seats = input.map(line => line.split(''));
            const flips = Array(input.length).fill(0).map(r => Array(r.length).fill(false));

            const round = (occup2Leave, direction) => {
                let flipped = 0;
                const adjacent = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
                seats.forEach((row, ri) => {
                    row.forEach((seat, si) => {
                        let countOccupied = 0;
                        adjacent.forEach(delta => {
                            let dist = 1;
                            do {
                                const delta2 = delta.slice(0).map(c => c * dist);
                                if (ri + delta2[0] < 0 || ri + delta2[0] >= seats.length || si + delta2[1] < 0 || si + delta2[1] >= row.length) {
                                    return;
                                }
                                if (seats[ri + delta2[0]][si + delta2[1]] == '.') {
                                    dist++;
                                    continue;
                                }
                                if (seats[ri + delta2[0]][si + delta2[1]] == '#') {
                                    countOccupied++;
                                }
                                break;
                            } while(direction);
                        });
                        flips[ri][si] = seat == 'L' && countOccupied == 0 || seat == '#' && countOccupied >= occup2Leave;
                        flipped += flips[ri][si] ? 1 : 0;
                    });
                });
                seats.forEach((row, ri) => {
                    row.forEach((seat, si) => {
                        seats[ri][si] = !flips[ri][si] ? seats[ri][si] : seats[ri][si] == '#' ? 'L' : '#';
                    });
                });
                return flipped;
            }

            const countOccup = () => {
                return seats.reduce((cum, row) => { 
                    return cum + row.reduce((cum2, seat) => { 
                        const s = cum2 + (seat == '#' ? 1 : 0);
                        return s;
                    }, 0); 
                }, 0);
            };


            if (part == Part.One) {
                while (round(4, false)) {
                    // nothing;
                }

                answerPart1 = countOccup();

                return answerPart1;
            } else {
                while (round(5, true)) {
                    // nothing;
                }

                answerPart2 = countOccup();
                return answerPart2;
            }

        }, "2020", "day11", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two);
}