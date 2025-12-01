/**
 * Advent of Code solution 2017/day01
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day01 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const list = input[0].split("").map(c => parseInt(c));
            const positions2LookAhead = (part == Part.One) ? 1 : list.length / 2;
            return list.reduce((sum, elt, i) => sum + (elt === list[(i + positions2LookAhead) % list.length] ? elt : 0), 0);

        }, "2017", "day01",
        // set this switch to Part.Two once you've finished part one.
        Part.One,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}