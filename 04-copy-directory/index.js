// import modules
const path = require('path');
const { copyFile, mkdir, readdir, access, unlink } = require('fs/promises');

// set the path to the src/dist folders
const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

// 1. check if folder exist
const checkDistFolder = async () => {
  try {
    // 2.A: if files-copy folder exists
    await access(destDir);
    removeFiles();
  } catch {
    // 2.B: if files-copy folder doesn`t exist
    createDistFolder();
  }
};

// 2.A: reset files-copy if folder existed
const removeFiles = async () => {
  try {
    const files = await readdir(destDir, { withFileTypes: true });
    // remove each file
    for (const file of files) {
      if (file.isFile()) {
        unlink(path.join(destDir, file.name));
      }
    }
    // copy files
    readFiles();
  } catch (err) {
    console.error(err);
  }
};

// 2.B: create dist folder if necessary
const createDistFolder = async () => {
  try {
    await mkdir(destDir, { recursive: true });
    // start reading files
    readFiles();
  } catch (err) {
    console.error(err);
  }
};

// 3. read files from src folder
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

// 4. copy files to dist folder
const copyDir = async (fileName) => {
  const fromPath = path.join(srcDir, fileName);
  const toPath = path.join(destDir, fileName);

  try {
    await copyFile(fromPath, toPath);
  } catch (err) {
    console.error(err);
  }
};

checkDistFolder();