// scripts/create-zip.js
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('Creating deployment zip file...');

const output = fs.createWriteStream(path.join(__dirname, '..', 'radiant-health-deployment.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
  console.log(`Zip file created: radiant-health-deployment.zip (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Add all files from the project root, excluding specific directories
archive.glob('**/*', {
  cwd: path.join(__dirname, '..'),
  ignore: [
    'node_modules/**', 
    '.next/**', 
    '.git/**', 
    'dbdata/**', 
    '*.zip'
  ],
});

archive.finalize();
