/**
 * Advent of Code solution 2024/day15
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day15 {

    const vector = { ">": [0, 1], "v": [1, 0], "<": [0, -1], "^": [-1, 0]};

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

            const grid = input0.map(line => line.split(""));
            let pos = [];
            grid.forEach((line, li) => line.forEach((cell, ci) => { if (cell === "@") { pos[0]=li; pos[1]=ci; } }));

            const instrs = input1.join("").split("");
            let instr:number[];
            while (instr = vector[instrs.shift()]) {

                let ptr = pos.slice(0);
                let boxSeen = false;
                let symb = null;
                do {
                    ptr[0] += instr[0]; ptr[1] += instr[1];
                    symb = grid[ptr[0]][ptr[1]];
                    boxSeen ||= symb === "O";
                } while (symb === "O");
                if (symb === ".") {
                    if (boxSeen)
                        grid[ptr[0]][ptr[1]] = "O";
                    grid[pos[0]][pos[1]] = ".";
                    pos = [pos[0] + instr[0], pos[1] + instr[1]];
                    grid[pos[0]][pos[1]] = "@";
                }
            }

            const gps = grid.reduce((cum0, line, li) => cum0 + line.reduce((cum1, cell, ci) => cum1 + (cell === "O" ? li * 100 + ci : 0), 0), 0);

            return gps;

        }, "2024", "day15", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}