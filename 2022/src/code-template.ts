namespace day00 {
    const fs = require("fs");

    const main = () => {
        const input = fs.readFileSync(`${__dirname}\\..\\..\\aoc\\day00\\input.txt`).toString().split("\n").slice(0, -1);
        const result = processInput(input);
        console.log(`Answer: ${result}`);
    }

    const processInput = (input) => {
        /** insert logic here */
        return 0;
    }

    main();
}