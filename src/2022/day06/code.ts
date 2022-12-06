/**
 * Advent of Code solution 2022/day06
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day06 {
    
    /** ADD 2022-day06 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // part aspecific code here
            const SIZE= part == Part.One ? 4 : 14;
            let i=0;
            const signal = input[0].split('');
            for (i=SIZE; i<signal.length;i++) {
                const num = (new Set(signal.slice(i-SIZE, i))).size;
                if (num === SIZE) {
                    break;
                }
            }

            return i;

        }, "2022", "day06", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}