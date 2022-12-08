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

            const reTxt = `^((${resolved["42"].join('|')}){2,})((${resolved["31"].join('|')}){1,})$`;
            const re = new RegExp(reTxt);

            for (var ch of chunks[1]) {
                
                if (resolved["0"].includes(ch))
                    matchCounts++;
                
                else if (part == Part.Two && re.test(ch)) {
                    var ms = ch.match(re);
                    if ((ms[1].length / ms[2].length) > (ms[3].length / ms[4].length))
                        matchCounts++;
                }
            }

            return matchCounts;


        }, "2020", "day19", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}