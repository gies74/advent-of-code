/**
 * Advent of Code solution 2021/day04
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day04 {
    const generic = require('../../generic');   

    /** ADD 2021-day01 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */
    class BingoChart {
        /**
         * 
         */
        data: number[][] = [];
        score: number;

        constructor(data: string[]) {
            for (var d of data) {
                this.data.push(d.trimStart().split(/\s+/).map(n => parseInt(n)));
            }
            this.score = -1;
        }

        call(n: number) {
            if (this.score > -1) {
                return false;
            }
            for (var d of this.data) {
                var i = d.indexOf(n);
                if (i == -1)
                    continue;
                d[i] = 0;
                break;
            }
            for (var row=0; row < this.data.length; row++) {
                if (this.data[row].every(bnum => !bnum) || this.data.every(rdata => !rdata[row])) {
                    this.score = n * this.data.map(row => row.reduce((cum, elt) => cum + elt, 0)).reduce((cum, elt) => cum + elt, 0);
                    return true;
                }
            }
            return false;

        }
    }

    generic.Utils.main(input => {
        var parts = generic.Utils.splitInput(input);

        /** ADD START HERE */
        const charts = parts.slice(1).map(p => new BingoChart(p));
        const callNums = parts[0][0].split(/,/).map(s => parseInt(s));
        for (var callNum of callNums) {
            const sCharts: BingoChart[] = []
            for (var bc of charts) {
                if (bc.call(callNum))
                    sCharts.push(bc);
            }
            if (charts.every(bc => bc.score > -1)) { /** for part two: replace some() by every() */
                if (sCharts.length != 1)
                    throw new Error("wtf");
                return sCharts[0].score;
            }
        }
        return -1;

    }, "2021", "day04");    
}