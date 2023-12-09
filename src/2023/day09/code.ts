/**
 * Advent of Code solution 2023/day09
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day09 {
    
    const extrapolateBack = (arr:number[]) => {
        if (arr.every(e => e === 0)) {
            return 0;
        }
        const diffs = arr.map((e,i) => i === 0 ? 0 : arr[i] - arr[i-1]).slice(1);
        return arr[0] - extrapolateBack(diffs);
    }

    const extrapolate = (arr:number[]) => {
        if (arr.every(e => e === 0)) {
            return 0;
        }
        const diffs = arr.map((e,i) => i === 0 ? 0 : arr[i] - arr[i-1]).slice(1);
        return extrapolate(diffs) - arr[arr.length - 1] ;
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const inputNums = input.map(l => l.split(' ').map(n => parseInt(n)));


            if (part == Part.One) {

                const extrapolants = inputNums.map(arr => extrapolate(arr));
                let answerPart1 = Utils.sum(extrapolants);
                return answerPart1;

            } else {

                const extrapolants = inputNums.map(arr => extrapolateBack(arr));
                let answerPart1 = Utils.sum(extrapolants);
                return answerPart1;

            }

        }, "2023", "day09", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}