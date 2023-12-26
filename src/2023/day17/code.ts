/**
 * Advent of Code solution 2023/day17
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { groupCollapsed } from "console";
import { Part, Utils } from "../../generic";
import { Dir } from "fs";

namespace day17 {

    const aStar = (start:SearchCell, goal:SearchCell, grid:SearchCell[][], part:Part):number => {
        

        const openSet: SearchCell[] = [start];
        start.gScores.push(new GScore(start, null));
        start.fScore = start.h; 
        goal.isGoal = true;

        while (openSet.length) {

            const lowestFScore = Math.min(...openSet.map(sc => sc.fScore));
            const current = openSet.find(sc => sc.fScore === lowestFScore);

            if (current === goal) {
                console.log(goal.lowestGScore.toString());
                return goal.lowestGScore.gScore;
            }

            openSet.splice(openSet.indexOf(current), 1)

            current.neighbours.forEach(neighbour => {
                // [[0,7],[4,7]].some(c => current.y === c[0] && current.x === c[1]) && [[4,7],[4,11]].some(c => neighbour.y === c[0] && neighbour.x === c[1])
                if (neighbour.improveScores(current.gScores, part)) {
                    neighbour.fScore = neighbour.h; // + neighbour.lowestGScore.gScore;
                    if (!openSet.includes(neighbour))
                        openSet.push(neighbour);
                }
            });
        }
        
        return 10E6;
    };

    class GScore {
        owner:SearchCell;
        cameFrom:GScore = null;
        constructor(owner, cameFrom) {
            this.owner = owner;
            this.cameFrom = cameFrom;
        }

        history(n):number[][] {
            if (n === 0)
                return [];
            let coords:number[][];
            if (this.cameFrom) {
                coords = this.owner.listBackTrack(this.cameFrom.owner).map(sc => [sc.y,sc.x]);
            } else {
                coords = [[this.owner.y, this.owner.x]];
            }
            return (this.cameFrom ? this.cameFrom.history(n - 1) : []).concat(coords);
        }

        newLinearity(refCrd:number[] = null, n:number = 4):number[][] {
            const history = this.history(n).reverse();
            const linearity:number[][] = [];
            if (refCrd) {
                while (refCrd[0] !== history[0][0] || refCrd[1] !== history[0][1])
                {
                    const h0 = history[0][0], h1 = history[0][1];
                    history.unshift([h0 + Math.sign(refCrd[0] - h0), h1 + Math.sign(refCrd[1] - h1)]);
                }
            }
            refCrd = history.shift();

            let xConstant = true, yConstant = true, crd:number[];
            while (crd = history.shift()) {
                if (yConstant && crd[0] !== refCrd[0]) 
                {
                    linearity.push([0, 0]);
                    yConstant = false;
                    xConstant = true;
                } else if (xConstant && crd[1] !== refCrd[1]) {
                    linearity.push([0, 0]);
                    xConstant = false;
                    yConstant = true;
                }
                if (xConstant) {
                    linearity[linearity.length - 1][0] += refCrd[0] - crd[0];
                } else {
                    linearity[linearity.length - 1][1] += refCrd[1]- crd[1];
                }
                refCrd = crd;
            }
            return linearity.reverse();

        }

        satisfies_10_4_criterium(refCrd) {
            const linearity = this.newLinearity(refCrd);
            const valid = linearity.every((l,i) => [0,1].every(xy => l[xy] === 0 || Math.abs(l[xy]) >= 4 && Math.abs(l[xy]) <= 10));
            return valid;
        }

        linearity(asking:SearchCell = null):number[] {
            const yx = asking ? [asking.y, asking.x] : null;
            const nl = this.newLinearity(yx);
            return nl[nl.length - 1];
        }

        get gScore():number {
            if (!this.cameFrom)
                return 0;
            return Utils.sum(this.owner.listBackTrack(this.cameFrom.owner).map(sc => sc.loss)) + this.cameFrom.gScore;
        }

        toString() {
            let path = this.history(100).map(coord => `(${coord[0]},${coord[1]})`).join('') + " ### "; //  ""; 
            path += this.newLinearity(null, 100).map(coord => `(${coord[0]},${coord[1]})`).join('');
            return `[${this.gScore}] ${path}`;
        }

    }

    class SearchCell {
        y:number;
        x:number;
        loss:number;
        fScore:number = 10E6;
        neighbours:SearchCell[] = [];
        btNeighbours:SearchCell[] = [];
        gScores:GScore[] = [];
        isGoal = false;

        constructor (loss:string, y:number, x:number) {
            this.loss = parseInt(loss);
            this.y = y;
            this.x = x;
        }

        listBackTrack(sc:SearchCell):SearchCell[] {
            if (sc === this) {
                return [];
            }
            const py = this.y + Math.sign(sc.y - this.y);
            const px = this.x + Math.sign(sc.x - this.x);
            const btNeighbour = this.btNeighbours.find(nb => nb.y === py && nb.x === px);
            return btNeighbour.listBackTrack(sc).concat([this]);
        }

        gScoreAcceptable(gScore:GScore, part:Part):boolean {
            const history = gScore.history(10);
            let acceptable = !history.some(c => c[0] === this.y && c[1] === this.x, this);
            if (part === Part.One) {
                acceptable &&= history.length < 4 || acceptable && history.some(c => c[0] !== this.y, this) && history.some(c => c[1] !== this.x, this);
            } else {
                acceptable &&= gScore.satisfies_10_4_criterium([this.y, this.x]);
            }
            return acceptable;
        }


        improveScores(gScores:GScore[], part:Part) {
            let improved:boolean = false;
            gScores.forEach(offeredGScore => {
                if (!this.gScoreAcceptable(offeredGScore, part)) 
                    return;
                const offeredLinearity = offeredGScore.linearity(this);
                const tentativeLoss = Utils.sum(this.listBackTrack(offeredGScore.owner).map(sc => sc.loss));

                this.gScores.forEach(myGScore => {
                    const myLinearity = myGScore.linearity();
                    if ([0,1].every(xy => Math.abs(Math.sign(offeredLinearity[xy])) === Math.abs(Math.sign(myLinearity[xy]))))
                        if (offeredGScore.gScore + tentativeLoss < myGScore.gScore) {
                            myGScore.cameFrom = offeredGScore;
                            improved = true;
                            return;
                        }
                        const checkpoint1 = true;
                }, this);
                if (improved)
                    return;
                if (this.gScores.every(myGScore => {
                    const myLinearity = myGScore.linearity();
                    const linearityMatches = [0,1].every(xy => Math.abs(Math.sign(offeredLinearity[xy])) === Math.abs(Math.sign(myLinearity[xy])));
                    return !linearityMatches;
                }))
                {
                    const gsc = new GScore(this, offeredGScore);
                    this.gScores.push(gsc);
                    improved = true;
                }
                const checkpoint2 = true;
            }, this);

            return improved;
        }

        get lowestGScore():GScore {
            const min = Math.min(...this.gScores.map(gs => gs.gScore));
            return this.gScores.find(gs => gs.gScore === min);
        }

        get h() {
            return (this.x + this.y);
        }

        toString() {
            return `(${this.y},${this.x})`;
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

            if (part === Part.One) {
                grid.forEach((row,y) => row.forEach((sc, x) => {
                    if (y > 0)
                        sc.neighbours.push(grid[y-1][x]);
                    if (y < grid.length - 1)
                        sc.neighbours.push(grid[y+1][x]);
                    if (x > 0)
                        sc.neighbours.push(grid[y][x-1]);
                    if (x < row.length - 1)
                        sc.neighbours.push(grid[y][x+1]);
                }));
            } else {
                grid.forEach((row,y) => row.forEach((sc, x) => {
                    for (var i=4; i<=10; i++) {
                        if (y - i >= 0)
                            sc.neighbours.push(grid[y - i][x]);
                        if (y + i < grid.length)
                            sc.neighbours.push(grid[y + i][x]);
                        if (x - i >= 0)
                            sc.neighbours.push(grid[y][x - i]);
                        if (x + i < row.length)
                            sc.neighbours.push(grid[y][x + i]);
                    }
                    if (y > 0)
                        sc.btNeighbours.push(grid[y-1][x]);
                    if (y < grid.length - 1)
                        sc.btNeighbours.push(grid[y+1][x]);
                    if (x > 0)
                        sc.btNeighbours.push(grid[y][x-1]);
                    if (x < row.length - 1)
                        sc.btNeighbours.push(grid[y][x+1]); 
                }));

            }

            const score = aStar(grid[0][0], grid[grid.length-1][grid[0].length-1], grid, part);
            // const score = aStar(grid[grid.length-1][grid[0].length-1], grid[0][0], grid);

            return score;
            // p2 answer 930 too high, wrong: 927 

        }, "2023", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}