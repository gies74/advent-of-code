/**
 * Advent of Code solution 2025/day09
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day09 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const coords = input.map(l => l.split(",").map(nm => parseInt(nm)));
            let largest = Number.MIN_SAFE_INTEGER;
            let li, lj;
            for (let i=0;i<coords.length-1;i++) {
                for(let j=i+1;j<coords.length;j++) {
                    const area = (1 + Math.abs(coords[j][0] - coords[i][0])) * (1 + Math.abs(coords[j][1] - coords[i][1]));
                    if (area > largest) {
                        largest = area;
                        li = i;
                        lj = j;
                    }
                }
            }

            return largest;

        }, "2025", "day09", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}