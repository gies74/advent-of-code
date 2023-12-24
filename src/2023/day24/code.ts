/**
 * Advent of Code solution 2023/day24
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day24 {

    let TEST_WINDOW:number[];

    class Hailstone {
        prms:number[];
        distTo4:number;
        constructor(line:string) {
            this.prms = line.replace(" @", ",").split(", ").map(n => parseInt(n));
        }

        areParallelXY(other:Hailstone) {
            return other.vx / this.vx === other.vy / this.vy;
        }

        solveCrossTime(other:Hailstone, comp:number) {
            if (this.prms[3 + comp] === other.prms[3 + comp])
                return Number.POSITIVE_INFINITY;

            // vx1 * t + px1 == vx2 * t + px2  ==>  (vx1 - vx2) * t == (px2 - px1)  ==>  t == (px2 - px1) / (vx1 - vx2)
            return (other.prms[0 + comp] - this.prms[0 + comp]) / (this.prms[3 + comp] - other.prms[3 + comp]);
        }

        getPosition(t:number) {
            return [
                this.px + t * this.vx,
                this.py + t * this.vy,
                this.pz + t * this.vz,
            ];
        }

        YZasFuncOfX()  {
                const timeX0 = -1 * this.prms[0] / this.prms[3];
                const yAtX0 = this.prms[1] + timeX0 * this.prms[4];
                const dyRate = this.prms[4] / this.prms[3];
                const zAtX0 = this.prms[2] + timeX0 * this.prms[5];
                const dzRate = this.prms[5] / this.prms[3];
                return [yAtX0, dyRate, zAtX0, dzRate];
        }

        crossInWindow(other:Hailstone):boolean {
            if (this.areParallelXY(other))
                return false;
            const YZAsFuncOfX = [this, other].map(stone => stone.YZasFuncOfX());
            const crossXbyY = (YZAsFuncOfX[1][0] - YZAsFuncOfX[0][0]) / (YZAsFuncOfX[0][1] - YZAsFuncOfX[1][1]);
            const crossY = YZAsFuncOfX[0][0] + crossXbyY * YZAsFuncOfX[0][1];
            const crossXbyZ = (YZAsFuncOfX[1][2] - YZAsFuncOfX[0][2]) / (YZAsFuncOfX[0][1] - YZAsFuncOfX[1][1]);
            const crossZ = YZAsFuncOfX[0][2] + crossXbyZ * YZAsFuncOfX[0][3];

            const [ty1, ty2] = [this, other].map(stone => (crossXbyY - stone.px) / stone.vx);
            const [tz1, tz2] = [this, other].map(stone => (crossXbyZ - stone.px) / stone.vx);

            return [ty1, ty2].every(t => t > 0 && Number.isFinite(t)) && [crossXbyY, crossY].every(xy => xy >= TEST_WINDOW[0] && xy <= TEST_WINDOW[1]);
        }

        //#region stuff
        get vx():number {
            return this.prms[3];
        }

        get vy():number {
            return this.prms[4];
        }
        get vz():number {
            return this.prms[5];
        }

        get px():number {
            return this.prms[0];
        }

        get py():number {
            return this.prms[1];
        }
        get pz():number {
            return this.prms[2];
        }
        toString1(v:string) {
            const abc = "abcdef";
            return [0,1,2].map(comp => `${this.prms[comp]}+${this.prms[comp+3]}*${v}=${abc[comp]}+${abc[comp+3]}*${v}`.replace(/\+\-/g, "-")).join("\r\n");
        }
        toString2() {
            const abc = "abcdef";
            const yz = this.YZasFuncOfX();
            return `y(x)=${yz[1]}*x+${yz[0]},z(x)=${yz[3]}*x+${yz[1]}`;
        }
        distTo(other:Hailstone) {
            const dist = Math.sqrt(Utils.sum([0,1,2].map(c => Math.pow(this.prms[c] - other.prms[c], 2))));
            return dist;
        }
        //#endregion
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example:number = 0) => {

            TEST_WINDOW = example === 0 ? [200000000000000, 400000000000000] : [7, 27];

            const hailstones = input.map(l => new Hailstone(l));

            if (part == Part.One) {

                let count = 0;
                for (var i=0; i<hailstones.length-1;i++) {
                    const stone1 = hailstones[i];
                    for (var j=i+1; j<hailstones.length;j++) {
                        const stone2 = hailstones[j];
                        count += (stone1.crossInWindow(stone2)) ? 1 : 0;
                    }
                }
    
                return count;

            } else {

                const somestones = hailstones.slice(0,3);

                const equations = somestones.map((os,i) => os.toString1("xyz"[i])).join("\r\n");
                console.log(equations);
                // enter results into
                // https://quickmath.com/webMathematica3/quickmath/equations/solve/advanced.jsp

                return 0;

            }

        }, "2023", "day24", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}