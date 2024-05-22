/**
 * Advent of Code solution 2022/day16
 * (c) 2022,2023 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day16 {

    const stateCache = {
    };

    const parseInput = (dict:any, line) => {
        // Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
        const parts =  line.split(/([A-Z]{2}|\d+)/g);
        dict[parts[1]] = new ValveRoom(parts[1], parseInt(parts[3]), parts.slice(5).filter((_,i) => (i % 2 === 0)), dict);
        return dict;
    };

    class ValveRoom {
        name:string;
        valveFlowrate:number;
        valveOpened:boolean = false;
        adjValveRooms:ValveRoom[] = [];

        constructor (name, valveFlowrate, adjNames:string[], dict) {
            this.name = name;
            this.valveFlowrate = valveFlowrate;
            adjNames.forEach(n => this.connect(n, dict), this);

        }

        toStateString(minutesLeft:number, prevRooms:ValveRoom[]) {
            const roomsValveOpen = [...new Set(prevRooms.filter(pr => pr.valveOpened))].sort().map(r => r.name).join("");
            return this.name + "/" + roomsValveOpen + "/" + String(minutesLeft);
        }

        toString() {
            return `${this.name}`; // : valve ${this.valveFlowrate} is ${this.valveOpened ? "open" : "closed"}`;
        }

        connect(adjName, dict) {
            if (dict[adjName]) {
                dict[adjName].adjValveRooms.push(this);
                this.adjValveRooms.push(dict[adjName]);
            }
        }

        maximizeFlow(minutesLeft:number, prevRooms:ValveRoom[], action:string[] = null):number {
            let maxflow = Number.MIN_VALUE;

            if (this.adjValveRooms.length === 1 && (this.valveOpened || this.valveFlowrate === 0) && prevRooms.length || [0, 1].includes(minutesLeft))
                return 0;
            if (prevRooms.filter(pr => pr === this, this).length > 3) {
                // kill recursion if room is revisited 4 times or more
                return Number.MIN_VALUE;
            }

            const state = this.toStateString(minutesLeft, prevRooms);
            if (stateCache[state])
                return stateCache[state];

            // open valve action makes sense
            if (this.valveFlowrate > 0 && !this.valveOpened)  {
                this.valveOpened = true;
                const openAndProceed = this.adjValveRooms;
                openAndProceed.forEach(avr => {
                    maxflow = Math.max(
                        maxflow, 
                        avr.maximizeFlow(
                            minutesLeft - 2 
                            , prevRooms.concat([this]) 
                            // , action.concat([`opening ${this.name} (${this.valveFlowrate})`, `${this.name}=>${avr.name}`])
                        ) + (minutesLeft - 1) * this.valveFlowrate
                    ) ; // 
                }, this);
                this.valveOpened = false;
            }

            // not allowed to turn back without action
            const proceedImmediately = this.adjValveRooms.filter(avr => !prevRooms.length || avr !== prevRooms[prevRooms.length - 1]);
            proceedImmediately.forEach(avr => {
                maxflow = Math.max(
                    maxflow, 
                    avr.maximizeFlow(
                        minutesLeft - 1
                        , prevRooms.concat([this])
                        // , action.concat([`${this.name}=>${avr.name}`])
                    )
                ); //
            }, this);

            stateCache[state] = maxflow;
            
            return maxflow;
        }
    }

    class ValveTime {
        room:ValveRoom;
        minutesLeftOpened:number;
        constructor(minutesLeftOpened, room) {
            this.minutesLeftOpened = minutesLeftOpened;
            this.room = room;
        }
        get totalFlow() {
            const r = this.minutesLeftOpened * this.room.valveFlowrate;
            return r;
        }
    }

    class SearchState {
        valveTimes:ValveTime[] = [];
        roomX:ValveRoom;
        roomY:ValveRoom;
        minutesLeft:number;
        gScore: number = -1;
        fScore:number;
        backPointer:SearchState = null;

        constructor(roomX, roomY, minutesLeft, valveTimes) {
            this.roomX = roomX;
            this.roomY = roomY;
            this.minutesLeft = minutesLeft;
            this.valveTimes = valveTimes;
        }

        calcNeighbours():SearchState[] {
            const neighbours = [];
            if (this.minutesLeft === 0) {
                return neighbours;
            }
            this.roomX.adjValveRooms.forEach(avrX => {

                // both agents move
                this.roomY.adjValveRooms.forEach(avrY => {
                    neighbours.push(new SearchState(avrX, avrY, this.minutesLeft - 1, this.valveTimes.slice(0)));
                });

                // y cannot open a valve that is already open
                if (!this.valveTimes.find(vt => vt.room === this.roomY)) {

                    // x moves, y opens valve
                    neighbours.push(new SearchState(avrX, this.roomY, this.minutesLeft - 1, this.valveTimes.concat(new ValveTime(this.minutesLeft-1, this.roomY))));
                }
            });

            // x cannot open a valve that is already open
            if (this.roomX.name !== this.roomY.name && !this.valveTimes.find(vt => vt.room === this.roomX)) {

                // x opens valve, y moves
                this.roomY.adjValveRooms.forEach(avrY => {
                    neighbours.push(new SearchState(this.roomX, avrY, this.minutesLeft - 1, this.valveTimes.concat(new ValveTime(this.minutesLeft-1, this.roomX))));
                });

                // y cannot open a valve that is already open
                if (!this.valveTimes.find(vt => vt.room === this.roomY)) {

                    // both agents open valve simultaneously
                    neighbours.push(new SearchState(this.roomX, this.roomY, this.minutesLeft - 1, this.valveTimes.concat(new ValveTime(this.minutesLeft-1, this.roomX),new ValveTime(this.minutesLeft-1, this.roomY))));
                }
            }

            return neighbours;
        }

        get h() {
            return -1 * this.minutesLeft;
        }

        evalGScore() {
            return Utils.sum(this.valveTimes.map(vt => vt.totalFlow));
        }

        toString() {
            return `${this.roomX},${this.roomY} [${this.minutesLeft}] {${this.valveTimes.map(vt => vt.room.name + '(' + String(vt.minutesLeftOpened) + ')').join(',')}} ::: ${this.evalGScore()}`
        }
    }

    const aStar = (start:SearchState, space) => {

        start.gScore = 0;
        start.fScore = start.h;

        const openSet:SearchState[] = [start];

        while (true) {
            const minFScore = Math.min(...openSet.map(ss => ss.fScore));
            const currentIdx = openSet.findIndex(ss => ss.fScore === minFScore);

            if (currentIdx === -1) {
                // todo: backtrack
                return Math.max(...Object.values(space).map(v => Math.max(...Object.values(v).map(w => w[0].gScore))));
            }

            const current = openSet[currentIdx];
            openSet.splice(currentIdx, 1);

            const neighbours= current.calcNeighbours();
            neighbours.forEach(neighbour => {
                const tentativeScore = neighbour.evalGScore();
                let n1=neighbour.roomX.name, n2=neighbour.roomY.name;
                if (!space[n1][n2]) {
                    const tmp = n1;
                    n1 = n2;
                    n2 = tmp;
                }
                const spaceItem = space[n1][n2][neighbour.minutesLeft];
                if (tentativeScore > spaceItem.gScore) {
                    spaceItem.gScore = tentativeScore;
                    spaceItem.fScore = neighbour.h;
                    spaceItem.valveTimes = neighbour.valveTimes;
                    spaceItem.backPointer = current;
                    if (!openSet.includes(spaceItem))
                        openSet.push(spaceItem);
                }
            });
        }
        return -1;
    }

    const buildSolutionSpace = (dict, minutesLeft) => {
        const roomNames = Object.keys(dict);
        const space = {};
        let i, j, rni, rnj;
        for (i = 0; i < roomNames.length; i++) {
            const row = space[rni = roomNames[i]] = {};
            for (j = 0; j <= i; j++) {
                const cell = row[rnj = roomNames[j]] = [] as SearchState[];
                Array(minutesLeft).fill(0).forEach((_, i) => cell.push(new SearchState(dict[rni], dict[rnj], i, [])));
            }
        }
        return space;
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const dict = input.reduce(parseInput, {});
            if (part === Part.One) {
                return dict["AA"].maximizeFlow(30, [], []);
            }

            const minutesLeft = (example > 1) ? 4 : 26;

            const space = buildSolutionSpace(dict, minutesLeft + 1);

            // 2297 answer is too low
            return aStar(space["AA"]["AA"][minutesLeft], space);

        }, "2022", "day16", 
        // set this switch to Part.Two once you've finished part one.
        Part.Two, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}