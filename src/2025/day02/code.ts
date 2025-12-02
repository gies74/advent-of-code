/**
 * Advent of Code solution 2025/day02
 * (c) 2022-2024 Gies Bouwman
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
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const ranges = input[0].split(",").map(sr => sr.split("-").map(el => parseInt(el)));
            let sum = 0;
            const pattern = (part === Part.One) ? /^(\d+)\1$/ : /^(\d+)\1+$/;
            for (var range of ranges) {
                for (var n=range[0]; n<=range[1]; n++) {
                    const strn = String(n);
                    if (pattern.test(strn))
                        sum += n;
                }
            }
            return sum;

        }, "2025", "day02", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}