/**
 * Advent of Code solution 2020/day06
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day06 {
    const generic = require('../../generic');

    function getIntersection(setA, setB) {
        var aa = [...setA.keys()];
        var bb = aa.filter(element => setB.has(element))
        const intersection = new Set(
            bb
        );      
        return intersection;
      }    
    
    /** ADD 2020-day06 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    generic.Utils.main((input) => {

        var parts = generic.Utils.splitInput(input);

        let count = 0;
        for (var group of parts) {
            let set = new Set(group[0].split(''));
            for (var yesQuestions of group) {
                set = getIntersection(set, new Set(yesQuestions.split('')));
            }
            count += set.size;
        }

        /** ADD START HERE */

        return count;

    }, "2020", "day06");

}