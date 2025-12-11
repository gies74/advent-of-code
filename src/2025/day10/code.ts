/**
 * Advent of Code solution 2025/day10
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day10 {

    class Machine {

        config:number;
        buttonBits:number[];
        buttonValues:number[][];
        joltages:number[];
        _joltage2presses:{[key:string]:any[]} = {}

        constructor(line:string) {
            const pattern = /^\[([#.]+)\] ((\(\d(,\d)*\) )+){(\d+(,\d+)*)}$/;
            const match = line.match(pattern);
            this.config = parseInt(match[1].replace(/\./g, "0").replace(/#/g, "1"), 2);
            this.buttonValues = match[2].trimEnd().split(" ").map(b => b.substring(1,b.length-1).split(",").map(c => parseInt(c)));
            this.buttonBits = this.buttonValues.map(but => but.reduce((f,e) => f + Math.pow(2,match[1].length-e-1), 0));
            this.joltages = match[5].split(",").map(n => parseInt(n));
        }

        buttonCombinations(comb:number[][], more:number[]):number[][] {
            if (more.length === 0)
                return comb;

            const nxt = more.shift();
            const extraComb = comb.map(lst => lst.concat([nxt]));
            return this.buttonCombinations(comb.concat(extraComb), more);
        }

        expand(input:number[]):number[][] {
            const result:number[][] = [];
            this.buttonValues.forEach(button => {
                const output = input.slice(0);
                button.forEach(idx => output[idx] -= 1);
                if (output.some(j => j < 0))
                    return;
                result.push(output);
            })
            return result;
        }

        minJPresses():number {
            this._joltage2presses[this.joltages.map(c => String(c)).join("_")] = [0, false];
            let entry;
            while ((entry = Object.entries(this._joltage2presses).find(j2p => !j2p[1][1])) !== undefined) {
                entry[1][1] = true;
                const joltages = this.expand(entry[0].split("_").map(n => parseInt(n)));
                joltages.forEach(j => {
                    const jkey = j.map(c => String(c)).join("_");
                    if (!this._joltage2presses[jkey] || this._joltage2presses[jkey][0] > entry[1][0] + 1)
                        this._joltage2presses[jkey] = [entry[1][0] + 1, false];
                });
            }
            const minPress = this._joltage2presses[Array(this.joltages.length).fill("0").join("_")][0];
            this._joltage2presses = {};
            return minPress;
        }

        minPresses() {
            const combos = this.buttonCombinations([[]], this.buttonBits.slice(0)).slice(1);
            let minPresses = Number.MAX_SAFE_INTEGER;
            for (let combo of combos) {
                const xor = combo.reduce((all, n) => all ^ n, 0);
                if (xor === this.config && combo.length < minPresses)
                    minPresses = combo.length;
            }
            return minPresses;
        }
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

            const machines = input.map(l => new Machine(l));
            if (part === Part.One) 
                return Utils.sum(machines.map(m => m.minPresses()));
            return Utils.sum(machines.map(m => m.minJPresses()));

        }, "2025", "day10", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        1
    );
}