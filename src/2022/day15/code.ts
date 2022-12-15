/**
 * Advent of Code solution 2022/day15
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved. 
 */

import { Part, Utils } from "../../generic";

namespace day15 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const sensBeacPairs = [];
            for (var line of input) {
                const parts = line.split(/[\=,\:]/).map(str => parseInt(str));
                sensBeacPairs.push([parts[1],parts[3],parts[5],parts[7]]);
            }
            for (var sbpair of sensBeacPairs) {
                const manhattanDist = Math.abs(sbpair[2] - sbpair[0]) + Math.abs(sbpair[3] - sbpair[1]);
                sbpair.push(manhattanDist);
            }


            let answerPart2 = 0;

            if (part == Part.One) {
                const tgtRow = 2000000;
                const tgtRowRanges = [];
                const beaconsOnTgt = []; //sensBeacPairs.filter(sbp => sbp[3] === tgtRow).map(sbp => sbp[2]);

                let minRange = Infinity;
                let maxRange = -Infinity;
                for (var sbpair of sensBeacPairs) {
                    const manhattanDist = sbpair[4];
                    const rangeTgt = manhattanDist - Math.abs(tgtRow - sbpair[1]);
                    if (rangeTgt < 0)
                        continue;
                    const lower = sbpair[0] - rangeTgt;
                    const upper = sbpair[0] + rangeTgt;
                    tgtRowRanges.push([lower, upper]);
                    minRange = (lower < minRange) ? lower : minRange;
                    maxRange = (upper > maxRange) ? upper : maxRange;
                }

                let cnt = 0;
                for (var i=minRange; i<=maxRange; i++) {
                    if (tgtRowRanges.some(range => i >= range[0] && i <= range[1]) && !beaconsOnTgt.includes(i)) {
                        cnt++;
                    }
                }
                
                let answerPart1 = cnt;

                return answerPart1;

            } else {
                const lowLimit = 0;
                const uppLimit = 4000000;
                const tgt=[0,0];

                for (var sbpair of sensBeacPairs) {
                    for (var x=Math.max(lowLimit, sbpair[0] - sbpair[4] - 1); x<=Math.min(uppLimit, sbpair[0] + sbpair[4] + 1); x++) {
                        const yu = sbpair[1] + (sbpair[4] - Math.abs(sbpair[0] - x)) + 1; 
                        const yl = sbpair[1] - (sbpair[4] - Math.abs(sbpair[0] - x)) - 1;

                        const coords = [];
                        if (yu >= lowLimit && yu <= uppLimit) {
                            coords.push([x,yu]);
                        }
                        if (yl >= lowLimit && yl <= uppLimit) {
                            coords.push([x,yl]);
                        }

                        coords.forEach(coord => {
                            if (sensBeacPairs.filter(sbp => sbp != sbpair).every(sbp => Math.abs(sbp[0] - coord[0]) + Math.abs(sbp[1] - coord[1]) > sbp[4])) {
                                tgt[0] = coord[0];
                                tgt[1] = coord[1];
                            }
                        });
                    }
                }

                answerPart2 = tgt[0] * 4000000 + tgt[1]; 

                return answerPart2;

            }

        }, "2022", "day15", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}