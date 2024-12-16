/**
 * Advent of Code solution 2024/day11
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day11 {

    const stoneMemory = {}
    const stoneDepthMemory = {}

    const stoneLookup = (engravings:string[], depth) => {

        if (depth === 0)
            return engravings.length;

        return engravings.reduce((cum, engraving) => {
            if (!stoneDepthMemory[engraving])
                stoneDepthMemory[engraving] = {};
            if (!stoneDepthMemory[engraving][depth]) {

                if (!stoneMemory[engraving]) {
                    if (engraving === "0")
                        stoneMemory[engraving] = ["1"];
                    else if (engraving.length % 2 === 0) {
                        stoneMemory[engraving] = [engraving.substring(0, engraving.length/2), String(parseInt(engraving.substring(engraving.length/2)))];
                    } else
                        stoneMemory[engraving] = [String(parseInt(engraving) * 2024)];
                }
                const numStones = stoneLookup(stoneMemory[engraving], depth-1);
                stoneDepthMemory[engraving][depth] = numStones;
            }

            return cum + stoneDepthMemory[engraving][depth];

        }, 0);
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

            const stones = input[0].split(" ");

            const v = stoneLookup(stones, part === Part.One ? 25 : 75);
            return v;
        }, "2024", "day11", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}