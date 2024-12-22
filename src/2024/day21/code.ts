/**
 * Advent of Code solution 2024/day21
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day21 {

    let ROBOTLEVELS;

    const numeric = {
        "A0":["<A"],
        "02":["^A"],
        "29":[">^^A", "^^>A"], // , "^>^A"],
        "A8":["<^^^A", "^^^<A"], // "^<^^A", "^^<^A"],
        "86":[">vA", "v>A"],
        "69":["^A"],
        "9A":["vvvA"],
        "A1":["^<<A"], // "<^<A"
        "18":[">^^A","^^>A"], // ,"^>^A"
        "80":["vvvA"],
        "0A":[">A"], 
        "A5":["^^<A","<^^A"],  // ,"^<^A"
        "59":["^>A",">^A"],
        "6A":["vvA"],
        "A9":["^^^A"],
        "65":["<A"],
        "5A":[">vvA","vv>A"],  // ,"v>vA"
        "97":["<<A"],
        "73":[">>vvA","vv>>A"],  // ,">v>vA",">vv>A","v>>vA","v>v>A"
        "3A":["vA"],
        "96":["vA"],
        "98":["<A"],
        "17":["^^A"],
        "79":[">>A"],
        "A4":["^^<<A"],
        "45":[">A"],
        "56":[">A"],
        "A3":["^A"],
        "37":["<<^^A", "^^<<A"],
    };
    const directional = {
        "A^":["<A"],
        "A<":["v<<A"], // , "<v<A"
        "Av":["<vA","v<A"],
        "A>":["vA"],
        "^A":[">A"],
        "^<":["v<A"],
        "^v":["vA"],
        "^>":[">vA", "v>A"],
        "<A":[">>^A"], // , ">^>A"
        "<^":[">^A"],
        "<v":[">A"],
        "<>":[">>A"],
        "vA":[">^A","^>A"],
        "v^":["^A"],
        "v<":["<A"],
        "v>":[">A"],
        ">A":["^A"],
        ">^":["<^A"], // "^<A"
        "><":["<<A"],
        ">v":["<A"]
    };

    const cache:{[a:string]:{[n:number]:number[]}} = {};

    const minPress = (aString:string, level:number):number[] => {        
        let result = [];
        if (level === 0)
            return [aString.length];
        cache[aString] = cache[aString] || {};
        if (cache[aString][level])
            return cache[aString][level];
        const lookup:{[cmb:string]:string[]} = level === ROBOTLEVELS ? numeric : directional;
        for (var i=0;i<aString.length;i++) {
            const combo = (i===0 ? "A" : aString[i-1]) + aString[i];
            const strokes = combo[0]===combo[1] ? ["A"] : lookup[combo];
            if (level === 1) {
                if (i===0) {
                    result.splice(result.length,0, ...strokes.map(s => s.length));                }
                else {
                    result = result.reduce((all, prevstroke) => all.concat(strokes.map(s => s.length + prevstroke)), []);
                }
            } else {
                const things = [];
                strokes.forEach(sequence => {
                    things.splice(things.length, 0, ...minPress(sequence, level-1));
                });
                if (i===0) {
                    result.splice(result.length,0, ...things);                }
                else {
                    result = result.reduce((all, prevstroke) => all.concat(things.map(thing => prevstroke + thing)), []);
                }
            }
        }
        const short = Math.min(...result);
        cache[aString][level] = [short];
        return [short];
    };

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            ROBOTLEVELS = part === Part.One ? 3 : 26;

            let result = 0;
            input.forEach(line => {
                const value = parseInt(line.substring(0,3));
                const inbetween= minPress(line, ROBOTLEVELS);
                const lengthShortest = Math.min(...inbetween);
                result += value * lengthShortest;
            });

            // 249073 too high
            return result;

        }, "2024", "day21", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}