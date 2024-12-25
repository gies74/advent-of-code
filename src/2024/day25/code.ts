/**
 * Advent of Code solution 2024/day25
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day25 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const lockskeys = Utils.splitInput(input);
            const locks = [];
            const keys = [];
            lockskeys.forEach(chunk => {
                const heights = chunk.map(line => line.split("")).reduce((totals, row) => {
                    row.forEach((c,ci) => { 
                        totals[ci] += (c==="#" ? 1 : 0);
                    });
                    return totals;
                 }, Array(chunk[0].length).fill(-1));
                 if (chunk[0] === "#####")
                    locks.push(heights);
                else
                    keys.push(heights);
            });

            let fits = 0;
            for (var lock of locks) {
                for (var key of keys) {
                    const sumHeights = lock.map((height, ci) => height + key[ci]);
                    if (sumHeights.every(h => h <= 5))
                        fits++;
                }
            }

            return fits;

        }, "2024", "day25", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}