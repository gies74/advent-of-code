/**
 * Advent of Code solution 2019/day10
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day10 {

    const getView = (coords, i) => {
        const view = [];

        const filteredCoords = coords.filter((_, j) => i != j);
        const relCoords = filteredCoords.map(c => [c[0]-coords[i][0], c[1]-coords[i][1]]);
        relCoords.forEach((c, ci) => {
            view.push({"angle": -1 * Math.atan2(c[0], c[1]) + Math.PI, "dist": Math.abs(c[0])+Math.abs(c[1]), "coord":filteredCoords[ci] });
        });
        
        return view;
    }
    
    /** ADD 2019-day10 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            const space = input.map(line => line.split(''));
            const def:number[][] = [];
            const coords: number[][] = space.reduce((rcs, row, ri) => 
                rcs.concat(row.reduce((ccs, col, ci) => {
                    if (col == "#")
                        ccs.push([ci, ri]);
                    return ccs;
               }, def.slice(0)))
            , def.slice(0));

            let mostAsteroids = 0;
            let mostAstIndex = -1;

            for (var i=0; i<coords.length; i++) {
                const view = getView(coords, i);

                const angles = new Set(view.map(v => v["angle"]));
                if (angles.size > mostAsteroids) {
                    mostAsteroids = angles.size;
                    mostAstIndex = i;
                }
            }
            
            if (part == Part.One) {
                return mostAsteroids;
            } else {
                const baseCoord = coords[mostAstIndex];
                const view = getView(coords, mostAstIndex);
                view.sort((v1, v2) => v1.angle != v2.angle ? v1.angle - v2.angle : v1.dist - v2.dist);

                const asteroids = [];
                let angle = -1;
                while (view.length) {
                    const next = view.find(v => v.angle > angle);
                    asteroids.push(next);

                    angle = next.angle;
                    const nextIndex = view.indexOf(next)
                    if (nextIndex === view.length - 1) {
                        angle = -1;
                    }
                    view.splice(nextIndex, 1);

                }
                return 100 * asteroids[199].coord[0] + asteroids[199].coord[1];
            }

        }, "2019", "day10", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}