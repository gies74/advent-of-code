/**
 * Advent of Code solution 2020/day14
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day14 {
    
    /** ADD 2020-day14 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            //var chunks = Utils.splitInput(input);

            let answerPart1 = 0;
            let answerPart2 = 0;

            const mem : {[name:string]: number} = {};

            let mask = "";
            let maskAnd;
            let maskOr;
            for (var chunk of input) {
                if (/^mask/.test(chunk)) {
                    mask = chunk.split(" = ")[1];
                    const mA = mask.replace(/X/g, '1');
                    maskAnd = BigInt(parseInt(mA, 2));
                    const mO = mask.replace(/X/g, '0');
                    maskOr = BigInt(parseInt(mO, 2));
                    continue
                }
                var line = chunk;
                const elts = line.split(/[/[\] ]/g);
                if (elts.length != 5)
                    throw Error("Wtf");
                const subject = BigInt(parseInt(elts[4]));
                const val = Number(subject & maskAnd | maskOr);
                if (val < -1 || val > maskAnd) {
                    throw Error("Wtf2");
                }
                mem[elts[1]] = val;
            }

            if (part == Part.One) {
                var x = Object.values(mem).reduce((agg, e) => agg + e, 0);
                answerPart1 = x;
                return answerPart1;
            } else {
                /** part 2 specific code here */
                return answerPart2;
            }

        }, "2020", "day14", 
        // set this switch to Part.Two once you've finished part one.
        Part.One);
}