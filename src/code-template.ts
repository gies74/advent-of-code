/**
 * Advent of Code solution year00/day00
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "./generic";

namespace day00 {
    
    /** ADD year00-day00 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // split input in empty line delimited chunks
            // var chunks = Utils.splitInput(input);

            let answerPart1 = 0;
            let answerPart2 = 0;

            /** ENTER 
             * CODE
             * HERE */

            if (part == Part.One) {
                /** part 1 specific code here */
                return answerPart1;
            } else {
                /** part 2 specific code here */
                return answerPart2;
            }

        }, "year00", "day00", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 0);
}