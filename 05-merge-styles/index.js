// import modules
const path = require('path');
const { readdir } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');

// set the path to the src/dist folders
const srcDir = path.join(__dirname, 'styles');
const destDir = path.resolve(__dirname, 'project-dist', 'bundle.css');

// 1. read files from styles folder
const readFiles = async () => {
  try {
    // create writable stream
    const writeStream = createWriteStream(destDir);

    const files = await readdir(srcDir, { withFileTypes: true });

    for (const file of files) {
      const ext = path.extname(file.name).split('.')[1];

      // check each file extention
      if (file.isFile() && ext === 'css') {
        // get the path to the text file
        const currPath = path.join(srcDir, file.name);

        // create readable stream
        const readStream = createReadStream(currPath, { encoding: 'utf8' });

        // copy styles from the file to bundle.css
        copyStyles(readStream, writeStream);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const copyStyles = (readStream, writeStream) => {
  let output = '';
  readStream.on('data', (chunk) => {
    output += chunk;
  });
  readStream.on('error', (error) => {
    console.error(error);
  });
  readStream.on('end', () => {
    output += '\n';
    writeStream.write(output);
  });
};

readFiles();
