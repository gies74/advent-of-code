/**
 * Advent of Code solution 2025/day06
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day06 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const operators = input[input.length-1].trim().split(/\s+/);
            let sheet = [[]];
            if (part === Part.One) {
                sheet = input.slice(0, input.length-1).map(line => line.trim().split(/\s+/).map(nm => parseInt(nm)));
                return operators.reduce((cum, op, i) => {
                    let asg;
                    if (op === "+")
                        asg = sheet.reduce((sum, row) => sum + row[i], 0);
                    else
                        asg = sheet.reduce((prod, row) => prod * row[i], 1);
                    return cum + asg;
                }, 0);
            }
            else {
                const chars = input.slice(0, input.length-1).map(line => line.split(""));
                const charsT = chars[0].map((_, ci) => chars.map((_, ri) => chars[ri][ci]));
                const operands = charsT.map(col => parseInt(col.join("").trim()));
                let operand;
                while((operand = operands.pop()) != undefined) {
                    if (isNaN(operand)) {
                        sheet.unshift([]);
                        continue;
                    }
                    sheet[0].push(operand);
                }
                return operators.reduce((cum, op, i) => {
                    let asg;
                    if (op === "+")
                        asg = sheet[i].reduce((sum, op) => sum + op, 0);
                    else
                        asg = sheet[i].reduce((prod, op) => prod * op, 1);
                    return cum + asg;
                
                }, 0);




                
            }

        }, "2025", "day06", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}