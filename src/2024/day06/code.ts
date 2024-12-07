/**
 * Advent of Code solution 2024/day06
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day06 {

    const right = { "^": [[0, 1], ">"], ">": [[1, 0], "v"], "v": [[0, -1], "<"], "<": [[-1, 0], "^"], };

    const evalObstacle = (grid, symbol, pos) => {
        const facing = right[symbol][0];
        symbol = right[symbol][1];
        while (true) {
            const npos = [pos[0] + facing[0], pos[1] + facing[1]];
            if (npos[0] === -1 || npos[0] === grid.length || npos[1] === -1 || npos[1] === grid[0].length)
                return false;

            const gridSymbol = grid[npos[0]][npos[1]];

            const nnpos = [pos[0] + 2 * facing[0], pos[1] + 2 * facing[1]];
            const nnposInside = !(nnpos[0] === -1 || nnpos[0] === grid.length || nnpos[1] === -1 || nnpos[1] === grid[0].length);

            if (gridSymbol === symbol || nnposInside && grid[nnpos[0]][nnpos[1]] === "#" && gridSymbol === right[symbol][1])
                return true;

            if (gridSymbol === "#")
                return false;

            pos = npos;
        }
    }


    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const grid = input.map(line => line.split(""));
            var pos = [input.findIndex(line => /\^/.test(line)), 0];
            pos[1] = grid[pos[0]].findIndex(cell => cell === "^");
            var symbol = "^";
            var facing = [-1, 0];
            
            let cntUniq = 1;
            let cntOptions = 0;

            while (true) {

                const npos = [pos[0] + facing[0], pos[1] + facing[1]];
                if (npos[0] === -1 || npos[0] === grid.length || npos[1] === -1 || npos[1] === grid[0].length)
                    break;

                const gridSymbol = grid[npos[0]][npos[1]];
                if (gridSymbol === "#") {
                    facing = right[symbol][0];
                    symbol = right[symbol][1];
                    continue;
                } else if (gridSymbol === ".") {
                    grid[npos[0]][npos[1]] = symbol;
                    cntUniq++;
                }
                if (evalObstacle(grid, symbol, pos)) {
                    const dgrid = grid.map(line => line.join(""));
                    dgrid[npos[0]] = dgrid[npos[0]].substring(0, npos[1]) + "O" + dgrid[npos[0]].substring(npos[1] + 1);
                    console.log(dgrid.join("\n") + "\n");

                    cntOptions++;
                }
                pos = npos;
                
            }

            // part 2: 545 too low
            return part === Part.One ? cntUniq : cntOptions;

        }, "2024", "day06", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}