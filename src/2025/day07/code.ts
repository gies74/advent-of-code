/**
 * Advent of Code solution 2025/day07
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day07 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            let nSplits = 0;

            const manif = input.map(l => l.split(""));
            let indices:{[index:number]:number} = {};
            indices[manif[0].indexOf("S")] = 1;
            manif.slice(1).forEach(row => {
                const newIndices = {};
                Object.entries(indices).forEach(([k, v])=> {
                    const i = parseInt(k);
                    if (row[i] === ".") {
                        if (!newIndices[i])
                            newIndices[i] = 0;
                        newIndices[i] += v;
                    }
                    else if (row[i] === "^") {
                        nSplits++;
                        if (i>0) {
                            if (!newIndices[i-1])
                                newIndices[i-1] = 0;
                            newIndices[i-1] += v;
                        }
                        if (i<row.length-1)
                        {
                            if (!newIndices[i+1])
                                newIndices[i+1] = 0;
                            newIndices[i+1] += v;
                        }
                    }
                });
                indices = newIndices;
            });
            return (part === Part.One) ? nSplits : Object.values(indices).reduce((cum, v) => v + cum, 0);

        }, "2025", "day07", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}