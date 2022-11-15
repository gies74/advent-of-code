/**
 * Advent of Code solution 2020/day22
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

import { stringify } from "querystring";

namespace day22 {
    const generic = require('../../generic');
    
    /** ADD 2020-day22 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */
    let GAME_ID = 1;

    const recursiveCombat = (deck1: number[], deck2: number[]): any[] => {
        var game_id = GAME_ID++;
        var round_id = 1;
        const deck1Hashes = {};
        const deck2Hashes = {};
        while (deck1.length && deck2.length) {
            const deck1Hash = deck1.map(c => String(c)).join(",");
            const deck2Hash = deck2.map(c => String(c)).join(",");
            // console.info(`Round ${round_id++} (Game ${game_id}) d1=[${deck1Hash}] d2=[${deck2Hash}]`);
            if (deck1Hashes[deck1Hash] || deck2Hashes[deck2Hash]) {
                return [true, game_id];
            }
            deck1Hashes[deck1Hash] = true;
            deck2Hashes[deck2Hash] = true;
        
            var c1 = deck1.shift();
            var c2 = deck2.shift();

            var gid = 0, p1Wins = true;
            if (c1 <= deck1.length && c2 <= deck2.length) {
                [p1Wins, gid] = recursiveCombat(deck1.slice(0, c1), deck2.slice(0, c2));
                // console.info(`Game ${gid} won by ${p1Wins ? "p1": "p2"}, anyway back to game ${game_id}`);
            }
            else {
                p1Wins = c1 > c2;
            }

            if (p1Wins) {
                deck1.push(c1);
                deck1.push(c2);
            }
            else {
                deck2.push(c2);
                deck2.push(c1);
            }
        }
        return [deck1.length > 0, game_id];
    }

    generic.Utils.main((input) => {

        var parts = generic.Utils.splitInput(input);

        /** ADD START HERE */

        parts[0].shift();
        var deck1 = parts[0].map(n => parseInt(n));
        parts[1].shift();
        var deck2 = parts[1].map(n => parseInt(n));
        // deck1 = [9, 2, 6, 3, 1];
        // deck2 = [5, 8, 4, 7, 10];

        const [p1Wins, gid] = recursiveCombat(deck1, deck2);
        console.info(`Main game ${gid} won by ${p1Wins ? "p1": "p2"}, computing score now!!`);

        var winningDeck = p1Wins ? deck1 : deck2;

        var score = 0;
        for (var i=1; i<=winningDeck.length;i++) {
            score += i * winningDeck[winningDeck.length - i];
        }

        return score;

    }, "2020", "day22");

}