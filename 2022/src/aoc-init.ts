import * as readline from 'readline';
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
     path:`/2021/day/${answer}/input`, // 9-11-2022 19:29:58
     headers: { 'cookie': '_ga=GA1.2.1479521940.1668018598; _gid=GA1.2.1114809174.1668018598; session=53616c7465645f5f36645957129ad4228965740b8d3fb4358eec62f009ee2ac3a7846ce8006dc90b0897f83ef943c9424e11e3133f9350db18a552e07125b0d0' }
  };

  const zeroPadded = `0${answer}`.substring(answer.length - 1);
  const name = `day${zeroPadded}`;
  let localDataPath = `${__dirname}\\..\\aoc\\${name}`;
  if (!fs.existsSync(localDataPath)){
      fs.mkdirSync(localDataPath);
  }
  localDataPath += `\\input.txt`;

  let localCodePath = `${__dirname}\\..\\src\\${name}`;
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
    rl.question(`Welke dag? `, _doInit);
    return;
  }
  _doInit(argv[2]);
};