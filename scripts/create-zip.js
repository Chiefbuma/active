// scripts/create-zip.js
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('Creating deployment zip file...');

// Define the output path for the zip file in the project root
const outputPath = path.join(__dirname, '..', 'radiant-health-deployment.zip');
const output = fs.createWriteStream(outputPath);

const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level for best compression
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log('Zip file created successfully: ' + (archive.pointer() / 1024 / 1024).toFixed(2) + ' MB');
  console.log('radiant-health-deployment.zip is ready for upload.');
});

archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // Log file not found warnings
    console.warn(err);
  } else {
    // Throw other errors
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Define the project root directory
const projectRoot = path.join(__dirname, '..');

// Add all files from the project root to the archive,
// while ignoring the specified patterns.
archive.glob('**/*', {
  cwd: projectRoot,
  ignore: [
    // node_modules is now included to be part of the deployment.
    '.next/**',
    '.git/**',
    'dbdata/**',
    '*.zip',
    'scripts/**', // Ignore the scripts folder itself
    '.DS_Store',
  ]
});

// Finalize the archive (this is when it starts writing)
archive.finalize();
