/**
 * Advent of Code solution 2024/day13
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day13 {

    const pBut = /^Button [AB]: X\+(\d+), Y\+(\d+)$/;
    const pPrize = /^Prize: X=(\d+), Y=(\d+)$/;
    const butTokens = { "A": 3, "B": 1 };

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const chunks = Utils.splitInput(input);

            let tokens = 0;
            let workedOut = 0;
            chunks.forEach((chunk, j) => {
                const buttons:{[s:string]:{[k:string]:number}} = {};
                buttons["A"] = { "X": parseInt(chunk[0].replace(pBut, "$1")), "Y": parseInt(chunk[0].replace(pBut, "$2")) };
                buttons["B"] = { "X": parseInt(chunk[1].replace(pBut, "$1")), "Y": parseInt(chunk[1].replace(pBut, "$2")) };
                const prize = { "X": parseInt(chunk[2].replace(pPrize, "$1")), "Y": parseInt(chunk[2].replace(pPrize, "$2")) };
                if (part === Part.Two) {                    
                    prize.X += 10000000000000;
                    prize.Y += 10000000000000;
                }

                const effective = buttons["A"].X > 3 * buttons["B"].X ? "A" : "B";
                const ineffective = effective === "A" ? "B" : "A";

                for (var i=100; i>=0;i--) {
                    const x = prize.X - i * buttons[ineffective].X;
                    const y = prize.Y - i * buttons[ineffective].Y;
                    if (x / buttons[effective].X === y / buttons[effective].Y) { // x % buttons[effective].X === 0 && y % buttons[effective].Y === 0 && 
                        const g = buttons[effective].X;
                        tokens += (i + 1E11) * butTokens[ineffective] + (x / g + 1E11) * butTokens[effective];
                        // tokens += 1E11 * 4;
                        break;
                    }
                }
    
            });
            console.log(workedOut);
            // 62000000032067  too low
            return tokens;

        }, "2024", "day13", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}