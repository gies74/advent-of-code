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
        if (Math.max(...robotsPerRow) <= 20)
            return false;
        const robotsPerColumn= Array(dims[0]).fill(null).map((_, ci) => robots.filter(r => r.p[0] === ci).length);
        if (Math.max(...robotsPerColumn) <= 20)
            return false;
    
        // assumption: a Xmas tree formation requires 20 robots to be in a row as well as 20 in a column - this will naver happen by pure chance

        return true;
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

            const numSectors = 2;
            const quadrants = Array(numSectors).fill(null).reduce((ai, _, j) => ai.concat(Array(numSectors).fill(null).map((_, i) => [[i * (DIMS[0]+1)/numSectors, (i+1) * (DIMS[0]+1)/numSectors-1],[j * (DIMS[1]+1)/numSectors, (j+1) * (DIMS[1]+1)/numSectors-1]])), []);

            const robots = input.map(line => new Robot(line));
            for (var i=0; i<(part === Part.One ? 100 : 1000000); i++) {
                robots.forEach(r => r.makeStep(DIMS));

                if (part === Part.Two && detectXmasTree(robots, DIMS)) {     
                    console.log(renderRobots(robots, DIMS));          
                    return i+1;
                }
            }

            const quadrantCounts = quadrants.map(q => robots.filter(r => [0,1].every(d => { 
                return r.p[d] >= q[d][0] && r.p[d] < q[d][1];
            })).length);

            return quadrantCounts.reduce((prod,qt) => prod * qt, 1);

        }, "2024", "day14", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}