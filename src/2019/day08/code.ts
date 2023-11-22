/**
 * Advent of Code solution 2019/day08
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day08 {

    const WIDTH = 25;
    const HEIGHT = 6;



    
    /** ADD 2019-day08 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const countDigit = (arr: number[][], digit) => {
                return arr.reduce((cum0, row:number[]) => cum0 + row.reduce((cum1, cell) => cum1 + (cell===digit ? 1 : 0), 0), 0);
            };

            const numLayers = input[0].length / (WIDTH * HEIGHT);

            const image = Array(numLayers).fill(null).map((ly, ln) => 
                    Array(HEIGHT).fill(null).map((ro, rn) =>
                        Array(WIDTH).fill(0).map((co, cn) => parseInt(input[0][ln * HEIGHT * WIDTH + rn * WIDTH + cn]))
                    )
                );


            if (part == Part.One) 
            {
                const zeroCounts = image.map(l => countDigit(l, 0));
                const fewestIdx = zeroCounts.indexOf(Math.min(...zeroCounts));
                
                let answerPart1 = countDigit(image[fewestIdx], 1) * countDigit(image[fewestIdx], 2);
    
                // part 1 specific code here

                return answerPart1;

            } else {
                let answerPart2 = 0;
                const result = Array(HEIGHT).fill(null).map(r => 
                        Array(WIDTH).fill('?')
                    );
                image.forEach(ly => {
                    ly.forEach((ro, rn) => {
                        ro.forEach((cell, cn) => {
                            if (result[rn][cn] === '?')
                                result[rn][cn] = cell === 2 ? '?' : cell == 1 ? '#' : ' ';
                        });
                    });
                });

                result.forEach(line => {
                    console.log(line.join(''));
                });
                console.log("");

                // part 2 specific code here

                return answerPart2;

            }

        }, "2019", "day08", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}