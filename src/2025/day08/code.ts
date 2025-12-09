/**
 * Advent of Code solution 2025/day08
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day08 {

    class Line {
        jbox1: JBox;
        jbox2: JBox;
        used:boolean = false;
        constructor(jbox1, jbox2) {
            this.jbox1=jbox1;
            this.jbox2=jbox2;
            jbox1.lines.push(this);
            jbox2.lines.push(this);
        }
        get length():number {
            return Math.sqrt([0,1,2].reduce((cum, n) => cum + Math.pow(this.jbox1.coords[n]-this.jbox2.coords[n],2), 0));
        }
        connects(jb1:JBox, jb2:JBox) {
            return ([jb1,jb2].includes(this.jbox1) && [jb1,jb2].includes(this.jbox2) && this.used);
        }
        oppJbox(jb:JBox) {
            return this.jbox1 === jb ? this.jbox2 : this.jbox1;
        }
        toString() {
            return `${this.jbox1.toString()} - ${this.jbox2.toString()} (${this.used})`;
        }
    }

    class JBox {
        coords:number[];
        lines:Line[] = [];
        constructor(line:string){
            this.coords = line.split(",").map(n => parseInt(n));
        }
        toString() {
            return this.coords.map(c => String(c)).join(",");
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

            const jboxes = input.map(l => new JBox(l));
            const lines:Line[] = [];
            for (let i=0;i<jboxes.length-1;i++)
                for(let j=i+1;j<jboxes.length;j++)
                    lines.push(new Line(jboxes[i], jboxes[j]));

            let goal = example === 1 ? 10 : 1000;
            while (goal>0) {
                goal--;
                console.log(goal);
                let shortestDist=Number.MAX_SAFE_INTEGER;
                let shortestLine=null;
                lines.filter(l => !l.used).forEach(line => {
                    if (line.length < shortestDist) {
                        shortestDist = line.length;
                        shortestLine = line;
                    }                    
                });
                shortestLine.used = true;
            }

            const circuits:JBox[][] = [];
            let jbox;
            while ((jbox = jboxes.find(jb => !circuits.some(circuit => circuit.includes(jb)))) !== undefined) {
                const circuit = [jbox];
                circuits.push(circuit);

                let cjbox;
                while ((cjbox = jboxes.find(jb => !circuit.includes(jb) && circuit.some(cjb => jb.lines.some(l => l.connects(jb, cjb))))) != undefined)
                    circuit.push(cjbox);
            }

            let circuitSizes = circuits.map(c => c.length);
            circuitSizes = circuitSizes.sort().reverse();
            const prod3 = circuitSizes.slice(0, 3).reduce((prod, e) => prod * e, 1);

            return prod3;  //729 too low

        }, "2025", "day08", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        1
    );
}