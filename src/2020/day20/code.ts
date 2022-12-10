/**
 * Advent of Code solution 2020/day20
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day20 {

    class Tile {        
        id: number;
        edges: string[] = [];
        edgeNums: number[] = [];        
        data: string[] = [];

        constructor(chunk: string[]) {
            this.id = parseInt(chunk[0].split(/[ :]/g)[1])
            this.data = chunk.slice(1);
            this._updateEdges();
        }

        _updateEdges() {
            this.edges = [
                this.data[0],
                this.data.map(s => s.substring(s.length - 1)).join(''),
                this.data[this.data.length - 1].split('').reverse().join(''),
                this.data.map(s => s.substring(0, 1)).reverse().join(''),
            ];
            this.edgeNums = this.edges.map(e => parseInt(e.replace(/#/g, '1').replace(/\./g, '0'), 2));
            this.edgeNums = this.edgeNums.concat(this.edges.map(e => parseInt(e.split('').reverse().join('').replace(/#/g, '1').replace(/\./g, '0'), 2)));
        }

        neighbours(tiles: Tile[]) {
            let cnt = 0;
            const edgeHavingNeighbour = [];
            for (var i=0; i<4; i++) {
                const num = this.edgeNums[i];
                var neighbour = tiles.filter(t => t !== this).find(t => t.edgeNums.includes(num));
                edgeHavingNeighbour.push(neighbour);
            }
            return edgeHavingNeighbour;
        }

        rightNeighbour(tiles) {
            return this._neighbour(tiles, 1);
        }
        underNeighbour(tiles) {
            return this._neighbour(tiles, 2);
        }

        _neighbour(tiles, edgeIndex) {
            const myEdgeNum = this.edgeNums[edgeIndex];
            const myNeighbour = this.neighbours(tiles)[edgeIndex];
            return myNeighbour._fit_towards(edgeIndex, myEdgeNum);
        }

        _fit_towards(edgeIndex, myEdgeNum) {
            let idx = this.edgeNums.indexOf(myEdgeNum);
            if (idx === -1)
                throw Error("Fck");
            if (idx < 4)
                this.flip();
            idx = this.edgeNums.indexOf(myEdgeNum);
            if (idx < 4)
                throw Error("fck more");
            var rotations = (idx + 2 - edgeIndex) % 4;
            for (var r=0; r<rotations; r++)
                this.rotate();
            return this;
        }

        flip() {
            this.data = this.data.reverse();
            this._updateEdges();
        }

        rotate() {
            const data = [];
            for (var i = this.data[0].length-1; i>=0; i--)
                data.push(this.data.map(r => r[i]).join(''));
            this.data = data;
            this._updateEdges();
        }

    }

    const getImage = (puzzle: Tile[][]): string[] => {
        const dLength = puzzle[0][0].data.length - 2;
        const result: string[] = Array(puzzle.length * dLength).fill("");
        puzzle.forEach((pRow, pIdx) =>
            pRow.forEach(tile => {
                tile.data.slice(1, tile.data.length - 1).forEach((dRow, dIdx) =>
                    result[pIdx * dLength + dIdx] += dRow.substring(1, dRow.length - 1))
            })
        );

        return result;
    }




    const puzzle = Utils.multiDimArray(2, 12, () => null);

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            // part aspecific code here

            // split input in case it has empty line delimited chunks
            var chunks = Utils.splitInput(input);

            const tiles = chunks.map(ch => new Tile(ch));

            const cornerTiles = tiles.filter(tile => tile.neighbours(tiles).filter(n => n).length === 2);
            if (cornerTiles.length != 4)
                console.warn("FFFFFOOUOOOOUUUUUUTTTTT");

            if (part == Part.One) {
                let answerPart1 = cornerTiles.reduce((agg, elt) => elt.id * agg, 1);
                return answerPart1;
            } else {
                const smCoords = [];
                const seamonsterImage= [
                    "                  # ",
                    "#    ##    ##    ###",
                    " #  #  #  #  #  #   "      
                ];
                seamonsterImage.map((l, li) => l.split('').forEach((c, ci) => {
                    if (c==="#")
                        smCoords.push([li,ci]);
                }));
                
                const topEdgeNums = []
                for (var ct of cornerTiles) {
                    const neighbours = ct.neighbours(tiles);
                    for (var i=0; i<4; i++) {
                        if (!neighbours[i] && !neighbours[(i + 3) % 4]) {
                            topEdgeNums.push(ct.edgeNums[i + 4]);
                            topEdgeNums.push(ct.edgeNums[(i + 3) % 4]);
                        }
                    }
                }

                let answerPart2 = Infinity;
    
                for (var topEdgeNum of topEdgeNums) {
    
                    const cornerTile = tiles.find(t => t.edgeNums.includes(topEdgeNum));
                    if (!cornerTile) {
                        var brjj = 1;
                    }
                    cornerTile._fit_towards(2, topEdgeNum);
    
                    puzzle[0][0] = cornerTile;
    
                    for (var y=0; y < puzzle.length;y++) {
                        for (var x=1; x < puzzle[0].length; x++) {
                            puzzle[y][x] = puzzle[y][x-1].rightNeighbour(tiles);
                        }
                        if (y < puzzle.length - 1) {
                            puzzle[y+1][0] = puzzle[y][0].underNeighbour(tiles);
                        }
                    }
    
                    var image = getImage(puzzle);

                    var smCount = 0;
                    for (var y=0;y<image.length - seamonsterImage.length; y++) {
                        for (var x=0; x<image[y].length - seamonsterImage[0].length; x++) {
                            if (smCoords.every(c => image[y + c[0]][x + c[1]] === "#")) {
                                smCount += 1;
                                smCoords.forEach(c => { 
                                    image[y + c[0]] = image[y + c[0]].substring(0, x + c[1]) + "■" + image[y + c[0]].substring(x + c[1] + 1);
                                });
                            }
                        }
                    }

                    var hashCnt = image.reduce((agg, line) => line.replace(/[.■]/g, "").length + agg, 0);

                    if (hashCnt < answerPart2) 
                        answerPart2 = hashCnt;
    
                }
    
                return answerPart2;
            }

        }, "2020", "day20", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}