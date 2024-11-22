/**
 * Advent of Code solution 2017/day22
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day22 {

    const DIM = 501;

    // turn matrices
    const LEFT = [[0, 1], [-1, 0]];
    const RIGHT = [[0, -1], [1, 0]];
    const AHEAD = [[1, 0], [0, 1]];
    const REVERSE = [[-1, 0], [0, -1]];

    const transitionPart1 = {
        ".": "#",
        "#": "."
    };
    const transitionPart2 = {
        ".": "W",
        "W": "#",
        "#": "F",
        "F": "." 
    };

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const transition = part === Part.One ? transitionPart1 : transitionPart2;
            const startGrid = input.map(line => line.split(""));
            const facing = [-1, 0];
            const pos = [(DIM - 1) / 2, (DIM - 1) / 2];

            const grid = Utils.multiDimArray([DIM, DIM], coord => {
                if (coord[1] >= (DIM - startGrid[0].length) / 2 && coord[1] < (DIM + input[0].length) / 2 && coord[0] >= (DIM - startGrid.length) / 2 && coord[0] < (DIM + input.length) / 2)
                {
                    return startGrid[coord[0] - (DIM - startGrid[0].length)/2][coord[1] - (DIM - startGrid.length)/2];
                }
                return ".";
            });

            let infectionCount = 0;

            for (var i=0; i<(part === Part.One ? 1E4: 1E7) ; i++) {

                // 0. assess
                const state0 = grid[pos[0]][pos[1]];
                infectionCount += transition[state0] === "#" ? 1 : 0;
                
                // 1. alter facing
                const turn = state0 === "." ? LEFT : state0 === "W" ? AHEAD : state0 === "#" ? RIGHT : REVERSE;
                const fy = turn[0][0] * facing[0] + turn[1][0] * facing[1];
                const fx = turn[0][1] * facing[0] + turn[1][1] * facing[1];
                facing[0] = fy;
                facing[1] = fx;

                // 2. alter state
                grid[pos[0]][pos[1]] = transition[state0];

                // 3. move
                pos[0] += facing[0];
                pos[1] += facing[1];

            }

            return infectionCount;

        }, "2017", "day22", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}