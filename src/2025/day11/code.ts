/**
 * Advent of Code solution 2025/day11
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day11 {

    class Server {
        name: string;
        outputs:Server[] = [];
        _path_count_cache;
        constructor(name:string) {
            this.name = name;
        }

        n_dac_fft_paths() {
            if (this._path_count_cache === undefined) {            
                if (this.name === "out")
                    return [1, 0, 0, 0]; // any path, paths thru dac, paths thru fft, paths thru both
                const self = this;
                this._path_count_cache = this.outputs.reduce((cum, o) => {
                    const paths = o.n_dac_fft_paths();
                    const anyPaths = paths[0];
                    const dacPaths = paths[1] + ((self.name === "dac") ? paths[0] : 0);
                    const fftPaths = paths[2] + ((self.name === "fft") ? paths[0] : 0);
                    const bothPaths = paths[3] + ((self.name === "dac") ? paths[2] : (self.name === "fft") ? paths[1] : 0);
                    return [cum[0] + anyPaths, cum[1] + dacPaths, cum[2] + fftPaths, cum[3] + bothPaths];
                }, [0, 0, 0, 0]);
            }
            return this._path_count_cache;
        }
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {
            const servers:{[name:string]:Server} = {};
            const lookup:{[name:string]:string[]} = input.reduce((lu, line) => {
                const [lkey, vals] = line.split(": ");
                lu[lkey] = vals.split(" ");
                servers[lkey] = new Server(lkey);
                return lu;
            }, {});
            servers["out"] = new Server("out");
            Object.entries(lookup).forEach(entry => servers[entry[0]].outputs = lookup[entry[0]].map(k => servers[k]));
            const multiPaths = servers[part === Part.One ? "you" : "svr"].n_dac_fft_paths();
            if (part === Part.One)
                return multiPaths[0];
            return multiPaths[3];

        }, "2025", "day11", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0
    );
}