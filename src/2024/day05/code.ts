/**
 * Advent of Code solution 2024/day05
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day05 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const [rules, updates] = Utils.splitInput(input);
            const sorter = (a,b) => rules.includes(a+'|'+b) ? -1 : rules.includes(b+'|'+a) ? 1 : 0;

            let sum=0;
            updates.forEach(update => {
                const sortedPages = update.split(',').slice(0).sort(sorter);
                const sortedUpdate = sortedPages.join(',');
                if ((part === Part.One) == (update === sortedUpdate)) {
                    sum += parseInt(sortedPages[(sortedPages.length-1)/2]);
                }
            });

            return sum;

        }, "2024", "day05", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}