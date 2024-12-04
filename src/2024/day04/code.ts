/**
 * Advent of Code solution 2024/day04
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day04 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const dirs = Utils.multiDimOffsets(2, false);
            const XMAS = "XMAS".split("");
            const MS = "MS".split("");
            const ln = XMAS.length;

            let count = 0;
            input.forEach((row, ri) => {
                row.split('').forEach((char, ci) => {
                    if (part === Part.One) {
                        if (char !== "X")
                            return;
                        dirs.forEach(dir => {
                            const yspan = ri + (ln - 1) * dir[0];
                            const xspan = ci + (ln - 1) * dir[1];
                            if (yspan < 0 || xspan < 0 || yspan >= input.length || xspan >= input[0].length)
                                return;
                            if (XMAS.every((l,i) => l === input[ri + i * dir[0]][ci + i * dir[1]]))
                                count++;
                        });
                    } else {
                        if (char !== "A" || ri < 1 || ci < 1 || ri >= input.length - 1 || ci >= input[0].length - 1)
                            return;
                        const lb = input[ri - 1][ci - 1], rb = input[ri - 1][ci + 1], lo = input[ri + 1][ci - 1], ro = input[ri + 1][ci + 1];
                        if (MS.every(l => [lb, ro].includes(l) && [lo, rb].includes(l)))
                            count++;
                    }
                });
            })

            return count;

        }, "2024", "day04", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}