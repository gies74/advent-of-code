# advent-of-code

download puzzle input and instantiate a typescript code file

requirements:
- Win10
- Latest VSCode and Node installed

instructions:
- clone repo and open the root folder in VSCode
- npm install
- rename default.env to .env and edit to set the AOC_COOKIE value from an AoC website request header while logged in (press F12, see network tab)
- choose appropriate value for Settings.YEAR in the ./src/settings.ts
- npm start ; when prompted, enter the day number you'd like to download
- after download, go to src/{YEAR}/day{DAY}/code.ts, place a breakpoint and launch the run configuration named "Run"
