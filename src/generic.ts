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
    public static main = (processFunc: (input: string[], part: Part) => any, year: string, day: string, part: Part = Part.One, example: number = 0) : void => {
        const input_sfx = (example == 0) ? `` : `_example${example}`;
        const input = fs.readFileSync(`${__dirname}/../data/${year}/${day}/input${input_sfx}.txt`).toString().split("\n").slice(0, -1);
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

    /**
     * Create multi dimensional filled array
     * @param dimension array dimension
     * @param sizeAxis number of elements in each dimension
     * @param fillFunc optional function that must return a value the given dim dimensional coordinate
     * @returns 
     */
    public static multiDimArray = (dimension: number, sizeAxis: number, fillFunc: (coord:any[]) => any = () => 0) => {
        return Utils._multiDimArray(dimension, sizeAxis, fillFunc, []);
    }

    private static _multiDimArray = (dimension: number, sizeAxis: number, fillFunc: (coord:any[]) => any, _coord) => {
        if (dimension == 0) {
            return fillFunc(_coord);
        }
        return Array(sizeAxis).fill(0).map((_, i) => Utils._multiDimArray(dimension - 1, sizeAxis, fillFunc, _coord.concat([i])));
    };

    /**
     * Generate array of length n arrays to use as neighbouring offset deltas in an n-dimensional space 
     * @param n 
     * @param top 
     * @returns 
     */
    public static multiDimOffsets = (n: number, top=true) => {
        if (n==0)
            return [[]];
        let r = [];
        for (var i of [-1,0,1])
            for (var e of Utils.multiDimOffsets(n-1, false)) {
                const cp = e.slice(0);
                cp.push(i);
                r.push(cp);
            }
        
        if (top)
            r = r.filter(v => v.some(e => e !== 0));
        return r;
    }

    /***
     * Counts the elements of an any dimensional array that are truthy
     * @param array 
     */
    public static sumTruthy = (array: any[]):number => {
        return array.reduce((aggregate, element) => {
            const s= aggregate + (element.length ? Utils.sumTruthy(element) : element ? 1 : 0);
            return s;
        }, 0);
    }
}