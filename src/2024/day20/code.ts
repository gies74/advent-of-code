/**
 * Advent of Code solution 2024/day20
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day20 {

    
    class Node {
        coords:number[];
        ch:string;
        edges:Edge[] = [];
        time:number = 0;
        constructor(ch:string, coords:number[]) {
            this.ch = ch;
            this.coords = coords;
        }   
        toString() {
            return `(${this.coords[0]},${this.coords[1]})`;
        }     
    }

    class Edge {
        node1:Node;
        node2:Node;
        constructor(n1:Node, n2:Node, regInNodes:boolean=true) {
            this.node1 = n1;
            this.node2 = n2;
            if (regInNodes) {
                n1.edges.push(this);
                n2.edges.push(this);
            }
        }
        oppNode(n:Node):Node {
            return n === this.node1 ? this.node2 : this.node1;    
        }
    }

    class Cheat extends Edge {
        constructor(n1:Node, n2:Node) {
            super(n1, n2, false);
        }
        get timeDiff():number {
            return Math.abs(this.node1.time - this.node2.time) - 2;
        }
        toString() {
            return `${this.node1}-${this.node2} ${this.timeDiff}ps`
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

            const cheats:Cheat[] = [];
            const track = input.map((line, li) => line.split("").map((ch, ci) => ch === "#" ? null : new Node(ch, [li,ci]) ));
            track.forEach((row,ri) => row.forEach((n, ci) => {
                if (!n) {
                    return;
                }
                if (ri > 1 && track[ri-1][ci]) {
                    new Edge(track[ri-1][ci], n);
                }
                if (ri > 2 && !track[ri-1][ci] && track[ri-2][ci]) {
                    cheats.push(new Cheat(track[ri-2][ci], n));                    
                }
                if (ci > 1 && track[ri][ci-1]) {
                    new Edge(track[ri][ci-1], n);
                }
                if (ci > 2 && !track[ri][ci-1] && track[ri][ci-2]) {
                    cheats.push(new Cheat(track[ri][ci-2], n));
                }
            }));
            let prevNode = track.reduce((tgt,row) => tgt || row.find(c => c && c.ch==="S"), null) as Node;
            let prevEdge:Edge = null;
            while (prevEdge = prevNode.edges.find(e => e !== prevEdge)) {
                const time = prevNode.time;
                prevNode = prevEdge.oppNode(prevNode);
                prevNode.time = time + 1;
            }

            const cnt = cheats.filter(cht => cht.timeDiff >= 100).length;



            return cnt;

        }, "2024", "day20", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}