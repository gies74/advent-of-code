/**
 * Advent of Code solution 2020/day21
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day21 {
    const generic = require('../../generic');
    
    /** ADD 2020-day21 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    function getIntersection(setA, setB) {
        var aa = [...setA.keys()];
        var bb = aa.filter(element => setB.has(element))
        const intersection = new Set(
            bb
        );      
        return intersection;
      }    

    generic.Utils.main((input) => {

        /** ADD START HERE */
        const allergens = [];
        const ingrSetsByAll = {}
        for (var line of input) {
            const ilist = line.replace(/(.*) \(contains .*\)/, "$1");
            const ingrs = new Set(ilist.split(" "));
            const alist = line.replace(/.*\(contains ([^\)]+)\)/, "$1");
            const alls = alist.split(", ");
            for (var all of alls) {
                if (!ingrSetsByAll[all])
                    ingrSetsByAll[all] = [];
                ingrSetsByAll[all].push(ingrs);
                if (!allergens.includes(all))
                    allergens.push(all);                
            }
        }

        var possibleIngrsPerAll = {};
        for (var allergen in ingrSetsByAll) {
            let myset = ingrSetsByAll[allergen][0];
            for (var i=1; i<ingrSetsByAll[allergen].length; i++)
                myset = getIntersection(myset, ingrSetsByAll[allergen][i]);
            possibleIngrsPerAll[allergen] = myset;
        }



        return 0;

    }, "2020", "day21");

}