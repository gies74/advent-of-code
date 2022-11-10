/**
 * Advent of Code 
 * (c) 2022 Gies Bouwman
 * All rights reserved.
 */

namespace day00 {
    const fs = require("fs");

    const main = (): void => {
        const input = fs.readFileSync(`${__dirname}\\..\\..\\aoc\\day00\\input.txt`).toString().split("\n").slice(0, -1);
        const sTime = Date.now();
        const result = processInput(input);
        console.log(`Answer: ${result} (calc time: ${Date.now() - sTime} ms)`);
    }

    const splitInput = (input: string[]): string[][] => {
        return input.reduce((agg: string[][], elt:string) => {
            if (!elt) {
                agg.push([]);
            } else {
                agg[agg.length - 1].push(elt);
            }
            return agg;
        }, [[]]);
    }

    /** 
     * add code for day00 below
     */

     const processInput = (input: string[]): number => {

        // const parts = splitInput(input);

        /** insert logic here */
        
        return 0;
    };

    /** 
     * add code for day00 above
     */
    main();

}