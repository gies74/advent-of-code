/**
 * Advent of Code solution 2022/day07
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Serializer } from "v8";
import { Part, Utils } from "../../generic";

namespace day07 {
    
    class FsObj {
        name: string;
        parent: FsObj;

        constructor(name, parent) {
            this.name = name;
            this.parent = parent;
            if (parent) {
                (parent as FsDir).contents.push(this);
            }
        }

        getSize() {
            return 0;
        }
        getSize100k(oTotal) {
            return;
        }        
    }

    class FsFile extends FsObj {
        size: number;
        constructor(name, parent, size) {
            super(name, parent);     
            this.size = size;       
        }

        getSize() {
            return this.size;
        }
        getSize100k(oTotal) {
            return;
        }        
    }

    class FsDir extends FsObj {
        contents: FsObj[] = [];
        constructor(name, parent) {
            super(name, parent);
        }
        getSize() {
            return this.contents.reduce((agg, fo:FsObj) => agg + fo.getSize(), 0)
        }
        getSize100k(oTotal) {
            this.contents.forEach(fs => fs.getSize100k(oTotal));
            const mySize = this.getSize();
            if (mySize <= 100000)
                oTotal.total += mySize;
            if (mySize > oTotal.target && mySize < oTotal.lowestAboveTarget)
                oTotal.lowestAboveTarget = mySize;
        }
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two 
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            var root = new FsDir("/", null);
            let current = null;

            while (true) {
                var line = input.shift();
                if (!line)
                    break;
                var parts = line.split(' ');
                if (parts[0] == "$") {
                    switch(parts[1]) {
                        case "ls":
                            while (!/^\$ /.test(input[0])) {
                                var fsLine = input.shift();
                                if (!fsLine) {
                                    break;
                                }
                                const [attr, name] = fsLine.split(' ');

                                const existsCheck = current.contents.find(fs => fs.name === name);
                                if (existsCheck) {
                                    console.log("known");
                                    continue;
                                }
                                if (attr === "dir") {
                                    new FsDir(name, current);
                                    continue;
                                }
                                const fsFile = new FsFile(name, current, parseInt(attr));
                            }
                            break;
                        case "cd":
                            if (parts[2] === "/") {
                                current = root;
                            } else if (parts[2] === "..") {
                                current = current.parent as FsDir;
                            } else {
                                const subdir = current.contents.find(fs => fs instanceof FsDir && fs.name === parts[2]);
                                current = subdir as FsDir;
                            }
                    }

                } else if (input.length == 0) {
                    break;
                }
            }
            
            const used = 70000000 - root.getSize();
            const needed = 30000000;
            const target = needed - used;

            var total = { "total": 0, "target": target, "lowestAboveTarget": 99999999999999};
            root.getSize100k(total);
            let answerPart1 = total.total;
            let answerPart2 = total.lowestAboveTarget;

            if (part == Part.One) {

                // part 1 specific code here

                return answerPart1;

            } else {

                // part 2 specific code here

                return answerPart2;

            }

        }, "2022", "day07", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}