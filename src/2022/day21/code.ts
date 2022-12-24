/**
 * Advent of Code solution 2022/day21
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day21 {

    let lookup = {};

    const workoutPart2 = (monkey, outcome) => {
        if (monkey === "humn") {
            return outcome;
        }
        const says = lookup[monkey];
        const pat = /^(\w+) ([\+\-\*\/]) (\w+)$/;
        const matches = says.match(pat);

        const op1 = workout(matches[1], Part.Two);
        const op2 = workout(matches[3], Part.Two);

        switch (matches[2]) {
            case "+":
                return op1 === "reverse" ? workoutPart2(matches[1], outcome - op2) : workoutPart2(matches[3], outcome - op1);
            case "-":
                return op1 === "reverse" ? workoutPart2(matches[1], op2 + outcome) : workoutPart2(matches[3], op1 - outcome);
            case "*":
                return op1 === "reverse" ? workoutPart2(matches[1], outcome / op2) : workoutPart2(matches[3], outcome / op1);
            case "/":
                return op1 === "reverse" ? workoutPart2(matches[1], op2 * outcome) : workoutPart2(matches[3], op1 / outcome);
        }
    };

    const workout = (monkey, part) => {
        const says = lookup[monkey];
        if (monkey === "humn" && part === Part.Two) {
            return "reverse";
        }
        if (/^\d+$/.test(says)) {
            return parseInt(says);
        }
        const pat = /^(\w+) ([\+\-\*\/]) (\w+)$/;
        const matches = says.match(pat);
        const op1 = workout(matches[1], part);
        const op2 = workout(matches[3], part);

        if (part === Part.Two) {
            if (monkey === "root") {
                if (op1 === "reverse")
                    return workoutPart2(matches[1], op2);
                else if (op2 === "reverse")
                    return workoutPart2(matches[2], op1);
                else
                    throw Error("This cannot be");
            }
            else if ([op1, op2].includes("reverse")) {
                return "reverse";
            }
        }

        switch (matches[2]) {
            case "+":
                return op1 + op2;
            case "-":
                return op1 - op2;
            case "*":
                return op1 * op2;
            case "/":
                return op1 / op2;
        }
    };    

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            lookup = input.reduce((agg, elt) => {
                const [monkey, expression] = elt.split(": ");
                agg[monkey] = expression;
                return agg;
            }, {});

            return workout("root", part);

        }, "2022", "day21",
        // set this switch to Part.Two once you've finished part one.
        Part.One,
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        0);
}