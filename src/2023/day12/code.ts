/**
 * Advent of Code solution 2023/day12
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day12 {

    const potentialBreakups = (block:string):number[][] => {
        if (!block.length)
            return [[]];
        const breakUps = [[block.length]];
        const x = block.split(/(#+|\?)/g).filter(s => s !== "");
        x.forEach((bit,idx) => {
            if (bit[0] === "?") {
                const p1 = potentialBreakups(x.slice(0, idx).join(""));
                const p2 = potentialBreakups(x.slice(idx+1).join(""));
                

                breakUps.splice(breakUps.length,0, ...p1);
                breakUps.splice(breakUps.length,0, ...p2);
            }
        });
        return breakUps;
    };
    
    const levenshtein = (springs:string[], nDamages:number[]):number => {
        //spring = spring.replace(/$\.*/g, "");
        if (nDamages.length === 0) {
            if (springs.every(s => /^\?+$/.test(s)))
                return 1;
            return 0;
        }

        const dSize = nDamages.shift();
        return 0;



    };

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const bus = potentialBreakups("??##?"); // [[5],[4],[4],[3],[3],[1,3],[2],[1,2]]

            const configs = input.map(line => {
                const [springpart, damagepart] = line.split(" ");
                const springs = springpart.split(/\.+/).filter(s => s !== "");
                const nDamages = damagepart.split(",").map(n => parseInt(n));

                return levenshtein(springs, nDamages);



            });
            

            if (part == Part.One) {
                return Utils.sum(configs);


            } else {


            }

        }, "2023", "day12", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}