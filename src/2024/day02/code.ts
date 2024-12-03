/**
 * Advent of Code solution 2024/day02
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day02 {

    const reportIsSafe = series => series.every((_, i) => i === 0 || [1,2,3].includes(series[i]-series[i-1])) || series.every((_, i) => i === 0 || [-1,-2,-3].includes(series[i]-series[i-1]));

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
            const safe = intInput.filter(series => { 

                let isSafe = reportIsSafe(series);
                if (part === Part.One || isSafe)
                    return isSafe;
                for (var j=0; j<series.length; j++) {
                    const seriesMod = series.slice(0);
                    seriesMod.splice(j,1);
                    isSafe = reportIsSafe(seriesMod);
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