/**
 * Advent of Code solution 2023/day09
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day09 {
    
    const extrapolate = (arr:number[], part:Part) => {
        if (arr.every(e => e === 0)) {
            return 0;
        }
        const diffs = arr.map((e,i) => i === 0 ? 0 : arr[i] - arr[i-1]).slice(1);
        if (part === Part.One)
            return extrapolate(diffs, part) + arr[arr.length - 1] ;
        else
            return arr[0] - extrapolate(diffs, part) ;
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const inputNums:number[][] = input.map(l => l.split(' ').map(n => parseInt(n)));
            const extrapolants:number[] = inputNums.map(arr => extrapolate(arr, part));
            return Utils.sum(extrapolants);

        }, "2023", "day09", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}