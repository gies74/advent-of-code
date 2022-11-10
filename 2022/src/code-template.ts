/**
 * Advent of Code 
 * (c) 2022 Gies Bouwman
 * All rights reserved.
 */

namespace day00 {
    const fs = require("fs");

    const main = (): void => {
        const input = fs.readFileSync(`${__dirname}\\..\\..\\aoc\\day00\\input.txt`).toString().split("\n").slice(0, -1);
        const result = processInput(input);
        console.log(`Answer: ${result}`);
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

    main();

    /** 
     * day00 specific classes and functions
     */

     const processInput = (input: string[]): number => {
        /** insert logic here */
        const parts = splitInput(input);
        const charts = parts.slice(1).map(p => new BingoChart(p));
        return 0;
    };

    class BingoChart {
        /**
         *
         */
        data:number[][] = [];

        constructor(data: string[]) {
            for (var d of data) {
                this.data.push(d.split(' ').map(n => parseInt(n)));
            }
        }
    }

}