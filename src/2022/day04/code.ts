/**
 * Advent of Code solution 2022/day04
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day04 {
    
    // verr similar to 2020/day16, borrowed the code here
    class Range {
        low: number;
        high: number;

        constructor(lowHigh: string) {
            const [low, high] = lowHigh.split("-");
            this.low = parseInt(low);
            this.high = parseInt(high);
        }

        test(val: number): boolean {
            return val >= this.low && val <= this.high;
        }

    }

    class RangePair {
        range1: Range;
        range2: Range;

        constructor(rangeOrRange: string) {
            const [r1, r2] = rangeOrRange.split(",");
            this.range1 = new Range(r1);
            this.range2 = new Range(r2);
        }

        test(val: number): boolean {
            return this.range1.test(val) || this.range2.test(val);
        }

        fullyContains() {
            return this.range1.low >= this.range2.low && this.range1.high <= this.range2.high ||
                this.range2.low >= this.range1.low && this.range2.high <= this.range1.high;
        }

        overlaps() {
            return this.range1.low <= this.range2.high && this.range1.high >= this.range2.high ||
            this.range2.low <= this.range1.high && this.range2.high >= this.range1.high;
        }

    }

    const parseFieldRanges = (fRanges: string[]) => {
        return fRanges.map(fRange =>  new RangePair(fRange));
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const assignments = parseFieldRanges(input);

            if (part == Part.One) {

                let answerPart1 = Utils.countTruthy(assignments.map(a => a.fullyContains()));
                    return answerPart1;

            } else {

                let answerPart2 = Utils.countTruthy(assignments.map(a => a.overlaps()));
                return answerPart2;

            }

        }, "2022", "day04", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}