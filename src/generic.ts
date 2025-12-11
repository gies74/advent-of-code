const fs = require("fs");
require('dotenv').config();
const readline = require('node:readline');
const https = require('https');
import { HttpsProxyAgent } from 'https-proxy-agent';

const agent = process.env["HTTPS_PROXY"] ? new HttpsProxyAgent(process.env["HTTPS_PROXY"]) : null;

export class Settings {
    public static readonly YEAR = 2025;
}

export enum Part {
    One = 1,
    Two = 2
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export class Utils {

    /**
     * Main entry point of a given puzzle. Reads puzzle input from file to memory
     * and reports the answer with timing stats.
     * @param processFunc Call back function, with the puzzle input as an argument
     * @param year Given year
     * @param day Given day
     */
    public static main = (processFunc: (input: string[], part: Part, example?:number) => any, year: string, day: string, part: Part = Part.One, example: number = 0) : void => {
        const input_sfx = (example == 0) ? `` : `_example${example}`;
        const input = fs.readFileSync(`${__dirname}/../data/${year}/${day}/input${input_sfx}.txt`).toString().split("\n").slice(0, -1);
        const sTime = Date.now();
        const result = processFunc(input, part, example);
        console.log(`Answer part ${part}: ${result} (time elapsed: ${Date.now() - sTime} ms)`);
        
        year = "2016";
        day = "2";
        part = Part.One;
        const options = {
            host: `adventofcode.com`,
            port: 443,
            agent: agent,
            method: 'POST',
            path: `/${year}/day/${day.replace("day0","").replace("day", "")}/answer`, // 9-11-2022 19:29:58
            headers: {
                cookie: process.env["AOC_COOKIE"],
                'Content-Type': 'application/x-www-form-urlencoded',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
            }
        };

        rl.question(`Post this answer? [Y,N] `, ans => {
            if (ans.toUpperCase() === "Y") {
                const postData = JSON.stringify({
                    level: part === Part.One ? 1 : 2,
                    answer: result
                });
                options.headers["Content-Length"] = postData.length;
                const req = https.request(options, (res) => {
                    res.on('data', (d) => {
                        rl.write(Buffer.from(d).toString('utf-8'));
                    });
                    res.on('end', (d) => {
                        const a=3;
                    })
                });
                req.on('error', (e) => {
                    console.error(e);
                });
                req.write(postData);
                req.end();
            }
            rl.close();
        });
        //const doPost = prompt("Post this answer? [Y,N]", "N") === "Y";
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
    public static multiDimArray<T>(dimension: number, sizeAxis: number, fillFunc?: (coord:number[]) => T) : any[];
    /**
     * Create multi dimensional filled array
     * @param sizes number of elements in each dimension
     * @param fillFunc optional function that must return a value the given dim dimensional coordinate
     * @returns
     */
    public static multiDimArray<T>(sizes: number[], fillFunc?: (coord:number[]) => T) : any[];
    public static multiDimArray<T>(arg1: number | number[], arg2?: number | ((coord:number[]) => T), fillFunc?: (coord:number[]) => T) : any[]
    {
        if ((typeof arg1 === 'object') !== (['undefined', 'function'].includes(typeof arg2))) 
            throw Error("Wrong args");
        const sizesDef = (typeof arg1 === 'object') ? arg1 : Array(arg1).fill(arg2);
        const funcDef = (typeof arg2 === 'function') ? arg2 : (typeof fillFunc === 'function') ? fillFunc : () => 0;
        return Utils._multiDimArray(sizesDef , funcDef, []);
    }

    private static _multiDimArray = (sizes:number[], fillFunc: (coord:any[]) => any, _coord:number[]):any[] => {
        if (!sizes.length) {
            return fillFunc(_coord);
        }
        const dim = sizes.shift();        
        return Array(dim).fill(0).map((_, i) => Utils._multiDimArray(sizes.slice(0), fillFunc, _coord.concat([i])));
    };

    /**
     * Generate array of length n arrays to use as neighbouring offset deltas in an n-dimensional space 
     * @param n 
     * @param ortho just the offsets in single dimension
     * @param top 
     * @returns 
     */
    public static multiDimOffsets = (n: number, ortho: boolean) => {
        if (n==0)
            return [[]];
        let r: any[] = [];
        for (var i of [-1,0,1])
            for (var e of Utils._multiDimOffsets(n-1, ortho)) {
                const cp = e.slice(0);
                cp.push(i);
                r.push(cp);
            }
        
        // filter out the all 0 co-ordinate
        r = r.filter(v => v.some((e: any): boolean => e !== 0));
        // filter out co-ordinates that are not orthogonal
        if (ortho)
            r = r.filter(v => Utils.countTruthy(v.map((c:number) => Math.abs(c))) === 1);
        return r;
    }

    public static _multiDimOffsets = (n: number, ortho: boolean) => {
        if (n==0)
            return [[]];
        let r: any[] = [];
        for (var i of [-1,0,1])
            for (var e of Utils._multiDimOffsets(n-1, ortho)) {
                const cp = e.slice(0);
                cp.push(i);
                r.push(cp);
            }        
        return r;
    }


    /***
     * Counts the elements of an any dimensional array that are truthy
     * @param array 
     */
    public static countTruthy = (array: any[]): number => {
        return array.reduce((aggregate, element) => {
            const s= aggregate + (element.length ? Utils.countTruthy(element) : element ? 1 : 0);
            return s;
        }, 0);
    }

    /***
     * Sums the elements of an any dimensional array assuming they are numeric
     * @param array 
     */
     public static sum = (array: any[]): number => {
        return array.reduce((aggregate, element) => {
            const s= aggregate + (element.length ? Utils.sum(element) : Number(element));
            return s;
        }, 0);
    }

    /***
     * Creates the intersection of two sets
     */
    public static getIntersection = (setA: Set<any>, setB: Set<any>): Set<any> => {
        var aa = [...setA.keys()];
        var bb = aa.filter(element => setB.has(element))
        const intersection = new Set(
            bb
        );      
        return intersection;
    }
    
    /***
     * Least Common Multiple
     * https://decipher.dev/30-seconds-of-typescript/docs/lcm/
     */
    public static lcm = (...arr: number[]):number => {
        const gcd = (x:number, y:number):number => (!y ? x : gcd(y, x % y));
        const _lcm = (x:number, y:number):number => (x * y) / gcd(x, y);
        return [...arr].reduce((a, b) => _lcm(a, b));
    };       

}