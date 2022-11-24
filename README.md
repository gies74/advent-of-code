# advent-of-code

download puzzle input and instantiate a typescript code file

requirements:
- Win10
- Latest VSCode and Node installed

instructions (once only):
- clone repo and open the root folder in VSCode
- npm install
- rename default.env to .env and edit to set the AOC_COOKIE value to the value of the HTTP request header named 'cookie' from an AoC website request while you are logged in (press F12 in your browser, see network tab and click any request to inspect and copy the cookie's value).
- edit ./src/settings.ts and set the Settings.YEAR variable appropriately

instructions (daily):
- npm start [DAYNUM]
- go to src/{YEAR}/day{DAYNUM}/code.ts, place a breakpoint and launch the run configuration named "Run"
