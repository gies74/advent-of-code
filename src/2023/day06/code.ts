/**
 * Advent of Code solution 2023/day06
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day06 {

    const countRecords = (time, dist) => {
        let cnt = 0;
        for (var t=0; t<time; t++) {
            if ((time -t) * t > dist) {
                cnt++;
            }
        }
        return cnt;
    }
    
    /** ADD 2023-day06 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            if (part == Part.One) {

                const matrix = input.map(l => l.split(/ +/).slice(1).map(n => parseInt(n)));
                const cr = Array(matrix[0].length).fill(0).map(((r,ri) => countRecords(matrix[0][ri], matrix[1][ri])));
    
                let answerPart1 = cr.reduce((prod, cr) => prod * cr, 1);

                return answerPart1;

            } else {

                const data = input.map(l => l.split(/ +/).slice(1).join("")).map(n => parseInt(n));
                
                let answerPart2 = countRecords(data[0], data[1]);

                return answerPart2;

            }

        }, "2023", "day06", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}