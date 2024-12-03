/**
 * Advent of Code solution 2024/day03
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

            let sum = 0;
            let enable = true;
            input.forEach(line => {
                const matches = line.matchAll(/do(n't)?\(\)|mul\((\d+),(\d+)\)/g);
                let match;
                while (!(match = matches.next()).done) {
                    if (/do/.test(match.value[0])) {
                        enable = true;
                        if (/don't/.test(match.value[0]))
                            enable = part === Part.One;
                        continue;
                    }
                    if (!enable)
                        continue;
                    sum += parseInt(match.value[2]) * parseInt(match.value[3]);
                }


            });
            return sum;

        }, "2024", "day03", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}