/**
 * Advent of Code solution 2022/day05
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved. 
 */

import { Part, Utils } from "../../generic";

namespace day05 {

    const parseStacks = (lines) => {
        lines.reverse();
        const nStacks = (lines[0].length + 1) / 4;
        const stacks = Array(nStacks).fill("");
        for (var l=1; l<lines.length;l++) {
            const line = lines[l].split('');
            for (var s=1; s<=nStacks;s++) {
                if (s*4 -3 > line.length || line[s*4 -3] === " ")
                    continue;
                stacks[s-1] += line[s*4 -3];
            }
        }
        return stacks;
    };

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // split input in empty line delimited chunks
            var chunks = Utils.splitInput(input);

            const stacks = parseStacks(chunks[0]);
                
            for (var line of chunks[1]) {
                const [sMove, sNum, sFrom, sSrc, sTo, sDest] = line.split(' ');
                const nLoops = part == Part.One ? parseInt(sNum) : 1;
                const nLoadsize = part == Part.Two ? parseInt(sNum) : 1;
                const nSrc = parseInt(sSrc) - 1;
                const nDest = parseInt(sDest) - 1;

                for (var m=0; m<nLoops; m++) {
                    const load = stacks[nSrc].substring(stacks[nSrc].length - 1 * nLoadsize);
                    stacks[nSrc] = stacks[nSrc].substring(0, stacks[nSrc].length - 1 * nLoadsize);
                    stacks[nDest] += load;
                }
            }

            let answer = stacks.map(stk => stk.substring(stk.length - 1)).join("");
            return answer;

        }, "2022", "day05", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}