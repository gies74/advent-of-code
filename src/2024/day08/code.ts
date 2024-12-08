/**
 * Advent of Code solution 2024/day08
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day08 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const locsByFreq:{[f:string]:number[][]} = {};
            input.forEach((line,li) => line.split('').forEach((cell, ci) => {
                if (cell === ".")
                    return;
                const locs = locsByFreq[cell] = locsByFreq[cell] ? locsByFreq[cell] : [];
                locs.push([li, ci]);
            }));

            const uniqAntinodeLocs = [];

            if (part === Part.Two) {
                Object.values(locsByFreq).forEach(locs => {
                    uniqAntinodeLocs.splice(uniqAntinodeLocs.length-1,0,...locs);
                });
            }

            Object.entries(locsByFreq).forEach(([freq, locs]) => {
                for (var i=0; i<locs.length-1; i++) {
                    for (var j=i+1; j<locs.length; j++) {
                        const step = [(locs[j][0] - locs[i][0]), (locs[j][1] - locs[i][1])];
                        for (var s=-1; s > -2 || part === Part.Two; s--) {
                            const l = [locs[i][0] + s * step[0], locs[i][1] + s * step[1]];
                            if (l[0] < 0 || l[0] >= input.length || l[1] < 0 || l[1] >= input[0].length)
                                break;
                            if (uniqAntinodeLocs.some(ul => ul[0]===l[0] && ul[1]===l[1]))
                                continue;
                            uniqAntinodeLocs.push(l);
                        }
                        for (var s=1; s < 2 || part === Part.Two; s++) {
                            const l = [locs[j][0] + s * step[0], locs[j][1] + s * step[1]];
                            if (l[0] < 0 || l[0] >= input.length || l[1] < 0 || l[1] >= input[0].length)
                                break;
                            if (uniqAntinodeLocs.some(ul => ul[0]===l[0] && ul[1]===l[1]))
                                continue;
                            uniqAntinodeLocs.push(l);
                        }
                    }
                }
            });


            return uniqAntinodeLocs.length;

        }, "2024", "day08", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}