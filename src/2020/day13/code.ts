/**
 * Advent of Code solution 2020/day13
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day13 {
    
    /** ADD 2020-day13 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            let answerPart1 = 0;
            let answerPart2 = 0;

            // input[1] = "1789,37,47,1889";

            const busLines = input[1].split(',').filter(elt => elt != 'x').map(elt => parseInt(elt));

            const multipliers = [0];

            if (part == Part.One) {
                const depTime = parseInt(input[0]);
                const waitTimes = busLines.map(bl => bl - depTime % bl);
                const minWaitTime = Math.min(...waitTimes);
                const busLineMinWaitTime = busLines[waitTimes.indexOf(minWaitTime)];
                    answerPart1 = busLineMinWaitTime * minWaitTime;
                return answerPart1;
            } else {
                const busLinesX = input[1].split(',').map(elt => elt.replace('x', '1')).map(elt => parseInt(elt));


                for (var v=1; v<busLines.length; v++) {
                    const bL = busLines[v];
                    const xIndex = busLinesX.indexOf(bL);
                    const tgtDepartureDelta = (100 * bL - xIndex) % bL;
                    let factor;
                    for (factor=1;factor<bL;factor++) {
                        if (multipliers.reduce((agg, e, i) => e + agg * busLines[multipliers.length -1 -i], factor) % bL == tgtDepartureDelta) {
                            const t = multipliers.reduce((agg, e, i) => e + agg * busLines[multipliers.length -1 -i], factor);
                            multipliers.unshift(factor);
                            break;
                        }
                    }
                }

                answerPart2 = multipliers.slice(1).reduce((agg, e, i) => e + agg * busLines[multipliers.length -2 -i], multipliers[0]);

                return answerPart2;
            }

        }, "2020", "day13", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two);
}