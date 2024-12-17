/**
 * Advent of Code solution 2024/day17
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day17 {

    var pattern = /^Register ([ABC]): (\d+)$/;

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const register:{[abc:string]:number} = {};

            const [input1, input2] = Utils.splitInput(input);
            input1.forEach(line => {
                const m = line.match(pattern);
                register[m[1]] = parseInt(m[2]);
            })

            const instrs = input2[0].replace("Program: ", "").split(",");
            let instrPtr = 0;

            const output = [];
            while (instrPtr < instrs.length) {
                const opcode = instrs[instrPtr];
                const operand = parseInt(instrs[instrPtr+1]);
                const comboOperand = operand < 4 ? operand : Object.values(register)[operand-4];

                switch (opcode) {
                    case "0": 
                        register["A"] = Math.floor(register["A"] / Math.pow(2, comboOperand));
                        break;
                    case "1":
                        register["B"] = register["B"] ^ operand;
                        break;
                    case "2":
                        register["B"] = comboOperand % 8;
                        break;
                    case "3":
                        if (register["A"] !== 0) {
                            instrPtr = operand;
                            continue;
                        }
                        break;
                    case "4":
                        register["B"] = register["B"] ^ register["C"];
                        break;
                    case "5":
                        output.push(comboOperand % 8);
                        break;
                    case "6":
                        register["B"] = Math.floor(register["A"] / Math.pow(2, comboOperand));
                        break;
                    case "7":
                        register["C"] = Math.floor(register["A"] / Math.pow(2, comboOperand));
                        break;
                }

                instrPtr += 2;
            }

            const oString = output.map(n => String(n)).join(",");

            return oString;

        }, "2024", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}