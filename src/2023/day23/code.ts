/**
 * Advent of Code solution 2023/day23
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { assert } from "console";
import { Part, Utils } from "../../generic";

namespace day23 {

    const globalNodes:SlopeNode[] = [];
    const globalEdges:Edge[] = [];
    const slopeCharDir:{[k:string]:number[]} = { "v": [1,0], "^": [-1,0], "<": [0,-1], ">": [0,1]};
    const deltas = Utils.multiDimOffsets(2, true);

    class SlopeNode {
        y:number;
        x:number;
        char:string;
        outEdges:Edge[] = [];
        inEdges:Edge[] = [];
        visited:boolean = false;
        distFromStart:number = 0;
        bestInEdge:Edge = null;
        constructor(y:number, x:number, char:string) {
            this.y = y;
            this.x = x;
            this.char = char;
            globalNodes.push(this);
        }
        toString() {
            return `${this.char}(${this.y},${this.x})`;
        }
        get edges() {
            return [].concat(this.inEdges, this.outEdges);
        }

        bouwman_p2(target:SlopeNode, inEdge:Edge = null) {
            let longest = -1;
            if (target === this)
                return 0;            
            if (this.visited)
                return longest;
            this.visited = true;

            const edges:Edge[] = (inEdge ? this.oppositeEdges(inEdge) : this.edges).filter(e => !e.passed);
            edges.forEach(edge => {
                edge.passed = true;
                const oppositeNode = edge.oppositeNode(this);
                const dist = oppositeNode.bouwman_p2(target, edge);
                longest = Math.max(longest, (dist !== -1) ? dist + edge.length : dist);
                edge.passed = false;
            }, this);
            this.visited = false;

            return longest;
        }

        oppositeEdges(e:Edge) {
            assert(this.edges.includes(e));
            return this.edges.filter(ed => ed !== e);
        }
    }

    class Edge {
        sn1:SlopeNode;
        sn2:SlopeNode;
        length:number;
        passed:boolean = false;
        constructor(sn1:SlopeNode, sn2:SlopeNode, length: number) {
            this.sn1 = sn1;
            this.sn2 = sn2;
            this.length = length;
            sn1.outEdges.push(this);
            sn2.inEdges.push(this);
            globalEdges.push(this);
        }
        toString() {
            return `${this.sn1.toString()} - ${this.sn2} [${this.length.toString()}]`;
        }
        oppositeNode(n:SlopeNode) {
            assert([this.sn1, this.sn2].includes(n));
            return n === this.sn1 ? this.sn2 : this.sn1;
        }
    }

    const surveyDownSlopes = (grid:string[][], y:number, x:number) => {
        const slopeCoords:number[][] = [];
        Object.keys(slopeCharDir).forEach(k => {
            const dy = y + slopeCharDir[k][0], dx = x + slopeCharDir[k][1];
            if (grid[dy][dx] === k)
                slopeCoords.push([dy, dx]);
        });
        return slopeCoords;
    }

    const takeStep = (grid:string[][], prevY:number, prevX:number, curY:number, curX:number):number[] => {
        const delta = deltas.find(d => {
            const dy = curY + d[0], dx = curX + d[1];
            return !(dy == prevY && dx === prevX) && /[.x]/.test(grid[dy][dx]);
        });
        return delta;
    };

    const traceGrid_p1 = (grid:string[][], start:SlopeNode, end:SlopeNode) => {
        const stack:SlopeNode[] = [start];
        let node:SlopeNode;
        while (node = stack.pop()) {
            const sLength = 1, y = node.y + slopeCharDir[node.char][0], x = node.x + slopeCharDir[node.char][1];

            surveyDownSlopes(grid, y, x).forEach(coord => {
                const snIdx = globalNodes.findIndex(sn => sn.y === coord[0] && sn.x === coord[1]);
                let sn;
                if (snIdx === -1) {
                    sn = new SlopeNode(coord[0], coord[1], grid[coord[0]][coord[1]]);
                    stack.push(sn);
                }
                else
                    sn = globalNodes[snIdx];
                new Edge(node, sn, sLength + 1);
            });

            deltas.forEach(d => {
                let dy = y + d[0], dx = x + d[1], cy = y, cx = x;
                if (grid[dy][dx] === ".") {                    
                    let length = sLength + 1, step;
                    while (true) {
                        surveyDownSlopes(grid, dy, dx).forEach(coord => {
                            const snIdx = globalNodes.findIndex(sn => sn.y === coord[0] && sn.x === coord[1]);
                            let sn;
                            if (snIdx === -1) {
                                sn = new SlopeNode(coord[0], coord[1], grid[coord[0]][coord[1]]);
                                stack.push(sn);
                            }
                            else
                                sn = globalNodes[snIdx];
                            new Edge(node, sn, length + 1);
                        });
                        step = takeStep(grid, cy, cx, dy, dx);
                        if (!step)
                            break;
                        length++;
                        cy = dy, cx = dx, dy = cy + step[0], dx = cx + step[1];                   
                    }
                }
            });

        }
    };

    const traceGrid_p2 = (grid:string[][]) => {
        globalNodes.forEach(node => {
            const ds = deltas.filter(d => {
                const dy = node.y + d[0], dx = node.x + d[1];
                return dy >= 0 && dy < grid.length && dx >= 0 && dx < grid[0].length && /[.x]/.test(grid[dy][dx]);
            });
            ds.forEach(d => {
                let cy = node.y, cx = node.x;
                let length = 1, dy = cy + d[0], dx = cx + d[1];
                let endNode;
                while (true) {
                    if (endNode = globalNodes.find(n => n.y === dy && n.x === dx)) {
                        if (!globalEdges.some(e => (e.sn1 === node && e.sn2 === endNode || e.sn2 === node && e.sn1 === endNode) && e.length === length)) {
                            new Edge(node, endNode, length);
                        }
                        return;
                    }
                    const step = takeStep(grid, cy, cx, dy, dx);
                    if (!step)
                        return;
                    length++;
                    cy = dy, cx = dx, dy = cy + step[0], dx = cx + step[1];
                }
            });
        });
    }

    const bestPath = (sn:SlopeNode):string[] => {
        if (!sn.bestInEdge)
            return [];
        else {
            const path = bestPath(sn.bestInEdge.sn1);
            path.push(sn.bestInEdge.toString());
            return path;
        }
    }

    const bouwman_p1 = (start:SlopeNode, target:SlopeNode, allNodes:SlopeNode[]):number => {

        let collection:SlopeNode[] = [start];
        start.distFromStart = 0;

        let loopDetect = 10E6;
        while (!collection.includes(target))
        {
            const leavingEdges:Edge[] = [].concat(...collection.map(sn => sn.outEdges));
            // leavingEdges.forEach(le => le.sn2.distFromStart = Math.max(le.sn2.distFromStart, le.sn1.distFromStart + le.length));
            const leavingNodes:SlopeNode[] = leavingEdges.map(le => le.sn2);

            const cands = leavingNodes.filter(n => !collection.includes(n) && n.inEdges.every(ie => leavingEdges.includes(ie)));
            const minDist = Math.min(...cands.map(n => n.distFromStart));
            const extremeNode = cands.find(n => n.distFromStart === minDist);

            extremeNode.bestInEdge = leavingEdges[leavingNodes.indexOf(extremeNode)];
            collection.push(extremeNode); 

            let visitedNodeIndex;
            while ((visitedNodeIndex = collection.findIndex(n => n !== target && n.outEdges.every(oe => collection.includes(oe.sn2)))) !== -1) {
                collection.splice(visitedNodeIndex,1);
            }
            collection.forEach(n => { 
                n.distFromStart = n.inEdges.length === 0 ? 0 : Math.max(...n.inEdges.map(ie => ie.sn1.distFromStart + ie.length)); 
            });

            if (loopDetect-- === 0)
                return -1;
        }

        console.log(bestPath(target).join("\n"));
        return target.distFromStart;
    }



    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const grid = input.map(l => l.split(''));
            const startCoord = [0, input[0].indexOf(".")];
            const endCoord = [input.length - 1, input[input.length - 1].indexOf(".")];
            if (part === Part.Two) {
                grid.forEach((row,ri) => row.forEach((cell,ci) => {
                    if (/[v<>^]/.test(cell)) {
                        grid[ri][ci] = ".";
                    }
                }));
                grid.forEach((row,ri) => row.forEach((cell,ci) => {
                    const nPaths = deltas.filter(d => {
                        const dy = ri + d[0], dx = ci + d[1];
                        return cell === "." && dy >= 0 && dy < grid.length && dx >= 0 && dx < grid[0].length && grid[dy][dx] === ".";
                    }).length;
                    if (nPaths > 2) {
                        grid[ri][ci] = "x";
                        new SlopeNode(ri, ci, "x");
                    }
                }));
            }
            grid[startCoord[0]][startCoord[1]] = part === Part.One ? "v" : "x";
            grid[endCoord[0]][endCoord[1]] = part === Part.One ? "v" : "x";


            const start = new SlopeNode(startCoord[0], startCoord[1], grid[startCoord[0]][startCoord[1]]);
            const end = new SlopeNode(endCoord[0], endCoord[1], grid[endCoord[0]][endCoord[1]]);


            if (part == Part.One) {

                traceGrid_p1(grid, start, end);
                let answerPart1 = bouwman_p1(start, end, globalNodes);
                return answerPart1;

            } else {

                traceGrid_p2(grid);
                let answerPart2 = start.bouwman_p2(end);
                return answerPart2;

            }

        }, "2023", "day23", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}