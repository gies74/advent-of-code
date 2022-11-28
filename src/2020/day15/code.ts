/**
 * Advent of Code solution 2020/day15
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day15 {
    
    /** ADD 2020-day15 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // split input in empty line delimited chunks
            // var chunks = Utils.splitInput(input);

            let answerPart1 = 0;
            let answerPart2 = 0;

            // input[0] = "0,3,6";

            const mem = new Array<number>(50000000).fill(0).map(() => Array(2));

            const inputI = input[0].split(',').map(c => parseInt(c));
            inputI.map((init, turn) => {
                mem[init] = [turn + 1];
            });

            const processSpoken = (spoken, turn, ignoreInput=false) => {
                if (!ignoreInput) {
                    if (mem[spoken][0]) {
                        mem[spoken][1] = mem[spoken][0];
                    }
                    mem[spoken][0] = turn;
                }

                if (!mem[spoken][1])
                    return 0;
                else
                    return mem[spoken][0] - mem[spoken][1];
            }

            let spoken = inputI[inputI.length - 1];            
            let turn = inputI.length ;
            let ignore = true;
            const until = (part == Part.One) ? 2020 : 30000000;
            for (; turn <= until; turn++) {
                if (turn == until)
                    break;
                spoken = processSpoken(spoken, turn, ignore);
                ignore = false;
                if (turn % 1000000 == 0)
                    console.log(`Turn ${turn}`);
            }

            return spoken;

        }, "2020", "day15", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two);
}