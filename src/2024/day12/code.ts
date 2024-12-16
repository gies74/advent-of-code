/**
 * Advent of Code solution 2024/day12
 * (c) 2022-2024 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day12 {

    class Region {
        coords:number[];
        letter:string;
        borders:Border[] = [];
        perimeter:number = 4;
        area:number = 1;
        
        constructor(letter, coords) {
            this.letter = letter;
            this.coords = coords;
        }

        merge(otherRegion:Region) {
            const commonBorders = this.borders.filter(b => otherRegion.borders.includes(b));
            const otherExclusivenBorders = otherRegion.borders.filter(b => !this.borders.includes(b));            
            this.area += otherRegion.area;
            this.perimeter += otherRegion.perimeter - 2 * commonBorders.length;
            commonBorders.forEach(b => this.borders.splice(this.borders.indexOf(b), 1));
            this.borders = this.borders.concat(otherExclusivenBorders);
            otherExclusivenBorders.forEach(b => {
                if (b.region1 == otherRegion)
                    b.region1 = this;
                else
                    b.region2 = this;
            })
        }
    }

    class Border {
        region1:Region;
        region2:Region;
        constructor(r1, r2) {
            this.region1 = r1;
            this.region2 = r2;
            r1.borders.push(this);
            r2.borders.push(this);
        }
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @param example example number (where 0 means: input containss actual puzzle input)
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part, example: number = 0) => {

            const regions = [];

            const garden = input.map((line,li) => line.split("").map((cell,ci) => {
                const region = new Region(cell, [li, ci]);
                regions.push(region);
                return region;
            }));
            garden.forEach((row,ri) => row.forEach((_,ci) => {
                if (ri > 0)
                    new Border(garden[ri-1][ci], garden[ri][ci]);
                if (ci > 0)
                    new Border(garden[ri][ci-1], garden[ri][ci]);
            }));
            garden.splice(0, garden.length);

            let border = null;
            while (border = regions.reduce((b,r) => b || r.borders.find(b => b.region1.letter === b.region2.letter), null)) {
                regions.splice(regions.indexOf(border.region2), 1);
                border.region1.merge(border.region2);
            }


            return regions.reduce((cum, r) => cum + r.area * r.perimeter , 0);

        }, "2024", "day12", 
        // set this switch to Part.Two once you've finished part one.
        Part.One, 
        // set this to N > 0 in case you created a file called input_exampleN.txt in folder data/YEAR/DAY
        0);
}