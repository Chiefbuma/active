import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';

// Next.js automatically loads .env files, but this ensures it works in the standalone server context.
dotenv.config({ path: path.resolve(process.cwd(), '.env') });


declare global {
  // Allow global `var` declarations
  // eslint-disable-next-line no-var
  var dbPool: Pool | undefined;
}

const createPool = (): Pool => {
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required DB environment variables:', missingEnvVars.join(', '));
    throw new Error(`Database configuration error: Missing ${missingEnvVars.join(', ')}`);
  }

  console.log('🔧 Database pool configuration created.');

  return mysql.createPool({
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
};

const getPool = (): Pool => {
    // In development, use a global variable to preserve the pool across HMR reloads.
    // In production, this logic creates the pool once per server instance.
    if (!global.dbPool) {
        console.log('⚡ Initializing new database connection pool...');
        global.dbPool = createPool();
    }
    return global.dbPool;
}

// The exported 'db' is a proxy object that lazily gets the pool.
// This prevents the connection from being created at build time.
export const db = {
  query: (...args: Parameters<Pool['query']>) => {
    return getPool().query(...args);
  },
  getConnection: (...args: Parameters<Pool['getConnection']>) => {
    return getPool().getConnection(...args);
  }
};
