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
        length:number;
        empty:boolean;
        constructor(length:number, empty:boolean) {
            this.length = length;
            this.empty = empty;
            if (!empty)
                this.id = File.idSeq++;
            else
                this.id = 0
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

            const lengths = input[0].split("").map(ln => parseInt(ln));
            lengths.pop();
            const fs = lengths.map((nm, i) =>  new File(nm, i%2 === 1));

            let blockPtr = fs.length-1;
            while (blockPtr > 0) {
                if (fs[blockPtr].empty) {
                    blockPtr--;
                    continue;
                }
                const size = fs[blockPtr].length;
                for (var spacePtr = 0; spacePtr < blockPtr; spacePtr++) {
                    if (!fs[spacePtr].empty || fs[spacePtr].length < fs[blockPtr].length)
                        continue;
                    break;
                }
                if (spacePtr >= blockPtr) {
                    blockPtr--;
                    continue;
                }
                fs[spacePtr].length -= fs[blockPtr].length;
                fs.splice(spacePtr,0, fs[blockPtr]);
                fs[blockPtr+1] = new File(size, true);
            }

            let sum = 0;
            let ptr = 0;
            for (var file of fs) {
                const end = ptr + file.length;
                for (;ptr<end; ptr++)
                    sum += file.empty ? 0 : ptr * file.id;
            }

            return sum;

        

        }, "2024", "day10", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}