/**
 * Advent of Code solution 2023/day25
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day25 {


    function buildComponents(input: string[]):[cs:{[key:string]:Component},ws:Wire[]] {
        const allWires:Wire[] = [];
        const dict: { [key: string]: string[]; } = input.reduce((d, line) => {
            const [key, ...components] = line.split(/:?\s/g);
            d[key] = components;
            return d;
        }, {});
        const allComponents: { [key: string]: Component; } = {};
        Object.entries(dict).forEach(cEntry => [cEntry[0], ...cEntry[1]].forEach(name => {
            if (!allComponents[name]) {
                allComponents[name] = new Component(name);
            }
        })
        );
        Object.entries(dict).forEach(cEntry => {
            cEntry[1].forEach(comp => allWires.push(allComponents[cEntry[0]].regWire(allComponents[comp])));
        });
        return [allComponents, allWires];
    } 

    const countConnected = (all:{[key:string]:Component}, brokenWires:Wire[]):number[] => {
        const counts:number[] = [];

        brokenWires.forEach(bWire => {
            [bWire.c1, bWire.c2].forEach(comp => {
                const count = comp.traceUnvisited();
                if (count > 0)
                    counts.push(count);
            })

        });
        Object.values(all).forEach(comp => comp.visited = false);

        return counts;

    };
    
    const splitConnected = (all:{[key:string]:Component}, wires:Wire[], nToBreak:number, brokenWires?:Wire[]):number[] => {
        let counts:number[] = [];
        if (!brokenWires)
            brokenWires = [];
        if (nToBreak === 0) {
            counts = countConnected(all, brokenWires);
            if (counts.length === 2)
                console.error(`Found split breaking wires ${brokenWires.map(w => w.toString()).join(",")}.`);


            return counts;
        }
        let splitFound = false;


        wires.forEach((w,wIdx) => {
            if (splitFound)
                return;
            w.toggle();

            const subBrokenWires = brokenWires.slice(0);
            subBrokenWires.push(w);

            counts = splitConnected(all, wires.slice(wIdx + 1), nToBreak - 1, subBrokenWires);
            splitFound = counts.length === 2;

            w.toggle();
        });


        return counts;
    }

    class Wire {
        c1:Component;
        c2:Component;
        name:string;
        broken:boolean = false;
        constructor(c1,c2) {
            this.c1 = c1;
            this.c2 = c2;
            this.name = this.toString();
        }
        contract():Component {

            const wires2drop = this.c1.wires.filter(w => [w.c1,w.c2].includes(this.c2), this);
            wires2drop.forEach(w => {
                w.drop();
            });

            const wires2move = this.c1.wires.slice(0);
            wires2move.forEach(w => {
                if (w.c1 === this.c1) {
                    w.c1 = this.c2;
                } else if (w.c2 === this.c1) {
                    w.c2 = this.c2;
                } else {
                    throw "Crazy wire???";
                }
                this.c2.wires.push(w);
            }, this);
            this.c1.wires.splice(0);
            return this.c1;
        }
        toggle() {
            this.broken = !this.broken;
        }
        toString() {
            return `[${this.c1} ~ ${this.c2}]`
        }
        oppositeComponent(comp:Component) {
            return comp === this.c1 ? this.c2 : this.c1;
        }
        drop() {
            [this.c1, this.c2].forEach(c => {
                const wi = c.wires.indexOf(this);
                c.wires.splice(wi, 1);
            }, this);
        }
    }

    class Component {
        name:string;
        wires:Wire[] = [];
        visited:boolean = false;

        constructor(name:string) {
            this.name = name;
        }

        regWire(comp:Component) {
            const wire = new Wire(this, comp);
            this.wires.push(wire);
            comp.wires.push(wire);
            return wire;
        }

        toggleWire(comp:Component, doBreak:boolean) {
            const wire = this.wires.find(w => [w.c1, w.c2].includes(comp));
            if (!wire)
                throw `${this} has no wire to ${comp}`;
            wire.toggle();
        }

        toString() {
            return `${this.name}`;
        }

        traceUnvisited() {
            if (this.visited) 
                return 0;
            this.visited = true;

            let count = 1;
            this.wires.filter(w => !w.broken).forEach(w => {
                const comp = w.oppositeComponent(this);
                count += comp.traceUnvisited();
            }, this);
            return count;
        }
    }


    const kargerMinCut = (all:{[key:string]:Component}) => {
        let graphSize = Object.entries(all).length;
        while (graphSize > 2) {
            const randIdx = Math.floor(Math.random() * graphSize);
            const randomComp = Object.values(all)[randIdx];
            if (randomComp.wires.length === 0)
                continue;
            const compToDelete = randomComp.wires[0].contract();
            delete all[compToDelete.name];
            graphSize--;                        
        }
        const l = Object.values(all)[0].wires.length;
        return l;
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            let minCut = 10000;
            const set = new Set();
            for (var i=0; i<0; i++) {

                const [allComponents, allWires] = buildComponents(input);
                
                const cnt = kargerMinCut(allComponents);
                minCut = Math.min(minCut, cnt);
                if (cnt === 3) {
                    console.warn("################################")
                    const wires = Object.values(allComponents)[0].wires.map(w => w.name).join(",")
                    console.log(`${i}: ${wires}`);
                    Object.values(allComponents)[0].wires.forEach(w => set.add(w.name));
                    break;
                }
                if (i > 0 && i % 100 === 0)
                    console.log(`${i} cycles complete`)


            }
            console.log(`$$$ DONE found ${set.size} interesting links`);
            const iwires = [...set].join("\n");
            console.log(`${iwires}`);

            const setGrail = new Set(["[cms ~ thk]", "[dht ~ xmv]","[rcn ~ xkf]"]);
            const [allComponents, allWires] = buildComponents(input);
            const someWires = allWires.filter(w => setGrail.has(w.name));
            const counts:number[] = splitConnected(allComponents, someWires, 3);
            
            // var chunks = Utils.splitInput(input);
            let answerPart1 = counts[0] * counts[1];
            let answerPart2 = 0;

            if (part == Part.One) {

                return answerPart1;

            } else {

                return answerPart2;

            }

        }, "2023", "day25", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);

}