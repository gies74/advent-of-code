/**
 * Advent of Code solution 2022/day16
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { open } from "fs";
import path = require("path");
import { Part, Utils } from "../../generic";

namespace day16 {

    const valves = {};
    const MINUTES = 30;


    const evaluate = (valveOpenActions) => {
        if (valveOpenActions.length > MINUTES) {
            return -1;
        }
        return valveOpenActions.reduce((agg, elt, idx) => {
            return agg + (elt && !/>/.test(elt) ? valves[elt].rate * (MINUTES - 1 - idx) : 0);
        }, 0);
    }

    class PathToGain {
        valve: string;
        predecessor: PathToGain;
        gain: 0;
        constructor(valve, opened, predecessor) {
            this.valve = valve;
            this.gain = opened.includes(valve) ? 0 : valves[valve].rate;
            this.predecessor = predecessor;
        }
        getGain(minutes) {
            return this.gain * minutes;
        }
        getPath() {
            let p: PathToGain = this;
            let path = [];
            while (p.predecessor) {
                path.unshift(p.valve);
                p = p.predecessor;
            }
            return path;
        }
    }

    const breadthFirst = (pos, opened) => {
        const gainPerValve: { [nm: string]: PathToGain } = {};
        const unexplored = [new PathToGain(pos, opened, null)];

        let pathObj;
        while (pathObj = unexplored.shift()) {
            const valve = pathObj.valve;
            gainPerValve[valve] = pathObj;
            for (var adjacentValve of valves[valve].tunnels) {
                if (!unexplored.includes(adjacentValve) && !Object.keys(gainPerValve).includes(adjacentValve)) {
                    unexplored.push(new PathToGain(adjacentValve, opened, pathObj));
                }
            }
        }
        const targets = Object.values(gainPerValve).filter(v => v.valve != pos);
        const gains = targets.map(v => v.getGain(MINUTES - 1 - opened.length - v.getPath().length));
        // only consider top 12 gains
        const topGains = gains.slice(0).sort((i,j) => j - i).slice(0,12);

        const topReleases = topGains.map(topGain => {
            const idxMaxGain = gains.findIndex((g, i) => g === topGain && targets[i].getPath().length < MINUTES - 1 - opened.length);
            if (idxMaxGain === -1 || gains[idxMaxGain] === 0) {
                return evaluate(opened);
            }
            const target = targets[idxMaxGain];
            const path = target.getPath();

            const newOpened = opened.concat(path.map(p => `>${p}`));
            newOpened.push(target.valve);
            return breadthFirst(target.valve, newOpened);
        });
        return Math.max(...topReleases); 
    }


    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            

            for (var line of input) {
                const pattern = /^Valve ([A-Z]{2}) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/;
                const valve = line.replace(pattern, "$1");
                const rate = parseInt(line.replace(pattern, "$2"));
                const tunnels = line.replace(pattern, "$3").split(", ");
                valves[valve] = { rate, tunnels };
            }

            // FUN sidetrack -> create input for https://csacademy.com/app/graph_editor/
            let msg = "";
            for (var fromValve of Object.keys(valves)) {
                for (var toValve of valves[fromValve].tunnels) {
                    try {
                    msg += `${fromValve}-${valves[fromValve].rate} ${toValve}-${valves[toValve].rate}\n`
                    } catch {
                        var breakhe = 1;
                    }
                }
            }
            console.log(msg);

            const pressureReleased = breadthFirst("AA", []);

            let answerPart1 = pressureReleased;
            let answerPart2 = 0;



            if (part == Part.One) {

                // part 1 specific code here

                return answerPart1;

            } else {

                // part 2 specific code here

                return answerPart2;

            }

        }, "2022", "day16",
        // set this switch to Part.Two once you've finished part one.
        Part.One,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}