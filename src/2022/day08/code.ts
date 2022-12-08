/**
 * Advent of Code solution 2022/day08
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day08 {
    
    /** ADD 2022-day08 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const forest = input.map(line => line.split('').map(c => parseInt(c)));

            let answerPart2 = 0;

            if (part == Part.One) {

                let visible = 0;
                for(var y=0; y<forest.length;y++) {
                    for (var x=0; x<forest[y].length;x++) {
                        const height = forest[y][x];
                        const tLeft = forest[y].slice(0,x).every(t => t < height);
                        const tRight = forest[y].slice(x+1).every(t => t < height);
                        const tTop = forest.slice(0,y).map(line => line[x]).every(t => t < height);
                        const tBottom = forest.slice(y+1).map(line => line[x]).every(t => t < height);
                        if (tLeft || tRight || tTop || tBottom) {
                            visible++;
                        }
                    }
                }
                
                let answerPart1 = visible;
    
                return answerPart1;

            } else {

                const deltas = [[-1, 0], [0, -1], [1, 0], [0, 1]];

                let bestScenic = -1;

                for(var y=0; y<forest.length;y++) {
                    for (var x=0; x<forest[y].length;x++) {
                        const height = forest[y][x];
                        let scenic = 1;
                        for (var delta of deltas) {
                            let dX = x + delta[0];
                            let dY = y + delta[1];
                            let dist = 0;
                            while (dX >= 0 && dX < forest[0].length && dY >= 0 && dY < forest.length) {
                                dist++;
                                if (forest[dY][dX] >= height)
                                    break;
                                dX += delta[0];
                                dY += delta[1];
                            }
                            scenic *= dist;
                        }
                        if (scenic > bestScenic) {
                            bestScenic = scenic;
                        }
                    }
                }
                return bestScenic;
            }

        }, "2022", "day08", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}