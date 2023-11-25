/**
 * Advent of Code solution 2019/day12
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day12 {

    class Moon {
        pos : number[];
        vel: number[];
        constructor(line) {
            const cs = line.split(/[=,>]/).map(e => parseInt(e));
            this.pos = [cs[1], cs[3], cs[5]];
            this.vel = [0,0,0];
        }
    }

    const simulateCycle = (moons:Moon[], dims:number[]) => {
        for (var n=0; n<moons.length-1; n++) {
            for (var m=n+1; m<moons.length; m++) {
                dims.forEach(pos => {
                    const deltaN = Math.sign(moons[m].pos[pos] - moons[n].pos[pos]);
                    moons[n].vel[pos] += deltaN;
                    moons[m].vel[pos] -= deltaN;
                });
            }
        }

        moons.forEach(m => {
            dims.forEach(pos => {
                m.pos[pos] += m.vel[pos];
            });
        });

    }

    const computeEnergy = (moons:Moon[], dims:number[]):number => {
        return moons.reduce((ke, m) => ke + dims.reduce((cum, d) => cum + Math.abs(m.pos[d]), 0) * dims.reduce((cum, d) => cum + Math.abs(m.vel[d]), 0), 0);
    }

    const dimPosVel = (moons:Moon[], dim:number):number[] => {
        return moons.map(m => m.pos[dim]).concat(moons.map(m => m.vel[dim]));
    }

    const DIMS = [0,1,2];

    // https://decipher.dev/30-seconds-of-typescript/docs/lcm/
    const lcm = (...arr) => {
        const gcd = (x, y) => (!y ? x : gcd(y, x % y));
        const _lcm = (x, y) => (x * y) / gcd(x, y);
        return [...arr].reduce((a, b) => _lcm(a, b));
    };    

    
    /** ADD 2019-day12 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {


    

            let answerPart1 = 0;
            let answerPart2 = 0;

            if (part == Part.One) {

                const moons = input.map(il => new Moon(il));

                for (var it=0; it < 1000; it++) {
                    simulateCycle(moons, DIMS);
                }
                answerPart1 = computeEnergy(moons, DIMS);

                // part 1 specific code here

                return answerPart1;

            } else {

                const cyclesByDim = [];

                DIMS.forEach(d => {

                    const moons = input.map(il => new Moon(il));

                    const initState = dimPosVel(moons, d);

                    let numCycles = 0;
                    do {
                        simulateCycle(moons, [d]);
                        numCycles++;
                    } while (dimPosVel(moons, d).some((n,i) => n != initState[i]));

                    cyclesByDim.push(numCycles);

                });

                answerPart2 = lcm(...cyclesByDim);

                // part 2 specific code here

                return answerPart2;

            }

        }, "2019", "day12", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}