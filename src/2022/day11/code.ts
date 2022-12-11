/**
 * Advent of Code solution 2022/day11
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day11 {

    class Monkey {
        items: number[];
        op: Function;
        testDivisor: number;
        ifTrue: number;
        ifFalse: number;
        numInspections: number;

        constructor(items: number[], op: Function, testDivisor: number, ifTrue: number, ifFalse: number) {
            this.items = items;
            this.op = op;
            this.testDivisor = testDivisor;
            this.ifTrue = ifTrue;
            this.ifFalse = ifFalse;
            this.numInspections = 0;
        }

        process(monkeys, part, commonDivisor) {
            while (this.items.length) {
                let val = this.items.shift();
                val = this.op(val);
                val = (part === 1) ? Math.floor(val / 3) : val % commonDivisor;
                const rcvMonkey = val % this.testDivisor == 0 ? this.ifTrue : this.ifFalse;
                monkeys[rcvMonkey].items.push(val);
                this.numInspections++;
            }
        }
    }

    const parseMonkey = (chunk: string[]): Monkey => {
        const items = chunk[1].split(': ')[1].split(', ').map(n => parseInt(n));
        const fnTxt = `return ${chunk[2].split(" = ")[1]};`;
        const op = new Function("old", fnTxt);
        // const funcTxt = `function (old) { return ${chunk[2].split(" = ")[1]}; }`;
        // const op = parseFunction(funcTxt);        
        const devisor = parseInt(chunk[3].split(" by ")[1]);
        const ifTrue = parseInt(chunk[4].split('monkey ')[1]);
        const ifFalse = parseInt(chunk[5].split('monkey ')[1]);
        return new Monkey(items, op, devisor, ifTrue, ifFalse);
    }


    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const chunks = Utils.splitInput(input);
            const monkeys = chunks.map(ch => parseMonkey(ch));

            //monkeys = monkeysExample;
            const commonDivisor = monkeys.reduce((agg, m) => agg * m.testDivisor, 1);
            const nRounds = part === Part.One ? 20 : 10000;
            for (var i = 0; i < nRounds; i++) {
                monkeys.forEach(monkey => monkey.process(monkeys, part, commonDivisor));
            }

            const sMonkeys = monkeys.sort((m1, m2) => m2.numInspections - m1.numInspections);

            return sMonkeys[0].numInspections * sMonkeys[1].numInspections;

        }, "2022", "day11",
        // set this switch to Part.Two once you've finished part one.
        Part.Two,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0); 
}