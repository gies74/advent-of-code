/**
 * Advent of Code solution 2022/day13
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day13 {

    const isNumber = (tst) => {
        return !(tst instanceof Array); 
    }
    
    const assessOrder = (left, right): number => {
        if (isNumber(left) && !left.length && isNumber(right) && !right.length)
            return Math.sign(Number(left) - Number(right));
        if (isNumber(left) && !left.length)
            return assessOrder([left], right);
        if (isNumber(right) && !right.length)
            return assessOrder(left, [right]);
        if (left.length === 0 && right.length === 0)
            return 0;    
        if (left.length > 0 && right.length > 0) {
            var order = assessOrder(left[0], right[0]);
            return order !== 0 ? order : assessOrder(left.slice(1), right.slice(1));
        }
        return left.length === 0 ? -1 : 1;
    };

    Utils.main(

        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            

            if (part == Part.One) {

                var chunks = Utils.splitInput(input);

                let correctOrder = 0;
                for (var i=1; i<=chunks.length; i++) {
                    const order = assessOrder(JSON.parse(chunks[i-1][0]), JSON.parse(chunks[i-1][1]));
                    if (order === -1)
                        correctOrder += i;
                }
    
    
                let answerPart1 = correctOrder;

                return answerPart1;

            } else {

                const fInput = input.filter(line => line.length).map(e => JSON.parse(e));
                fInput.push([[2]]);
                fInput.push([[6]]);
                fInput.sort((l,r) => assessOrder(l,r));

                const i1 = 1 + fInput.findIndex(elt => assessOrder(elt, [[2]]) === 0);
                const i2 = 1 + fInput.findIndex(elt => assessOrder(elt, [[6]]) === 0);

                return i1 * i2;

            }

        }, "2022", "day13", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}