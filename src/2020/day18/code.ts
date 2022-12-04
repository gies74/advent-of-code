/**
 * Advent of Code solution 2020/day18
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day18 {
    
    /** ADD 2020-day18 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    const goLeft = (txt) => {
        const numPat = /(.*)(\d+)$/;
        if (numPat.test(txt)) {
            const term  = txt.replace(numPat, "$2");
            const remainder  = txt.replace(numPat, "$1");
            return [remainder, term];
        }
        const chars = txt.split('');
        let pos = chars.length - 1;
        if (chars[pos] != ")") {
            throw Error("Versteh es nicht");
        }
        const charStack = [chars[pos]];
        pos--;
        while (charStack.length > 0) {
            if (pos < 0)
                return [`${txt} + `, "0"];
            if (chars[pos] == "(")
                charStack.pop();
            if (chars[pos] == ")")
                charStack.push(chars[pos]);            
            pos--;
        }        
        return [txt.substring(0, pos + 1), txt.substring(pos + 2, txt.length - 1)];        
    }
    const goRight = (txt) => {
        const numPat = /^(\d+)(.*)/;
        if (numPat.test(txt)) {
            const term  = txt.replace(numPat, "$1");
            const remainder  = txt.replace(numPat, "$2");
            return [term, remainder];
        }
        const chars = txt.split('');
        let pos = 0;
        if (chars[pos] != "(") {
            throw Error("Versteh es nicht");
        }
        const charStack = [chars[pos]];
        pos++;
        while (charStack.length > 0) {
            if (pos >= chars.length)
                return ["0", ` + ${txt}`];
            if (chars[pos] == "(")
                charStack.push(chars[pos]); 
            if (chars[pos] == ")")
                charStack.pop();           
            pos++;
        }        
        return [txt.substring(0, pos), txt.substring(pos)];          
    }

    const insertParentheses = (line) => {
        const parts = line.split(' + ');
        for (var j=parts.length - 1; j>0; j--) {
            const [lRemainder, lTerm] = goLeft(parts[j-1]);
            const [rTerm, rRemainder] = goRight(parts[j]);
            parts[j-1] = `${lRemainder}(${lTerm} + ${rTerm})${rRemainder}`;
        }
        return parts[0];
    }


    const parseRemainder = (term, remainder) => {
        if (!remainder)
            return term;
        if (/ \+ $/.test(remainder)) {
            remainder = remainder.replace(/ \+ $/, "");
            return term + parseExp(remainder);
        } else if (/ \* $/.test(remainder)) {
            remainder = remainder.replace(/ \* $/, "");
            return term * parseExp(remainder);
        } else {
            throw Error(`je ne comprends pas ${remainder}`);
        }
    }

    const parseExp = (exp) => {
        const numPat = /(.*)(\d+)$/;
        if (numPat.test(exp)) {
            let term = parseInt(exp.replace(numPat, "$2"));
            var remainder = exp.replace(numPat, "$1");
            return parseRemainder(term, remainder);
        }
        const chars = exp.split('');
        let pos = chars.length - 1;
        if (chars[pos] != ")") {
            throw Error("Versteh es nicht");
        }
        const charStack = [chars[pos]];
        pos--;
        while (charStack.length > 0) {
            if (pos < 0)
                throw Error("What is this");
            if (chars[pos] == "(")
                charStack.pop();
            if (chars[pos] == ")")
                charStack.push(chars[pos]);            
            pos--;
        }        
        return parseRemainder(parseExp(exp.substring(pos + 2, exp.length - 1)), exp.substring(0, pos + 1));
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
            let sum = 0;
            for (var line of input) {
                if (part == Part.Two)
                    line = insertParentheses(line);

                let d = parseExp(line);
                sum += d;
            }

            return sum;

        }, "2020", "day18", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}