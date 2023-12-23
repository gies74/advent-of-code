/**
 * Advent of Code solution 2023/day23
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day23 {

    const nodes:SlopeNode[] = [];
    const edges:Edge[] = [];
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
            nodes.push(this);
        }
        toString() {
            return `${this.char}(${this.y},${this.x})`;
        }
    }

    class Edge {
        sn1:SlopeNode;
        sn2:SlopeNode;
        length:number;
        constructor(sn1:SlopeNode, sn2:SlopeNode, length: number) {
            this.sn1 = sn1;
            this.sn2 = sn2;
            this.length = length;
            sn1.outEdges.push(this);
            sn2.inEdges.push(this);
            edges.push(this);
        }
        toString() {
            return `${this.sn1.toString()} - ${this.sn2} [${this.length.toString()}]`;
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
            return !(dy == prevY && dx === prevX) && grid[dy][dx] === ".";
        });
        return delta;
    };

    const traceGrid = (grid:string[][], start:SlopeNode, end:SlopeNode) => {
        const stack:SlopeNode[] = [start];
        let node:SlopeNode;
        while (node = stack.pop()) {
            const sLength = 1, y = node.y + slopeCharDir[node.char][0], x = node.x + slopeCharDir[node.char][1];

            surveyDownSlopes(grid, y, x).forEach(coord => {
                const snIdx = nodes.findIndex(sn => sn.y === coord[0] && sn.x === coord[1]);
                let sn;
                if (snIdx === -1) {
                    sn = new SlopeNode(coord[0], coord[1], grid[coord[0]][coord[1]]);
                    stack.push(sn);
                }
                else
                    sn = nodes[snIdx];
                new Edge(node, sn, sLength + 1);
            });

            deltas.forEach(d => {
                let dy = y + d[0], dx = x + d[1], cy = y, cx = x;
                if (grid[dy][dx] === ".") {                    
                    let length = sLength + 1, step;
                    while (true) {
                        surveyDownSlopes(grid, dy, dx).forEach(coord => {
                            const snIdx = nodes.findIndex(sn => sn.y === coord[0] && sn.x === coord[1]);
                            let sn;
                            if (snIdx === -1) {
                                sn = new SlopeNode(coord[0], coord[1], grid[coord[0]][coord[1]]);
                                stack.push(sn);
                            }
                            else
                                sn = nodes[snIdx];
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

    const bestPath = (sn:SlopeNode):string[] => {
        if (!sn.bestInEdge)
            return [];
        else {
            const path = bestPath(sn.bestInEdge.sn1);
            path.push(sn.bestInEdge.toString());
            return path;
        }
    }

    const bouwman = (start:SlopeNode, target:SlopeNode, allNodes:SlopeNode[]):number => {

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
            if (part === Part.One) {
                grid[startCoord[0]][startCoord[1]] = "v";
                grid[endCoord[0]][endCoord[1]] = "v";
            } else {
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
                    }
                }));
            }

            const start = new SlopeNode(startCoord[0], startCoord[1], grid[startCoord[0]][startCoord[1]]);
            const end = new SlopeNode(endCoord[0], endCoord[1], grid[endCoord[0]][endCoord[1]]);


            if (part == Part.One) {

                traceGrid(grid, start, end);
                let answerPart1 = bouwman(start, end, nodes);
                return answerPart1;

            } else {


                let answerPart2 = 0;
                return answerPart2;

            }

        }, "2023", "day23", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}