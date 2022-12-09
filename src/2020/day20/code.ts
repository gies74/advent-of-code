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

            this.edges = [
                this.data[0],
                this.data[this.data.length - 1],
                this.data.map(s => s.substring(0, 1)).join(''),
                this.data.map(s => s.substring(s.length - 1)).join('')
            ];
            for (var e of this.edges) {
                let num;
                num = parseInt(e.replace(/#/g, '1').replace(/\./g, '0'), 2);
                this.edgeNums.push(num);
                num = parseInt(e.split('').reverse().join('').replace(/#/g, '1').replace(/\./g, '0'), 2);
                this.edgeNums.push(num);
            }
        }

        neighbours(tiles: Tile[]) {
            let cnt = 0;
            const edgeHavingNeighbour = [];
            for (var i=0; i<this.edgeNums.length;i+=2) {
                const num = this.edgeNums[i];
                var neighbour = tiles.filter(t => t !== this).find(t => t.edgeNums.includes(num));
                edgeHavingNeighbour.push(neighbour);
            }
            return edgeHavingNeighbour;
        }


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

                

                // part 2 specific code here

                return 0;

            }

        }, "2020", "day20", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}