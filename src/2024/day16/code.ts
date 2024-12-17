/**
 * Advent of Code solution 2024/day16
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day16 {

    class Node {

    }

    class Edge {
        
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const maze = input.map(line => line.split(""));
            const start = [input.length-2, 1];
            const end = [0, input[0].length - 2];

            const x = maze[start[0]][start[1]];

            return 0;

        }, "2024", "day16", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        1);
}