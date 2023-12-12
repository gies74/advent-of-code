/**
 * Advent of Code solution 2023/day12
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day12 {

    const replaceQmarks = (line:string) => {
        if (!/\?/.test(line))
            return [line];
        return replaceQmarks(line.replace("?", "#")).concat(replaceQmarks(line.replace("?", ".")));
    }

    const damageLengths = (line) => {
        return line.split(/\.+/).filter(s => s !== "").map(s => s.length);
    }

    class State {
        sLength:number;
        next:State = null;
        pat = null;
        constructor(sLength) {
            this.sLength = sLength;
        }
    }

    class DamageState extends State {
        pat = /[\?#]/;
    }

    class DelimState extends State {
        pat = /[\?\.]/;
    }

    class MarkovModel {
        states:State[];
        constructor(sLengths:number[]) {
            const damageStates = Array(sLengths.length).fill(null).map((_, i) => new DamageState(sLengths[i]));
            this.states = [new DelimState(0)];
            damageStates.forEach(d => {
                this.states[this.states.length-1].next = d;
                this.states.push(d);
                d.next = new DelimState(1);
                this.states.push(d.next);
            });
            this.states[this.states.length-1].sLength = 0;
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



            

            if (part == Part.One) {

                let cum = input.map(line => {
                    const [damageLine, numLine] = line.split(" ");
                    const nums = numLine.split(",").map(n => parseInt(n));

                    const all = replaceQmarks(damageLine);
                    const configs = all.filter(s => {
                        const lens = damageLengths(s);
                        return lens.length === nums.length && lens.every((d,i) => d === nums[i]);
                    });
                    return configs.length;
                });
                return Utils.sum(cum);



            } else {

                let cum = input.map(line => {
                    const [damageLine, numLine] = line.split(" ");
                    const nums = numLine.split(",").map(n => parseInt(n));
    
                    const mm = new MarkovModel(nums);
    
    
    
                });

            }

        }, "2023", "day12", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}