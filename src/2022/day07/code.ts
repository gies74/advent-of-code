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
        parent: FsDir;

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
        
        findSpace(oTotal) {
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
    }

    class FsDir extends FsObj {
        contents: FsObj[] = [];
        constructor(name, parent) {
            super(name, parent);
        }

        getSize() {
            return this.contents.reduce((agg, fo:FsObj) => agg + fo.getSize(), 0)
        }

        findSpace(oTotal) {
            this.contents.forEach(fs => fs.findSpace(oTotal));
            const mySize = this.getSize();
            if (mySize <= 100000)
                oTotal.totalUnder100k += mySize;
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
            let current: FsDir = null;

            while (input.length) {
                var line = input.shift();
                var parts = line.split(' ');
                if (parts[0] == "$") {
                    switch(parts[1]) {
                        case "ls":
                            while (input.length && !/^\$ /.test(input[0])) {
                                var fsLine = input.shift();
                                const [attr, name] = fsLine.split(' ');

                                const existsCheck = current.contents.find(fs => fs.name === name);
                                if (existsCheck) {
                                    console.log(`ls object ${name} known`);
                                    continue;
                                }
                                if (attr === "dir") {
                                    new FsDir(name, current);
                                    continue;
                                }
                                new FsFile(name, current, parseInt(attr));
                            }
                            break;
                        case "cd":
                            if (parts[2] === "/") {
                                current = root;
                            } else if (parts[2] === "..") {
                                current = current.parent;
                            } else {
                                const subdir = current.contents.find(fs => fs instanceof FsDir && fs.name === parts[2]);
                                current = subdir as FsDir;
                            }
                    }

                } else if (input.length == 0) {
                    break;
                }
            }
            
            const free = 70000000 - root.getSize();
            const needed = 30000000;
            const target = needed - free;

            var oTotal = { "totalUnder100k": 0, "target": target, "lowestAboveTarget": 99999999999999};
            root.findSpace(oTotal);
            let answerPart1 = oTotal.totalUnder100k;
            let answerPart2 = oTotal.lowestAboveTarget;

            if (part == Part.One) {
                return answerPart1;
            } else {
                return answerPart2;
            }
        }, "2022", "day07", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}