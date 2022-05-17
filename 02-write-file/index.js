// import modules
const { createWriteStream } = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');
const readline = require('readline');

// set the path to the output file
const currPath = path.join(__dirname, 'message.txt');

// create writable stream
const writeStream = createWriteStream(currPath);

// show greeting
stdout.write('Please, leave a message: \n');

// set the interface for reading data from a Readable stream
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

// waiting for user input (one line at a time)
// check the input for the 'exit' keyword
rl.on('line', (input) => {
  if (input.match('exit')) {
    closeRl();
  } else {
    writeStream.write(`${input} \n`, 'utf8');
  }
});

// event for Ctrl + C exit
rl.on('SIGINT', () => {
  closeRl();
});

// close readline interface
const closeRl = () => {
  stdout.write('Thank you for the message!');
  rl.close();
};
