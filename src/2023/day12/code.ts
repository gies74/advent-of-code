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
        _parent:MarkovModel;
        _sLength:number;
        _pat:RegExp = null;

        constructor(parent:MarkovModel, sLength) {
            this._parent = parent;
            this._sLength = sLength;
        }

        public get LBound():number {
            return this._sLength;
        }

        public get UBound():number {
            return this._sLength;
        }

        public isValid(charIdx:number, n:number):boolean {
            const chars = this._parent._chars.slice(charIdx+1, charIdx+1+n);
            return chars.every(c => this._pat.test(c));
        }
    }

    class DamageState extends State {
        _pat = /[\?#]/;
    }

    class DelimState extends State {
        _pat = /[\?\.]/;

        public get LBound():number {
            return this._sLength === 0 ? 0 : 1;
        }

        public get UBound():number {
            return Number.POSITIVE_INFINITY;
        }
    }

    class MarkovModel {
        _states:State[];
        _chars:string[];
        _solSpace:number[][];

        constructor(line:string, sLengths:number[]) {

            this._states = [new DelimState(this, 0)];
            sLengths.forEach((len, idx) => {
                this._states.push(new DamageState(this, len));
                this._states.push(new DelimState(this, idx === sLengths.length - 1 ? 0 : 1));
            }, this);

            this._chars = line.split('');

            this._solSpace = Utils.multiDimArray([this._states.length, this._chars.length], () => null);
        }

        run() {
            const numParsings = this.getNumParsings(this._states.length-1, this._chars.length-1);
            return numParsings;
        }

        getNumParsings(stateIdx, charIdx) {
            let retVal = 0;

            if (stateIdx === -1 && charIdx === -1)
                return 1;
            if (stateIdx === -1 || charIdx <= -1 && stateIdx > 0)
                return 0;
            if (charIdx >= 0 && this._solSpace[stateIdx][charIdx] !== null)
                return this._solSpace[stateIdx][charIdx];

            const state = this._states[stateIdx];
            let valid = true;
            for (var i=state.LBound; valid && i<=state.UBound; i++) {
                valid = i <= charIdx + 1 && state.isValid(charIdx - i, i);
                if (valid) {
                    retVal += this.getNumParsings(stateIdx-1, charIdx - i);
                }
            }

            this._solSpace[stateIdx][charIdx] = retVal;

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