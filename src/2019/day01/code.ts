/**
 * Advent of Code solution 2019/day01
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day01 {
    
    /** ADD 2019-day01 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

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
            var inputI = input.map(str => parseInt(str));


            const calcF1 = m => Math.floor(m / 3) - 2;

            if (part == Part.One) {

                // part 1 specific code here
                return inputI.map(calcF1).reduce((cum, elt) => cum + elt, 0);

            } else {
                const calcF2 = m => {
                    let totModuleFuel = 0;
                    let addtnlFuel = calcF1(m);
                    while (addtnlFuel >= 0) {
                        totModuleFuel += addtnlFuel;
                        addtnlFuel = calcF1(addtnlFuel);
                    }
                    return totModuleFuel;
                };

                return inputI.map(calcF2).reduce((cum, elt) => cum + elt, 0);

            }


        }, "2019", "day01", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}