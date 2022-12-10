/**
 * Advent of Code solution 2022/day10
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved. 
 */

import { Part, Utils } from "../../generic";

namespace day10 {
    
    /** ADD 2022-day10 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            let signal_strength = 0;

            let cycle = 1;
            let val = 0;
            let wait = 0;

            let signal = 1;
            const screen = Array(6).fill(0).map(() => Array(40).fill(' '));
            while (input.length) {

                if (wait > 0) {
                    wait--;
                } else {
                    signal += val;
                    val = 0;
                    const [instr, sVal] = input.shift().split(' ');
                    if (instr === "addx") {
                        wait = 1;
                        val = parseInt(sVal);
                    }
                }

                const pixel = (((cycle - 1) % 40 + 1) >= signal && ((cycle - 1) % 40 + 1) <= signal + 2) ? "#" : ".";
                screen[Math.floor((cycle - 1) / 40)][(cycle - 1) % 40] = pixel;

                if (cycle % 40 == 20) {
                    signal_strength += signal * cycle;
                }
                cycle++;
            }

            

            if (part == Part.One) {

                let answerPart1 = signal_strength;
                return answerPart1;

            } else {

                for (var sLine of screen) {
                    console.log(sLine.join(''));
                }
    
                return 0;

            }

        }, "2022", "day10", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}