/**
 * Advent of Code solution 2024/day02
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

            const intInput = input.map(line => line.split(" ").map(nm => parseInt(nm)));
            const safe = intInput.filter(row => { 

                let isSafe = row.every((nm, i) => i === 0 || [1,2,3].includes(row[i]-row[i-1])) || row.every((nm, i) => i === 0 || [-1,-2,-3].includes(row[i]-row[i-1]));
                if (part === Part.One || isSafe)
                    return isSafe;
                for (var j=0; j<row.length; j++) {
                    const rowMod = row.slice(0);
                    rowMod.splice(j,1);
                    isSafe = rowMod.every((nm, i) => i === 0 || [1,2,3].includes(rowMod[i]-rowMod[i-1])) || rowMod.every((nm, i) => i === 0 || [-1,-2,-3].includes(rowMod[i]-rowMod[i-1]));
                    if (isSafe)
                        return true;
                }
                return false;
            });

            return safe.length;
        }, "2024", "day02", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}