// server.js
// This file is the entry point for Phusion Passenger.
// It finds and starts the actual Next.js server from the standalone output.
// The .next/standalone folder is a self-contained production server
// created by `npm run build`, and it includes an optimized node_modules directory.
process.chdir(__dirname);
process.env.PORT = process.env.PORT || '3000';

// The path to the standalone server is relative to this file's location
require('./.next/standalone/server.js');
