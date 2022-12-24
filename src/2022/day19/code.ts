/**
 * Advent of Code solution 2022/day19
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { getHeapCodeStatistics } from "v8";
import { Part, Utils } from "../../generic";

const RESOURCES = ["geode", "obsidian", "clay", "ore"];
let MINUTES = 0;
let maxGeodesPerBlueprint : {[a:number]:number} = {};

class Blueprint {
    blueprintId: number;
    priceInfos: {[name: string]: PriceInfo} = {};

    constructor(line: string) {
        RESOURCES.forEach(resource => {
            this.priceInfos[resource] = new PriceInfo()
        });           
        // Blueprint 30: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 17 clay. Each geode robot costs 3 ore and 16 obsidian.
        const bpat = /^Blueprint (\d+): .*/;
        this.blueprintId = parseInt(line.replace(bpat, "$1"));
        const rLines = line.split(/[\:\.] ?/).splice(1, 4);
        for (var rLine of rLines) {
            const rpat = /^Each (\w+) robot costs (.*)$/;
            const resource = rLine.replace(rpat, "$1");
            const cLine = rLine.replace(rpat, "$2");
            for (var pLine of cLine.split(" and ")) {
                const [price, presource] = pLine.split(" ");
                this.priceInfos[resource].price[presource] = parseInt(price);
            }
        }
    }

    initState() {
        const state = new State(this);
        state.rstates["ore"].robots = 1;
        return state;
    }
}

class State {
    blueprint: Blueprint;
    rstates : {[name:string]: ResourceState} = {};
    robotCredit: string[] = [];

    constructor(blueprint: Blueprint) {
        this.blueprint = blueprint;
        RESOURCES.forEach(resource => {
            this.rstates[resource] = new ResourceState(0, 0);
        });        
    }

    maxGeodes(minutes, part): number {
        
        if (this.rstates["geode"].robots < Math.max(0, .4 * (minutes - MINUTES + 12)) ) {
            return 0; 
        }

        let newstates: State[] = [this];
        let spendStates = [];
        let examineStates = [this];

        let examineOnce = true;
        while (examineOnce) {  /// part === Part.One && examineOnce || part === Part.Two && examineStates.length) {
            examineOnce = false;
            spendStates = [];
            for (var examineState of examineStates) {
                for (var resource of ["geode", "obsidian", "clay", "ore"]) {
                    const costResources = Object.keys(examineState.blueprint.priceInfos[resource].price);                    
                    if (costResources.every(r => examineState.rstates[r].collected >= examineState.blueprint.priceInfos[resource].price[r])
                        && costResources.some(r => examineState.rstates[r].collected - examineState.rstates[r].robots < examineState.blueprint.priceInfos[resource].price[r])) {
                        const clone = examineState.clone();
                        costResources.forEach(r => {
                            clone.rstates[r].collected -= clone.blueprint.priceInfos[resource].price[r];
                        });

                        clone.robotCredit.push(resource);

                        spendStates.push(clone);                
                        // console.log(`Blueprint ${this.blueprint.blueprintId}, minute ${minutes}, got me myself a ${resource} robot`);
                    }
                }
            }
            newstates = spendStates.concat(newstates);
            examineStates = spendStates;
        }

        newstates = newstates.filter(st => st.robotCredit.length || ["ore", "clay"].every(rs => st.rstates[rs].collected < 50 + Math.max(...Object.values(st.blueprint.priceInfos).map(r => !r.price[rs] ? 4 : r.price[rs]))));

        newstates.forEach(state => state.tick());

        if (minutes === MINUTES) {
            const geodes = this.rstates["geode"].collected;
            if (geodes > (maxGeodesPerBlueprint[this.blueprint.blueprintId] || 0)) {
                console.log(`Blueprint ${this.blueprint.blueprintId} => ${geodes} geodes possible`);
                maxGeodesPerBlueprint[this.blueprint.blueprintId] = geodes;
            }
            return geodes;
        }


        if (newstates.length === 0) {
            return 0;
        }

        return Math.max(...newstates.map(s => s.maxGeodes(minutes + 1, part)));
    }

    tick() {
        Object.values(this.rstates).forEach(rs => rs.tick());
        while (this.robotCredit.length) {
            this.rstates[this.robotCredit.shift()].robots++;
        }
    }

    clone() {
        const clone = new State(this.blueprint);
        Object.keys(this.rstates).forEach(r => {
            clone.rstates[r].collected = this.rstates[r].collected;
            clone.rstates[r].robots = this.rstates[r].robots;
        });
        clone.robotCredit = this.robotCredit.slice(0);
        return clone;
    }

    toString() {

            return RESOURCES.slice(0).reverse().map(r => `${r}:${this.rstates[r].collected},${this.rstates[r].robots}`).join('|') + `|${this.robotCredit.join(',')}`;

            // const collecting = RESOURCES.filter(r => s.rstates[r].robots).map(r => `${s.rstates[r].robots} ${r}-collecting robot collect ${s.rstates[r].robots} ${r}. you now have ${s.rstates[r].collected} ${r}`).join("\n");
            // const robots = newRobots.length ? "\n" + newRobots.map(r => `The new ${r} robot is ready; you now got ${s.rstates[r].robots + 1} of them`).join("\n") : ``;
            // console.log(`== Minute ${minutes} ==\n${collecting}${robots}`);
   
    }

}


class ResourceState {
    collected: number = 0;
    robots: number = 0;
    constructor(collected, robots) {
        this.collected = collected;
        this.robots = robots;
    }

    tick() {
        this.collected += this.robots;
    }
}

class PriceInfo {
    price:  {[name: string]: number} = {};
}



namespace day19 {
     
    /** ADD 2022-day19 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            MINUTES = part === Part.One ? 24 : 32; 

            const blueprints = input.map(line => new Blueprint(line)).slice(0, part === Part.Two ? 3 : input.length);
            const maxGeodes = blueprints.map(bp => bp.initState().maxGeodes(1, part));
            

            if (part == Part.One) {

                let answerPart1 = maxGeodes.reduce((agg,mx,idx) => agg + mx * blueprints[idx].blueprintId , 0);
                return answerPart1;

            } else {
                let answerPart2 = maxGeodes.reduce((agg,mx) => agg * mx, 1);
                return answerPart2;

            }

        }, "2022", "day19", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}