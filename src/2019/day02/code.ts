/**
 * Advent of Code solution 2019/day02
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day02 {
    
    /** ADD 2019-day02 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const runIntProg = (noun, verb, memState) => {
                var inputI = memState[0].split(",").map(num => parseInt(num));

                inputI[1] = noun;
                inputI[2] = verb;
    
                var instrPtr = 0;
                while (inputI[instrPtr] != 99) {
                    if (![1,2].includes(inputI[instrPtr]))
                        throw `Huh? ${inputI[instrPtr]}`;
                    if (inputI[instrPtr] == 1)
                        inputI[inputI[instrPtr+3]] = inputI[inputI[instrPtr+1]] + inputI[inputI[instrPtr+2]];
                    else
                        inputI[inputI[instrPtr+3]] = inputI[inputI[instrPtr+1]] * inputI[inputI[instrPtr+2]];
                    instrPtr += 4;
                }
                return inputI[0];    
            }


            
            // part aspecific code here

            // split input in case it has empty line delimited chunks
            // var chunks = Utils.splitInput(input);
            let answerPart1 = 0;
            let answerPart2 = 0;



            if (part == Part.One) {

                // part 1 specific code here
                answerPart1 = runIntProg(12, 2, input);

                return answerPart1;

            } else {

                // part 2 specific code here
                var stop = false;
                for (var noun = 0; !stop && noun <= 99; noun++) {
                    for (var verb = 0; !stop && verb <= 99; verb++) {
                        var result = runIntProg(noun, verb, input);
                        if (result == 19690720) {
                            answerPart2 = 100 * noun + verb;
                            stop = true;
                        }
                    }
                }

                return answerPart2;
            }

        }, "2019", "day02", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}