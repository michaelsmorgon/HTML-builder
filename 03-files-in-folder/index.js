const { stdout } = process;
const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, '/secret-folder');
fs.readdir(dirPath, (err, files) => {
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    showInfo(filePath);
  });
});

function showInfo(filePath) {
  fs.stat(filePath, (err, stats) => {
    if (stats.isFile()) {
      const ext = path.extname(filePath);
      const fileName = path.basename(filePath, ext);
      const size = Number(stats['size'] / 1024).toFixed(2);
      stdout.write(`${fileName} - ${ext.replace('.', '')} - ${size}kb\n`);
    }
  });
}