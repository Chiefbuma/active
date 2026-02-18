const path = require('path');

// This is the entry point for your Phusion Passenger server.
// It detects if the app is running in a standalone build folder
// and correctly starts the Next.js server.

const standaloneDir = path.join(__dirname, '.next/standalone');

// Phusion Passenger provides the port to listen on via the process.env.PORT variable.
// The Next.js standalone server automatically uses this.
process.env.PORT = process.env.PORT || '3000';

// The standalone server needs to be run from its own directory.
try {
  process.chdir(standaloneDir);
} catch (err) {
  console.error(`Could not change directory to ${standaloneDir}. Standalone build may not exist. Run 'npm run build' first.`);
  process.exit(1);
}


console.log(`Starting Next.js server from: ${standaloneDir}`);

// Require the standalone server entry point.
require('./server.js');
