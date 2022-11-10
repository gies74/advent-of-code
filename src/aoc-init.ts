import * as readline from 'readline';
import * as generic from './generic';
const path = require('path');
const fs = require('fs');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const _doInit = (answer) => {
  const options = {
    host: `adventofcode.com`,
    port: 443,
    method: 'GET',
    path: `/${generic.Settings.YEAR}/day/${answer}/input`, // 9-11-2022 19:29:58
    headers: {
      cookie: process.env["AOC_COOKIE"]
      , 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
    }
  };

  // general variables
  const zeroPadded = `0${answer}`.substring(answer.length - 1);
  const name = `day${zeroPadded}`;

  // typescript source code file
  let localCodePath = `${__dirname}\\..\\src\\${generic.Settings.YEAR}\\${name}`;
  if (!fs.existsSync(localCodePath)) {
    fs.mkdirSync(localCodePath, { "recursive": true });
  }
  localCodePath += `\\code.ts`;
  if (fs.existsSync(localCodePath)) {
    console.warn(`[WARN] Code file ${path.resolve(localCodePath)} already exists! Please remove manually.`);
  } else {
    let code = fs.readFileSync(`${__dirname}\\..\\src\\code-template.ts`).toString();
    code = code.replace(/day00/g, name);
    code = code.replace(/year00/g, generic.Settings.YEAR);
    fs.writeFile(localCodePath, code, (err) => {
      if (err)
        console.error(`[ERR] Error: ${err}`);
      else 
        console.info(`[INFO] Code file ${path.resolve(localCodePath)} succesfully prepared.`)
    });
  }

  // input data file
  let localDataPath = `${__dirname}\\..\\data\\${generic.Settings.YEAR}\\${name}`;
  if (!fs.existsSync(localDataPath)) {
    fs.mkdirSync(localDataPath, { "recursive": true });
  }
  localDataPath += `\\input.txt`;

  console.info(`[INFO] Attempting to download from ${options.path} to ${localDataPath}`);
  https.get(options, (res) => {
    const fileStream = fs.createWriteStream(localDataPath);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      console.info('[INFO] Download complete!');
      process.exit();
    });
  });
};

export const aocInit = (argv) => {
  if (argv.length < 3) {
    rl.question(`Welke dag van ${generic.Settings.YEAR}? `, _doInit);
    return;
  }
  _doInit(argv[2]);
};