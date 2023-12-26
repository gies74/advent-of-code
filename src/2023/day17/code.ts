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

        while (openSet.length) {

            const lowestFScore = Math.min(...openSet.map(sc => sc.fScore));
            const current = openSet.find(sc => sc.fScore === lowestFScore);

            if (current === goal) {
                console.log(goal.lowestGScore.toString());
                return goal.lowestGScore.gScore;
            }

            openSet.splice(openSet.indexOf(current), 1)

            current.neighbours.forEach(neighbour => {
                if (neighbour.improveScores(current.gScores, part)) {
                    // neighbour.gScore = tentativeScore;
                    neighbour.fScore = current.lowestGScore.gScore + neighbour.h;
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
            const coords = [[this.owner.y, this.owner.x]];
            return (this.cameFrom ? this.cameFrom.history(n - 1) : []).concat(coords);
        }

        satisfies_10_4_criterium() {
            const history = this.history(11).reverse();
            let refCrd = history.shift();
            if (!refCrd)
                return true;
            const linearity:number[][] = [];
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
                    linearity[linearity.length - 1][0] += Math.sign(refCrd[0] - crd[0]);
                } else {
                    linearity[linearity.length - 1][1] += Math.sign(refCrd[1]- crd[1]);
                }
                refCrd = crd;
            }
            if (!linearity.length)
                return true;
            const valid = linearity.slice(1).every(l => [0,1].every(xy => l[xy] === 0 && l[xy] > 4 && l[xy] < 10));
            return valid;
        }

        linearity(asking:SearchCell = null, depth:number = 4):number[] {
            const history = this.history(depth).reverse();
            const yx = asking ? [asking.y, asking.x] : history.shift();
            const retval = [0, 0];
            let xConstant = true, yConstant = true, crd:number[];
            while ((xConstant || yConstant) && (crd = history.shift())) {
                yConstant &&= crd[0] === yx[0];
                xConstant &&= crd[1] === yx[1];
                if (xConstant) {
                    retval[0] = yx[0] - crd[0];
                }
                if (yConstant) {
                    retval[1] = yx[1] - crd[1];
                }
            }
            return retval;0
        }

        get gScore() {
            return !this.cameFrom ? 0 : this.owner.loss + this.cameFrom.gScore;
        }

        toString() {
            const path = this.history(100).map(coord => `(${coord[0]},${coord[1]})`).join('');
            return `[${this.gScore}] ${path}`;
        }

    }

    class SearchCell {
        y:number;
        x:number;
        loss:number;
        fScore:number = 10E6;
        neighbours:SearchCell[] = [];
        gScores:GScore[] = [];

        constructor (loss:string, y:number, x:number) {
            this.loss = parseInt(loss);
            this.y = y;
            this.x = x;
        }

        gScoreAcceptable(gScore:GScore, part:Part):boolean {
            const history = gScore.history(part === Part.One ? 4 : 11);
            let acceptable = !history.some(c => c[0] === this.y && c[1] === this.x, this)
            if (part === Part.One) {
                acceptable = history.length < 4 || acceptable && history.some(c => c[0] !== this.y, this) && history.some(c => c[1] !== this.x, this);
            } else {
                acceptable = gScore.satisfies_10_4_criterium();
            }
            return acceptable;
        }


        improveScores(gScores:GScore[], part:Part) {
            let improved:boolean = false;
            gScores.forEach(offeredGScore => {
                if (!this.gScoreAcceptable(offeredGScore, part)) 
                    return;
                const offeredLinearity = offeredGScore.linearity(this);

                this.gScores.forEach(myGScore => {
                    const myLinearity = myGScore.linearity();
                    if ([0,1].every(xy => offeredLinearity[xy] === 0 ? myLinearity[xy] === 0 : (myLinearity[xy] / offeredLinearity[xy]) >= 1) && offeredGScore.gScore + this.loss < myGScore.gScore) {
                        myGScore.cameFrom = offeredGScore;
                        improved = true;
                        return;
                    }
                    const checkpoint1 = true;
                }, this);
                if (!this.gScores.find(myGScore => {
                    const myLinearity = myGScore.linearity();
                    return [0,1].every(xy => offeredLinearity[xy] === 0 ? myLinearity[xy] === 0 : (myLinearity[xy] / offeredLinearity[xy]) <= 1) && myGScore.gScore <= this.loss + offeredGScore.gScore;
                }, this)) {
                    this.gScores.push(new GScore(this, offeredGScore));
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

            const score = aStar(grid[0][0], grid[grid.length-1][grid[0].length-1], grid, part);
            // const score = aStar(grid[grid.length-1][grid[0].length-1], grid[0][0], grid);

            return score;
            // answer 749 wrong, 763 too high

        }, "2023", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}