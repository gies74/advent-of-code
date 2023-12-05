/**
 * Advent of Code solution 2023/day05
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day05 {

    const splitRange = (rng1:number[], rng2:number[]) => {
        const inside:number[][] = [];
        const outside:number[][] = [];
        const f1 = rng1[0], t1 = rng1[0] + rng1[1] - 1, f2 = rng2[0], t2 = rng2[0] + rng2[1] - 1;
        if (t1 < f2 || f1 >= t2)
            outside.push(rng1.slice(0));
        else {
            if (f1 < f2) {
                outside.push([f1, f2 - f1]);
            }

            if (f1 < t2 && t1 >= f2) {
                inside.push([Math.max(f1, f2), Math.min(t1, t2) - Math.max(f1, f2) + 1]);
            }

            if (t1 > t2) {
                outside.push([t2 + 1, t1 - t2]);
            }
        }
        if (rng1[1] != Utils.sum(outside.map(r => r[1])) + Utils.sum(inside.map(r => r[1]))) {
            throw "Error";
        }
        return [inside, outside];
    }

    class Mapper {
        name: string;
        public mappings:number[][];

        constructor(lines:string[]) {
            this.name = lines[0];
            this.mappings = lines.slice(1).map(l => l.split(" ").map(n => parseInt(n)));
        }

        map(n:number) {
            for (var mapping of this.mappings) {
                if (n >= mapping[1] && n < mapping[1] + mapping[2])
                    return mapping[0] + n - mapping[1];
            }
            return n;
        }

        mapRanges(ranges:number[][]) {
            var insideRanges:number[][] = [];
            for (var mapping of this.mappings) {
                const outsideRanges = [];
                for (var range of ranges) {
                    var split =splitRange(range, [mapping[1], mapping[2]]);
                    split[0].forEach(inside => {
                        insideRanges.push([this.map(inside[0]), inside[1]]);
                    }, this);
                    outsideRanges.splice(outsideRanges.length - 1, 0, ...split[1]);
                }
                ranges.splice(0, ranges.length, ...outsideRanges);
            }
            ranges.splice(ranges.length - 1, 0, ...insideRanges);
        }
    }
    
    /** ADD 2023-day05 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            var chunks = Utils.splitInput(input);
            const mappers = chunks.splice(1).map(ch => new Mapper(ch));

            const seedInput = input[0].split(" ").slice(1).map(n => parseInt(n));

            if (part == Part.One) {

                const locations = seedInput.map(s => {
                    let mapped = s;
                    for (var mapper of mappers) {
                        mapped = mapper.map(mapped);
                    }
                    return mapped;
                });
    
    
                let answerPart1 = Math.min(...locations);

                return answerPart1;

            } else {

                let ranges:number[][] = [];
                for (var i=0; i<seedInput.length; i+=2) {
                    ranges.push([seedInput[i], seedInput[i+1]]);
                }
                mappers.forEach(mapper => mapper.mapRanges(ranges));
                const locations = ranges.map(r => r[0]);        
                let answerPart2 = Math.min(...locations);;

                return answerPart2;

            }

        }, "2023", "day05", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}