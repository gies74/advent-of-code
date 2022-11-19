/**
 * Advent of Code solution 2020/day08
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day08 {
    const generic = require('../../generic');
    
    /** ADD 2020-day08 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    generic.Utils.main((input) => {

        let accum=0, corruptAccum=0;
        let instrPtr=0;
        let instrPtrs = new Set([]);
        let corruptInstrPtrs = new Set([])
        const corruptInstrPtrsTried = [];
        let corruptInstrPtr=-1;
        while(true) {
            instrPtrs.add(instrPtr);
            let [instr, arg] = input[instrPtr].split(" ");
            const argi = parseInt(arg);
            if (corruptInstrPtr == -1 && !corruptInstrPtrsTried.includes(instrPtr) && ["nop", "jmp"].includes(instr))
            {
                corruptInstrPtr = instrPtr;
                corruptAccum = accum;
                corruptInstrPtrs = new Set([...instrPtrs]);
                corruptInstrPtrsTried.push(instrPtr);
                if (instr == "jmp")
                    instr = "nop";
                else
                    instr = "jmp";
            }


            switch (instr) {
                case "nop":
                    instrPtr++;
                    break;
                case "acc":
                    instrPtr++;
                    accum += argi;
                    break;
                case "jmp":
                    instrPtr += argi;
                    break;
                default:
                    throw "Wtf";
            }
            if (instrPtr > input.length) {
                if (corruptInstrPtr == -1)
                    throw "Wtf2";
                instrPtr = corruptInstrPtr;
                accum = corruptAccum;
                instrPtrs = corruptInstrPtrs;
                corruptInstrPtr = -1;
            } else if (instrPtrs.has(instrPtr)) {
                instrPtr = corruptInstrPtr;
                accum = corruptAccum;
                instrPtrs = corruptInstrPtrs;
                corruptInstrPtr = -1;
            }
            if (instrPtr == input.length) {
                if (corruptInstrPtr == -1)
                    throw "Wtf3";
                console.log(`Found it, line ${corruptInstrPtr + 1}:${input[corruptInstrPtr]} was corrupt!`);
                break;
            }
        }



        return accum;

    }, "2020", "day08");

}