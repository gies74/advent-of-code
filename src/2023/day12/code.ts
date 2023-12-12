/**
 * Advent of Code solution 2023/day12
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { stat } from "fs";
import { Part, Utils } from "../../generic";

namespace day12 {

    class State {
        parent:MarkovModel;
        sLength:number;
        pat = null;

        constructor(parent:MarkovModel, sLength) {
            this.parent = parent;
            this.sLength = sLength;
        }

        public get LBound():number {
            return this.sLength;
        }

        public get UBound():number {
            return this.sLength;
        }

        public isValid(charIdx:number, n:number):boolean {
            const chars = this.parent.chars.slice(charIdx+1, charIdx+1+n);
            return chars.every(c => this.pat.test(c));
        }
    }

    class DamageState extends State {
        pat = /[\?#]/;
    }

    class DelimState extends State {
        pat = /[\?\.]/;

        public get LBound():number {
            return this.sLength === 0 ? 0 : 1;
        }

        public get UBound():number {
            return Number.POSITIVE_INFINITY;
        }
    }

    class MarkovModel {
        states:State[];
        chars:string[];
        sSpace:number[][];

        constructor(line:string, sLengths:number[]) {

            this.states = [new DelimState(this, 0)];
            sLengths.forEach((len, idx) => {
                this.states.push(new DamageState(this, len));
                this.states.push(new DelimState(this, idx === sLengths.length - 1 ? 0 : 1));
            }, this);

            this.chars = line.split('');

            this.sSpace = Utils.multiDimArray([this.states.length, this.chars.length], () => null);
        }

        run() {
            const numParsings = this.getNumParsings(this.states.length-1, this.chars.length-1);
            return numParsings;
        }

        getNumParsings(stateIdx, charIdx) {
            let retVal = 0;

            if (stateIdx === -1 && charIdx === -1)
                return 1;
            if (stateIdx === -1 || charIdx <= -1 && stateIdx > 0)
                return 0;
            if (charIdx >= 0 && this.sSpace[stateIdx][charIdx] !== null)
                return this.sSpace[stateIdx][charIdx];

            const state = this.states[stateIdx];
            let valid = true;
            for (var i=state.LBound; valid && i<=state.UBound; i++) {
                valid = i <= charIdx + 1 && state.isValid(charIdx - i, i);
                if (valid) {
                    retVal += this.getNumParsings(stateIdx-1, charIdx - i);
                }
            }

            this.sSpace[stateIdx][charIdx] = retVal;

            return retVal;
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

            const cum = input.map(line => {
                const [damageLine, numLine] = line.split(" ");

                const realDamageLine = part === Part.One ? damageLine : Array(5).fill(damageLine).join("?");

                const realNumLine = part === Part.One ? numLine : Array(5).fill(numLine).join(",");
                const nums = realNumLine.split(",").map(n => parseInt(n));

                const mm = new MarkovModel(realDamageLine, nums);
                return mm.run();

            });
            return Utils.sum(cum);

        }, "2023", "day12", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}