/**
 * Advent of Code solution 2020/day05
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { maxHeaderSize } from "http";

namespace day05 {
    const generic = require('../../generic');
    
    /** ADD 2020-day05 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    generic.Utils.main((input) => {

        // var parts = generic.Utils.splitInput(input);

        /** ADD START HERE */
        const seatIds = input.map(p => parseInt(p.replace(/[FL]/g, '0').replace(/[BR]/g, '1'), 2));

        // return Math.max(...seatIds);

        let missing = -1;
        for (var i=100;i<924;i++) {
            if (!seatIds.includes(i)) {
                missing = i;
                break;
            }
        }
        return missing;

    }, "2020", "day05");

}