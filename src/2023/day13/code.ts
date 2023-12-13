/**
 * Advent of Code solution 2023/day13
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day13 {

    const vScore = (group, diffTarget) => {
        for (var c = 1; c < group[0].length ; c += 1) {
            const numComps = Math.min(c, group[0].length-c);
            const diff = group.map((_, ri) => Array(numComps).fill(0).map((_, ci) => group[ri][c-ci-1] === group[ri][c+ci] ? 0 : 1));
            if (Utils.sum(diff) === diffTarget)
                return c;
        }
        return 0;
    };

    const hScore = (group, diffTarget) => {
        for (var c = 1; c < group.length; c += 1) {
            const numComps = Math.min(c, group.length-c);
            const diff = group[0].split("").map((_, ci) => Array(numComps).fill(0).map((_, ri) => group[c-ri-1][ci] === group[c+ri][ci] ? 0 : 1));
            if (Utils.sum(diff) === diffTarget)
                return c * 100;
        }
        return 0;
    };

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            var chunks = Utils.splitInput(input);
            const diffTarget = part === Part.One ? 0 : 1;

            return Utils.sum(chunks.map(ch => vScore(ch,diffTarget) + hScore(ch,diffTarget)));

        }, "2023", "day13", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}