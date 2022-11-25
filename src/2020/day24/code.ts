/**
 * Advent of Code solution 2020/day24
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part } from "../../generic";

namespace day24 {
    const generic = require('../../generic');
    
    /** ADD 2020-day24 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    const splitDirs = (line) => {
        return [...line.matchAll(/(nw|ne|sw|se|w|e)/g)].map(m => m[0]);
    };

    const WHITE=0;
    const BLACK=1;
    const REF_TILE = [10,10];

    const tileFloor = Array(2*REF_TILE[1]).fill(0).map(() => Array(2*REF_TILE[0]).fill(WHITE));

        // EVEN Y           50
        //  ODD Y             50
        // 48:  0   0   0   0   0   0   0
        // 49:    0   0   0   0   0   0   0
        // 50:  0   0   0   0   0   0   0
        // 51:    0   0   0   0   0   0   0
        // 52:  0   0   0   0   0   0   0

    /**
     *  Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
        Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
     */

    const drawFloor = (flips) => {
        for (var rowI = 0; rowI < tileFloor.length; rowI++) {
            let s = (rowI % 2 == 0) ? "" : "  ";
            s += tileFloor[rowI].map((v,colI) => `${v}${flips[rowI][colI] ? '*' : ' '}`).join("  ");
            console.log(`${s}`);
        }
    };
    
    const applyFlipRules = () => {
        const flips = Array(2*REF_TILE[1]).fill(0).map(() => Array(2*REF_TILE[0]).fill(false));

        for (var rowI=1; rowI<tileFloor.length - 1; rowI++) {
            for (var colI=1; colI<tileFloor[rowI].length - 1; colI++) {
                const val = tileFloor[rowI][colI];
                let nBlack = 0;
                if (rowI % 2 == 0) {
                    nBlack += tileFloor[rowI-1][colI-1] == BLACK ? 1 : 0;
                    nBlack += tileFloor[rowI  ][colI-1] == BLACK ? 1 : 0;
                    nBlack += tileFloor[rowI+1][colI-1] == BLACK ? 1 : 0;
                    nBlack += tileFloor[rowI-1][colI  ] == BLACK ? 1 : 0;
                    nBlack += tileFloor[rowI  ][colI+1] == BLACK ? 1 : 0;
                    nBlack += tileFloor[rowI+1][colI  ] == BLACK ? 1 : 0;
                } else {
                    nBlack += tileFloor[rowI-1][colI  ] == BLACK ? 1 : 0;
                    nBlack += tileFloor[rowI  ][colI-1] == BLACK ? 1 : 0;
                    nBlack += tileFloor[rowI+1][colI  ] == BLACK ? 1 : 0;
                    nBlack += tileFloor[rowI-1][colI+1] == BLACK ? 1 : 0;
                    nBlack += tileFloor[rowI  ][colI+1] == BLACK ? 1 : 0;
                    nBlack += tileFloor[rowI+1][colI+1] == BLACK ? 1 : 0;
                }
                if (val == WHITE) {
                    flips[rowI][colI] = nBlack == 2;
                } else {
                    flips[rowI][colI] = ![1,2].includes(nBlack);
                }            
            }                
        }

        drawFloor(flips);

        for (var rowI=0; rowI<tileFloor.length; rowI++) {
            for (var colI=0; colI<tileFloor[rowI].length; colI++) {
                if (flips[rowI][colI]) {
                    tileFloor[rowI][colI] = 1 - tileFloor[rowI][colI];
                } 
            }
        }
    }



    generic.Utils.main((input: string[], part: Part = Part.One) => {

        /** ADD START HERE */


        
        input = ["sesenwnenenewseeswwswswwnenewsewsw",
"neeenesenwnwwswnenewnwwsewnenwseswesw",
"seswneswswsenwwnwse",
"nwnwneseeswswnenewneswwnewseswneseene",
"swweswneswnenwsewnwneneseenw",
"eesenwseswswnenwswnwnwsewwnwsene",
"sewnenenenesenwsewnenwwwse",
"wenwwweseeeweswwwnwwe",
"wsweesenenewnwwnwsenewsenwwsesesenwne",
"neeswseenwwswnwswswnw",
"nenwswwsewswnenenewsenwsenwnesesenew",
"enewnwewneswsewnwswenweswnenwsenwsw",
"sweneswneswneneenwnewenewwneswswnese",
"swwesenesewenwneswnwwneseswwne",
"enesenwswwswneneswsenwnewswseenwsese",
"wnwnesenesenenwwnenwsewesewsesesew",
"nenewswnwewswnenesenwnesewesw",
"eneswnwswnwsenenwnwnwwseeswneewsenese",
"neswnwewnwnwseenwseesewsenwsweewe",
"wseweeenwnesenwwwswnew"];

        input.map(line => splitDirs(line)).forEach(dirs => {
            const coord = REF_TILE.slice(0);
            dirs.forEach(dir => {
                let deltaX = 0;
                const deltaY = ['nw', 'ne'].includes(dir) ? -1 : ['w', 'e'].includes(dir) ? 0 : 1;
                if (coord[0] % 2 == 0) {
                    deltaX = ['nw', 'w', 'sw'].includes(dir) ? -1 :  ['ne', 'se'].includes(dir) ? 0 : 1;
                } else {
                    deltaX = ['w'].includes(dir) ? -1 :  ['nw', 'sw'].includes(dir) ? 0 : 1;
                }
                coord[0] += deltaY;
                coord[1] += deltaX;
            });
            tileFloor[coord[1]][coord[0]] = 1 - tileFloor[coord[1]][coord[0]];
        });

        const ITERATIONS = 10;
        let totBlack = 0;
        const sum = (numarr: number[]) => numarr.reduce((cum, tile) => cum + tile, 0);
        for (var i=0; i<ITERATIONS; i++) {
            totBlack = sum(tileFloor.map(row => sum(row)));
            console.log(`Iteration ${i}: ${totBlack} black tiles`);
            applyFlipRules();
        }

        totBlack = sum(tileFloor.map(row => sum(row)));
        console.log(`Iteration ${ITERATIONS}: ${totBlack} black tiles`);
            
        return totBlack;

    }, "2020", "day24", Part.Two);

}