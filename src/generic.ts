const fs = require("fs");

export class Settings {
    public static readonly YEAR = 2020;
}

export enum Part {
    One = 1,
    Two = 2
}

export class Utils {

    /**
     * Main entry point of a given puzzle. Reads puzzle input from file to memory
     * and reports the answer with timing stats.
     * @param processFunc Call back function, with the puzzle input as an argument
     * @param year Given year
     * @param day Given day
     */
    public static main = (processFunc: (input: string[], part: Part) => any, year: string, day: string, part: Part = Part.One) : void => {
        const input = fs.readFileSync(`${__dirname}/../data/${year}/${day}/input.txt`).toString().split("\n").slice(0, -1);
        const sTime = Date.now();
        const result = processFunc(input, part);
        console.log(`Answer part ${part}: ${result} (time elapsed: ${Date.now() - sTime} ms)`);
    }

    /**
     * Split input into groups separated by empty lines
     * @param input The puzzle input as a string array, each element representing a line
     * @returns Array of array of strings, grouping subsequent lines delimited by empty lines
     */
    public static splitInput = (input: string[]): string[][] => {
        return input.reduce((agg: string[][], elt:string) => {
            if (!elt) {
                agg.push([]);
            } else {
                agg[agg.length - 1].push(elt);
            }
            return agg;
        }, [[]]);
    }
}