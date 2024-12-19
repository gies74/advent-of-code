/**
 * Advent of Code solution 2024/day19
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day19 {

    const known = {};

    const test = (restLinnen:string, patterns:RegExp[]):number => {
        if (restLinnen === "")
            return 1;
        if (known[restLinnen] !== undefined)
            return known[restLinnen];
        let count=0;
        for (var pattern of patterns) {
            if (pattern.test(restLinnen)) {
                count += test(restLinnen.replace(pattern, ""), patterns);
            }
        }
        known[restLinnen] = count;
        return count;
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

            const [patterns, linnen] = Utils.splitInput(input);
            const res = patterns[0].split(", ").sort((a,b) => b.length - a.length).map(str => new RegExp(`^${str}`));

            let cnt = 0;
            for (var lin of linnen) {
                cnt += test(lin, res);
            }

            return cnt;

        }, "2024", "day19", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}