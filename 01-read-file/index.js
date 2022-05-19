// import modules
const { createReadStream } = require('fs');
const { pipeline } = require('stream');
const path = require('path');

// get the path to the text file
const currPath = path.join(__dirname, 'text.txt');

// create pipeline between read stream and write stream(console)
pipeline(
  createReadStream(currPath, { encoding: 'utf8' }),
  process.stdout,
  (err) => {
    if (err) {
      console.error('Pipeline failed: ', err);
    }
  },
);
