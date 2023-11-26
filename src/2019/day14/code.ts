/**
 * Advent of Code solution 2019/day14
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day14 {

    type Dict = {name:string, props:object};

    class Prerequisite {
        product:Product;
        amount: number;
        constructor(product:Product, amount:number) {
            this.product = product;
            this.amount = amount;
        }

        get name() {
            return this.product == null ? "ORE" : this.product.name;
        }
    }

    class Product {
        name:string;
        prereqs:Prerequisite[];
        amount:number;

        constructor(name:string, dict:Dict) {
            dict[name].product = this;
            this.name = name;
            this.amount = dict[name].amount;
            this.prereqs = [];
            dict[name].ingredients.forEach(ingr => {
                if (ingr.name !== "ORE" && !dict[ingr.name].product) {
                    new Product(ingr.name, dict);
                }

                this.prereqs.push(new Prerequisite(
                    ingr.name === "ORE" ? null : dict[ingr.name].product,
                    ingr.amount
                ));
            });
        }

        ingredients() {
            return this.prereqs.reduce((set, pr) => {
                if (pr.product) {
                    set.add(pr.product);
                    [...pr.product.ingredients()].forEach(set.add, set);
                }
                return set;
            }, new Set());
        }

    }

    const computeOre = (product) => {
        const x = product.ingredients();

        const state = [new Prerequisite(product, 1)];

    }
    
    /** ADD 2019-day14 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {

            const dict = input.reduce((dt, line) => {
                const [ingr, res] = line.split(" => ");
                const [resAmount, resName] = res.split(" ");
                const ingrs = ingr.split(", ");
                dt[resName] = {
                    "amount": parseInt(resAmount),
                    "ingredients": ingrs.map(ig => ({"name": ig.split(" ")[1], "amount": parseInt(ig.split(" ")[0])}))
                }
                return dt;
            }, {} as Dict );

            const fuel = new Product("FUEL", dict);
            
            
            // part aspecific code here

            // split input in case it has empty line delimited chunks
            // var chunks = Utils.splitInput(input);
           computeOre(fuel);
            let answerPart2 = 0;

            if (part == Part.One) {

                // part 1 specific code here

                return 0;

            } else {

                // part 2 specific code here

                return answerPart2;

            }

        }, "2019", "day14", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/dayDAY
        1);
}