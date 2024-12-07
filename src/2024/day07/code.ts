/**
 * Advent of Code solution 2024/day07
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day07 {

    const makeList = (list:number[], part:Part) => {
        if (list.length === 1)
            return list;
        const operand = list.pop();
        const operatedList = makeList(list, part);
        const result = operatedList.map(it => it + operand).concat(operatedList.map(it => it * operand));
        if (part === Part.Two)
            result.splice(0, 0, ...operatedList.map(it => parseInt(String(it) + String(operand))));
        return result;
    };

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            let sum = 0;

            input.forEach(line => {
                const [result, numbers] = line.split(": ");
                const operatedList = makeList(numbers.split(" ").map(nmber => parseInt(nmber)), part);
                const resultInt = parseInt(result);
                if (operatedList.includes(resultInt))
                    sum += resultInt;
            });

            return sum;

        }, "2024", "day07", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}