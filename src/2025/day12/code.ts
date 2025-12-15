/**
 * Advent of Code solution 2025/day12
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day12 {

    class Piece {
        lines:string;
        constructor(lines){
            this.lines = lines;
        }
    }

    class Puzzle{
        dims:number[];
        pieceAmounts:number[];
        constructor(line:string) {
            const [dims, amounts] = line.split(": ");
            this.dims = dims.split("x").map(n => parseInt(n));
            this.pieceAmounts = amounts.split(" ").map(n => parseInt(n));
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

            const parts = Utils.splitInput(input);
            const pieces = parts.slice(0, parts.length-1).map(p => new Piece(p.slice(1)));
            const puzzles = parts[parts.length-1].map(l => new Puzzle(l));


            return 0;

        }, "2025", "day12", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        1
    );
}