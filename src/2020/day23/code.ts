/**
 * Advent of Code solution 2020/day23
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day23 {
    const generic = require('../../generic');
    
    /** ADD 2020-day23 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    class CrabNum {
        num: number;
        nextCrabNum: CrabNum;
        destination: CrabNum;

        /**
         *
         */
        constructor(num, nextCrabNum) {
            this.num = num;
            this.nextCrabNum = nextCrabNum;
        }

        move3toDes() {
            const movers = [this.nextCrabNum, this.nextCrabNum.nextCrabNum, this.nextCrabNum.nextCrabNum.nextCrabNum];
            
            let destination = this.destination;
            while (movers.includes(destination))
                destination = destination.destination;

            var desNextCrabNum = destination.nextCrabNum;
            var thisThirdNext = this.nextCrabNum.nextCrabNum.nextCrabNum;
            destination.nextCrabNum = this.nextCrabNum;
            this.nextCrabNum = thisThirdNext.nextCrabNum;
            thisThirdNext.nextCrabNum = desNextCrabNum;

            var brpt=0;
        }

        setDest(allCns) {
            const length = allCns.length;
            const prevNum = (this.num - 2 + length) % length + 1;    
            for (var cn of allCns) {
                if (cn.num == prevNum) {
                    this.destination = cn;
                    break;
                }
            }
        }
    }


    generic.Utils.main((input) => {

        input = input[0];
        // input = "389125467";
        let aInput: number[] = input.split('').map(n => parseInt(n));
        /** ADD START HERE */
        for (var num = Math.max(...aInput) + 1; num <= 1000000; num++) {
            aInput.push(num);
        }

        let nextCn = new CrabNum(aInput[aInput.length - 1], null);
        const allCns = [nextCn];
        for (var i=aInput.length - 2; i >= 0; i--) {
            const cn = new CrabNum(aInput[i], nextCn);
            nextCn.destination = cn;            
            allCns.push(cn);
            nextCn = cn;
        }
        allCns[0].nextCrabNum = nextCn;
        const someCns = allCns.slice(999990);
        for (var cn of someCns)
            cn.setDest(allCns);
        let current = nextCn;

        for (var m=1; m<= 10000000; m++) {
            current.move3toDes();
            current = current.nextCrabNum;
        }

        let num1Cn = null;
        for (var cn of allCns) {
            if (cn.num == 1) {
                num1Cn = cn;
                break;
            }
        }


        return num1Cn.nextCrabNum.num * num1Cn.nextCrabNum.nextCrabNum.num;

    }, "2020", "day23");

}