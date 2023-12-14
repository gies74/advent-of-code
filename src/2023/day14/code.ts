/**
 * Advent of Code solution 2023/day14
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day14 {

    enum Dir {
        North,
        South,
        West,
        East,
    };

    const tilt = (grid:string[][], direction:Dir) => {
        const horiz = [Dir.West,Dir.East].includes(direction);
        const positive = [Dir.West,Dir.North].includes(direction);

        const rowscols = Array(horiz ? grid.length : grid[0].length).fill(0).map((_, i) => i);
        const ptrRange = Array(horiz ? grid[0].length : grid.length).fill(0).map((_, i) => i);
        if (!positive) {
            ptrRange.reverse();
        }

        for (var rc of rowscols) {
            let ptrE = 0, ptrR = 0;
            let solidPassed = true;
            
            for (var ptr of ptrRange) {
                switch (grid[horiz ? rc : ptr][horiz ? ptr : rc]) {
                    case "#":
                        solidPassed = true;
                        break;
                    case ".":
                        if (solidPassed) {
                            ptrE = ptr;
                            solidPassed = false;
                        }
                        break;
                    case "O":
                        ptrR = ptr;
                        if (!solidPassed) {
                            grid[horiz ? rc: ptrE][horiz ? ptrE : rc] = "O";
                            grid[horiz ? rc : ptrR][horiz ? ptrR : rc] = ".";
                            ptrE += positive ? 1 : -1;
                        }                            
                        break;
                }
            }
        }
    };

    const calcload = (grid) => {
        return grid.reduce((cumR,row,ri) => cumR + row.reduce((cumC,cell) => { const tot = cumC + (cell === "O" ? (grid.length - ri) : 0); return tot;  }, 0), 0);
    }

    const toString = (grid) => 
        grid.map(row => row.join('')).join('');

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const grid = input.map(line => line.split(""));

            if (part == Part.One) {

                tilt(grid, Dir.North);
                return calcload(grid);

            } else {

                const gridStrings = [];
                const loads = [];
                let gridString = "";
                while (!gridStrings.includes(gridString)) {
                    gridStrings.push(gridString);
                    [Dir.North, Dir.West, Dir.South, Dir.East].forEach(d => {
                        tilt(grid, d); 
                    });
                    gridString = toString(grid);
                    loads.push(calcload(grid));
                }
                console.log(`After ${gridStrings.length} cycles a gridconfig was detected again. First occurrence cycle #${gridStrings.indexOf(gridString)}`);

                const loopLength = gridStrings.length - gridStrings.indexOf(gridString);
                const offSetStart = gridStrings.indexOf(gridString);
                const remainder = (1000000000 - offSetStart) % loopLength;

                return loads[offSetStart + remainder - 1];

            }

        }, "2023", "day14",
        // set this switch to Part.Two once you've finished part one.
        Part.Two,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}