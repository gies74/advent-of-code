const fs = require("fs");

export class Settings {
    public static readonly YEAR = 2021;
}

export class Utils {

    public static main = (processFunc: (input: string[]) => number, year: number, day: string) : void => {
        const input = fs.readFileSync(`${__dirname}/../data/${year}/${day}/input.txt`).toString().split("\n").slice(0, -1);
        const sTime = Date.now();
        const result = processFunc(input);
        console.log(`Answer: ${result} (calc time: ${Date.now() - sTime} ms)`);
    }

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