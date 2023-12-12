/**
 * Advent of Code solution 2023/day11
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";
const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

namespace day11 {

    const calcDist = (g1:number[], g2:number[], yempty:number[], xempty:number[], dims:number[], yDirect:boolean, xDirect:boolean, part:Part):number => {
        const emptySize = part === Part.One ? 1 : (1E6 - 1);
        const minY = Math.min(g1[0],g2[0]), maxY = Math.max(g1[0], g2[0]);
        const stepsY = yDirect ? range(minY,maxY) : range(0,minY).concat(range(maxY,dims[0]));
        const distY = stepsY.length + emptySize*yempty.filter(ye => stepsY.includes(ye)).length;
        const minX = Math.min(g1[1],g2[1]), maxX = Math.max(g1[1], g2[1]);
        const stepsX = xDirect ? range(minX,maxX) : range(0,minX).concat(range(maxX,dims[1]));
        const distX = stepsX.length + emptySize*xempty.filter(xe => stepsX.includes(xe)).length;

        return distY + distX;
    }
    
    /** ADD 2023-day11 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const space = input.map(line => line.split(''));
            const galaxies = [];
            const xempty = [], yempty = [];
            space.forEach((r,ri) => {
                r.forEach((c, ci) => {
                    if (c === "#")
                        galaxies.push([ri, ci]);
                })
            });
            
            space.forEach((r,ri) => {
                if (!galaxies.map((gr,gri) => gr[0]).includes(ri))
                    yempty.push(ri);
            });
            space[0].forEach((c,ci) => {
                if (!galaxies.map((gr,gri) => gr[1]).includes(ci))
                    xempty.push(ci);
            });
            
            const dists = [];
            for (var i0=0;i0<galaxies.length-1;i0++) {
                for (var i1=i0+1;i1<galaxies.length;i1++) {
                    const gdists = [];
                    gdists.push(calcDist(galaxies[i0], galaxies[i1], yempty, xempty, [space.length,space[0].length], true, true, part));
                    dists.push(Math.min(...gdists));
                }
    
            }

            return Utils.sum(dists);

        }, "2023", "day11", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}