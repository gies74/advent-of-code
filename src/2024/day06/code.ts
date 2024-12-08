/**
 * Advent of Code solution 2024/day06
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day06 {

    class PosState {
        position:number[];
        symbol:string;
        constructor(position:number[], symbol:string) {
            this.position = position;
            this.symbol = symbol;
        }
        get facing():number[] {
            return { "^": [-1, 0], ">": [0, 1], "v": [1, 0], "<": [0, -1]}[this.symbol];
        }
        turn():PosState {
            const symbol = { "^": ">", ">": "v", "v": "<", "<": "^", }[this.symbol];
            return new PosState(this.position, symbol);
        }
        stride():PosState {
            return new PosState([this.position[0] + this.facing[0], this.position[1] + this.facing[1]] , this.symbol);
        }
        equals(ps:PosState, includeSymbol) {
            return ps.position[0] === this.position[0] && ps.position[1] === this.position[1] && (!includeSymbol || ps.symbol === this.symbol);
        }
    }

    const findPathOut = (grid:string[][], posState:PosState, hypothesizeObstacles:boolean):number => {
        const pathHistory:PosState[] = [];
        const obstacleHistory:PosState[] = [];

        while (true) {
            if (!pathHistory.some(ps => ps.equals(posState, false))) {
                pathHistory.push(posState);
            }

            const npos = [posState.position[0] + posState.facing[0], posState.position[1] + posState.facing[1]];
            if (npos[0] === -1 || npos[0] === grid.length || npos[1] === -1 || npos[1] === grid[0].length) {
                // leaving grid, return how many steps
                return hypothesizeObstacles ? obstacleHistory.length : pathHistory.length;
            }

            const gridSymbol = grid[npos[0]][npos[1]];
            if (![".", "^"].includes(gridSymbol)) {
                posState = posState.turn();
                continue;
            }
            if (hypothesizeObstacles && (npos[0] !== pathHistory[0].position[0] || npos[1] !== pathHistory[0].position[1])) {
                const gridClone = grid.map(row => row.slice(0));
                gridClone[npos[0]][npos[1]] = "O";
                const pathLen = findPathOut(gridClone, pathHistory[0], false);
                const obstacle = new PosState([npos[0],npos[1]], "#");
                if (pathLen === -1 && !obstacleHistory.some(ps => ps.equals(obstacle, false)))
                    obstacleHistory.push(obstacle);
            }
            posState = posState.stride();
            if (pathHistory.some(ps => ps.equals(posState, true))) {
                // been here before loop detected
                return -1;
            }            
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

            const grid = input.map(line => line.split(""));
            var pos = [input.findIndex(line => /\^/.test(line)), 0];
            pos[1] = grid[pos[0]].findIndex(cell => cell === "^");
            const start = new PosState(pos, "^");

            return findPathOut(grid, start, part === Part.Two);

        }, "2024", "day06", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}