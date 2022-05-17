// <имя файла>-<расширение файла>-<вес файла>
// example - txt - 128.369kb

// import modules
const { readdir } = require('fs/promises');
const { stat } = require('fs');
const path = require('path');

// set the path to the output file
const currPath = path.join(__dirname, 'secret-folder');

// read secret folder files
const readFiles = async () => {
  try {
    const files = await readdir(currPath, { withFileTypes: true });

    // read each object of the folder
    for (const file of files) {
      const filePath = path.join(currPath, file.name);

      stat(filePath, (err, stats) => {
        if (err) console.error(err);

        // check if object is a file
        if (file.isFile()) {
          const name = file.name.split('.')[0];
          const ext = path.extname(file.name).split('.')[1];
          const size = `${stats.size / 1024} kb`;
          process.stdout.write(`${name} - ${ext} - ${size} \n`);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
};

readFiles();