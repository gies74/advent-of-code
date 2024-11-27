/**
 * Advent of Code solution 2017/day24
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day24 {

    class Port {
        value:number;
        comps:Component[] = [];
        constructor(name:string) {
            this.value= parseInt(name);
        }
        findStrongest(used:Component[], part:Part):Component[] {
            const nonUsed = this.nonUsedComponents(used);
            if (nonUsed.length === 0)
                return [];
            let bestLength = 0;
            let bestStrength = 0;
            let bestBridge:Component[] = null;
            for (var comp of nonUsed) {
                const bridge = [comp].concat(comp.opposingPort(this).findStrongest(used.concat([comp]), part));
                const strength = bridge.reduce((cum, comp) => cum + comp.port1.value + comp.port2.value, 0);
                const length = bridge.length;
                if (part === Part.One && strength > bestStrength || part === Part.Two && (length > bestLength || length === bestLength && strength > bestStrength)) {
                    bestBridge = bridge;
                    bestStrength = strength;
                    bestLength = length;
                }
            }
            return bestBridge;
        }
        nonUsedComponents(used) {
            return this.comps.filter(c => !used.includes(c));
        }
    }

    class Component {
        port1: Port;
        port2: Port;
        constructor(name, ports) {
            const portnames = name.split("/");
            if (portnames[0] === portnames[1])
                portnames.pop();
            portnames.forEach(pn => {
                if (!ports[pn])
                    ports[pn] = new Port(pn);
                ports[pn].comps.push(this);
            });
            this.port1 = ports[portnames[0]];
            this.port2 = ports[portnames[portnames.length - 1]];
        }
        opposingPort(port:Port) {
            return this.port1 === port ? this.port2 : this.port1;
        }
        toString() {
            return `${this.port1.value}-${this.port2.value}`;
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
            const ports:{[name:string]:Port} = {};
            input.forEach(line => new Component(line, ports));
            const port0 = ports["0"];

            const strongestBridge:Component[] = port0.findStrongest([], part);
            const strength = strongestBridge.reduce((cum, comp) => cum + comp.port1.value + comp.port2.value, 0);

            return strength;

        }, "2017", "day24", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}