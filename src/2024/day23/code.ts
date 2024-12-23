/**
 * Advent of Code solution 2024/day23
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day23 {



    class Node {
        name:string;
        nodes:Node[] = [];
        constructor(name) {
            this.name = name;
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

            const lookup:{[key:string]:Node} = {};
            input.forEach(line => {
                const [n1, n2] = line.split("-");
                const node1 = lookup[n1] = lookup[n1] || new Node(n1);
                const node2 = lookup[n2] = lookup[n2] || new Node(n2);
                node1.nodes.push(node2);
                node2.nodes.push(node1);
            });

            const targets = [];
            Object.entries(lookup).forEach(([key,node]) => {
                node.nodes.forEach(node_l1 => {
                    node_l1.nodes.forEach(node_l2 => {
                        const names = [node.name, node_l1.name, node_l2.name];
                        if (node_l2.nodes.includes(node) && names.some(nm => /^t/.test(nm)) && !targets.some(tgt => tgt.every(nm => names.includes(nm)))) {
                            targets.push(names);
                        }
                    });
                });
            });

            return 0;

        }, "2024", "day23", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}