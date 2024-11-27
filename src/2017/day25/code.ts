/**
 * Advent of Code solution 2017/day25
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day25 {

    const DATASIZE = 10000;

    // Begin in state A.
    // Perform a diagnostic checksum after 6 steps.
    //
    // In state A:
    //   If the current value is 0:
    //     - Write the value 1.
    //     - Move one slot to the right.
    //     - Continue with state B.

    const reBegin = /^Begin in state (.)\.$/;
    const rePerform = /^Perform a diagnostic checksum after (\d+) steps\.$/;
    const reInState = /^In state (.):$/;
    const reIfTheCurrent = /^  If the current value is ([01]):$/;
    const reWriteValue = /^    \- Write the value ([01])\.$/;
    const reMoveOneSlot = /^    \- Move one slot to the (left|right)\.$/;
    const reContinueWith = /^    \- Continue with state (.)\.$/;

    const parseCondStatements = (inState, input) => {
        const condState = parseInt(input.shift().replace(reIfTheCurrent, "$1"));
        const cs = inState[condState] = {};
        cs["write"] = parseInt(input.shift().replace(reWriteValue, "$1"));
        cs["move"] = input.shift().replace(reMoveOneSlot, "$1");
        cs["continue"] = input.shift().replace(reContinueWith, "$1");        
    };

    class TuringMachine {
        position: number;
        state: string;
        config: object;

        constructor(startState, config) {
            this.state = startState;
            this.config = config;
            this.position = DATASIZE;
        }

        makeStep(data) {
            const instructions = this.config[this.state][data[this.position]];
            data[this.position] = instructions["write"];
            this.position += instructions["move"] === "left" ? -1 : 1;
            this.state = instructions["continue"];
        }
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

            const startState = input.shift().replace(reBegin, "$1");
            const steps = parseInt(input.shift().replace(rePerform, "$1"));
            input.shift(); // blank line

            const machineConfig = {};
            while (input.length) {
                const state = input.shift().replace(reInState, "$1");
                machineConfig[state] = Array(2);
                parseCondStatements(machineConfig[state], input);
                parseCondStatements(machineConfig[state], input);
                input.shift(); // blank line
            }

            const turingMachine = new TuringMachine(startState, machineConfig);
            const data = Utils.multiDimArray(1, 2 * DATASIZE, c => 0);

            for (var i=0; i<steps; i++) {
                turingMachine.makeStep(data);
            }

            return Utils.sum(data);

        }, "2017", "day25", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}