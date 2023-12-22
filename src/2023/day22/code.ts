/**
 * Advent of Code solution 2023/day22
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day22 {

    class Brick {
        name:string = "";
        xs: number[] = [];
        ys: number[] = [];
        zs: number[] = [];
        isFloor:boolean = false;
        leansOn: Brick[];
        supports: Brick[] = [];

        constructor(line:string) {
            const cs= line.split("~");
            cs.forEach(c => {
                const ns = c.split(",");
                this.xs.push(parseInt(ns[0]));
                this.ys.push(parseInt(ns[1]));
                this.zs.push(parseInt(ns[2]));                
            });
        }

        get top():number {
            return this.isFloor ? 0 : this.height + this.leansOn[0].top;
        }

        get height():number {
            return this.zs[1] - this.zs[0] + 1;
        }

        get lowZ():number {
            return this.zs[0];
        }

        supportsExclusively(fallingAnyway:Brick[] = []) {
            return this.supports.filter(supported => supported.leansOn.filter(lo => !fallingAnyway.includes(lo)).length === 1); // .length <= 1); // 
        }

        disintegratable() {
            return this.supports.every(supported => supported.leansOn.length > 1);
        }

        allSupportsExclusively(fallingAnyway:Brick[] = []):Brick[] {
            const ex = this.supportsExclusively(fallingAnyway);
            return ex.concat(...ex.map(b => b.allSupportsExclusively(fallingAnyway.concat(ex.filter(e => e !== b)))));
        }

        toString() {
            return `${this.name}`;    
        }
    }

    const range =(start:number, end:number):number[] => Array.from({length: (end - start + 1)}, (v, k) => k + start);

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            const allBricks = input.map(line => new Brick(line));
            allBricks.sort((b1,b2) => b1.lowZ - b2.lowZ);
            allBricks.forEach((b,i) => b.name = abc[i % abc.length]);

            const floor = new Brick("1,1,0~9,9,0");
            floor.name = "floor";
            floor.isFloor = true;

            const memory:Brick[][] = Utils.multiDimArray(2, 10, () => floor);

            allBricks.forEach(b => {

                const rx = range(b.xs[0],b.xs[1]);
                const ry = range(b.ys[0],b.ys[1]);

                let stackTop = -1;
                rx.forEach(x => ry.forEach(y => {
                    stackTop = Math.max(memory[x][y].top, stackTop); 
                }));
                const topBricks = [...new Set(rx.reduce((st1,x) => st1.concat(ry.reduce((st2,y) => {
                    if (memory[x][y].top === stackTop)
                        st2.push(memory[x][y]);
                    return st2;
                }, [])), []))] as Brick[];
                
                b.leansOn = topBricks;
                topBricks.forEach(tb => tb.supports.push(b));
                rx.forEach(x => ry.forEach(y => {
                    memory[x][y] = b; 
                }));
            });

            if (part == Part.One) {
                const nDisintegratable = Utils.countTruthy(allBricks.filter(b => b.disintegratable()));
                let answerPart1 = nDisintegratable;
                return answerPart1;
            } else {
                const answerPart2 = Utils.sum(allBricks.map(b => {
                    const supEx = b.allSupportsExclusively();
                    const s = new Set(supEx);
                    return s.size;
                }));
                return answerPart2;
            }

        }, "2023", "day22", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}