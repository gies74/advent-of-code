import { aocInit } from "./aoc-init";

class App {
    /** Entry point of our app */
    public static start() {
        const argv = process.argv;
        aocInit(argv);
    }
}

App.start();