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
        start.vGScore = 0;
        start.hGScore = 0;
        start.fScore = start.h; 

        while (openSet.length) {

            const lowestFScore = Math.min(...openSet.map(sc => sc.fScore));
            const current = openSet.find(sc => sc.fScore === lowestFScore);

            if (current === goal) {
                return Math.min(goal.vGScore, goal.hGScore);
            }

            openSet.splice(openSet.indexOf(current), 1)

            current.vNeighbours.forEach(vNeighbour => {
                const tentativeScore = current.vGScore + Utils.sum(vNeighbour.listBackTrack(current).map(sc => sc.loss));
                if (vNeighbour.hGScore > tentativeScore) {
                    vNeighbour.hGScore = tentativeScore;
                    vNeighbour.fScore = vNeighbour.h + Math.min(vNeighbour.vGScore, vNeighbour.hGScore);; 
                    if (!openSet.includes(vNeighbour))
                        openSet.push(vNeighbour);
                }
            });
            current.hNeighbours.forEach(hNeighbour => {
                const tentativeScore = current.hGScore + Utils.sum(hNeighbour.listBackTrack(current).map(sc => sc.loss));
                if (hNeighbour.vGScore > tentativeScore) {
                    hNeighbour.vGScore = tentativeScore;
                    hNeighbour.fScore = hNeighbour.h + Math.min(hNeighbour.vGScore, hNeighbour.hGScore);
                    if (!openSet.includes(hNeighbour))
                        openSet.push(hNeighbour);
                }
            });
        }
        
        return 10E6;
    };


    class SearchCell {
        y:number;
        x:number;
        loss:number;
        fScore:number = 10E6;
        vGScore:number = 10E6;
        hGScore:number = 10E6;
        hNeighbours:SearchCell[] = [];
        vNeighbours:SearchCell[] = [];
        btNeighbours:SearchCell[] = [];

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

            const minStepsStraight = part === Part.One ? 1 : 4;
            const maxStepsStraight = part === Part.One ? 3 : 10;

            grid.forEach((row,y) => row.forEach((sc, x) => {
                for (var i=minStepsStraight; i<=maxStepsStraight; i++) {
                    if (y - i >= 0)
                        sc.vNeighbours.push(grid[y - i][x]);
                    if (y + i < grid.length)
                        sc.vNeighbours.push(grid[y + i][x]);
                    if (x - i >= 0)
                        sc.hNeighbours.push(grid[y][x - i]);
                    if (x + i < row.length)
                        sc.hNeighbours.push(grid[y][x + i]);
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



            const score = aStar(grid[0][0], grid[grid.length-1][grid[0].length-1], grid, part);
            // const score = aStar(grid[grid.length-1][grid[0].length-1], grid[0][0], grid);

            return score;
            // p2 answer 930 too high, wrong: 927 

        }, "2023", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}