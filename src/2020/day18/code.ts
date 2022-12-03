/**
 * Advent of Code solution 2020/day18
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day18 {
    
    /** ADD 2020-day18 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    const parseExp = (exp) => {
        const numPat = /^(\d+)(.*)/;
        if (numPat.test(exp)) {
            let term = parseInt(exp.replace(numPat, "$1"));
            var remainder = exp.replace(numPat, "$2");
            if (remainder) {
                if (/^ \+ /.test(remainder)) {
                    remainder = remainder.replace(/ \+ /, "");
                    return term + parseExp(remainder);
                } else if (/^ \* /.test(remainder)) {
                    remainder = remainder.replace(/ \* /, "");
                    return term * parseExp(remainder);
                } else {
                    throw Error(`je ne comprends pas ${remainder}`);
                }
            } else {
                return term;
            }
        }
        const chars = exp.split('');
        let pos = 0;
        if (chars[pos] != "(") {
            throw Error("Versteh es nicht");
        }
        pos++;
        const charStack = ["("];
        while (charStack.length > 0) {
            if (pos >= chars.length)
                throw Error("What is this");
            if (chars[pos] == "(")
                charStack.push(chars[pos]);
            if (chars[pos] == ")")
                charStack.pop();            
            pos++;
        }        
        return remainder.substring(1, pos - 2);
    }



    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // part aspecific code here
            for (var line of input) {
                let d = parseExp(line);
            }



            // split input in case it has empty line delimited chunks
            // var chunks = Utils.splitInput(input);
            let answerPart1 = 0;
            let answerPart2 = 0;

            if (part == Part.One) {

                // part 1 specific code here

                return answerPart1;

            } else {

                // part 2 specific code here

                return answerPart2;

            }

        }, "2020", "day18", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}