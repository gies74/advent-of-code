/**
 * Advent of Code solution 2023/day18
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";
var area = require('area-polygon');

namespace day18 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {


            const pos = [0,0];
            const poss:number[][] = [];
            // poss.push(pos.slice(0));

            const inputM = input.map(l => {
                const [dir, sNum, color] = l.split(" ");

                let num:number[], delta:number[];
                if (part === Part.One) {
                    num = [parseInt(sNum)];
                    delta = dir === "R" ? [0,1] : dir === "L" ? [0,-1] : dir === "U" ? [-1,0] : [1,0];

                } else {
                    num = [parseInt(color.substring(2,7), 16)];
                    delta =  [[0,1],[1,0],[0,-1],[-1,0]][parseInt(color.substring(7,8))];
                }
                return [num, delta];
            });
            inputM.forEach((l,i) => {
                const [_0,delta0] = inputM[(inputM.length + i - 1) % inputM.length];
                const [num, delta] = l;
                const [_2,delta2] = inputM[(i + 1) % inputM.length];
                const turn0 = Math.sin(Math.atan2(delta[0], delta[1]) - Math.atan2(delta0[0],delta0[1]));
                const turn2 = Math.sin(Math.atan2(delta2[0],delta2[1]) - Math.atan2(delta[0], delta[1]));
                const numF = turn0 * .5 + turn2 * .5 + num[0];
    
                pos[0] = pos[0] + numF * delta[0];
                pos[1] = pos[1] + numF * delta[1];
                poss.push(pos.slice(0));

            });

            const a = area(poss);
            return a;

        }, "2023", "day18", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}