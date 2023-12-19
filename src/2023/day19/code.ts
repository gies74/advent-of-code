/**
 * Advent of Code solution 2023/day19
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day19 {

    class Range {
        low:number;
        high:number;
        constructor(low,high) {
            this.low = low;
            this.high = high;
        }
        break(condOp, num) {
            return condOp === "<" ? [
                (num > this.low) ? new Range(this.low, Math.min(num-1, this.high)) : null,
                (num <= this.high) ? new Range(Math.max(num, this.low), this.high) : null,
            ] : [
                (num < this.high) ? new Range(Math.max(num+1, this.low), this.high) : null,
                (num >= this.low) ? new Range(this.low, Math.min(num, this.high)) : null,
            ]
        }
    }

    class RuleRange {
        rulename:string;
        ranges:{[letter:string]:Range};
        constructor(name,rule:{[letter:string]:Range}) {
            this.rulename = name;
            this.ranges = rule;
        }

        applyRule(rule) {
            const outRanges:RuleRange[] = [];
            const rulepts = rule.split(",");
            let pt;
            let rr:RuleRange = this;

            for (pt of rulepts)
            {
                if (!/:/.test(pt))
                    break;
                const [cond1,cond2,cond3] = pt.split(":")[0].split(/([<>])/);
                const [suc,fail] = rr.ranges[cond1].break(cond2, parseInt(cond3));
                if (suc) {
                    const rr1 = this.clone(pt.split(":")[1]);
                    rr1.ranges[cond1] = suc;
                    outRanges.push(rr1);
                }
                if (fail) {                    
                    this.ranges[cond1] = fail;
                }
            }
            this.rulename = rulepts[rulepts.length - 1];
            // outRanges.push(this);

            return outRanges;
        }

        clone(name) {
            const ranges = Object.keys(this.ranges).reduce((d, it) => { d[it] = new Range(this.ranges[it].low,this.ranges[it].high); return d;}, {});
            return new RuleRange(name, ranges);
        }

        prod() {
            return Object.values(this.ranges).reduce((prod, rng) => prod * (rng.high - rng.low + 1), 1);
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


            
            var chunks = Utils.splitInput(input);
            const objects = chunks[1].map(l => JSON.parse(l.replace(/([xmas])/g, '"$1"').replace(/=/g,':')));
            const rules = chunks[0].reduce((rs,l) => {
                const lp = l.split(/[\{\}]/);
                rs[lp[0]] = lp[1];
                return rs;
            }, {});

            if (part == Part.One) {

                const applyRule= (rule, obj):string => {
                    const rulepts = rule.split(",");
                    let pt;
                    while (/:/.test(pt = rulepts.shift()))
                    {
                        const [cond1,cond2,cond3] = pt.split(":")[0].split(/([<>])/);
                        if (cond2 === "<" && obj[cond1] < parseInt(cond3) || cond2 === ">" && obj[cond1] > parseInt(cond3))
                            return pt.split(":")[1];
                    }
                    return pt;

                };

                const cum = objects.map(obj => {
                    let rulename = "in";
                    do {
                        rulename = applyRule(rules[rulename], obj);                    
                    } while (!["A","R"].includes(rulename));
    
                    if (rulename === "R")
                        return 0;
                    else
                        return Utils.sum(Object.values(obj));
    
                });
    
                let answerPart1 = Utils.sum(cum);
                return answerPart1;

            } else {


                // const r = new Range(3,7);
                // let x = r.break("<", 4);
                // x = r.break("<", 3);
                // x = r.break(">", 6);
                // x = r.break(">", 7);




                const ranges = [new RuleRange("in", {"x":new Range(1,4000), "m":new Range(1,4000), "a":new Range(1,4000), "s":new Range(1,4000)})];
                let range;
                while (range = ranges.find(rr => !["R","A"].includes(rr.rulename))) {
                    ranges.splice(ranges.length,0,...range.applyRule(rules[range.rulename]));
                }

                let answerPart2 = Utils.sum(ranges.filter(r => r.rulename === "A").map(r => r.prod()));
                return answerPart2;

            }

        }, "2023", "day19", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}