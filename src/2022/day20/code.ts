/**
 * Advent of Code solution 2022/day20
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day20 {

    class RingNum {
        num: number;
        prev: RingNum;
        next: RingNum;
        constructor(num,) {
            this.num = num;
            this.prev = null;
            this.next = null;
        }

        move(inputLength) {

            const target = this.getInsertRingNum(this.num % (inputLength - 1));
            if (target == this || target == this.next) {
                return;
            }
            const [tPrev, myPrev, myNext] = [target.prev, this.prev, this.next];

            tPrev.next = this;
            this.prev = tPrev;

            this.next = target;
            target.prev = this;

            myPrev.next = myNext;
            myNext.prev = myPrev;

            if (!this.checkSanity(inputLength)) {
                throw Error("Insane");
            }

        }

        checkSanity(inputLength) {
            const roundTrip = this.getInsertRingNum(inputLength - 1);
            return this.num === roundTrip.num;
        }

        getInsertRingNum(positions) {
            // find the ringnum where I will be INSERTED in front of 
            let ringNum:RingNum = positions > 0 ? this.next : this;
            while (positions < 0) {
                ringNum = ringNum.prev;
                positions++;
            }
            while (positions > 0) {
                ringNum = ringNum.next;
                positions--;
            }
            return ringNum;
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

            const scale = part === Part.One ? 1 : 811589153;

            const initial = input.map(n => parseInt(n));
            const lookup = initial.reduce((agg, elt, idx) => { agg[`${idx}_${elt}`] = new RingNum(elt * scale); return agg; } , {});
            for (var i=0; i<initial.length;i++) {
                lookup[`${i}_${initial[i]}`].prev = (i===0) ? lookup[`${initial.length - 1}_${initial[initial.length - 1]}`] : lookup[`${i - 1}_${initial[i - 1]}`];
                lookup[`${i}_${initial[i]}`].next = (i===initial.length -1) ? lookup[`0_${initial[0]}`] : lookup[`${i + 1}_${initial[i + 1]}`];
            }
            const idx0 = initial.indexOf(0);
            if (!lookup[`${idx0}_0`].checkSanity(initial.length)) {
                const stophere = 1;
            }

            for (var round=1; round<= (part === Part.One ? 1 : 10); round++) {
                for (var i=0; i<initial.length; i++) {
                    lookup[`${i}_${initial[i]}`].move(initial.length);
                }
            }

            var g1 = lookup[`${idx0}_0`].getInsertRingNum(1000-1);
            var g2 = lookup[`${idx0}_0`].getInsertRingNum(2000-1);
            var g3 = lookup[`${idx0}_0`].getInsertRingNum(3000-1);

            return g1.num + g2.num + g3.num;

        }, "2022", "day20", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}