/**
 * Advent of Code solution 2024/day24
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day24 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const pattern = /^([^ ]+) (OR|XOR|AND) ([^ ]+) \-> ([^ ]+)$/;

            const [init, logic] = Utils.splitInput(input);
            const register = init.reduce((reg, line) => {
                const [variable, val] = line.split(": ");
                reg[variable] = parseInt(val);
                return reg;
            }, {});

            const logicRE = logic.map(l => l.match(pattern)); 
            let logicOp;
            while (logicOp = logicRE.find(l => register[l[1]] !== undefined && register[l[3]] !== undefined)) {
                logicRE.splice(logicRE.indexOf(logicOp),1);
                switch (logicOp[2]) {
                    case "AND":
                        register[logicOp[4]] = register[logicOp[1]] & register[logicOp[3]];
                        break;
                    case "OR":
                        register[logicOp[4]] = register[logicOp[1]] | register[logicOp[3]];
                        break;
                    case "XOR":
                        register[logicOp[4]] = register[logicOp[1]] ^ register[logicOp[3]];
                        break;
                }
            }

            let final = Object.keys(register).sort().filter(key => /^z/.test(key));
            final = final.reverse();
            const finalstr = final.map(key => register[key]).join("");

            return parseInt(finalstr, 2);

        }, "2024", "day24", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}