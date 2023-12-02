/**
 * Advent of Code solution 2019/day19
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day19 {
    
    /** ADD 2019-day19 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // part aspecific code here

            // split input in case it has empty line delimited chunks
            // var chunks = Utils.splitInput(input);
            let answerPart1 = 0;
            let answerPart2 = 0;

            if (part == Part.One) {

                // part 1 specific code here

                return answerPart1;

            } else {

                // part 2 specific code here

                return answerPart2;

            }

        }, "2019", "day19", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}