/**
 * Advent of Code solution 2022/day12
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day12 {

    class Cell {
        height: number;
        minSteps: number = Infinity;
        neighbours: Cell[] = [];

        constructor(height) {
            this.height = height;
            this.minSteps = Infinity;
        }

        update(minSteps) {
            this.minSteps = minSteps;
            this.neighbours.forEach(nc => {
                if (nc.minSteps > this.minSteps + 1) {
                    nc.update(this.minSteps + 1);
                }
            })
        }
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const abc = "abcdefghijklmnopqrstuvwxyz".split('').reduce((agg, elt) => { agg[elt] = elt.charCodeAt(0); return agg; }, {});
            abc["S"] = abc["a"] ;
            abc["E"] = abc["z"] ;

            const grid = input.map(l => l.split('').map(c => new Cell(abc[c])));
            for (var y = 0; y < grid.length; y++)
                for (var x = 0; x < grid[y].length; x++) {
                    if (y > 0 && grid[y - 1][x].height - grid[y][x].height <= 1)
                        grid[y][x].neighbours.push(grid[y - 1][x]);
                    if (y < grid.length - 1 && grid[y + 1][x].height - grid[y][x].height <= 1)
                        grid[y][x].neighbours.push(grid[y + 1][x]);
                    if (x > 0 && grid[y][x - 1].height - grid[y][x].height <= 1)
                        grid[y][x].neighbours.push(grid[y][x - 1]);
                    if (x < grid[y].length - 1 && grid[y][x + 1].height - grid[y][x].height <= 1)
                        grid[y][x].neighbours.push(grid[y][x + 1]);
                }

            const Ey = input.findIndex(l => /E/.test(l));
            const Ex = input[Ey].split('').indexOf('E');
            const Sy = input.findIndex(l => /S/.test(l));
            const Sx = input[Ey].split('').indexOf('S');

            grid[Sy][Sx].update(0);
            
            if (part === Part.Two) {
                for (var y = 0; y < grid.length; y++)
                    for (var x = 0; x < grid[y].length; x++) {
                        if (grid[y][x].height == abc["S"])
                            grid[y][x].update(0);
                    }

            }

            const minStepsGrid = grid.map(gY => gY.map(c => c.minSteps));

            return grid[Ey][Ex].minSteps;

        }, "2022", "day12",
        // set this switch to Part.Two once you've finished part one.
        Part.Two,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}