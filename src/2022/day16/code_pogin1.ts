/**
 * Advent of Code solution 2022/day16
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day16 {
    
    const valves = {};

    const cycleDetection = (valveOpenActions) => {
        const hist = [];
        for (var j=valveOpenActions.length-1;j>=0;j--) {
            const voa = valveOpenActions[j];
            if (!/>/.test(voa)) {
                return false;
            }
            if (hist.includes(voa)) {
                return true;
            }
            hist.push(voa);
        }
        return false;
    }

    const evaluate = (valveOpenActions) => {
        if (valveOpenActions.length > 30) {
            return -1;
        }
        return valveOpenActions.reduce((agg, elt, idx) => { 
            return agg + (elt && !/>/.test(elt) ? valves[elt].rate * (29 - idx) : 0);
        }, 0);
    }

    const openValve = (pos, valveOpenActions) => {
        const clone = valveOpenActions.slice(0);
        clone.push(pos);
        return doAction(pos, clone);
    }

    const goTo = (pos, valveOpenActions) => {
        const clone = valveOpenActions.slice(0);
        clone.push(`>${pos}`);
        if (!cycleDetection(clone)) {
            return doAction(pos, clone);
        }
        return valveOpenActions;
    }

    const doAction = (pos, valveOpenActions) => {

        if (valveOpenActions.length >= 30) {
            return valveOpenActions;
        }

        const actions = [];
        const effects = [];
        if (!valveOpenActions.includes(pos) && valves[pos].rate > 0) {
            const action = openValve(pos, valveOpenActions);
            actions.push(action);
            effects.push(evaluate(action));
        }
        // dont allow to move around without ever doing anything
        for (var nextPos of valves[pos].tunnels) {
            const action = goTo(nextPos, valveOpenActions);
            actions.push(action);
            effects.push(evaluate(action));
        }

        if (!effects.length) {
            return valveOpenActions;
        }

        const maximizeIdx = effects.findIndex(e => e === Math.max(...effects));
        return actions[maximizeIdx];
    };

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

            const actions = doAction("AA", []);
            console.log(actions.join(','));
            let answerPart1 = evaluate(actions);
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
        1);
}