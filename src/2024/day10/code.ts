/**
 * Advent of Code solution 2024/day10
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day10 {
    
    class File {

        static idSeq: number = 0;
        id:number;
        constructor() {
            this.id = File.idSeq++;
        }
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const fs = [];
            const lengths = input[0].split("").map(ln => parseInt(ln));

            lengths.forEach((nm, i) => {
                const file = (i%2 === 0) ? new File() : null;
                for (var block=0; block<nm; block++)
                    fs.push(file);
            });

            let blockPtr = fs.length-1;
            let spacePtr = 0;
            while (spacePtr < blockPtr) {
                if (!fs[blockPtr]) {
                    blockPtr--;
                    continue;
                }
                if (fs[spacePtr]) {
                    spacePtr++;
                    continue;
                }
                fs[spacePtr] = fs[blockPtr];
                fs[blockPtr] = null;
            }

            blockPtr = 0;
            let sum = 0;
            while (fs[blockPtr]) {
                sum += blockPtr * fs[blockPtr].id;
                blockPtr++;
            }

            return sum;

        

        }, "2024", "day10", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}