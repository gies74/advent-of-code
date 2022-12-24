/**
 * Advent of Code solution 2022/day18
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day18 {
    
    /** ADD 2022-day18 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /** 
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const AXIS = 22;

            const grid = Utils.multiDimArray(3, AXIS, (coord) => input.includes(coord.join(',')) ? "solid" : "air");
            const deltas = Utils.multiDimOffsets(3, true);

            let count = 0;

            if (part === Part.Two) {

                let progress = true;
                while (progress) {
                    progress = false;
                    for (var x=0; x<AXIS; x++) {
                        for (var y=0; y<AXIS; y++) {
                            for (var z=0; z<AXIS; z++) { 
                                if (grid[x][y][z] === "air" && (x === 0 || x === AXIS - 1 || y === 0 || y === AXIS - 1 || z === 0 || z === AXIS - 1)) {
                                    grid[x][y][z] = "outside";
                                    progress = true;
                                    continue;
                                }
                                for (var d of deltas) {
                                    if (grid[x][y][z] === "air" && grid[x + d[0]][y + d[1]][z + d[2]] === "outside") {
                                        grid[x][y][z] = "outside";
                                        progress = true;
                                    }
                                }
                            } 
                        } 
                    }
                }

                for (var x=0; x<AXIS; x++) {
                    for (var y=0; y<AXIS; y++) {
                        for (var z=0; z<AXIS; z++) {
                            if (grid[x][y][z] === "air") {
                                grid[x][y][z] = "solid";
                            }
                        }
                    }
                }
            }

            for (var x=0; x<AXIS; x++) {
                for (var y=0; y<AXIS; y++) {
                    for (var z=0; z<AXIS; z++) {
                        if (grid[x][y][z] !== "solid")
                            continue;
                        for (var d of deltas) {
                            if (x + d[0] < 0 || x + d[0] === AXIS || y + d[1] < 0 || y + d[1] === AXIS || z + d[2] < 0 || z + d[2] === AXIS || grid[x + d[0]][y + d[1]][z + d[2]] !== "solid")
                                count++;
                        }
                    }
                }
            }
            
            return count; 

        }, "2022", "day18", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}