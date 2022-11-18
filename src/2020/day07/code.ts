/**
 * Advent of Code solution 2020/day07
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { serialize } from "v8";

namespace day07 {
    const generic = require('../../generic');
    
    /** ADD 2020-day07 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    class NumBagContainers {
        num: number;
        bagContainer: BagContainer;
        /**
         *
         */
        constructor(num, bagContainer) {
            this.num = num;
            this.bagContainer = bagContainer;
        }
    }

    const lookupBagContainer = {};

    class BagContainer {
        color: string;
        heldBy: BagContainer[];
        holds: NumBagContainers[];
        /**
         *
         */
        constructor(color:string) {
            this.color = color;
            this.heldBy = [];
            this.holds = [];
            lookupBagContainer[color] = this;
        }

        getHolders(holders) {
            for (var holder of this.heldBy) {
                holders.push(holder);
                holder.getHolders(holders);
            }
        }

        getContentCount() {
            let num = 0;
            for (var hold of this.holds) {
                num += hold.num;
                num += hold.num * hold.bagContainer.getContentCount();
            }
            return num;
        }
    }

    const parseLine = (line) => {
        const [holder, helds] = line.split(" contain ");
        const pattern = /((\d+) )?([^\s]+ [^\s]+) bags?\.?/gm;
        const key = holder.replace(pattern, "$3");        
        const bc = lookupBagContainer[key] || new BagContainer(key);

        for (var held of helds.split(", ")) {
            const num = held.replace(pattern, "$2");
            const color = held.replace(pattern, "$3");
            if (!num || isNaN(parseInt(num)))
                break;
            const hbc = lookupBagContainer[color] || new BagContainer(color);
            hbc.heldBy.push(bc);
            bc.holds.push(new NumBagContainers(parseInt(num), hbc));
        }
    }

    generic.Utils.main((input) => {

        /** ADD START HERE */
        for (var line of input) {
            parseLine(line);
        }

        const shinyGold = lookupBagContainer["shiny gold"];

        // const holders = [];
        // shinyGold.getHolders(holders);
        // const sz = new Set(holders).size;

        const cnt = shinyGold.getContentCount();
        return cnt;

    }, "2020", "day07");

}