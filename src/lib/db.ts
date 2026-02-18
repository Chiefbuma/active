// Load environment variables FIRST, before anything else
import path from 'path';
import dotenv from 'dotenv';

// Try to load from .env.production first, then fallback to .env
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Also load from current working directory (for standalone)
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Debug: Log which env vars are loaded (remove in production)
console.log('🔧 DB Config - Env vars loaded:', {
  DB_HOST: process.env.DB_HOST ? '✅' : '❌',
  DB_USER: process.env.DB_USER ? '✅' : '❌',
  DB_DATABASE: process.env.DB_DATABASE ? '✅' : '❌',
  DB_PORT: process.env.DB_PORT ? '✅' : '❌',
  NODE_ENV: process.env.NODE_ENV,
  CWD: process.cwd()
});

import mysql from 'mysql2/promise';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var db: mysql.Pool | undefined;
}

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  throw new Error(`Database configuration error: Missing ${missingEnvVars.join(', ')}`);
}

const db = global.db || mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
});

// Test the connection immediately
db.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

if (process.env.NODE_ENV !== 'production') global.db = db;

export { db };
