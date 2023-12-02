/**
 * Advent of Code solution 2023/day02
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day02 {

    class Draw {
        cubes: object = { "red": 0, "green": 0, "blue": 0 };
        constructor(part: string) {
            var self = this;
            part.split(", ").forEach(p => {
                const [amount, color] = p.split(" ");
                self.cubes[color] = parseInt(amount);
            });
        }
    }

    class Game {
        id: number;
        draws: Draw[];
        constructor(line: string) {
            const [gid, draws] = line.split(": ");
            this.id = parseInt(gid.replace("Game ", ""));
            this.draws = draws.split("; ").map(d => new Draw(d));
        }

        allDrawsUnderMax() {
            var self = this;
            const maxes = { "red": 12, "green": 13, "blue": 14 };
            return Object.keys(maxes).every(color => Math.max(...self.draws.map(d => d.cubes[color])) <= maxes[color]);
        }

        power() {
            var self = this;
            const maxes = { "red": 0, "green": 0, "blue": 0 };
            Object.keys(maxes).forEach(color => maxes[color] = Math.max(...self.draws.map(d => d.cubes[color])));
            return maxes["red"] * maxes["green"] * maxes["blue"];
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

            const games = input.map(l => new Game(l));
            // part aspecific code here

            // split input in case it has empty line delimited chunks
            // var chunks = Utils.splitInput(input);

            let terms = [];
            if (part == Part.One) {
                terms = games.filter(g => g.allDrawsUnderMax()).map(g => g.id);
            } else {
                terms = games.map(g => g.power());
            }

            return Utils.sum(terms);


        }, "2023", "day02",
        // set this switch to Part.Two once you've finished part one.
        Part.Two,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}