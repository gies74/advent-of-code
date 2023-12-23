/**
 * Advent of Code solution 2023/day17
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day17 {

    class SearchCell {
        y:number;
        x:number;
        loss:number;
        leastLoss:number; 

        constructor (loss:string, y:number, x:number) {
            this.loss = parseInt(loss);
            this.y = y;
            this.x = x;
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

            const grid = input.map((l,y) => l.split('').map((loss,x) => new SearchCell(loss, y, x)));
            grid[0][0].leastLoss = 0;

            for (var i=1; i<grid.length + grid[0].length - 1; i++) {
                for (var y0=Math.min(i, grid.length - 1); y0 >= Math.max(0, i - grid.length + 1); y0--) {
                    const x0 = i - y0;
                    grid[y0][x0].leastLoss = grid[y0][x0].loss + (x0 === 0 ? grid[y0-1][x0].leastLoss : y0 === 0 ? grid[y0][x0-1].leastLoss : Math.min(grid[y0-1][x0].leastLoss, grid[y0][x0-1].leastLoss))
                }

            }



            return 0;

        }, "2023", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}