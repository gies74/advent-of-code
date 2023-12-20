/**
 * Advent of Code solution 2023/day17
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day17 {

    class BackTrack {
        cell: SearchCell;
        totLoss: number;

        constructor(cell:SearchCell, totLoss:number) {
            this.cell = cell;
            this.totLoss = totLoss;
        }

        conseqLen(dir:string) {
            return 0;
        }
    }

    class SearchCell {
        loss:number;
        leastLoss: {[dir:string]:BackTrack} = {};
        neighbours: {[dir:string]:SearchCell} = {};
        constructor (loss:string) {
            this.loss = parseInt(loss);
            this.leastLoss = {};
        }

        findBest(path, init) {
            const dirs = init ? ['n', 'w'] : ['n', 'w','s','e'];
            if (!['n','w'].some(d => this.neighbours[d], this)) {
                return this.loss;
            }
            if (!init && path.length >= 3 && /^(n{3}|w{3}|s{3}|e{3})/.test(path)) {
                const i = dirs.indexOf(path[0]);
                dirs.splice(i,1);
            }         
            const losses = dirs.filter(dir => this.neighbours[dir]).map(dir => {                

                const nb = this.neighbours[dir];

                if (!this.leastLoss[dir]) {
                    this.leastLoss[dir] = new BackTrack(nb, Number.MAX_VALUE);
                    this.leastLoss[dir].totLoss = this.loss + nb.findBest(dir + path, init);
                }
                return this.leastLoss[dir].totLoss;

            }, this);
            return Math.min(...losses);
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

            const grid = input.map(l => l.split('').map(loss => new SearchCell(loss)));
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
            
            grid[grid.length-1][grid[0].length-1].findBest("", true);
            grid.forEach(r => r.forEach(c => {
                ['n', 'w','s','e'].filter(dir => c.neighbours[dir]).map(dir => {                
                    const nb = c.neighbours[dir];
                    if (!c.leastLoss[dir]) {
                        c.leastLoss[dir] = new BackTrack(nb, c.loss + Math.min(...Object.values(nb.leastLoss).map(ll => ll.totLoss)));
                    }
    
                });
            }));
            const minLoss = grid[grid.length-1][grid[0].length-1].findBest("", false);
            
            // var chunks = Utils.splitInput(input);
            let answerPart1 = minLoss;
            let answerPart2 = 0;

            if (part == Part.One) {

                return answerPart1;

            } else {

                return answerPart2;

            }

        }, "2023", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        2);
}