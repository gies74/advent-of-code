/**
 * Advent of Code solution 2023/day20
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { sign } from "crypto";
import { Part, Utils } from "../../generic";

namespace day20 {

    enum Pulse {
        Low,
        High,
    }

    enum State {
        Off,
        On,
    }

    class Signal {
        origin:Module;
        destination:Module;
        pulse:Pulse;
        constructor(origin,destination,pulse) {
            this.origin=origin;
            this.destination=destination;
            this.pulse=pulse;
        }
    }

    class Module {
        name: string;
        inputs: Module[] = [];
        outputs: Module[] = [];
        inPulses: Pulse[];

        constructor(name:string) {
            this.name = name;
        }


        behave(signal:Signal): Signal[] {
            if (this.name === "rx" && signal.pulse === Pulse.Low) {
                throw `SIGNAL RECEIVED`;
            }
            return [];
        }
    }

    class BroadCaster extends Module {

        behave(signal:Signal): Signal[] {
            return this.outputs.map(m => new Signal(this,m, Pulse.Low));
        }

    }

    class FlipFlop extends Module {
        state: State = State.Off;

        behave(signal:Signal): Signal[] {
            if (signal.pulse === Pulse.Low) {
                this.state = this.state === State.Off ? State.On : State.Off;
                const pulse = this.state === State.On ? Pulse.High : Pulse.Low;
                return this.outputs.map(m => new Signal(this, m, pulse));
            }
            return [];
        }

    }

    class Conjunction extends Module {
        memory: Pulse[] = [];

        behave(signal:Signal): Signal[] {
            if (this.memory.length === 0) {
                this.memory = this.inputs.map(im => Pulse.Low);
            }
            const memIdx = this.inputs.indexOf(signal.origin);
            this.memory[memIdx] = signal.pulse;
            const pulse = this.memory.every(p => p === Pulse.High) ? Pulse.Low : Pulse.High;
            return this.outputs.map(m => new Signal(this, m, pulse));
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

            const dict = input.reduce((d, line) => {
                const [sm, outs] = line.split(" -> ");
                const modname = sm.replace(/^[%&]/, "")
                const module = sm.startsWith("%") ? new FlipFlop(modname) : sm.startsWith("&") ? new Conjunction(modname) : modname === "broadcaster" ? new BroadCaster(modname) :  new Module(modname);
                d[modname] = { "module": module,  "outs": outs.split(", ") };
                return d;
            }, {});

            Object.keys(dict).forEach(name => {
                const module:Module = dict[name]["module"];
                dict[name]["outs"].forEach(nm => { 
                    if (!dict[nm])
                        dict[nm] = { "module" : new Module(nm), "outs": [] };
                    module.outputs.push(dict[nm]["module"]);
                    dict[nm]["module"].inputs.push(module);
                });
            });                        
            const modules = Object.values(dict).map(m => m["module"]);

            const watches = dict["rx"].module.inputs[0].inputs.reduce((dd, m) => { dd[m.name] = 0; return dd }, {});

            const queue:Signal[] = [];
            let signal:Signal;
            let countLow = 0, countHigh = 0;
            let breakAll = false;

            let answerPart2 = 0;

            const buttonPresses = part === Part.One ? 1000 : 10000000;
            Array(buttonPresses).fill(0).forEach((_, buttonPress) => {
                if (breakAll) {
                    return;
                }
                queue.push(new Signal(null, dict["broadcaster"]["module"], Pulse.Low));
                while (signal = queue.shift()) {
                    if (signal.pulse === Pulse.Low && signal.destination.name === "rx")
                    {
                        breakAll = part === Part.Two;
                        answerPart2 = buttonPress + 1;
                        break;
                    }

                    if (signal.pulse === Pulse.Low)
                        countLow++;
                    else
                        countHigh++;


                    if (part === Part.Two && signal.origin && Object.keys(watches).includes(signal.origin.name) && !watches[signal.origin.name] && signal.pulse === Pulse.High) {
                        console.log(`After ${buttonPress + 1} presses, ${signal.origin.name} signals ${signal.pulse}`);
                        watches[signal.origin.name] = buttonPress + 1;
                        breakAll = Object.values(watches).every(w => w);
                    }
                    queue.splice(queue.length, 0, ...signal.destination.behave(signal));

                }
            });

            
            if (part == Part.One) {

                return countLow * countHigh;;

            } else {

                return Utils.lcm(...Object.values(watches));

            }

        }, "2023", "day20", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}