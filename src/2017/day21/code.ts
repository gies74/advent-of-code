/**
 * Advent of Code solution 2017/day21
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day21 {

    const turnTile = (tile:string[]):string[] => {
        const tileA = tile.map(r => r.split(''));
        const out = [];
        tileA.forEach((row,i) => {
            row.forEach((e,j) => {
                if (i===0) out.unshift([e]); else out[row.length-j-1].push(e);
                var x = 0;
            });
        });
        return out.map(row => row.join(''));
    }

    const flipTile = (tile:string[]):string[] => {
        return tile.map(r => r.split('').reverse().join(''));
    }

    class Rule {
        in: string[];
        out: string[];
        followUpRules: Rule[];
        _numOn: number = -1;

        constructor(line) {
            const [i1, o1] = line.split(" => ");
            this.in = i1.split("/");
            this.out = o1.split("/");
        }
        fits(tile) {
            return tile.every((line, i) => line === this.in[i])
        }
        apply(tile:string[]):boolean {
            const all8 = [];
            for (var j=0; j<2; j++) {
                for (var i=0; i<4; i++) {
                    all8.push(tile);
                    tile = turnTile(tile);
                }
                tile = flipTile(tile);
            }
            if (all8.some(tileTransform => this.fits(tileTransform), this)) {
                return true;
            }
            return false;
        }
        countOn(depth):number {
            if (depth === 0) {
                if (this._numOn === -1) {
                    const grid = splitGrid([this.out]);
                    this._numOn = grid.reduce((c0,tile) => c0 + tile.reduce((c1,line) => c1 + Utils.sum(line.split("").map(c => c==="#"?1:0)), 0), 0);
                }
                return this._numOn;
            }
            return this.followUpRules.reduce((cum, rule) => cum + rule.countOn(depth-1), 0);
        }


    }

    const tryRules = (grid, rulebook):Rule[] => {

        const outGrid = [];
        for (var tile of grid) {
            for (var rule of rulebook) {
                if (rule.apply(tile)) {             
                    outGrid.push(rule);
                    break;
                }
            }
        }
        if (grid.length != outGrid.length)
            throw "FOUT!!";
        return outGrid;

    };

    const splitGrid = (grid:string[][]):string[][] => {
        const sqrt = Math.sqrt(grid.length);

        const size = sqrt * grid[0][0].length;
        const flatGrid = Array(size).fill(0).map(() => "");
        for (var i=0; i<sqrt; i++) {
            for (var j=0; j<sqrt; j++) {
                const tile = grid[i*sqrt + j];
                for (var l=0; l<tile.length; l++) {
                    flatGrid[i * grid[0][0].length + l] += tile[l];          
                }
            }
        }

        grid = [];
        const div = flatGrid.length % 2 == 0 ? 2 : 3; 

        for (var i=0; i<flatGrid.length; i+=div) {
            for (var j=0; j<flatGrid[i].length; j+=div) {
                const m = [];
                for (var l=0; l<div; l++) {
                    m.push(flatGrid[i+l].substring(j, div + j));
                }
                grid.push(m);
            }
        }


        return grid;
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const rulebook = input.map(line => new Rule(line));
            if (example === 0) {
                rulebook.forEach(rule => {
                    const ruleOutGrid = splitGrid([rule.out]);
                    rule.followUpRules = tryRules(ruleOutGrid, rulebook);                
                });
            } else {
                rulebook[0].followUpRules = [];
                rulebook[1].followUpRules = [rulebook[0],rulebook[0],rulebook[0],rulebook[0]];
            }

            let grid:string[][] = [[".#.", "..#", "###"]];
            const startRules = tryRules(grid, rulebook);

            const iterations = example === 1 ? 1 : (part == Part.One ? 5 : 18) - 1;
            const numOn = startRules.reduce((cum, rule) => cum + rule.countOn(iterations), 0);

            return numOn;

        }, "2017", "day21", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}