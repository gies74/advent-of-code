/**
 * Advent of Code solution 2024/day01
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day01 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const intMatrix = input.map(line => line.split(/\s+/).map(e => parseInt(e)));
            const list1 = intMatrix.map(row => row[0]);
            const list2 = intMatrix.map(row => row[1]);
            if (part === Part.One)
            {
                list1.sort();
                list2.sort();
                const diff = list1.map((elt, idx) => Math.abs(elt - list2[idx]));
                return Utils.sum(diff);
            }
            const dict = list2.reduce((d, e) => {
                if (d[e]) {
                    d[e] += e;
                } else {
                    d[e] = e;
                }
                return d;
            }, {});
            return list1.reduce((cum, item) => cum + (dict[item] ? dict[item] : 0), 0);

        }, "2024", "day01", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}