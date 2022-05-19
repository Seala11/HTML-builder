// import modules
const path = require('path');
const { copyFile, mkdir, readdir } = require('fs/promises');

// set the path to the src/dist folders
const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

// 1. create dist folder if necessary
const createDistFolder = async () => {
  try {
    await mkdir(destDir, { recursive: true });
    // start reading files
    readFiles();
  } catch (err) {
    console.error(err);
  }
};

// 2. read files from src folder
const readFiles = async () => {
  try {
    const files = await readdir(srcDir, { withFileTypes: true });
    // pass each file to copy
    for (const file of files) {
      if (file.isFile()) {
        await copyDir(file.name);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// 3. copy files to dist folder
const copyDir = async (fileName) => {
  const fromPath = path.join(srcDir, fileName);
  const toPath = path.join(destDir, fileName);

  try {
    await copyFile(fromPath, toPath);
  } catch (err) {
    console.error(err);
  }
};

createDistFolder();
