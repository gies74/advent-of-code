/**
 * Advent of Code solution 2017/day03
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

            const target = parseInt(input[0]);
            let c=[0,0], di=0;
            const dir=[[1,0],[0,1], [-1,0], [0,-1]];
            const extremes = [[0,0],[0,0]];
            let num=1;
            while(num < target) {
                const heading = dir[di];
                c[0] = c[0] + heading[0];
                c[1] = c[1] + heading[1];
                if (c[0] < extremes[0][0] || c[0] > extremes[0][1] || c[1] < extremes[1][0] || c[1] > extremes[1][1]) {
                    extremes[0][0] = Math.min(c[0], extremes[0][0]);
                    extremes[0][1] = Math.max(c[0], extremes[0][1]);
                    extremes[1][0] = Math.min(c[1], extremes[1][0]);
                    extremes[1][1] = Math.max(c[1], extremes[1][1]);
                    di = (di + 1) % dir.length;
                }
                num++;
            }
            return Math.abs(c[0]) + Math.abs(c[1]);

        }, "2017", "day03", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}