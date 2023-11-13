/**
 * Advent of Code solution 2019/day06
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day06 {

    class Moon {
        name: string;
        parent: Moon;
        children: Moon[] = [];

        constructor(name:string, parent:Moon) {
            this.name = name;
            this.parent = parent;
            if (parent)
                parent.children.push(this);
        }

        countOrbits(depth) {
            return depth + this.children.reduce((cum, childMoon) => cum + childMoon.countOrbits(depth + 1), 0);
        }

        rootpath() {
            if (this.parent == null)
                return [];
            const path = this.parent.rootpath();
            path.push(this);
            return path;
        }
    }
    
    /** ADD 2019-day06 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const lookup = input.reduce((lu, line) => {
                const [from, to] = line.split(')');
                lu[from] = lu[from] || [];
                lu[from].push(to);
                return lu;
            }, {});

            const com = new Moon("COM", null);
            const moons = {"COM": com};
            const buildMoonTree = (from) => {
                if (lookup[from.name]) {
                    for (var toName of lookup[from.name]) {
                        const to = new Moon(toName, from);
                        moons[toName] = to;
                        buildMoonTree(to);
                    }
                }
            } 
            buildMoonTree(com);


            if (part == Part.One) {

                // part 1 specific code here
                let answerPart1 = com.countOrbits(0);
                return answerPart1;

            } else {

                const pathYou = moons["YOU"].rootpath();
                const pathSan = moons["SAN"].rootpath();
                while (pathYou[0] == pathSan[0]) {
                    pathYou.shift();
                    pathSan.shift();
                }
                
                let answerPart2 = pathYou.length + pathSan.length - 2;
                // part 2 specific code here

                return answerPart2;

            }

        }, "2019", "day06", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}