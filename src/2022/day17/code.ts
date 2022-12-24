/**
 * Advent of Code solution 2022/day17
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day17 {

    const blocks = [
        [[true], [true], [true], [true]],
        [[false,true,false],[true, true, true],[false, true, false]],
        [[true,false, false], [true,false,false],[true,true,true]],
        [[true,true,true,true]],
        [[true,true],[true,true]]
    ];

    const COLUMNS = 7;
    

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            const grid = Array(COLUMNS).fill(0).map(() => Array(4 * 2022).fill(false));
            const instrs = input[0].split('');
            let blockCnt=0;
            let instrIdx=0;
            let highest = 0;

            const cycles = part === Part.One ? 2022 : 1000000000000;
            const mem = Array(COLUMNS);

            let height = 0;

            while (blockCnt < cycles) {                

                const block = blocks[blockCnt % blocks.length];


                let blockX = 2;
                let blockY = highest+3;                
                while (true) {
                    const instr = instrs[instrIdx++ % instrs.length]; 
                    if (instr === "<") {
                        blockX = block[0].every((c, i) => {
                            const minx = blockX + block.map(bc => bc[i]).findIndex(e => e) - 1;
                            return minx >= 0 && !grid[minx][blockY + i];
                        }) ? blockX - 1 : blockX;
                    } else {
                        blockX = block[0].every((c, i) => {
                            const maxx = blockX + block.length - block.map(bc => bc[i]).reverse().findIndex(e => e);
                            return maxx < COLUMNS && !grid[maxx][blockY + i];
                        }) ? blockX + 1 : blockX;
                    }
                    if (blockY === 0 || block.some((bc,bi) => grid[blockX + bi][blockY + bc.findIndex(b => b) - 1])) {
                        break;
                    }
                    blockY--;
                }
                block.forEach((bc,bi) => {
                    bc.forEach((b,i) => {
                        grid[blockX + bi][blockY + i] ||= b;
                    });
                });

                highest = grid[0].findIndex((c,i) => grid.every(col => !col[i]));
                
                if (highest > 8020) {
                    grid.forEach((bc,bi) => {
                        mem[bi] = bc.slice(8000);
                    });
                    grid.forEach(bc => bc.fill(false));
                    mem.forEach((bc,bi) => {
                        bc.forEach((e,i) => {
                            grid[bi][i] = mem[bi][i];
                        });
                    });
                    
                    const newHighest = grid[0].findIndex((c,i) => grid.every(col => !col[i]));
                    height += highest - newHighest;
                    highest = newHighest;
                }

                blockCnt++;
            }

            return height + highest;

        }, "2022", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}