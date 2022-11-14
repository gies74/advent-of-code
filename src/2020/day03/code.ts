/**
 * Advent of Code solution 2020/day03
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day03 {
    const generic = require('../../generic');
    
    /** ADD 2020-day03 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    generic.Utils.main((input) => {

        // var parts = generic.Utils.splitInput(input);
        let answer = 1;

        const slopes = [[1,1], [3,1], [5,1], [7,1], [1,2]];

        for (var slope of slopes) {
            let count=0;
            let x=0;
            for (let y=0; y<input.length; y += slope[1]) {
                if (input[y][x] == "#")
                    count++;
                x = (x + slope[0]) % input[y].length;
            }
            answer *= count;
        }
        return answer;


    }, "2020", "day03");

}