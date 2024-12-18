/**
 * Advent of Code solution 2024/day18
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day18 {

    class Node {
        edges:Edge[] = [];
        score:number = Number.MAX_SAFE_INTEGER;
        bestEdge:Edge = null;
        coord:number[];
        constructor(coord:number[]) {
            this.coord = coord;        
        }

        toString() {
            return `(${this.coord[0]},${this.coord[1]})`;
        }

    }

    class Edge {
        node1:Node;
        node2:Node;
        coord:number[];
        constructor(n1:Node, n2:Node) {
            this.node1 = n1;
            this.node2 = n2;
            n1.edges.push(this);
            n2.edges.push(this);            
        }
        oppNode(node:Node) {
            return this.node1 === node ? this.node2 : this.node1;
        }
        toString() {
            return `${this.node1}-${this.node2}`
        }
    }

    const exitReachable = (grid) => {
        const gridsize = grid.length;

        const startNode = grid[0][0];
        const targetNode = grid[gridsize-1][gridsize-1];
        targetNode.score = 0;

        const open:Set<Node> = new Set([targetNode]);
        while (open.size) {
            const lowestScore = Math.min(...[...open].map(n => n.score));
            const bestOpenNode = [...open].find(n => n.score === lowestScore);

            for (var edge of bestOpenNode.edges) {
                const neighbour = edge.oppNode(bestOpenNode);
                if (neighbour.score > bestOpenNode.score + 1) {
                    neighbour.score = bestOpenNode.score + 1;
                    open.add(neighbour);
                }
                open.delete(bestOpenNode);
            }
        }

        return startNode.score < Number.MAX_SAFE_INTEGER;
    };

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const gridsize = example != 0 ? 7 : 71;


            let stillReachable = 0;
            let notReachable = input.length-1;

            while (notReachable - stillReachable > 1) {

                let fallen = stillReachable + Math.floor((notReachable - stillReachable) / 2);

                if (part === Part.One) {
                    fallen = example===0 ? 1024 : 12;
                }
                const firstBytes = input.slice(0, fallen);
                const grid = Utils.multiDimArray([gridsize,gridsize], c => firstBytes.includes(`${c[1]},${c[0]}`) ? null : new Node(c));
                grid.forEach((row, ri) => row.forEach((node, ci) => {
                    if (!node)
                        return;
                    if (ri > 0 && grid[ri-1][ci])
                        new Edge(grid[ri-1][ci], node);
                    if (ci > 0 && grid[ri][ci - 1])
                        new Edge(grid[ri][ci - 1], node);
                }));
    
                if (exitReachable(grid)) {
                    stillReachable = fallen;
                } else {
                    notReachable = fallen;
                }
                if (part === Part.One)
                    return grid[0][0].score;
    
            }
            return input[notReachable-1];


        }, "2024", "day18", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}