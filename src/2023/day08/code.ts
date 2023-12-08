/**
 * Advent of Code solution 2023/day08
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day08 {

    class Elem {
        elem: string;
        left:Elem;
        right:Elem;
        constructor(elem:string) {
            this.elem = elem;
        }
    }

    // https://decipher.dev/30-seconds-of-typescript/docs/lcm/
    const lcm = (...arr) => {
        const gcd = (x, y) => (!y ? x : gcd(y, x % y));
        const _lcm = (x, y) => (x * y) / gcd(x, y);
        return [...arr].reduce((a, b) => _lcm(a, b));
    };       


    
    /** ADD 2023-day08 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            var chunks = Utils.splitInput(input);

            const instrs = chunks[0][0].split("");

            const dict = chunks[1].reduce((d, line) => {
                const parts = line.split(/( \= \(|, |\))/);
                d[parts[0]] = [parts[2], parts[4]];
                return d;
            }, {});

            const eDict = {};
            Object.keys(dict).forEach(elemname =>  eDict[elemname] = new Elem(elemname));
            Object.keys(dict).forEach(en => {
                eDict[en].left = eDict[dict[en][0]];
                eDict[en].right = eDict[dict[en][1]];
            });

            const startPat = part === Part.One ? /AAA/ : /A$/;
            const endPat = part === Part.One ? /ZZZ/ : /Z$/;
            const selems = Object.keys(eDict).filter(en => startPat.test(en)).map(en => eDict[en]);

            const counts = [];
            selems.forEach(se => {
                let cnt = 0;
                const elems = [se];
                while (!elems.every(el => endPat.test(el.elem))) {
                    const instr = instrs[cnt++ % instrs.length];
                    elems.forEach((_, i) => elems[i] = (instr === "L") ? elems[i].left : elems[i].right);
                }
                counts.push(cnt);
            });
    
            return lcm(...counts);

        }, "2023", "day08", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}