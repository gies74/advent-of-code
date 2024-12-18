/**
 * Advent of Code solution 2024/day16
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day16 {

    const windVectors = { "n": [-1, 0], "e": [0,1], "s": [1, 0], "w": [0, -1]};
    const oppWindDir = { "n": "s", "s": "n", "e": "w", "w": "e"};

    class Node {
        coords:number[];
        ch:string;
        edges:{[wind:string]:Edge} = {};
        scoreToEnd:{[origWind:string]:number} = {"we": Number.MAX_SAFE_INTEGER, "ns": Number.MAX_SAFE_INTEGER};
        constructor(ch:string, coords:number[]) {
            this.ch = ch;
            this.coords = coords;
        }
        wind(e:Edge) {
            return Object.keys(this.edges).find(k => this.edges[k] === e, this);
        }
        contract() {
            const windDirs = Object.keys(this.edges);
            const e1 = this.edges[windDirs[0]];
            const e2 = this.edges[windDirs[1]];
            const oppNode = e2.oppNode(this);
            if (e1.node1 === this)
                e1.node1 = oppNode;
            else
                e1.node2 = oppNode;
            oppNode.edges[oppNode.wind(e2)] = e1;
            e1.length += e2.length + (oppWindDir[windDirs[0]] === windDirs[1] ? 0 : 1000);
        }
    }

    class Edge {
        node1:Node;
        node2:Node;
        length:number = 1;
        constructor(n1:Node, n2:Node) {
            this.node1 = n1;
            this.node2 = n2;
        }
        oppNode(n:Node):Node {
            return n === this.node1 ? this.node2 : this.node1;    
        }
    }



    const buildGraph = (maze:Node[][], start:Node, end:Node):Node[] => {
        const allNodes = [start];
        const nodes2Explore = [start];
        let node = null;
        while (node = nodes2Explore.shift()) {

            for (var windDir in windVectors) {
                const neighbourNode = maze[node.coords[0] + windVectors[windDir][0]][node.coords[1] + windVectors[windDir][1]]
                if (node.edges[windDir] || !neighbourNode)
                    continue;
                node.edges[windDir] = neighbourNode.edges[oppWindDir[windDir]] = new Edge(node, neighbourNode);
                if (!allNodes.includes(neighbourNode)) {
                    allNodes.push(neighbourNode);
                    nodes2Explore.push(neighbourNode);
                }
            }
        }

        let contractableNode = null;
        while (contractableNode = allNodes.find(n => Object.keys(n.edges).length === 2 && !"SE".includes(n.ch))) {
            contractableNode.contract();
            allNodes.splice(allNodes.indexOf(contractableNode), 1);
        }
        return allNodes;
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

            const maze = input.map((line,li) => line.split("").map((ch,ci) => "SE.".includes(ch) ? new Node(ch, [li, ci]) : null));
            const start = maze[maze.length-2][1];
            const end = maze[1][maze[0].length-2];
            const nodes = buildGraph(maze, start, end);

            //const cost = nodes.find(n => n.ch === "S").findEnd([]);
            end.scoreToEnd["we"] = 0;
            end.scoreToEnd["ns"] = 0;
            const open:Set<Node> = new Set([end]);

            while (open.size) {
                const lowScore = Math.min(...[...open].map(n => Math.min(...Object.values(n.scoreToEnd))));
                const goodNode = [...open].find(n => lowScore === Math.min(...Object.values(n.scoreToEnd)));
                for (var edge of Object.values(goodNode.edges)) {
                    const oppNode = edge.oppNode(goodNode);
                    const windDirGoodNode = Object.keys(goodNode.edges).find(wd => goodNode.edges[wd] === edge);
                    const scoreGoodNode = goodNode.scoreToEnd[["w", "e"].includes(windDirGoodNode) ? "we" : "ns"];
                    const windDirOppNode = Object.keys(oppNode.edges).find(wd => oppNode.edges[wd] === edge);
                    const length = edge.length + scoreGoodNode;
                    const wePenaltyOppNode = ["w", "e"].includes(windDirOppNode) ? 0 : 1000;
                    const nsPenaltyOppNode = 1000 - wePenaltyOppNode;
                    if (oppNode.scoreToEnd["we"] > length + wePenaltyOppNode) {
                        oppNode.scoreToEnd["we"] = length + wePenaltyOppNode;
                        open.add(oppNode);
                    }
                    if (oppNode.scoreToEnd["ns"] > length + nsPenaltyOppNode) {
                        oppNode.scoreToEnd["ns"] = length + nsPenaltyOppNode;
                        open.add(oppNode);
                    }                    
                }
                open.delete(goodNode);
            }

            return start.scoreToEnd["we"];


        }, "2024", "day16", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}