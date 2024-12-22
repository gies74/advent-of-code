/**
 * Advent of Code solution 2024/day22
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day22 {

    const PRUNE = ((1 << 24) - 1);

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            
            const total = input.reduce((cum, line) => {
                let secret = parseInt(line);
                Array(2000).fill(null).forEach(_ => {
                    secret = ((secret << 6) ^ secret) & PRUNE;
                    secret = ((secret >> 5) ^ secret) & PRUNE;
                    secret = ((secret << 11) ^ secret) & PRUNE;                    
                });
                return cum + secret;
            }, 0);

            return total;

        }, "2024", "day22", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}