/**
 * Advent of Code solution 2022/day24
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { text } from "stream/consumers";
import { Part, Utils } from "../../generic";

namespace day24 {

    class TimeCell {
        x: number;
        y: number;
        t: number;
        prevTC: TimeCell;

        constructor (x, y, prevTC) {
            this.x = x;
            this.y = y;
            this.prevTC = prevTC;
        }

        getSteps() {
            let steps = 0;
            let tc:TimeCell = this;
            while (tc != null) {
                tc = tc.prevTC;
                steps++;
            }
            return steps;
        }
    }
    
    class SearchSpace {
        limX: number;
        limY: number;
        timeCells: TimeCell[] = [];

        constructor(limY:number, limX:number) {
            this.limY = limY;
            this.limX = limX;
            this.timeCells = [new TimeCell(0, -1, null)];
        }

        isSolved() {
            return this.timeCells.some(tc => tc.y === this.limY-1 &&  tc.x === this.limX-1);
        }

        search(blizzards: Blizzard[]) {
            let time = 0;
            while (!this.isSolved()) {
                blizzards.forEach(b => b.move());
                time++;

                // add all cells in waiting state
                const timeCells = this.timeCells.map(tc => new TimeCell(tc.x, tc.y, tc));

                const searchSpace = this;
                this.timeCells.forEach(tc => {
                    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(delta => {
                        if (tc.y + delta[0] < 0 || tc.y + delta[0] >= searchSpace.limY || 
                            tc.x + delta[1] < 0 || tc.x + delta[1] >= searchSpace.limX ||
                            blizzards.some(b => tc.y + delta[0] === b.y && tc.x + delta[1] === b.x)) {
                            return;
                        }                        
                        if (!timeCells.some(etc => tc.y + delta[0] === etc.y && tc.x + delta[1] === etc.x)) {
                            timeCells.push(new TimeCell(tc.x + delta[1] , tc.y + delta[0], tc))
                        }
                    });                    
                });

                this.timeCells = timeCells;
            }

            let solutionTC = this.timeCells.find(tc => tc.y === this.limY-1 &&  tc.x === this.limX-1);
            return solutionTC.getSteps();

        }

    }

    class Blizzard {
        x: number;
        y: number;
        dir: number[];
        lim: number;

        constructor(x:number, y:number, char:string, limX:number, limY:number) {
            this.x = x;
            this.y = y;
            this.dir = { ">": [0, 1], "<": [0, -1], "^": [-1, 0], "v": [1, 0] }[char];
            this.lim = "><".includes(char) ? limX : limY;
        }

        move() {
            this.y = this.dir[0] !== 0 ? (this.y + this.dir[0] + this.lim) % this.lim : this.y;
            this.x = this.dir[1] !== 0 ? (this.x + this.dir[1] + this.lim) % this.lim : this.x;            
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

            const blizzards: Blizzard[] = [];

            input.slice(1, input.length - 1).map((line, li) => {
                line.split('').slice(1, input[0].length - 1).map((c, ci) => {
                    if (c === ".")
                        return;
                    blizzards.push(new Blizzard(ci, li, c, input[0].length-2, input.length-2));
                });
            });

            const searchSpace = new SearchSpace(input.length -2, input[0].length - 2);
            
            let answerPart1 = searchSpace.search(blizzards);
            let answerPart2 = 0;

            if (part == Part.One) {

                // part 1 specific code here

                return answerPart1;

            } else {

                // part 2 specific code here

                return answerPart2;

            }

        }, "2022", "day24", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}