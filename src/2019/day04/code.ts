/**
 * Advent of Code solution 2019/day04
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day04 {
    
    const validate1 = (num) => {
        var digits = String(num).split('');
        var c1 = digits.some((_,i) => i > 0 && digits[i-1] == digits[i]);
        var c2 = digits.every((_,i) => i == 0 || parseInt(digits[i-1]) <= parseInt(digits[i]))
        return c1 && c2;
    }

    const validate2 = (num) => {
        var digits = String(num).split('');
        var c1 = digits.some((_,i) => i > 0 && digits[i-1] == digits[i] && (i < 2 || digits[i-2] != digits[i]) && (i == 5 || digits[i] != digits[i+1]));
        var c2 = digits.every((_,i) => i == 0 || parseInt(digits[i-1]) <= parseInt(digits[i]))
        return c1 && c2;
    }


    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            var [lower, upper] = input[0].split('-').map(e => parseInt(e));
            let count = 0;
            for (var num=lower; num <= upper; num++) {
                if (part == Part.One && validate1(num) || part == Part.Two && validate2(num))
                    count++;
            }
            return count;

        }, "2019", "day04", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}