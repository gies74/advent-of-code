/**
 * Advent of Code solution 2017/day15
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day15 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            var gen = Array(2);
            gen[0] = parseInt(input[0].replace("Generator A starts with ", ""));
            gen[1] = parseInt(input[1].replace("Generator B starts with ", ""));
            var factors = [16807, 48271];
            var divisors = [4, 8];
            var modder = 0x7fffffff;

            let equal = 0;
            const iterations = (part == Part.One) ? 4E7 : 5E6;
            for (var x=0; x<iterations; x++) {
                if (part == Part.One) {
                    gen.forEach((val,idx) => {
                        gen[idx] = (val * factors[idx]) % modder;
                    });
                } else {
                    gen.forEach((val,idx) => {
                        do {
                            gen[idx] = (gen[idx] * factors[idx]) % modder;
                        }
                        while (gen[idx] % divisors[idx] != 0);
                    });
                }
                if ((gen[0] & 0xffff) === (gen[1] & 0xffff))
                    equal++;
            }

            return equal;

        }, "2017", "day15", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}