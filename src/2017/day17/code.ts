/**
 * Advent of Code solution 2017/day17
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day17 {

    class Spinlock {
        next: Spinlock;
        value: number;
        constructor(insert:Spinlock, value:number) {
            this.value = value;
            if (!insert)
            {
                this.next = this;
                return;
            }
            const next = insert.next;
            insert.next = this;
            this.next = next;
        }
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {
            const insertions = part == Part.One ? 2017 : 5E7;
            const steps = parseInt(input[0]);
            let current = new Spinlock(null, 0);
            for (var it=1; it <= insertions; it++) {
                for (var nm=0; nm<steps; nm++) {
                    current = current.next;
                }
                current = new Spinlock(current, it)
            }
            if (part == Part.Two)
                while (current.value != 0)
                    current = current.next;
            return current.next.value;

        }, "2017", "day17", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}