/**
 * Advent of Code solution 2023/day03
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day03 {
    
    /** ADD 2023-day03 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const partNumPat = /\d+/g;
            const deltas = Utils.multiDimOffsets(2, false);

            // part 1
            const partNumbers:number[] = [];
            /* part 2 */
            const numbersAdj2Stars = Utils.multiDimArray([input.length, input[0].length], c => []);

            input.forEach((l, li) => {
                const matches = [...l.matchAll(partNumPat)];
                matches.forEach(m => {
                    const starCoords = [];
                    let touchSym = false;

                    for (var idx=m.index; idx<m.index + m[0].length; idx++) {
                        deltas.forEach(d => {
                            const c0 = li+d[0], c1 = idx+d[1];
                            if (c0 < 0 || c0 >= input.length || c1 < 0 || c1 >= l.length)
                                return;

                            touchSym ||= /[^.^\d]/.test(input[c0][c1]);

                            if (/\*/.test(input[c0][c1]) && !starCoords.some(c => c[0] == c0 && c[1] == c1) ) {
                                starCoords.push([c0,c1]);
                            }
                        });
                    }

                    if (touchSym) {
                        partNumbers.push(parseInt(m[0]));
                    }

                    starCoords.forEach(c => {
                        numbersAdj2Stars[c[0]][c[1]].push(parseInt(m[0]));
                    });
                });
            });

            let cum = 0;
            
            numbersAdj2Stars.forEach((r,ri) => r.forEach((c,ci) => {
                if (c.length == 2) {
                    cum += c[0] * c[1];
                }
            }));

            return (part == Part.One) ? Utils.sum(partNumbers) : cum;

        }, "2023", "day03", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}