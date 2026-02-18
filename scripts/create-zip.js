// scripts/create-zip.js
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('Creating standalone deployment zip file...');

const projectRoot = path.join(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');
const publicDir = path.join(projectRoot, 'public');
const envFile = path.join(projectRoot, '.env');
const outputPath = path.join(projectRoot, 'radiant-health-standalone-deployment.zip');

if (!fs.existsSync(standaloneDir)) {
  console.error('Error: .next/standalone directory not found.');
  console.error('Please run "npm run build" before running the zip script.');
  process.exit(1);
}

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
  console.log(`Zip file created: ${path.basename(outputPath)} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
  console.log('Ready for upload.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Add the entire contents of the standalone directory to the zip's root
archive.directory(standaloneDir, false);

// The standalone output needs the `public` folder at the root for static assets.
if (fs.existsSync(publicDir)) {
  archive.directory(publicDir, 'public');
}

// The standalone output also needs the .env file.
if (fs.existsSync(envFile)) {
  archive.file(envFile, { name: '.env' });
}

archive.finalize();
