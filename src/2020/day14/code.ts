/**
 * Advent of Code solution 2020/day14
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day14 {
    
    /** ADD 2020-day14 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // input = [
            //     "mask = 000000000000000000000000000000X1001X",
            //     "mem[42] = 100",
            //     "mask = 00000000000000000000000000000000X0XX",
            //     "mem[26] = 1"
            // ]

            let answerPart1 = 0;
            let answerPart2 = 0;

            const mem : {[name:string]: number} = {};

            const assignMem = (mem, subject, mask) => {
                if (!/X/.test(mask)) {
                    const actualAddress = Number(BigInt(parseInt(mask, 2)));
                    mem[actualAddress] = subject;
                    return;
                }
                assignMem(mem, subject, mask.replace(/X/, 0));
                assignMem(mem, subject, mask.replace(/X/, 1));
            };



            let mask = "";
            let maskAnd;
            let maskOr;
            for (var chunk of input) {
                if (/^mask/.test(chunk)) {
                    mask = chunk.split(" = ")[1];
                    const mA = mask.replace(/X/g, '1');
                    maskAnd = BigInt(parseInt(mA, 2));
                    const mO = mask.replace(/X/g, '0');
                    maskOr = BigInt(parseInt(mO, 2));
                    continue
                }
                var line = chunk;
                const elts = line.split(/[/[\] ]/g);
                if (elts.length != 5)
                    throw Error("Wtf");
                let subject, address;
                if (part == Part.One) {
                    subject = BigInt(parseInt(elts[4]));
                    address = BigInt(parseInt(elts[1]));
                    const val = Number(subject & maskAnd | maskOr);
                    if (val < -1 || val > maskAnd) {
                        throw Error("Wtf2");
                    }
                    mem[elts[1]] = val;
                } else {
                    subject = (parseInt(elts[4]));
                    address = BigInt(parseInt(elts[1]));
                    const mask0 = mask.replace(/X/g, '0');
                    const mask0dec = BigInt(parseInt(mask0, 2));
                    const addressMasked = ((address | mask0dec).toString(2));
                    let result = "00000000000000000000000000000000000000000000" + addressMasked;
                    result = result.substring(result.length-36);
                    mask.split('').forEach((c, i) => {
                        if (c == 'X')
                            result = result.substring(0, i) + 'X' + result.substring(i+1);
                    })
                    assignMem(mem, subject, result);
                }
            }

            var x = Object.values(mem).reduce((agg, e) => agg + e, 0);
            return x;

        }, "2020", "day14", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two);
}