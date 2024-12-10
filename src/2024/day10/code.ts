/**
 * Advent of Code solution 2024/day08
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day08 {

    class Cell {
        nines;
        coord:number[];
        ntrails:number;
        value:number;
        neighbours:Cell[];
        constructor(value, coord) {
            this.value = value;
            this.ntrails = 0;
            this.coord = coord;
            this.nines = new Set();
            this.neighbours = [];
            if (value === 9) {
                this.nines.add(this);
                this.ntrails = 1;
            }
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

            const grid = input.map((line, ri) => line.split("").map((c, ci) => new Cell(parseInt(c), [ri, ci])));

            const dirs = Utils.multiDimOffsets(2, true);
            grid.forEach(row => row.forEach(cell => {
                dirs.forEach(dir => {
                    const vc = cell.coord[0] + dir[0];
                    const hc = cell.coord[1] + dir[1];
                    if (vc >= 0 && vc < grid.length && hc >= 0 && hc < grid[0].length ? grid[vc][hc] : null) {
                        const nCell = grid[vc][hc];
                        cell.neighbours.push(nCell);
                    }
                });
            }));

            for (var val=9;val>0;val--) {
                grid.forEach(row => row.filter(c => c.value === val).forEach(c => {
                    c.neighbours.filter(n => n.value === val - 1).forEach(n => {
                        [...c.nines].forEach(nine => n.nines.add(nine));
                        n.ntrails += c.ntrails;
                    });
                }));
            }

            let sum = 0;
            grid.forEach(row => row.filter(c => c.value === 0).forEach(c => {
                sum += part === Part.One ? c.nines.size : c.ntrails;
            }));

            return sum;


        }, "2024", "day10", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}