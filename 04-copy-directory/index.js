const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, '/files');
const dirPathCopy = path.join(__dirname, '/files-copy');
let filesList = [];

fs.mkdir(dirPathCopy, {
  recursive: true
}, (err) => {
  if (err) {
    throw new Error('Something wrong!');
  }
  console.log('Folder successfully created!');
});

getFilesForCopy(dirPath, dirPathCopy);
removeFiles(dirPath, dirPathCopy);

console.log('Done!');

function getFilesForCopy(dirPath, dirPathCopy) {
  fs.readdir(dirPath, (err, files) => {
    files.forEach((file) => {
      filesList.push(file);
      copyFile(path.join(dirPath, file), path.join(dirPathCopy, file))
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

function removeFiles(dirPath, dirPathCopy) {
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