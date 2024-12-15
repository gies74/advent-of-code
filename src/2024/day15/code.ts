/**
 * Advent of Code solution 2024/day15
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day15 {

    const vector = { ">": [0, 1], "v": [1, 0], "<": [0, -1], "^": [-1, 0]};

    const getMovingCoords = (ptrs:number[][], instr:string, grid:string[][]) => {
        const pushDir = vector[instr];
        const newBoxCoords = [];
        for (var ptr of ptrs) {
            const pusherSymb = grid[ptr[0]][ptr[1]]; 
            let pushedSymb = grid[ptr[0] + pushDir[0]][ptr[1] + pushDir[1]];
            if (pushedSymb === "#")
                return null;
            if ("[]".includes(pushedSymb))
                newBoxCoords.push([ptr[0] + pushDir[0],ptr[1] + pushDir[1]]);
            if ("^v".includes(instr) && pushedSymb == "]")
                newBoxCoords.push([ptr[0] + pushDir[0], ptr[1] - 1]);
            if ("^v".includes(instr) && pushedSymb == "[")
                newBoxCoords.push([ptr[0] + pushDir[0], ptr[1] + 1]);
        }
        return newBoxCoords;
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

            const [input0, input1] = Utils.splitInput(input);

            const grid = input0.map(line => line.replace(/#/g, "##").replace(/\./g, "..").replace(/O/g, "[]").replace(/@/g, "@.").split(""));
            let pos = [];
            grid.forEach((line, li) => line.forEach((cell, ci) => { if (cell === "@") { pos[0]=li; pos[1]=ci; } }));

            const instrs = input1.join("").split("");
            let instr:string;
            while (instr = instrs.shift()) {

                const allMovingCoords = [pos];
                let newMovingCoords = getMovingCoords([pos], instr, grid);
                while (newMovingCoords && newMovingCoords.length > 0) {
                    newMovingCoords.forEach(c => {
                        if (!allMovingCoords.some(apc => apc[0] === c[0] && apc[1] === c[1]))
                            allMovingCoords.push(c);
                    });
                    newMovingCoords = getMovingCoords(newMovingCoords, instr, grid);
                    if (newMovingCoords === null)
                        break;
                }
                if (newMovingCoords === null)
                    continue;
                let ptr = null;
                while (ptr = allMovingCoords.pop()) {
                    grid[ptr[0] + vector[instr][0]][ptr[1] + vector[instr][1]] = grid[ptr[0]][ptr[1]];
                    grid[ptr[0]][ptr[1]] = ".";
                }
                pos = [pos[0]+ vector[instr][0], pos[1]+ vector[instr][1]];

            }

            const gps = grid.reduce((cum0, line, li) => cum0 + line.reduce((cum1, cell, ci) => cum1 + (cell === "[" ? li * 100 + ci : 0), 0), 0);

            return gps;

        }, "2024", "day15", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}