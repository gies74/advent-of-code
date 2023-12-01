/**
 * Advent of Code solution 2023/day01
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day01 {
    
    /** ADD 2023-day01 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const mapper = {
                "one": "1",
                "two": "2",
                "three": "3",
                "four": "4",
                "five": "5",
                "six": "6",
                "seven": "7",
                "eight": "8",
                "nine": "9",
            };

            let pattern = (part == Part.One) ?  /\d/g : new RegExp("(\\d|" + Object.keys(mapper).join('|') + ")", "g");

            let numbers = input
                .reduce((results, line) => {
                    var match;
                    const matches = [];
                    pattern.lastIndex = 0;
                    while ( (match = pattern.exec( line ) ) != null ) {
                        matches.push( match[0] );
                        pattern.lastIndex = match.index + 1;
                    }  
                    results.push(matches);
                    return results;              
                }, [])
                .map(str2num => str2num.map(str => mapper[str] ? mapper[str] : str))
                .map(arr => arr[0] + arr[arr.length-1])
                .map(n => parseInt(n));

            return Utils.sum(numbers);
            


        }, "2023", "day01", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}