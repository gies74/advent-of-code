/**
 * Advent of Code solution 2022/day03
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day03 {

    const charCode = (c) => {
        if (/[A-Z]/.test(c)) {
            return 26 + c.charCodeAt(0) - "A".charCodeAt(0) + 1;
        }
        if (/[a-z]/.test(c)) {
            return c.charCodeAt(0) - "a".charCodeAt(0) + 1;
        }
        return -1;
    }
    
    
    /** ADD 2022-day03 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            let sum = 0;

            if (part == Part.One) {

                for (var line of input) {
                    var items = line.split('');
                    const comp1 = new Set(items.slice(0, items.length/2));
                    const comp2 = new Set(items.slice(items.length/2));
                    const comItem = [...Utils.getIntersection(comp1, comp2)][0];
                    sum += charCode(comItem);
                }
    
                let answerPart1 = sum;    

                return answerPart1;

            } else {

                for (var i=0; i<input.length;i+=3) {
                    const comp1 = new Set(input[i].split(''));
                    const comp2 = new Set(input[i+1].split(''));
                    const comp3 = new Set(input[i+2].split(''));
                    const comItem = [...Utils.getIntersection(Utils.getIntersection(comp1, comp2), comp3)][0]
                    sum += charCode(comItem);
                }
    
                let answerPart2 = sum;    

                return answerPart2;
                
            }

        }, "2022", "day03", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}