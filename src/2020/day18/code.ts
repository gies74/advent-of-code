/**
 * Advent of Code solution 2020/day18
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day18 {

    const doExecPrio = (stack:number[], part:Part, executor:string) => {
            const last = stack.pop();
            if (part == Part.One && executor === "*")
                stack[stack.length - 1] *= last;
            else
                stack[stack.length - 1] += last;
    }

    const parseD18 = (pieces:string[], part:number):number => {
        let piece = null;
        let execPrio = false;
        let executor = '';
        let breakAll = false;

        const stack:number[] = [];
        while(piece = pieces.shift()) {
            switch(piece) {
                case "(":
                    stack.push(parseD18(pieces, part));
                    if (execPrio)
                        doExecPrio(stack, part, executor);
                    execPrio = false;
                    executor = "";
                    break;
                case ")":
                    breakAll = true;
                    break;
                case "*":
                    execPrio = part === Part.One;
                    executor = "*";
                    break;
                case "+":
                    execPrio = true;
                    executor = "+";
                    //stack.splice(0, stack.length, stack.reduce((prod, s) => s * prod, 1));
                    break;
                default:
                    stack.push(parseInt(piece));                
                    if (execPrio)
                        doExecPrio(stack, part, executor);
                    execPrio = false;
                    executor = "";
                    break;
            }
            if (breakAll)
                break;
        }
        return part === Part.One && executor !== "*" ? stack.reduce((cum, s) => s + cum, 0)  : stack.reduce((prod, s) => s * prod, 1);
    };
    
    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // part aspecific code here
            let sum = Utils.sum(input.map(l => { 
                const res = parseD18(l.split(/ ?(\(|\)|\*|\+) ?/).filter(e => e !== ''), part); 
                return res;
            }));

            return sum;

        }, "2020", "day18", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}