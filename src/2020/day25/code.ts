/**
 * Advent of Code solution 2020/day25
 * (c) 2022 Gies Bouwman
 * gies.bouwman@alliander.com
 * All rights reserved.
 */

namespace day25 {
    const generic = require('../../generic');
    
    /** ADD 2020-day25 SPECIFIC OBJECTS, CLASSES AND FUNCTIONS HERE  */

    const MASTER_PRIME = 20201227;

    const findLoopSizeForPubkey = (pubkey) => {
        let loopDetect = 17000000;
        let val = 1;
        let loopSize = 0;
        while (val != pubkey && loopDetect > 0) {
            val *= 7;
            val = val % MASTER_PRIME;
            loopSize++;
            loopDetect--;
        }
        return (loopDetect == 0) ? -1 : loopSize; 
    }

    const transform = (subject, loopSize) => {     
        let privKey = 1;   
        for (var l=0; l<loopSize;l++) {
            privKey *= subject;
            privKey = privKey % MASTER_PRIME;
        }
        return privKey;
    }

    generic.Utils.main((input) => {

        const pubKeyCard = parseInt(input[0]); // 5764801;
        const loopSizeCard = findLoopSizeForPubkey(pubKeyCard);

        const pubKeyDoor = parseInt(input[1]); // 17807724;
        const loopSizeDoor = findLoopSizeForPubkey(pubKeyDoor);

        const privateKey = transform(pubKeyCard, loopSizeDoor);

        return privateKey;

    }, "2020", "day25");

}