/**
 * Advent of Code solution 2020/day12
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day12 {
    
    /** ADD 2020-day12 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {
            
            let answerPart1 = 0;
            let answerPart2 = 0;

            const ship = {
                "WE": 0,
                "NS": 0,
                "heading": "E"
            };

            const WINDDIRS = "NESW";

            if (part == Part.One) {
                /** part 1 specific code here */
                const WINDDIRS = "NESW";
                for (var inst of input) {
                    const letter = inst.substring(0, 1);
                    const number = parseInt(inst.substring(1));
                    switch(letter) {
                        case "N":
                            ship.NS += number;
                            break;
                        case "S":
                            ship.NS -= number;
                            break;
                        case "E":
                            ship.WE += number;
                            break;
                        case "W":
                            ship.WE -= number;
                            break;
                        case "R":
                            var ni = WINDDIRS.indexOf(ship.heading);
                            ni = (ni + number/90) % 4;
                            ship.heading = WINDDIRS[ni];
                            break;
                        case "L":
                            var ni = WINDDIRS.indexOf(ship.heading);
                            ni = (ni + (4 - number/90)) % 4;
                            ship.heading = WINDDIRS[ni];
                            break;
                        default: 
                            const sign = "WS".includes(ship.heading) ? -1 : 1;
                            if ("WE".includes(ship.heading))
                                ship.WE += sign * number;
                            else
                                ship.NS += sign * number;
                            break;
                        }
                }

                answerPart1 = Math.abs(ship.WE) + Math.abs(ship.NS);
                return answerPart1;
            } else {
                /** part 2 specific code here */

                const waypoint = {
                    "WE": 10,
                    "NS": 1
                };
    
                for (var inst of input) {
                    const letter = inst.substring(0, 1);
                    const number = parseInt(inst.substring(1));
                    switch(letter) {
                        case "N":
                            waypoint.NS += number;
                            break;
                        case "S":
                            waypoint.NS -= number;
                            break;
                        case "E":
                            waypoint.WE += number;
                            break;
                        case "W":
                            waypoint.WE -= number;
                            break;
                        case "R":
                        case "L":
                            const sign2 = (letter == "R") ? 1 : -1;
                            for (var t=0; t<(4 + sign2 * number/90) % 4; t++) {
                                const we = waypoint.WE;
                                waypoint.WE = waypoint.NS;
                                waypoint.NS = -1 * we;
                            }
                            break;
                        default:
                            ship.WE += waypoint.WE * number;
                            ship.NS += waypoint.NS * number;
                            break;
                        }
                }

                answerPart2 = Math.abs(ship.WE) + Math.abs(ship.NS);

                return answerPart2;
            }

        }, "2020", "day12", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two);
}