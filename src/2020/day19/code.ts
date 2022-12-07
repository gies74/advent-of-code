/**
 * Advent of Code solution 2020/day19
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { match } from "assert";
import { parse } from "path";
import { Part, Utils } from "../../generic";

namespace day19 {

    const resolved : {[num: string]: string[]} = {};
    const unresolved : {[num: string]: string} = {};

    const makePermutations = (rule) => {
        let perms = [];
        for (var rulePart of rule.split(" | ")) {
            let partPerms = [""];
            let result = [];
            for (var rnum of rulePart.split(" ")) {
                partPerms.forEach(pp => {
                    resolved[rnum].forEach(r => {
                        result.push(pp + r);
                    });
                });
                partPerms = result;
                result = [];
            };
            perms = perms.concat(partPerms);
        }
        return perms;
    }

    const parseRules = (chunk) => {
        for (var line of chunk) {
            const [num, rule] = line.split(": ");
            if (/"[a-b]"/.test(rule)) {
                resolved[num] = [rule.replace(/"/g, "")];
            } else {
                unresolved[num] = rule;
            }
        }

        let progress=true;
        while (progress && Object.values(unresolved).length) {
            progress = false;
            for (var num in unresolved) {
                const rule = unresolved[num];
                if (!rule)
                    continue;
                if (rule.split(" | ").every(rp => rp.split(" ").every(n => resolved[n]))) {
                    resolved[num] = makePermutations(rule);
                    delete unresolved[num];
                    progress = true;
                    break;
                }
            }
        }


    };

    
    /** ADD 2020-day19 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // part aspecific code here

            // split input in case it has empty line delimited chunks
            var chunks = Utils.splitInput(input);
            parseRules(chunks[0]);

            let matchCounts = 0;

            for (var ch of chunks[1]) {
                
                if (resolved["0"].includes(ch))
                    matchCounts++;
                else 
                if (resolved["42"].some(p => new RegExp(`^${p}`).test(ch)) && resolved["31"].some(p => new RegExp(`${p}$`).test(ch)))
                    matchCounts++;
            }




            let answerPart1 = matchCounts;
            let answerPart2 = 0;

            if (part == Part.One) {

                // part 1 specific code here

                return answerPart1;

            } else {

                // part 2 specific code here

                return answerPart2;

            }

        }, "2020", "day19", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}