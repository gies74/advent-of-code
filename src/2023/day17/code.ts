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

    const aStar = (start:SearchCell, goal:SearchCell, grid:SearchCell[][]):number => {
        

        const openSet: SearchCell[] = [start];
        start.scoreUpdated(0, null);
        start.fScore = 0; // start.h;

        while (openSet.length) {

            const lowestFScore = Math.min(...openSet.map(sc => sc.fScore));
            const current = openSet.find(sc => sc !== goal && sc.fScore === lowestFScore);

            if (openSet.length === 1 && openSet.includes(goal)) {
                console.log(goal.path);
                return Math.min(...Object.values(goal.gScores).map(gs => gs.gScore));
            }

            openSet.splice(openSet.indexOf(current), 1)

            Object.keys(current.neighbours).forEach(k => { 
                const neighbour = current.neighbours[k];
                const tentativeScore = current.gScores[k].gScore + neighbour.loss;
                let gss: DirGScore[];

                if ((gss = neighbour.scoreUpdated(tentativeScore, current)).length) {
                    // neighbour.gScore = tentativeScore;
                    neighbour.fScore = 0; // tentativeScore + neighbour.h
                    if (!openSet.includes(neighbour))
                        openSet.push(neighbour);
                }
            });
        }
        
        return 10E6;
    };

    class DirGScore {
        owner:SearchCell;
        dir:string;
        gScore:number = 10E6;
        cameFrom:SearchCell = null;
        constructor(owner, d) {
            this.owner = owner;
            this.dir = d;
        }

        canUpdate(comingFrom) {
            if (!comingFrom)
                return true;
            const history:SearchCell[] = this.cameFromHistory(comingFrom, 3);
            const reversing = comingFrom.getDirection(history[history.length-1]) === this.dir;

            if (reversing || history.length === 3 && history.concat([this.owner]).every((cf,i) => i === 0 || history[i-1].getDirection(cf) === this.dir, this))
                return false;  
            return true;          

        }

        cameFromHistory(referringSearchCell:SearchCell, n) {
            if (n == 1) {
                return [referringSearchCell];
            }
            const referringGScore =  referringSearchCell.gScores[referringSearchCell.getDirection(this.owner)];
            if (!referringGScore.cameFrom)
                return [referringSearchCell];
            return referringGScore.cameFromHistory(referringGScore.cameFrom, n-1).concat([referringSearchCell]);
        }
    }


    class SearchCell {
        y:number;
        x:number;
        loss:number;
        fScore:number = 10E6;
        neighbours:{[windDir:string]:SearchCell} = {};
        gScores:{[windDir:string]:DirGScore} = {};

        constructor (loss:string, y:number, x:number) {
            this.loss = parseInt(loss);
            this.y = y;
            this.x = x;
        }

        getDirection(sc:SearchCell) {
            return Object.keys(this.neighbours).find(k => this.neighbours[k] === sc);
        }

        scoreUpdated(tentativeScore:number, cameFrom:SearchCell) {
            return Object.values(this.gScores).filter(gs => {
                if (tentativeScore < gs.gScore && gs.canUpdate(cameFrom)) {
                    gs.gScore = tentativeScore;
                    gs.cameFrom = cameFrom;
                    return true;
                }
                return false;
            }, this);
        }

        get lowestGScore():DirGScore {
            const min = Math.min(...Object.values(this.gScores).map(gs => gs.gScore));
            return Object.values(this.gScores).find(gs => gs.gScore === min);
        }

        get h() {
            return (this.x + this.y);
        }

        get path() {
            const gs = this.lowestGScore;
            const history = gs.cameFromHistory(gs.cameFrom, 500);
            history.push(this);
            return history.map(sc => sc.toString()).join(" - ");
        }

        createGScores() {
            Object.keys(this.neighbours).forEach(k => {
                this.gScores[k] = new DirGScore(this, k);
           });
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
                    sc.neighbours["n"] = grid[y-1][x];
                if (y < grid.length - 1)
                    sc.neighbours["s"] = grid[y+1][x];
                if (x > 0)
                    sc.neighbours["w"] = grid[y][x-1];
                if (x < row.length - 1)
                    sc.neighbours["e"] = grid[y][x+1];
                sc.createGScores();
            }));

            const score = aStar(grid[0][0], grid[grid.length-1][grid[0].length-1], grid);
            // const score = aStar(grid[grid.length-1][grid[0].length-1], grid[0][0], grid);

            return score;
            // answer 763 too high

        }, "2023", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}