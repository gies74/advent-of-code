import * as readline from 'readline';
import * as settings from './settings';
const fs = require('fs');
const https = require('https');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const _doInit = (answer) => {
  const options = {
     host: `adventofcode.com`,
     port:443,
     method: 'GET',
     path:`/${settings.Settings.YEAR}/day/${answer}/input`, // 9-11-2022 19:29:58
     headers: { 'cookie': process.env["AOC_COOKIE"] }
  };

  const zeroPadded = `0${answer}`.substring(answer.length - 1);
  const name = `day${zeroPadded}`;
  let localDataPath = `${__dirname}\\..\\data\\${settings.Settings.YEAR}\\${name}`;
  if (!fs.existsSync(localDataPath)){
      fs.mkdirSync(localDataPath);
  }
  localDataPath += `\\input.txt`;

  let localCodePath = `${__dirname}\\..\\src\\${settings.Settings.YEAR}\\${name}`;
  if (!fs.existsSync(localCodePath)){
      fs.mkdirSync(localCodePath);
  }
  localCodePath += `\\code.ts`;
  let code = fs.readFileSync(`${__dirname}\\..\\src\\code-template.ts`).toString();
  code = code.replace(/day00/g, name);
  fs.writeFile(localCodePath, code, (err) => {
    if (err)
      console.log(`Error: ${err}`);
  });


  console.log(`Attempting to download from ${options.path} to ${localDataPath}`);
  https.get(options, (res) => {
      const fileStream = fs.createWriteStream(localDataPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
          fileStream.close();
          console.log('Download complete!');
          process.exit();
      });
  });
};

export const aocInit = (argv) => {
  if (argv.length < 3) {
    rl.question(`Welke dag van ${settings.Settings.YEAR}? `, _doInit);
    return;
  }
  _doInit(argv[2]);
};