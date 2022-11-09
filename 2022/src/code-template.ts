namespace day00 {
    const fs = require("fs");

    const main = () => {
        const input = fs.readFileSync(`${__dirname}\\..\\..\\aoc\\day00\\input.txt`).toString().split("\n");
        console.log(input);
    }
    
    main();
}