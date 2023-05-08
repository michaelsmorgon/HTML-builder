const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'project-dist');
const templateFilePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const dirStylesPath = path.join(__dirname, '/styles');
const distPath = path.join(__dirname, 'project-dist/style.css');
const stylesWriteStream = fs.createWriteStream(distPath);

makeDir(dirPath);

const templateReadStream = fs.createReadStream(templateFilePath, 'utf-8');
const indexWriteStream = fs.createWriteStream(path.join(dirPath, 'index.html'));

let content ='';
templateReadStream.on('data', (data) => {
  content = data.toString();

  fs.readdir(componentsPath, (err, files) => {
    if (err) {
      throw new Error('Something wrong!');
    }
    files.forEach((file) => {
      const filePath = path.join(componentsPath, file);
      const ext = path.extname(filePath);
      const fileName = path.parse(filePath).name;
  
      if (ext === '.html') {
        const readStream = fs.createReadStream(filePath);
        readStream.on('data', (data2) => {
          content = content.replace(`{{${fileName}}}`, data2);

          if (!content.match(/{{(.)*}}/g)) {
            indexWriteStream.write(content);
          }
        });
      }
    });
  });
});

createCssFile();
const assetsDirPath = path.join(__dirname, 'assets');
const assetsDirPathCopy = path.join(__dirname, 'project-dist/assets');
copyFiles(assetsDirPath, assetsDirPathCopy);


function copyFiles(assetsDirPath, assetsDirPathCopy) {
  let filesList = [];

  makeDir(assetsDirPathCopy);
  getFilesForCopy(assetsDirPath, assetsDirPathCopy, filesList);
  removeFiles(assetsDirPath, assetsDirPathCopy, filesList);
}

function makeDir(path) {
  fs.mkdir(path, {
    recursive: true
  }, (err) => {
    if (err) {
      throw new Error("Folder already exists or something wrong!");
    }
    console.log("Folder successfully created!");
  });
}

function createCssFile() {
  fs.readdir(dirStylesPath, (err, files) => {
    if (err) {
      throw new Error('Something wrong!');
    }
    files.forEach((file) => {
      const filePath = path.join(dirStylesPath, file);
      const ext = path.extname(filePath);
  
      if (ext === '.css') {
        const readStream = fs.createReadStream(filePath);
        readStream.on('data', (data) => {
          stylesWriteStream.write(data.toString() + '\n');
        });
      }
    });
  });
}

function getFilesForCopy(dirPath, dirPathCopy, filesList) {
  fs.readdir(dirPath, (err, files) => {
    files.forEach((file) => {
      if (!path.extname(file)) {
        copyFiles(path.join(assetsDirPath, file), path.join(assetsDirPathCopy, file));
      } else {
        filesList.push(file);
        copyFile(path.join(dirPath, file), path.join(dirPathCopy, file));
      }
    });
  });
}

function copyFile(src, dest) {
  fs.copyFile(src, dest, (err) => {
    if (err) {
      throw new Error('Something wrong while copying file!');
    }
  });
}

function removeFiles(dirPath, dirPathCopy, filesList) {
  fs.readdir(dirPathCopy, (err, files) => {
    files.forEach((file) => {
      if (!filesList.includes(file)) {
        fs.rm(path.join(dirPathCopy, file), {
          force: true, recursive: true
        }, (err) => {
          if (err) {
            throw new Error('Something wrong while removing file!');
          }
        });
      }
    });
  });
}