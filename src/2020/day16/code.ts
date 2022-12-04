/**
 * Advent of Code solution 2020/day16
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { Part, Utils } from "../../generic";

namespace day16 {

    class Range {
        low: number;
        high: number;

        constructor(lowHigh: string) {
            const [low, high] = lowHigh.split("-");
            this.low = parseInt(low);
            this.high = parseInt(high);
        }

        test(val: number): boolean {
            return val >= this.low && val <= this.high;
        }

    }

    class RangePair {
        range1: Range;
        range2: Range;

        constructor(rangeOrRange: string) {
            const [r1, r2] = rangeOrRange.split(" or ");
            this.range1 = new Range(r1);
            this.range2 = new Range(r2);
        }

        test(val: number): boolean {
            return this.range1.test(val) || this.range2.test(val);
        }
    }

    const parseFieldRanges = (fRanges): { [name: string]: RangePair } => {
        const fields: { [name: string]: RangePair } = {};
        fRanges.forEach(fRange => {
            const [fieldname, rangepair] = fRange.split(': ');
            fields[fieldname] = new RangePair(rangepair);
        });
        return fields;
    }

    const parseNearbyTickets = (tickets): number[][] => {
        const retVal: number[][] = [];
        tickets.slice(1).forEach(ticketLine => {
            retVal.push(ticketLine.split(',').map(n => parseInt(n)));
        });
        return retVal;
    }

    Utils.main(
        /**
         * Main entry point of this day's code
         * @param input this day's input
         * @param part report answer for either part one or two
         * @returns sought answer of given puzzle part
         */
        (input: string[], part: Part) => {



            // split input in empty line delimited chunks
            var chunks = Utils.splitInput(input);

            const fields = parseFieldRanges(chunks[0]);
            const myTicket = parseNearbyTickets(chunks[1])[0];
            let nearbyTickets = parseNearbyTickets(chunks[2]);


            const scanErrors = (nbTickets: number[][]): number[] => {
                return nbTickets.map((nbTicket: number[]): number => {
                    const error = nbTicket.find(num => !Object.values(fields).some(rangepair => rangepair.test(num)));
                    return (error) ? error : 0;
                });
            }
            const ticketScanningErrors: number[] = scanErrors(nearbyTickets);

            if (part == Part.One) {
                /** part 1 specific code here */
                return ticketScanningErrors.reduce((agg, e) => agg + e, 0);

            } else {
                /** part 2 specific code here */
                const validTickets = nearbyTickets.filter((e, i) => !ticketScanningErrors[i]);
                nearbyTickets = null;

                const fieldIndices: { [fn: string]: number } = {};
                while (!Object.keys(fields).every(fieldname => Object.keys(fieldIndices).includes(fieldname))) {
                    const preLen = Object.keys(fieldIndices).length;
                    for (var fieldname in fields) {
                        if (Object.keys(fieldIndices).includes(fieldname))
                            continue;
                        let breakOuter = false;
                        for (var index = 0; index < myTicket.length; index++) {
                            if (Object.values(fieldIndices).includes(index))
                                continue;
                            const valuesOfValidTickets = validTickets.map(ticket => ticket[index]);
                            valuesOfValidTickets.push(myTicket[index]);
                            var evaluation = valuesOfValidTickets.every(val => fields[fieldname].test(val));
                            var otherFieldsPassingAllValues = Object.keys(fields)
                                .filter(altFieldname => altFieldname != fieldname && !Object.keys(fieldIndices).includes(altFieldname))
                                .filter(altFieldname => valuesOfValidTickets.every(val => fields[altFieldname].test(val)));

                            if (evaluation && !otherFieldsPassingAllValues.length) {
                                fieldIndices[fieldname] = index;
                                breakOuter = true; 
                                break;
                            }
                        }
                        if (breakOuter)
                            break;
                    }
                    if (Object.keys(fieldIndices).length == preLen) {
                        console.error("failed :-(");
                        break;
                    }
                }



                return 0;
            }

        }, "2020", "day16",
        // set this switch to Part.Two once you've finished part one.
        Part.Two);
}