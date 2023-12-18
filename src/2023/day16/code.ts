/**
 * Advent of Code solution 2023/day16
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day16 {

    const passLight = {
        "n": { ".": ["n"], "|": ["n"], "-": ["w", "e"], "/": ["e"], "\\": ["w"]},
        "s": { ".": ["s"], "|": ["s"], "-": ["w", "e"], "/": ["w"], "\\": ["e"]},
        "w": { ".": ["w"], "|": ["n", "s"], "-": ["w"], "/": ["s"], "\\": ["n"]},
        "e": { ".": ["e"], "|": ["n", "s"], "-": ["e"], "/": ["n"], "\\": ["s"]},
    }

    class LightCell {
        neighbours:{[dir:string]:LightCell} = { "n": null, "s": null, "w": null, "e": null };
        energized:{[dir:string]:boolean} = { "n": false, "s": false, "w": false, "e": false };
        char:string;

        constructor(char:string) {
            this.char = char;
        }

        hit(dir:string) {
            const newDirs = [];
            const dirsToPass = passLight[dir][this.char];
            dirsToPass.forEach(dir => {
                if (!this.energized[dir])
                    newDirs.push(dir);
            });
            newDirs.forEach(dir => this.energized[dir] = true, this);
            newDirs.forEach(dir => {
                if (this.neighbours[dir])
                    this.neighbours[dir].hit(dir);
            }, this);           
        }

        reset() {
            Object.keys(this.energized).forEach(dir => this.energized[dir] = false, this);
        }

        get isEnergized() {
            return Object.values(this.energized).some(e => e);
        }

        get toString() {
            const dirs = Object.keys(this.energized).filter(k => this.energized[k], this);
            if (this.char !== ".")
                return this.char;
            let s = ".";
            if (dirs.length > 1)
                s = `${dirs.length}`;
            else if (dirs.length === 1)
                s = { "n": "^", "s": "v", "w": "<", "e": ">"}[dirs[0]];
            return s;
        }
    }

    const resetGrid = (grid:LightCell[][]) => {
        grid.forEach(r => r.forEach((lc => lc.reset())));
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const grid = input.map(l => l.split("").map(ch => new LightCell(ch)));
            grid.forEach((row,ri) => row.forEach((lc, ci) => {
                if (ri > 0)
                    lc.neighbours["n"] = grid[ri - 1][ci];
                if (ri < grid.length - 1)
                    lc.neighbours["s"] = grid[ri + 1][ci];
                if (ci > 0)
                    lc.neighbours["w"] = grid[ri][ci - 1];
                if (ci < grid[0].length - 1)
                    lc.neighbours["e"] = grid[ri][ci + 1];
            }));

            if (part == Part.One) {

                grid[0][0].hit("e");
                let answerPart1 = Utils.countTruthy(grid.map(r => r.map(lc => lc.isEnergized)));    
                return answerPart1;

            } else {

                let max  = Number.NEGATIVE_INFINITY;

                Array(grid.length).fill(0).forEach((_, ri) => {
                    grid[ri][0].hit("e");
                    const east = Utils.countTruthy(grid.map(r => r.map(lc => lc.isEnergized)));
                    resetGrid(grid);

                    grid[ri][grid[0].length-1].hit("w");
                    const west = Utils.countTruthy(grid.map(r => r.map(lc => lc.isEnergized)));    
                    resetGrid(grid);

                    max = Math.max(max, east, west);
                });

                Array(grid[0].length).fill(0).forEach((_, ci) => {
                    grid[0][ci].hit("s");
                    const south = Utils.countTruthy(grid.map(r => r.map(lc => lc.isEnergized)));
                    resetGrid(grid);

                    grid[grid.length-1][ci].hit("n");
                    const north = Utils.countTruthy(grid.map(r => r.map(lc => lc.isEnergized)));
                    resetGrid(grid);

                    max = Math.max(max, south, north);
                });

                let answerPart2 = max;
                return answerPart2;

            }

        }, "2023", "day16", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}