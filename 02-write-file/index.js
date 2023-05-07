const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(filePath);

stdout.write('Hello! Please enter the text:\n');
stdin.on('data', data => {
  const text = data.toString().trim();
  if (text === 'exit') {
    finishProcess();
  }
  writeStream.write(data);
});

process.on('SIGINT', finishProcess);

function finishProcess() {
  stdout.write('Bye!');
  process.exit();
}