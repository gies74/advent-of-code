/**
 * Advent of Code solution 2025/day05
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day05 {

    const combine =(r1:number[], r2:number[]):number[][] => {
        if (r1[1] < r2[0] || r2[1] < r1[0])
            return [r1, r2];
        return [[Math.min(r1[0],r2[0]), Math.max(r1[1], r2[1])]];
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const [p1, p2] = Utils.splitInput(input);
            const ranges = p1.map(line => line.split("-").map(e => parseInt(e)));
            let count;

            if (part === Part.One) {
                const ids = p2.map(line => parseInt(line));
                count = ids.filter(id => {
                    return ranges.some(r => r[0] <= id && id <= r[1]);
                }).length;

            } else {

                let cntRangesPrev = Number.MAX_SAFE_INTEGER;
                while (ranges.length < cntRangesPrev) {
                    let forsBreak = false;                
                    cntRangesPrev = ranges.length;
                    for (let i=ranges.length-1;i>0;i--) {
                        for (let j=i-1; j>=0; j--) {
                            const combination = combine(ranges[i], ranges[j]);
                            if (combination.length === 1) {
                                ranges.splice(i, 1);
                                ranges.splice(j, 1);
                                ranges.push(combination[0]);
                                forsBreak = true;
                                break;
                            }
                        }
                        if (forsBreak)
                            break;
                    }
                }
                count = ranges.reduce((cum, r) => cum + r[1] - r[0] + 1, 0);
            }

            return count;

        }, "2025", "day05", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}