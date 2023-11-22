/**
 * Advent of Code solution 2022/day25
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day25 {
    
    const snafuEncode = (dec) => {

        const pos = Math.floor(Math.log(2* Math.abs(dec))/Math.log(5));
        return _snafuEncode(pos, dec);
    }

    const _snafuEncode = (pos, remainder) => {

        if (pos === -1) 
            return "";
        const dict = { "-2": "=", "-1": "-", "0": "0", "1": "1", "2": "2" };

        const dev = Math.round(remainder / Math.pow(5, pos));

        const char = dict[String(dev)];

        remainder -= dev * Math.pow(5, pos);

        return char + _snafuEncode(pos - 1, remainder);
    }



    const snafuDecode = (snafu) => {
        const dict = { "2": 2, "1": 1, "0": 0, "-": -1, "=": -2 };
        return snafu.split('').reverse().reduce((fivary, char, pos) => {
            return fivary + dict[char] * Math.pow(5, pos);
        }, 0);
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const x = snafuEncode(23);

            const sum = input.reduce((cum, line) => {
                return cum + snafuDecode(line);
            }, 0);
            let answerPart1 = snafuEncode(sum);
            let answerPart2 = 0;

            if (part == Part.One) {

                // part 1 specific code here

                return answerPart1;

            } else {

                // part 2 specific code here

                return answerPart2;

            }

        }, "2022", "day25", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}