/**
 * Advent of Code solution 2023/day17
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day17 {

    const repTail = inp => {
        const lastChar = inp[inp.length-1];
        const re = RegExp(`${lastChar}*$`);
        return [lastChar, inp.match(re)[0]];
    };

    const inits = (char:string, num:number):string[] => {
        return Array(num).fill(0).map((_, i) => Array(i+1).fill(char).join(''));
    };

    const opposDir = { "n": "s", "s": "n", "e": "w", "w": "e"};

    class SearchCell {
        y:number;
        x:number;
        loss:number;
        leastLoss: {[dir:string]:number} = {};
        neighbours: {[dir:string]:SearchCell} = {};

        constructor (loss:string, y:number, x:number) {
            this.loss = parseInt(loss);
            this.y = y;
            this.x = x;
        }

        update(sender:string, totLoss:number) {
            if (!sender.length) { 
                Object.keys(this.neighbours).forEach(k => {
                   this.neighbours[k].update(opposDir[k], 0);
                });
                return;
            }
            if (sender.length > (this.x + this.y) * 1.4)
                return;
            const [lastChar, reps] = repTail(sender);
            if (reps.length >= 4)
                return;
            
            const starts = inits(lastChar, reps.length);
            if (starts.every(key => !this.leastLoss[key] || this.leastLoss[key] > totLoss + this.loss))
            {
                this.leastLoss[reps] = totLoss + this.loss;
                if (!['s', 'e'].some(d => this.neighbours[d]))
                    return;
                Object.keys(this.neighbours).filter(k => k !== lastChar).forEach(k => {
                    this.neighbours[k].update(sender + opposDir[k], totLoss + this.loss);
                });
            }
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
            grid.forEach((row,ri) => row.forEach((lc, ci) => {
                if (ci < grid[0].length - 1)
                    lc.neighbours["e"] = grid[ri][ci + 1];
                if (ri < grid.length - 1)
                    lc.neighbours["s"] = grid[ri + 1][ci];
                if (ci > 0)
                    lc.neighbours["w"] = grid[ri][ci - 1];
                if (ri > 0)
                    lc.neighbours["n"] = grid[ri - 1][ci];
            }));

            grid[0][0].update("", 0);

            return Math.min(...Object.values(grid[grid.length-1][grid[0].length-1].leastLoss));

        }, "2023", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}