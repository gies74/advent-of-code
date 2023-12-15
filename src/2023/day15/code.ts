/**
 * Advent of Code solution 2023/day15
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day15 {

    class Lens {
        name:string;
        focLen:number;
        constructor(name:string, focLen:number) {
            this.name = name;
            this.focLen = focLen;
        }
    }
    
    const hash = (str) => {
        let curVal = 0;
        str.split('').forEach(ch => {
            const ascii = ch.charCodeAt();
            curVal += ascii;
            curVal *= 17;
            curVal %= 256;
        });
        return curVal;
    };

    const initiateSequence = (boxes:Lens[][], sequence:string[]) => {
        sequence.forEach(instr => {
            const [label,op,sVal] = instr.split(/([\=\-])/);
            const val = parseInt(sVal);
            const hashVal = hash(label);
            const box:Lens[] = boxes[hashVal];
            const lensIdx = box.findIndex(ln => ln.name === label);
            if (op === "-") {
                if (lensIdx === -1) {
                    return;
                }
                box.splice(lensIdx, 1);
            } else {
                if (lensIdx === -1)
                    box.push(new Lens(label, val));
                else
                    box[lensIdx].focLen = val;
            }

        });        
    }

    const focPower=(boxes:Lens[][]) => {
        const retVal = Utils.sum(boxes.map((box,bIdx) => box.reduce((boxCum,lens,lIdx) => boxCum + (bIdx + 1) * (lIdx + 1) * lens.focLen, 0)));
        return retVal;
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // var chunks = Utils.splitInput(input);
            const sequence = input[0].split(",");


            if (part == Part.One) {

                return Utils.sum(sequence.map(instr => hash(instr)));

            } else {
                const boxes:Lens[][] = Utils.multiDimArray([256], () => []);

                initiateSequence(boxes, sequence);

                return focPower(boxes);

            }

        }, "2023", "day15", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}