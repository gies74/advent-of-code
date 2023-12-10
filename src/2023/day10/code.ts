/**
 * Advent of Code solution 2023/day10
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day10 {

    const takeStep = (pos:number[], heading:string, grid:string[][]):string => {
        const posDelta = {
            "W": [0, -1], "E": [0, 1], "N": [-1, 0], "S": [1, 0],
        }
        pos[0] += posDelta[heading][0];
        pos[1] += posDelta[heading][1];
        const hc = grid[pos[0]][pos[1]];

        const headDelta = {
            "W": hc === "L" ? "N" : hc === "F" ? "S" : hc === "-" ? "W" : "?",
            "E": hc === "J" ? "N" : hc === "7" ? "S" : hc === "-" ? "E" : "?",
            "N": hc === "7" ? "W" : hc === "F" ? "E" : hc === "|" ? "N" : "?",
            "S": hc === "J" ? "W" : hc === "L" ? "E" : hc === "|" ? "S" : "?",
        }
        return headDelta[heading];
    }
    
    /** ADD 2023-day10 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const grid = input.map(l => l.split(""));
            const sRow = input.map((r,ri) => [r,ri]).find(arr => String(arr[0]).includes('S'));
            const pos = [Number(sRow[1]), String(sRow[0]).indexOf('S')];
            const [y,x] = pos;
            let heading = "-J7".includes(grid[y][x+1]) ? "E" : "FL-".includes(grid[y][x-1]) ? "W" : "JL|".includes(grid[y+1][x]) ? "S" : "N";
            const initHeading = heading;

            if (part == Part.One) {

                let count = 1;
                while ((heading = takeStep(pos, heading, grid)) !== "?") {
                    count++;
                }
                return count / 2;
    
            } else {

                const trackGrid = Utils.multiDimArray([grid.length, grid[0].length], () => 0);
                const path = [];
                const prevPos = pos.slice(0);
                while (true) {
                    heading = takeStep(pos, heading, grid);                   
                    if (grid[pos[0]][pos[1]] === "S")
                        heading = initHeading;

                    trackGrid.forEach((tr, ty) => {
                        tr.forEach((tc, tx) => {
                            if (ty < pos[0] && [prevPos[1],pos[1]].includes(tx))
                                trackGrid[ty][tx] += prevPos[1] - pos[1];
                            else if (ty > pos[0] && [prevPos[1],pos[1]].includes(tx))
                                trackGrid[ty][tx] += pos[1] - prevPos[1];
                            else if ([prevPos[0],pos[0]].includes(ty) && tx < pos[1])
                                trackGrid[ty][tx] += pos[0] - prevPos[0];
                            else if ([prevPos[0],pos[0]].includes(ty) && tx > pos[1])
                                trackGrid[ty][tx] += prevPos[0] - pos[0];
                        });
                    });
                    
                    if (grid[pos[0]][pos[1]] === "S")
                        break;
                    prevPos.splice(0,2,...pos);
                                        
                }


                let cnt4 = 0;
                trackGrid.forEach((tr, ty) => {
                    tr.forEach((tc, tx) => {
                        if (Math.abs(tc) == 8)
                            cnt4++;
                    });
                });
                
                return cnt4;

            }

        }, "2023", "day10", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}