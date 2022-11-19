/**
 * Advent of Code solution 2020/day09
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day09 {
    const generic = require('../../generic');
    
    /** ADD 2020-day09 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    generic.Utils.main((input) => {

        /** ADD START HERE */
        const window = [];
        let currNum = 0;
        for (var line of input) {
            currNum = parseInt(line);
            if (window.length < 25) {
                window.push(currNum);
                continue;
            }

            let sumFound = false;
            for (var i0=0;!sumFound && i0<24;i0++) {
                for (var j0=i0+1; j0<25; j0++) {
                    if (window[i0] + window[j0] == currNum) {
                        sumFound=true
                    }
                }
            }
            if (!sumFound) {
                break;
            }

            window.push(currNum);
            window.shift();
        }

        const weakness = currNum;
        const idx = input.indexOf(String(weakness));

        let sumFound2 = false;
        let i=0;
        let j=0;
        for (i=input.length - 1; i>=0 && !sumFound2; i--) {
            let sum = 0;
            for (j=i; j>=0 && !sumFound2; j--) {
                if (j == idx) {
                    break;
                }
                sum += parseInt(input[j]);
                if (sum > weakness)
                    break;
                if (sum == weakness) {
                    sumFound2 = true;
                    break;
                }
            }
        }

        if (!sumFound2)
            throw "Wtf";

        const min = Math.min(...input.slice(j, i).map(n => parseInt(n)));
        const max = Math.max(...input.slice(j, i).map(n => parseInt(n)));

        return min + max;

    }, "2020", "day09");

}