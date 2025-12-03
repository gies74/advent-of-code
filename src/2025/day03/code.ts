/**
 * Advent of Code solution 2025/day03
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day03 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const N = part === Part.One ? 2 : 12;

            const sum = input.reduce((cum, line) => {
                const ints = line.split("").map(c => parseInt(c));
                let posMax = -1;
                let joltage = 0;
                for (let n=N; n>0; n--) {
                    const intsConsidered = ints.slice(posMax+1, ints.length-n+1);
                    const max = Math.max(...intsConsidered);
                    joltage += max * Math.pow(10, n-1);
                    posMax = posMax + intsConsidered.indexOf(max) + 1;
                }
                return cum + joltage;
            }, 0);

            return sum;

        }, "2025", "day03", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}