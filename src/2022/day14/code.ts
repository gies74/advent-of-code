/**
 * Advent of Code solution 2022/day14
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */ 

import { stringify } from "querystring";
import { Part, Utils } from "../../generic";

namespace day14 {

    const srcX = 500;

    const modelCave = (input, dev, height) => {
        const cave = Array(height+2).fill(0).map(() => Array(2 * dev + 1).fill('.'));
        for (var line of input) {
            const coords = line.split(" -> ").map(coord => coord.split(',').map(c => parseInt(c)));
            coords[0][0] -= (srcX - dev);
            for (var i=1; i<coords.length; i++) {
                coords[i][0] -= (srcX - dev);
                const dX = Math.sign(coords[i][0] - coords[i-1][0]);
                const dY = Math.sign(coords[i][1] - coords[i-1][1]);
                let fillX = coords[i-1][0], fillY = coords[i-1][1];
                cave[fillY][fillX] = "#";
                do {
                    fillY += dY;
                    fillX += dX;
                    cave[fillY][fillX] = "#";
                } while (fillX != coords[i][0] || fillY != coords[i][1]);
            }
        }
        return cave;     
    };

    const printCave = (cave) => {
        cave.forEach((l, i) => {
            console.log(`${("00" + String(i)).slice(-3)} ${l.join("")}`);
        });
    };

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            let minX = Infinity;
            let maxX = -1 * Infinity;
            let maxY = -1 * Infinity;
            for (var line of input) {
                const coords = line.split(" -> ");
                for (var coord of coords) {
                    const [x, y] = coord.split(',').map(c => parseInt(c));
                    minX = Math.min(x, minX);
                    maxX = Math.max(x, maxX);
                    maxY = Math.max(y, maxY);
                }
            }

            const devX = 1 + Math.max(srcX - minX, maxX - srcX, maxY + 1);

            const cave = modelCave(input, devX, maxY);

            let cntSandRest = 0;
            let caveFull = false;
            while (!caveFull) {
                const grain = [0, devX];
                while (true) {
                    if (grain[0] === cave.length - 1 && part === Part.One) {
                        // cave is full
                        caveFull = true;
                        break;
                    }
                    else if (part === Part.Two && grain[0] === cave.length - 1) {
                        cave[grain[0]][grain[1]] = "O";
                        cntSandRest++;
                        break;
                    }
                    else if (grain[0] < cave.length && cave[grain[0] + 1][grain[1]] === ".") {
                        grain[0] += 1;
                    }
                    else if (grain[0] < cave.length && cave[grain[0] + 1][grain[1] - 1] === ".") {
                        grain[0] += 1;
                        grain[1] -= 1;
                    }                        
                    else if (grain[0] < cave.length && cave[grain[0] + 1][grain[1] + 1] === ".") {
                        grain[0] += 1;
                        grain[1] += 1;
                    } else if (grain[0] === 0 && cave[0][devX] !== "." && part === Part.Two) {
                        caveFull = true;
                        break;
                    }
                    else {
                        cave[grain[0]][grain[1]] = "O";
                        cntSandRest++;
                        break;
                    }
                }
            }

            // printCave(cave);

            return cntSandRest;

        }, "2022", "day14", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}