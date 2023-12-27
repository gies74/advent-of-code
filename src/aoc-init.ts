import { Console } from 'console';
import { exit } from 'process';
import * as readline from 'readline';
import * as generic from './generic';
const path = require('path');
const fs = require('fs');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const _doInit = async (answer: string) => {

  if (!process.env["AOC_COOKIE"] || process.env["AOC_COOKIE"].length < 100) {
    console.error(`Please read README.md, it looks like .env file has no valid AoC cookie!`);
    exit(0);
  }

  // general variables
  const zeroPadded = `0${answer}`.substring(answer.length - 1);
  const name = `day${zeroPadded}`;

  // typescript source code file
  let localCodePath = `${__dirname}/../src/${generic.Settings.YEAR}/${name}`;
  if (!fs.existsSync(localCodePath)) {
    fs.mkdirSync(localCodePath, { "recursive": true });
  }
  localCodePath += `/code.ts`;
  if (fs.existsSync(localCodePath)) {
    console.warn(`[WARN] Code file ${path.resolve(localCodePath)} already exists! Please remove manually.`);
  } else {
    let code = fs.readFileSync(`${__dirname}/../src/code-template.ts`).toString();
    code = code.replace(/day00/g, name);
    code = code.replace(/year00/g, generic.Settings.YEAR);
    code = code.replace("./generic", "../../generic");
    fs.writeFile(localCodePath, code, (err: Error) => {
      if (err)
        console.error(`[ERR] Error: ${err}`);
      else
        console.info(`[INFO] Code file ${path.resolve(localCodePath)} succesfully prepared.`)
    });
  }

  // input data file
  let localDataPath = `${__dirname}/../data/${generic.Settings.YEAR}/${name}`;


  const downloads = [{ "path": "/input", "localPath": "input.txt" }, { "path": "", "localPath": "puzzle.html" }];


  const promises = downloads.map(async spec => new Promise(async (resolve) => {
    const options = {
      host: `adventofcode.com`,
      port: 443,
      method: 'GET',
      path: `/${generic.Settings.YEAR}/day/${answer}${spec.path}`, // 9-11-2022 19:29:58
      headers: {
        cookie: process.env["AOC_COOKIE"]
        , 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
      }
    };

    const localFilePath = `${localDataPath}/${spec.localPath}`;
    if (!fs.existsSync(path.dirname(localFilePath))) {
      fs.mkdirSync(path.dirname(localFilePath), { "recursive": true });
    }

    console.info(`[INFO] Attempting to download from ${options.path} to ${path.resolve(localFilePath)}`);
    await https.get(options, (res: any) => {
      const fileStream = fs.createWriteStream(localFilePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });
    });
  }));
  await Promise.all(promises);
  console.info('[INFO] All downloads complete!');

  let html = fs.readFileSync(`${localDataPath}/puzzle.html`).toString();
  html = html.replace("/static/style.css", "../../static/style.css");
  const promWriteExample = extractExample(html, localDataPath);
  const promWritePuzzle = new Promise(puzzleWritten => {
    fs.writeFile(`${localDataPath}/puzzle.html`, html, () => {
      puzzleWritten(null);
    });
  });
  Promise.all([promWriteExample, promWritePuzzle]).then(() => {
    process.exit();
  });
};

const extractExample = async (html, localDataPath) => {
  return new Promise(attemptComplete => {
    try {
      const example = html.split("your puzzle input")[1].split("</code>")[0].split('<code>')[1];
      fs.writeFile(`${localDataPath}/input_example1.txt`, example, () => {
        console.info('[INFO] Example 1 succesfully extracted');
        attemptComplete(null);
      });
    } catch {
      console.warn('[WARN] Dit not extract example');
      attemptComplete(null);
    }
  });
};

export const aocInit = (argv: string[]) => {
  if (argv.length < 3) {
    rl.question(`Welke dag van ${generic.Settings.YEAR}? `, _doInit);
    return;
  }
  _doInit(argv[2]);
};