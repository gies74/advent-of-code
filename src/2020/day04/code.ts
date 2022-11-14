/**
 * Advent of Code solution 2020/day04
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day04 {
    const generic = require('../../generic');

    /** ADD 2020-day04 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    generic.Utils.main((input) => {

        var parts = generic.Utils.splitInput(input);

        const expFields = ["byr"
            , "iyr"
            , "eyr"
            , "hgt"
            , "hcl"
            , "ecl"
            , "pid"];

        let cnt_valid = 0;
        for (var part of parts) {
            const dict = {};
            for (var line of part) {
                const props = line.split(' ');
                for (var prop of props) {
                    const keyval = prop.split(':');
                    dict[keyval[0]] = keyval[1];
                }
            }
            if (expFields.every(field => dict[field])) {
                var ok = true;
                for (var name in dict) {
                    switch (name) {
                        case "byr":
                            ok &&= /^\d{4}$/.test(dict[name]);
                            ok &&= parseInt(dict[name]) >= 1920 && parseInt(dict[name]) <= 2002;
                            break;
                        case "iyr":
                            ok &&= /^\d{4}$/.test(dict[name]);
                            ok &&= parseInt(dict[name]) >= 2010 && parseInt(dict[name]) <= 2020;
                            break;
                        case "eyr":
                            ok &&= /^\d{4}$/.test(dict[name]);
                            ok &&= parseInt(dict[name]) >= 2020 && parseInt(dict[name]) <= 2030;
                            break;
                        case "hgt":
                            ok &&= /^\d+(cm|in)$/.test(dict[name]);
                            var hgt = parseInt(dict[name]);
                            ok &&= hgt >= 150 && hgt <= 193 && dict[name].includes("cm") || 
                                   hgt >= 59 && hgt <= 76 && dict[name].includes("in");
                            break;
                        case "hcl":
                            ok &&= /^#[a-z0-9]{6}$/.test(dict[name]);
                            break;
                        case "ecl": 
                            ok &&= ["amb", "amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(dict[name]);
                            break;
                        case "pid":
                            ok &&= /^\d{9}$/.test(dict[name]);
                            break;
                        case "cid":
                            break;
                        default:
                            console.error(`${name}:${dict[name]} unexpeccted`);
                    }
                    if (!ok) {
                        // console.log(`prop ${name} invalid: ${dict[name]}`);
                        break;
                    }
                }
                if (ok)
                    cnt_valid++;
            }
        }
        return cnt_valid;


        /** ADD START HERE */

        return 0;

    }, "2020", "day04");

}