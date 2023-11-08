/**
 * Advent of Code solution 2019/day03
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day03 {
    
    const buildCoords = (actions) => {
        var maxx=0, minx=0, maxy=0, miny=0;
        var x=0,y=0;
        var coords1 = [[x,y]];
        for (var a of actions.split(",")) {
            const d = a.substring(0,1);
            const sz = parseInt(a.substring(1));
            switch(d) {
                case 'L':
                    x -= sz;
                    maxx = Math.max(x, maxx);
                    break;
                case 'R':
                    x += sz;
                    minx = Math.min(x, minx);
                    break;
                case 'D':
                    y -= sz;
                    miny = Math.min(y, miny);
                    break;
                case 'U':
                    y += sz;
                    maxy = Math.max(y, maxy);
                    break;
            }
            coords1.push([x,y]);                
        }
        return coords1;    
    };

    const crossesAt = (p0, p1, q0, q1) => {
        var pHqV = p0[0] == p1[0] && q0[1] == q1[1];
        var pVqH = p0[1] == p1[1] && q0[0] == q1[0];
        var xPt;
        if (pHqV 
            && Math.min(p0[1], p1[1]) < q0[1] && q0[1] < Math.max(p0[1], p1[1]) 
            && Math.min(q0[0], q1[0]) < p0[0] && p0[0] < Math.max(q0[0], q1[0])) 
        {
            xPt = [p0[0], q0[1]];
        } 
        else if (pVqH 
            && Math.min(p0[0], p1[0]) < q0[0] && q0[0] < Math.max(p0[0], p1[0]) 
            && Math.min(q0[1], q1[1]) < p0[1] && p0[1] < Math.max(q0[1], q1[1])) 
        {
            xPt = [q0[0], p0[1]];
        } 
        else
            return null;
        return xPt;

        
    };


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
            // var chunks = Utils.splitInput(input);


            const coords1 = buildCoords(input[0]);
            const coords2 = buildCoords(input[1]);

            let answerPart1 = Number.MAX_VALUE;
            let answerPart2 = Number.MAX_VALUE;
            
            var steps2 = 0;
            for (var i=1; i<coords2.length; i++) {
                var steps1 = 0;
                for (var j=1; j<coords1.length; j++) {
                    const xPt = crossesAt(coords1[j-1], coords1[j], coords2[i-1], coords2[i]);
                    if (xPt != null) {
                        var steps2ToCrossing = steps2 + Math.abs(xPt[0] - coords2[i-1][0]) + Math.abs(xPt[1] - coords2[i-1][1]); 
                        var steps1ToCrossing = steps1 + Math.abs(xPt[0] - coords1[j-1][0]) + Math.abs(xPt[1] - coords1[j-1][1]); 
                        var crossingMD = Math.abs(xPt[0]) + Math.abs(xPt[1]);
                        answerPart1 = Math.min(answerPart1, crossingMD);
                        answerPart2 = Math.min(answerPart2, steps2ToCrossing + steps1ToCrossing);
                    }
                    steps1 += Math.abs(coords1[j][0] - coords1[j-1][0]) + Math.abs(coords1[j][1] - coords1[j-1][1]); 
                }
                steps2 += Math.abs(coords2[i][0] - coords2[i-1][0]) + Math.abs(coords2[i][1] - coords2[i-1][1]); 
            }


            if (part == Part.One) {

                // part 1 specific code here

                return answerPart1;

            } else {

                // part 2 specific code here

                return answerPart2;

            }

        }, "2019", "day03", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}