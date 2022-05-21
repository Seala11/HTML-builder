// import modules
const path = require('path');
const { copyFile, readFile, mkdir, readdir } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');

// set the path to the src/dist folders
const srcTemplate = path.join(__dirname, 'template.html');
const srcDirHtml = path.join(__dirname, 'components');
const srcDirStyles = path.join(__dirname, 'styles');
const srcDirAssets = path.join(__dirname, 'assets');

const distDir = path.join(__dirname, 'project-dist');
const distDirHtml = path.join(distDir, 'index.html');
const distDirStyles = path.join(distDir, 'style.css');
const distDirAssets = path.join(distDir, 'assets');

// HTML

// 1.1 merge html files
const htmlMerge = async () => {
  try {
    const template = await readFile(srcTemplate, { encoding: 'utf8' });

    const newTemplate = await replaceComponents(template);

    const writeStream = createWriteStream(distDirHtml);

    writeStream.write(newTemplate);
  } catch (err) {
    console.error(err);
  } finally {
    console.log('- 1 - html merged -');
  }
};

const replaceComponents = async (template) => {
  try {
    const files = await readdir(srcDirHtml, { withFileTypes: true });

    for (const file of files) {
      const ext = path.extname(file.name).split('.')[1];

      // check each file extention
      if (file.isFile() && ext === 'html') {
        // get the path to the text file
        const currPath = path.join(srcDirHtml, file.name);

        // read file
        const component = await readFile(currPath, { encoding: 'utf8' });

        // replace the component
        const fileName = file.name.split('.')[0];
        template = template.split(`{{${fileName}}}`).join(component);
      }
    }

    return template;
  } catch (err) {
    console.error(err);
  }
};

// STYLES

// 2.1. read files from styles folder
const mergeStyles = async () => {
  try {
    // create writable stream
    const writeStream = createWriteStream(distDirStyles);

    const files = await readdir(srcDirStyles, { withFileTypes: true });

    for (const file of files) {
      const ext = path.extname(file.name).split('.')[1];

      // check each file extention
      if (file.isFile() && ext === 'css') {
        // get the path to the text file
        const currPath = path.join(srcDirStyles, file.name);

        // create readable stream
        const readStream = createReadStream(currPath, { encoding: 'utf8' });

        // copy styles from the file to bundle.css
        copyStyles(readStream, writeStream);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.log('- 2 - styles merged -');
  }
};

// 2.2. read files from styles folder
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

// ASSETS

// 2.1. create dist folder if necessary
const createAssetsFolder = async (fromFolder, toFolder) => {
  try {
    await mkdir(toFolder, { recursive: true });

    // copy assets
    await readAssetsFiles(fromFolder, toFolder);
  } catch (err) {
    console.error(err);
  }
};

// 2.2. read files from src folder
const readAssetsFiles = async (fromFolder, toFolder) => {
  try {
    const files = await readdir(fromFolder, { withFileTypes: true });
    // pass each file to copy
    for (const file of files) {
      if (file.isFile()) {
        await copyAssetsFile(file.name, fromFolder, toFolder);
        console.log(`Copy - ${file.name} - to ${toFolder}`);
      } else if (file.isDirectory()) {
        const newSrc = path.join(fromFolder, file.name);
        const newDist = path.join(toFolder, file.name);
        console.log(`Create new folder - ${file.name} in ${toFolder}`);
        await createAssetsFolder(newSrc, newDist);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.log(`- 3 - assets copied to ${toFolder}`);
  }
};

// 2.3. copy files to dist folder
const copyAssetsFile = async (fileName, fromFolder, toFolder) => {
  const fromPath = path.join(fromFolder, fileName);
  const toPath = path.join(toFolder, fileName);

  try {
    await copyFile(fromPath, toPath);
  } catch (err) {
    console.error(err);
  }
};

// BUILD

const htmlBuilder = async () => {
  try {
    // 0. create dist folder
    await mkdir(distDir, { recursive: true });
    console.log('- 0 - start build -');

    // 1. merge html
    await htmlMerge();

    // 2. merge all styles from styles folder
    await mergeStyles();

    // 3. start from assets folder and go recursively to copy all inner folders
    await createAssetsFolder(srcDirAssets, distDirAssets);
  } catch (err) {
    console.error(err);
  } finally {
    console.log('- 4 - build is done -');
  }
};

htmlBuilder();
