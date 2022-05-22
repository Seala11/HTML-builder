// import modules
const { createWriteStream } = require('fs');
const path = require('path');
const readline = require('readline');

// set the path to the output file
const currPath = path.join(__dirname, 'message.txt');

// create writable stream
const writeStream = createWriteStream(currPath);

// show greeting
process.stdout.write('Please, leave a message: \n');

// set the interface for reading data from a Readable stream
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// waiting for user input (one line at a time)
rl.on('line', (input) => {

  // check the input for the 'exit' keyword
  if (input.match('exit')) {
    rl.emit('SIGINT');
  } else {
    writeStream.write(`${input} \n`, 'utf8');
  }
});

// close readline interface
rl.on('SIGINT', () => {
  process.stdout.write('Thank you for the message!');
  rl.close();
});