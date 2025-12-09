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
        dist(otherjbox:JBox):number {
            return [0,1,2].reduce((cum, n) => cum + Math.pow(this.coords[n]-otherjbox.coords[n],2), 0); 
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
            const lines:number[][] = Utils.multiDimArray(2, jboxes.length, ()=>0);
            const all = [];
            for (let i=0;i<jboxes.length-1;i++)
                for(let j=i+1;j<jboxes.length;j++) {
                    lines[i][j] = jboxes[i].dist(jboxes[j]);
                    all.push(lines[i][j]);
                }

            let goal = example === 1 ? 10 : 1000;
            const circuits:Set<JBox>[] = [];
            while (goal>0 || part === Part.Two) {
                let min = Number.MAX_SAFE_INTEGER;
                let mini = 0;
                let minj = 0;
                for (let i=0;i<jboxes.length-1;i++) {
                    const row = lines[i].slice(i+1);
                    const tmin = Math.min(...row);
                    if (tmin < min) {
                        min = tmin;
                        mini = i;
                        minj = i + 1 + row.findIndex(e => e === tmin);
                    }
                }
                const jb1 = jboxes[mini];
                const jb2 = jboxes[minj];
                const ncircuits = circuits.filter(c => c.has(jb1) || c.has(jb2));
                if (ncircuits.length === 0) {
                    circuits.push(new Set([jb1, jb2]));                    
                } else {
                    ncircuits[0].add(jb1);
                    ncircuits[0].add(jb2);
                    if (ncircuits.length > 1) {
                        [...ncircuits[1]].forEach(e => ncircuits[0].add(e));
                        circuits.splice(circuits.indexOf(ncircuits[1]), 1);
                    }
                }
                if (part === Part.Two && circuits[0].size === jboxes.length) {
                    return jb1.coords[0] * jb2.coords[0];
                }
                lines[mini][minj] = Number.MAX_SAFE_INTEGER;

                goal--;
            }

            let circuitSizes = circuits.map(c => c.size);
            circuitSizes.sort((a,b) => a - b);
            circuitSizes.reverse();
            const prod3 = circuitSizes.slice(0, 3).reduce((prod, e) => prod * e, 1);

            return prod3;  //729 too low

        }, "2025", "day08", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}