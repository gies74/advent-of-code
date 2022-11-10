/**
 * Advent of Code 
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day00 {
    const fs = require("fs");
    const generic = require('../../generic');   

    const main = (): void => {
        const input = fs.readFileSync(`${__dirname}\\..\\..\\..\\data\\${generic.Settings.YEAR}\\day00\\input.txt`).toString().split("\n").slice(0, -1);
        const sTime = Date.now();
        const result = processInput(input);
        console.log(`Answer: ${result} (calc time: ${Date.now() - sTime} ms)`);
    }

    /** 
     * add code for day00 below
     */

     const processInput = (input: string[]): number => {

        // const parts = generic.Utils.splitInput(input);

        /** insert logic here */
        
        return 0;
    };

    /** 
     * add code for day00 above
     */
    main();

}