/**
 * Advent of Code solution 2022/day22
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day22 {

    const turnMatrix = { "R": [[0, 1], [-1, 0]], "L": [[0, -1], [1, 0]], "-": [[1, 0], [0, 1]], "O": [[-1, 0], [0, -1]] };
    const makeTurn = (dir, facing) => {
        const matrix = turnMatrix[dir];
        const newFacing = matrix.map((v, i) => v[0] * facing[0] + v[1] * facing[1]);
        return newFacing;
    }

    const makeSteps = (steps, pos, facing, grid) => {
        for (var s = 0; s < steps; s++) {
            let posAhead = [pos[0] + facing[0], pos[1] + facing[1]];
            if (posAhead[0] < 0 || posAhead[0] === grid.length || posAhead[1] < 0 || posAhead[1] === grid[0].length || grid[posAhead[0]][posAhead[1]] === ' ') {
                posAhead = pos.slice(0);
                while (posAhead[0] - facing[0] >= 0 &&
                    posAhead[0] - facing[0] < grid.length &&
                    posAhead[1] - facing[1] >= 0 &&
                    posAhead[1] - facing[1] < grid[0].length &&
                    grid[posAhead[0] - facing[0]][posAhead[1] - facing[1]] !== ' ') {
                    // go backwards
                    posAhead[0] -= facing[0];
                    posAhead[1] -= facing[1];
                }
            }
            if (grid[posAhead[0]][posAhead[1]] === '#') {
                break;
            }
            if (grid[posAhead[0]][posAhead[1]] !== '.') {
                throw Error("Cant be");
            }
            pos = posAhead;
        }
        return pos;
    }

    const cubeEdges: any[] = [
        { "y": 0, "xRange": [50, 99], "turn": "R", "yRangeTrans": [150, 199], "xTrans": 0 },     //A
        { "y": 0, "xRange": [100, 149], "turn": "-", "xRangeTrans": [0, 49], "yTrans": 199 }, //B
        { "x": 149, "yRange": [0, 49], "turn": "O", "yRangeTrans": [149, 100], "xTrans": 99 }, //C
        { "x": 50, "yRange": [0, 49], "turn": "O", "yRangeTrans": [149, 100], "xTrans": 0 }, //D
        { "x": 50, "yRange": [50, 99], "turn": "L", "xRangeTrans": [0, 49], "yTrans": 100 }, //E
        { "y": 49, "xRange": [100, 149], "turn": "R", "yRangeTrans": [50, 99], "xTrans": 99 }, //F
        { "y": 149, "xRange": [50, 99], "turn": "R", "yRangeTrans": [150, 199], "xTrans": 49 }, //G
    ];

    const completeCubeEdges = () => {
        for (var edge of cubeEdges.slice(0)) {
            const newEdge = {};
            for (var prop in edge) {
                const newProp = /turn/.test(prop) ? "turn" : /Trans/.test(prop) ? prop.replace("Trans", "") : `${prop}Trans`;
                if (newProp === "turn") {
                    newEdge["turn"] = { "R": "L", "L": "R", "O": "O", "-": "-" }[edge[prop]];
                } else {
                    newEdge[newProp] = edge[prop].length ? edge[prop].slice(0) : edge[prop];                    
                }
            }
            ["xRange", "yRange"].forEach(rng => {
                if (newEdge[rng] && newEdge[rng][0] > newEdge[rng][1]) {
                    newEdge[rng].reverse();
                    if (newEdge["xRangeTrans"])
                        newEdge["xRangeTrans"].reverse();
                    else
                        newEdge["yRangeTrans"].reverse();
                }
            })
            cubeEdges.push(newEdge);
        }
    };

    const getCubeStepAhead = (pos, facing, grid): any[] => {
        const edge = cubeEdges.find(e => {
            return e["x"] !== undefined && 
                pos[1] === e["x"] && 
                Math.min(...e["yRange"]) <= pos[0] && 
                pos[0] <= Math.max(...e["yRange"]) && 
                Math.abs(e["x"] % 50 - (e["x"]+facing[1]+50) % 50) === 49 ||
            e["y"] !== undefined && 
                pos[0] === e["y"] && 
                Math.min(...e["xRange"]) <= pos[1] && 
                pos[1] <= Math.max(...e["xRange"]) && 
                Math.abs(e["y"] % 50 - (e["y"]+facing[0]+50) % 50) === 49;
        });
        if (!edge) {
            return [[pos[0] + facing[0], pos[1] + facing[1]], facing.slice(0)];
        }
        const posAhead = Array(2);
        if (edge["x"] !== undefined) {

            posAhead[0] = edge.yTrans !== undefined ? edge.yTrans : edge.yRangeTrans[1] > edge.yRangeTrans[0] ? edge.yRangeTrans[0] + (pos[0] - edge.yRange[0]) : edge.yRangeTrans[0] - (pos[0] - edge.yRange[0]);
            posAhead[1] = edge.xTrans !== undefined ? edge.xTrans : edge.xRangeTrans[1] > edge.xRangeTrans[0] ? edge.xRangeTrans[0] + (pos[0] - edge.yRange[0]) : edge.xRangeTrans[1] - (pos[1] - edge.yRange[0]);

        } else {

            posAhead[0] = edge.yTrans !== undefined ? edge.yTrans : edge.yRangeTrans[1] > edge.yRangeTrans[0] ? edge.yRangeTrans[0] + (pos[1] - edge.xRange[0]) : edge.yRangeTrans[0] - (pos[0] - edge.xRange[0]);
            posAhead[1] = edge.xTrans !== undefined ? edge.xTrans : edge.xRangeTrans[1] > edge.xRangeTrans[0] ? edge.xRangeTrans[0] + (pos[1] - edge.xRange[0]) : edge.xRangeTrans[1] - (pos[1] - edge.xRange[0]);

        }
        const facingAhead = makeTurn(edge["turn"], facing);
        return[posAhead, facingAhead];
    }


    const makeCubeSteps = (steps, pos, facing, grid) => {

        for (var s = 0; s < steps; s++) {
            const [posAhead, facingAhead] = getCubeStepAhead(pos, facing, grid);
            if (grid[posAhead[0]][posAhead[1]] === '#') {
                break;
            }
            if (grid[posAhead[0]][posAhead[1]] !== '.') {
                throw Error("Cant be");
            }
            pos = posAhead;
            facing = facingAhead;
        }
        return [pos, facing];
    }



    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            completeCubeEdges();

            var chunks = Utils.splitInput(input);

            const grid = Array(chunks[0].length).fill(0).map(() => Array(Math.max(...chunks[0].map(l => l.length))).fill(' '));
            let pos = [];
            let facing = [0, 1];

            chunks[0].map((line, li) => line.split('').forEach((c, ci) => {
                grid[li][ci] = c;
                if (c !== ' ' && !pos.length) {
                    pos = [li, ci];
                }
            }));

            const pat = /^(\d+)([RL])/;
            let matches;
            while (matches = chunks[1][0].match(pat)) {
                const steps = parseInt(matches[1]);
                const turn = matches[2];
                chunks[1][0] = chunks[1][0].replace(new RegExp(`^${steps}${turn}`), '');
                if (part === Part.One) {
                    pos = makeSteps(steps, pos, facing, grid);
                } else {
                    try {
                        [pos, facing] = makeCubeSteps(steps, pos, facing, grid);
                    } catch (err) {
                        
                        const breakhere = `${steps}${turn}`;

                    }
                }
                facing = makeTurn(turn, facing);
                var breakhere = 1;

            }

            const finalSteps = parseInt(chunks[1][0]);

            if (part === Part.One) {
                pos = makeSteps(finalSteps, pos, facing, grid);
            } else {
                [pos, facing] = makeCubeSteps(finalSteps, pos, facing, grid);

            }

            const facingValue = facing[0] === 0 && facing[1] === 1 ? 0 :
                facing[0] === 1 && facing[1] === 0 ? 1 :
                    facing[0] === 0 && facing[1] === -1 ? 2 : 3;
            
            return 1000 * (pos[0] + 1) + 4 * (pos[1] + 1) + facingValue;

        }, "2022", "day22",
        // set this switch to Part.Two once you've finished part one.
        Part.Two,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}