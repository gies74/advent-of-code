/**
 * Advent of Code solution 2020/day06
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day06 {
 
    
    /** ADD 2020-day06 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main((input) => {

        var parts = Utils.splitInput(input);

        let count = 0;
        for (var group of parts) {
            let set = new Set(group[0].split(''));
            for (var yesQuestions of group) {
                set = Utils.getIntersection(set, new Set(yesQuestions.split('')));
            }
            count += set.size;
        }

        /** ADD START HERE */

        return count;

    }, "2020", "day06");

}