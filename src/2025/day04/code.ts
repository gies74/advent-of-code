/**
 * Advent of Code solution 2025/day04
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

            const grid = input.map(line => line.split(""));
            const offs = Utils.multiDimOffsets(2, false);
            let cnt = 0;
            const toRemove = [];
            while (cnt === 0 || toRemove.length > 0) {
                let c;
                while (c = toRemove.shift()) {
                    grid[c[0]][c[1]] = ".";
                }
                grid.forEach((row, ri) => row.forEach((cell, ci) => {
                    if (cell === "@" && offs.filter(off => {
                        const rowIdx = ri + off[0];
                        const colIdx = ci + off[1];
                        return rowIdx >= 0 && rowIdx <= grid.length-1 && colIdx >= 0 && colIdx <= grid[0].length && grid[rowIdx][colIdx] === "@";
                    }).length < 4) {
                        cnt++;
                        toRemove.push([ri, ci]);
                    }
                }));
                if (part === Part.One)
                    break;
            }

            return cnt;

        }, "2025", "day04", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}