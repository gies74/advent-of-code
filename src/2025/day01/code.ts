/**
 * Advent of Code solution 2025/day01
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day01 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const rotations = input.map(c => parseInt(c.replace("L", "-").replace("R", "")));
            let state = 50;
            let cnt0 = 0;
            for (var rot of rotations) {
                if (part == Part.One) {
                    state = (state + rot + 100) % 100;
                    if (state === 0)
                        cnt0++;
                } else {
                    state = state + rot;
                    while (state >= 100) {
                        state -= 100;
                        cnt0++;
                    }
                    while (state < 0) {
                        state += 100;
                        cnt0++;
                    }
                }
            }
            return cnt0;

        }, "2025", "day01", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}