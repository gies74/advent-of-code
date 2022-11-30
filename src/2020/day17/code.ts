/**
 * Advent of Code solution 2020/day17
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day17 {

    const nCycles = 6;
    
    /** ADD 2020-day17 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            let state = Utils.multiDimArray(4, 2*nCycles + input.length, (coord) => { 
                return false; 
            });
            const z0 = 
            input.forEach((line, li) => {
                line.split('').forEach((cell, ci) => {
                    state[nCycles][nCycles][nCycles + li][nCycles + ci] = cell == '#';
                });
            });

            const deltas = Utils.multiDimOffsets(4);

            const printPlane =(z) => {
                console.log(`z=${z-nCycles}`);
                for (var y=0;y<state[z].length;y++) {
                    console.log(state[z][y].map(c => c ? "#" : ".").join(''));
                }
            };
            
            for (var cycle=0; cycle<nCycles; cycle++) {
                for (var j=6-cycle; j<=6+cycle;j++) {
                    // printPlane(j);
                } 
                const newState = Utils.multiDimArray(4, 2*nCycles + input.length, (coord) => { 
                    return false; 
                });
                for (var z=0;z<state.length;z++) {
                    for (var y=0;y<state[0].length;y++) {
                        for (var x=0;x<state[0][0].length;x++) {
                            for (var w=0;w<state[0][0][0].length;w++) {
                                var cnt = 0;                        
                                for (var delta of deltas) {
                                    if (z+delta[0] < 0 || z+delta[0] >= state.length || 
                                        y+delta[1] < 0 || y+delta[1] >= state[0].length || 
                                        x+delta[2] < 0 || x+delta[2] >= state[0][0].length || 
                                        w+delta[3] < 0 || w+delta[3] >= state[0][0][0].length
                                        )
                                        continue;
                                    cnt += state[z+delta[0]][y+delta[1]][x+delta[2]][w+delta[3]] ? 1 : 0;
                                }
                                newState[z][y][x][w] = state[z][y][x][w] && [2,3].includes(cnt) || !state[z][y][x][w] && [3].includes(cnt);
                            }
                        }
                    }
                }
                state = newState;
                console.log(`After cycle ${cycle + 1}: total = ${Utils.sumTruthy(state)}`);
            }


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

        }, "2020", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 2);
}