# Advent of Code

This codebase covers:
- Helper scripts to retrieve daily puzzle input for https://adventofcode.com/ and instantiate a fresh typescript code file. 
- All solutions to the puzzles I've solved over the years

In case you're interested to use the first bit yourself, keep reading. 

Requirements:
- Latest VSCode and Node installed

Instructions (once only):
- fork and clone this repo and open the root folder in VSCode
- npm install
- rename default.env to .env and edit to set the AOC_COOKIE value to the value of the HTTP request header named 'cookie' from an AoC website request while you are logged in (press F12 in your browser, see network tab and click any request to inspect and copy the cookie's value). Note: the cookie information is personal and sensitive; make sure the .env file stays gitignored!
- edit line 4 of ./src/generic.ts and set the YEAR variable appropriately

Instructions (daily):
- npm start [DAYNUM]
- go to src/{YEAR}/day{DAYNUM}/code.ts, place a breakpoint and launch the run configuration named "Run"
- have fun!

Tips and known deficits:
- Install the VSCode extension https://marketplace.visualstudio.com/items?itemName=george-alisson.html-preview-vscode to view the HTML formatted puzzle description in ./data/YEAR/dayDAYNUM/puzzle.html within VSCode. Download AoC's style.css once only into a folder /data/static for optimal rendering. 
- Currently there's no support to submit your answer from the VSCode environment. For now you should do this using your browser. 