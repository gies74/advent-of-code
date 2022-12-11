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
        op: (number) => number;
        testDivisor: number;
        ifTrue: number;
        ifFalse: number;
        numInspections: number;

        constructor(items: number[], op: (number) => number, testDivisor: number, ifTrue: number, ifFalse: number) {
            this.items = items;
            this.op = op;
            this.testDivisor = testDivisor;
            this.ifTrue = ifTrue;
            this.ifFalse = ifFalse;
            this.numInspections = 0;
        }

        process(monkeys, part, commonDivisor) {
            this.items = this.items.sort();
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

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            let monkeys = [
                new Monkey( //0
                    [99, 67, 92, 61, 83, 64, 98],
                    (item: number): number => item * 17,
                    3,
                    4, 2),
                new Monkey( //1
                    [78, 74, 88, 89, 50],
                    (item: number): number => item * 11,
                    5,
                    3, 5),
                new Monkey( //2
                    [98, 91],
                    (item: number): number => item + 4,
                    2,
                    6, 4),
                new Monkey( //3
                    [59, 72, 94, 91, 79, 88, 94, 51],
                    (item: number): number => item * item,
                    13,
                    0, 5),
                new Monkey( //4
                    [95, 72, 78],
                    (item: number): number => item + 7,
                    11,
                    7, 6),
                new Monkey(  //5
                    [76],
                    (item: number): number => item + 8,
                    17,
                    0, 2),
                new Monkey( //6
                    [69, 60, 53, 89, 71, 88],
                    (item: number): number => item + 5,
                    19,
                    7, 1),
                new Monkey( //7
                    [72, 54, 63, 80],
                    (item: number): number => item + 3,
                    7,
                    1, 3)];

            const monkeysExample = [
                new Monkey( //0
                    [79, 98],
                    (item: number): number => item * 19,
                    23,
                    2, 3),
                new Monkey( //1
                    [54, 65, 75, 74],
                    (item: number): number => item + 6,
                    19,
                    2, 0),
                new Monkey( //2
                    [79, 60, 97],
                    (item: number): number => item * item,
                    13,
                    1, 3),
                new Monkey( //3
                    [74],
                    (item: number): number => item + 3,
                    17,
                    0, 1),
            ]

            //monkeys = monkeysExample;
            const commonDivisor = monkeys.reduce((agg, m) => agg * m.testDivisor, 1);
            const nRounds = part === Part.One ? 20 : 10000;
            for (var i = 0; i < nRounds; i++) {
                monkeys.forEach(monkey => monkey.process(monkeys, part, commonDivisor));
                // if (i == 0 || i == 19) {
                //     monkeys.forEach((m, mi) => {
                //         console.log(`${mi}: ${m.numInspections}`);
                //     })
                // }
            }

            const sMonkeys = monkeys.sort((m1, m2) => m2.numInspections - m1.numInspections);

            return sMonkeys[0].numInspections * sMonkeys[1].numInspections;


        }, "2022", "day11",
        // set this switch to Part.Two once you've finished part one.
        Part.One,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}