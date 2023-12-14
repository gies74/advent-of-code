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
        if (direction === Dir.North) {
            for (var col=0; col < grid[0].length; col++) {
                let ptrE = 0, ptrR = 0;
                let solidPassed = true;
                for (var ptr=0; ptr < grid.length; ptr++) {
                    switch (grid[ptr][col]) {
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
                                grid[ptrE][col] = "O";
                                grid[ptrR][col] = ".";
                                ptrE += 1;
                            }                            
                            break;
                    }
                }

            }
        }
        else if (direction === Dir.South) {
            for (var col=0; col < grid[0].length; col++) {
                let ptrE = 0, ptrR = 0;
                let solidPassed = true;
                for (var ptr=grid.length-1;ptr >= 0; ptr--) {
                    switch (grid[ptr][col]) {
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
                                grid[ptrE][col] = "O";
                                grid[ptrR][col] = ".";
                                ptrE -= 1;
                            }                            
                            break;
                    }
                }

            }
        }    
        else if (direction === Dir.West) {
            for (var row=0; row < grid.length; row++) {
                let ptrE = 0, ptrR = 0;
                let solidPassed = true;
                for (var ptr=0; ptr < grid[0].length; ptr++) {
                    switch (grid[row][ptr]) {
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
                                grid[row][ptrE] = "O";
                                grid[row][ptrR] = ".";
                                ptrE += 1;
                            }                            
                            break;
                    }
                }
            }
        }    
        else if (direction === Dir.East) {
            for (var row=0; row < grid.length; row++) {
                let ptrE = 0, ptrR = 0;
                let solidPassed = true;
                for (var ptr=grid[0].length-1;ptr >= 0; ptr--) {
                    switch (grid[row][ptr]) {
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
                                grid[row][ptrE] = "O";
                                grid[row][ptrR] = ".";
                                ptrE -= 1;
                            }                            
                            break;
                    }
                }
            }
        }                       
    };

    const load = (grid) => {
        return grid.reduce((cumR,row,ri) => cumR + row.reduce((cumC,cell) => { const tot = cumC + (cell === "O" ? (grid.length - ri) : 0); return tot;  }, 0), 0);
    }
   


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

            } else {
                
                for (var x=0 ; x < 1000000000; x++) {
                    [Dir.North, Dir.West, Dir.South, Dir.East].forEach(d => {
                        tilt(grid, d); 
                    });
                }


            }
            return load(grid);

        }, "2023", "day14",
        // set this switch to Part.Two once you've finished part one.
        Part.Two,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}