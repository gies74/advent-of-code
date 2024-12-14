/**
 * Advent of Code solution 2024/day14
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day14 {

    class Robot {
        p:number[];
        v:number[];
        constructor(line) {
            const [_p, _v] = line.split(" ").map(prm => prm.split("=")[1]).map(rhs => rhs.split(",").map(n => parseInt(n)));
            this.p = _p;
            this.v = _v;
        }

        makeStep(dims:number[]) {
            [0,1].forEach(d => this.p[d] = (this.p[d] + this.v[d] + dims[d]) % dims[d]);
        }
    }

    const renderRobots = (robots:Robot[], dims:number[]) => {
        return Array(dims[1]).fill(null).map((_, ri) => Array(dims[0]).fill(null).map((_, ci) => robots.some(r => r.p[0]===ci&&r.p[1]===ri) ? "#" : ".").join("")).join("\n");
    }

    const detectXmasTree = (robots:Robot[], dims:number[]):boolean => {

        const robotsPerRow = Array(dims[1]).fill(null).map((_, ri) => robots.filter(r => r.p[1] === ri).length);
        const robotsPerColumn= Array(dims[0]).fill(null).map((_, ci) => robots.filter(r => r.p[0] === ci).length);
        const maxR = Math.max(...robotsPerRow);
        const maxC = Math.max(...robotsPerColumn);
    
        const overN = maxR > 20 && maxC > 20;

        return overN;
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

            const DIMS = example === 1 ? [11,7] : [101,103];

            const parts = part === Part.One ? 2 : 4;
            const allQs = Array(parts).fill(null).reduce((ai, _, j) => ai.concat(Array(parts).fill(null).map((_, i) => [[i * (DIMS[0]+1)/parts, (i+1) * (DIMS[0]+1)/parts-1],[j * (DIMS[1]+1)/parts, (j+1) * (DIMS[1]+1)/parts-1]])), []);
            // const quadrants = [[0,(DIMS[0]+1)/2], [(DIMS[0]+1)/2, DIMS[0]], [0,(DIMS[1]+1)/2], [(DIMS[1]+1)/2, DIMS[1]]];
            // const allQs = [[quadrants[0],quadrants[2]],[quadrants[1],quadrants[2]],[quadrants[0],quadrants[3]],[quadrants[1],quadrants[3]]];

            const robots = input.map(line => new Robot(line));
            for (var i=0; i<(part === Part.One ? 100 : 1000000); i++) {
                robots.forEach(r => r.makeStep(DIMS));

                if (part === Part.Two && detectXmasTree(robots, DIMS)) {     
                    console.log(renderRobots(robots, DIMS));          
                    return i+1;
                }
            }

            const qtots = allQs.map(q => robots.filter(r => [0,1].every(d => { 
                return r.p[d] >= q[d][0] && r.p[d] < q[d][1];
            })).length);

            return qtots.reduce((prod,qt) => prod * qt, 1);

        }, "2024", "day14", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}