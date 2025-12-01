/**
 * Advent of Code solution 2017/day02
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

            const inputInt = input.map(line => line.split("\t").map(c => parseInt(c)));
            let res;
            if (part == Part.One)
                res = inputInt.reduce((s, line) => {
                    const max = Math.max(...line);
                    const min = Math.min(...line);
                    return s + max - min;
                }, 0);
            else {
                res = inputInt.reduce((s, line) => {
                    for (let i0=0; i0<line.length-1;i0++)
                        for(let i1=i0+1; i1<line.length;i1++) {
                            const max = Math.max(line[i0], line[i1]);
                            const min = Math.min(line[i0], line[i1])
                            if (max % min == 0)
                                return s + (max / min);
                        }
                    throw "no pair??"
                }, 0);

            }

            return res;

        }, "2017", "day02", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}