// import modules
const { createReadStream } = require('fs');
const path = require('path');
const process = require('process');

// get the path to the text file
const currPath = path.join(__dirname, 'text.txt');

// create readable stream
const readStream = createReadStream(currPath, { encoding: 'utf8' });

// put handler on 'data' event
readStream.on('data', (chunk) => {
  process.stdout.write(chunk);
});
