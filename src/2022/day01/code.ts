/**
 * Advent of Code solution 2022/day01
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day01 {
    
    /** ADD 2022-day01 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // split input in empty line delimited chunks
            var chunks = Utils.splitInput(input);


            const totals = chunks.map(ch => ch.map(e => parseInt(e)).reduce((agg, elt) => agg + elt, 0));


            if (part == Part.One) {
                /** part 1 specific code here */
                let answerPart1 = Math.max(...totals);

                return answerPart1;
            } else {
                /** part 2 specific code here */
                const sorted = totals.sort((a,b) => b - a);
                let answerPart2 = sorted.slice(0,3).reduce((agg, elt) => agg + elt, 0);
                return answerPart2;
            }

        }, "2022", "day01", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two);
}