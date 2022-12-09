/**
 * Advent of Code solution 2022/day09
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day09 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const gridSz = 400;
            const ropeLen = part === Part.One ? 2 : 10;
            const grid = Utils.multiDimArray(2, gridSz, () => false);
            const rope = Utils.multiDimArray(1, ropeLen, () => [gridSz/2, gridSz/2]); // 
            grid[rope[rope.length - 1][1]][rope[rope.length - 1][0]] = true;

            const moveDir = { "R": [1, 0], "U": [0, 1], "L": [-1, 0], "D": [0, -1] };

            for (var line of input) {
                const [dir, sNum] = line.split(' ');
                const num = parseInt(sNum);
                for (var s=0; s<num; s++) {
                    rope[0][0] += moveDir[dir][0];
                    rope[0][1] += moveDir[dir][1];

                    for (var k=1; k<ropeLen; k++) {
                        const pKnot = rope[k-1];
                        const cKnot = rope[k];

                        if (Math.abs(pKnot[0] - cKnot[0]) > 1 || Math.abs(pKnot[1] - cKnot[1]) > 1) {
                            cKnot[0] += Math.sign(pKnot[0] - cKnot[0]);
                            cKnot[1] += Math.sign(pKnot[1] - cKnot[1]);
                        }
                        grid[rope[rope.length - 1][1]][rope[rope.length - 1][0]] = true;
                    }
                }
            }

            return Utils.countTruthy(grid);

        }, "2022", "day09", Part.One, 0);
}