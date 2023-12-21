/**
 * Advent of Code solution 2023/day21
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day21 {

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const delta = Utils.multiDimOffsets(2, true);

            const grid0 = input.map(l => l.split(''));
            const startcoord0 = [input.findIndex(l => /S/.test(l))];
            startcoord0.push(grid0[startcoord0[0]].indexOf('S'));
            grid0[startcoord0[0]][startcoord0[1]] = ".";

            const hEven = Utils.countTruthy(grid0.map((r,ri) => r.map((c,ci) => c === "#" && (ri+ci) % 2 == 0)));
            const hOdd = Utils.countTruthy(grid0.map((r,ri) => r.map((c,ci) => c === "#" && (ri+ci) % 2 == 1)));

            const f = 0;
            const dim = 1 + 2 * f;
            const grid = Utils.multiDimArray(2, dim * 131, (coord) => { 
                return grid0[coord[0] % 131][coord[1] % 131] 
            });

            const startcoord = [(dim * 131 - 1) / 2, (dim * 131 - 1) / 2];
            //const startcoord = [0, 130];
            grid[startcoord[0]][startcoord[1]] = "O";

            const plotcoords = [startcoord];
            const steps = 64; // 65 + f * 131; // 64; // + 131; // 
            const reachedForSteps = [];

            Array(steps).fill(0).forEach((_, nStepsMin1) => {

                const remainder = (startcoord[0] + startcoord[1] + steps) % 2; // 0; // 

                if (!plotcoords.length)
                    return;
                const newplotcoords = [];
                plotcoords.forEach(c => {          
                    delta.forEach(d => {
                        const dy = c[0] + d[0], dx = c[1] + d[1];
                        if (dy < 0 || dy >= grid.length || dx < 0 || dx >= grid[0].length)
                            return;
                        if (grid[dy][dx] === "." && !newplotcoords.some(cc => cc[0] === dy && cc[1] === dx))
                            newplotcoords.push([dy,dx]);
                    });
                });
                newplotcoords.forEach(c => grid[c[0]][c[1]] = "O");
                plotcoords.splice(0, plotcoords.length, ...newplotcoords);

                const reached = Utils.countTruthy(grid.map((r,ri) => {
                    return r.map((c,ci) => {
                        return (c === "O" && (ri + ci) % 2 === remainder)
                    });
                }));
                reachedForSteps.push(reached);
    
            });

            if (part == Part.One) {

                let answerPart1 = reachedForSteps[reachedForSteps.length - 1];
                return answerPart1;

            } else {

                console.log("see Computation.xlsx")
                return 0;

            }

        }, "2023", "day21", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}