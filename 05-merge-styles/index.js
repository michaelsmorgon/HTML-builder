const fs = require('fs');
const path = require('path');
const dirStylesPath = path.join(__dirname, '/styles');
const distPath = path.join(__dirname, 'project-dist/bundle.css');
const writeStream = fs.createWriteStream(distPath);

fs.readdir(dirStylesPath, (err, files) => {
  files.forEach((file) => {
    const filePath = path.join(dirStylesPath, file);
    const ext = path.extname(filePath);
console.log(ext);
    if (ext === '.css') {
      const readStream = fs.createReadStream(filePath);
      readStream.on('data', (data) => {
        writeStream.write(data.toString() + '\n');
      });
    }
  });
});
