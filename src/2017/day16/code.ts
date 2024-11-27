/**
 * Advent of Code solution 2017/day16
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day16 {

    const danceLookup = [];

    const swap = (word, p1, p2) => {
        const tmp = word[p1];
        word[p1] = word[p2]
        word[p2] = tmp;
        return word;
    }

    const applyMove = (programs, move)=> {
        switch(move[0]) {
            case "s":
                const spin = parseInt(move.substring(1));
                return programs.slice(-1 * spin).concat(programs.slice(0, programs.length - spin));
            case "x":
                const r1 = /x(\d+)\/(\d+)/;
                const p1 = parseInt(move.replace(r1, "$1"));
                const p2 = parseInt(move.replace(r1, "$2"));
                return swap(programs, p1, p2);
            case "p":
                const r2 = /p(.)\/(.)/;
                const p3 = programs.indexOf(move.replace(r2, "$1"));
                const p4 = programs.indexOf(move.replace(r2, "$2"));
                return swap(programs, p3, p4);
            default:
                throw Error(move);
        }
        return "";
    };

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const moves = input[0].split(/,/);
            let programsStr = (example == 0 ?  "abcdefghijklmnop" :  "abcde" )
            let programs = programsStr.split('');
            while (true) {
                danceLookup.push(programsStr);
                moves.forEach(move => {
                    programs = applyMove(programs, move);
                });
                programsStr = programs.join('');
                if (danceLookup.includes(programsStr)) {
                    console.log(`Seen dance ${programsStr} before: ${danceLookup.indexOf(programsStr)} / ${danceLookup.length}`);
                    break;
                }
            }
            return part == Part.One ? danceLookup[1] : danceLookup[1E9 % (danceLookup.length)];


        }, "2017", "day16", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}