/**
 * Advent of Code solution 2020/day10
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day10 {
    const generic = require('../../generic');
    
    /** ADD 2020-day10 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */
    const numCache = {};

    const countNumConfigs = (inp, start) => {
        if (start == 0)
            return 1;
        if (numCache[start])
            return numCache[start];
        var num = 0;
        for (var delta of [1,2,3]) {
            if (inp.includes(start - delta))
                num += countNumConfigs(inp, start - delta);
        }
        if (!numCache[start]) {
            numCache[start] = num;
        }
        return num;
    };

    generic.Utils.main((input, part) => {

        // var parts = generic.Utils.splitInput(input);

        /** ADD START HERE */



        const inputInt = input.map(j => parseInt(j));
        inputInt.push(0);

        if (part == generic.Part.One) {
            var step3=1;
            var step1=0;
            inputInt.sort((a,b) => Math.sign(b - a));
            for (var idx = 0; idx < inputInt.length - 1; idx++) {
                if (inputInt[idx + 1] == inputInt[idx] - 1)
                    step1++;
                else if (inputInt[idx + 1] == inputInt[idx] - 3)
                    step3++;
                else 
                    var x = 0;
            }
            return step1 * step3;        
        } else {
            return countNumConfigs(inputInt, Math.max(...inputInt) + 3);
        }


    }, "2020", "day10", generic.Part.Two);

}