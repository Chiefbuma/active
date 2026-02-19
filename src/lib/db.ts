// Load environment variables FIRST, before anything else
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// In cPanel/Passenger, environment variables are already set by the hosting panel
// Only load .env files as fallback for local development
if (process.env.NODE_ENV !== 'production') {
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

// Debug logging (remove in production)
console.log('🔧 DB Config Check:', {
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST ? '✅ Set' : '❌ Missing',
  DB_USER: process.env.DB_USER ? '✅ Set' : '❌ Missing',
  DB_DATABASE: process.env.DB_DATABASE ? '✅ Set' : '❌ Missing',
  DB_PORT: process.env.DB_PORT ? '✅ Set' : '❌ Missing',
  DB_PASSWORD: process.env.DB_PASSWORD ? '✅ Set' : '❌ Missing',
  CWD: process.cwd()
});

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
  // Don't throw error immediately, let the app try to connect and fail gracefully
}

// Create connection pool configuration
const poolConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || '',
  database: process.env.DB_DATABASE || '',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
  // Add timeout to prevent hanging
  connectTimeout: 10000,
  // Enable keep-alive
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create the pool
const db = global.db || mysql.createPool(poolConfig);

// Export the pool immediately (don't wait for connection test)
if (process.env.NODE_ENV !== 'production') global.db = db;

// Test connection lazily (only when needed)
export async function testDatabaseConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    console.error('Connection config used:', {
      host: poolConfig.host,
      user: poolConfig.user,
      database: poolConfig.database,
      port: poolConfig.port,
      // Don't log password
    });
    return false;
  }
}

// Call test connection but don't block
testDatabaseConnection().catch(console.error);

export { db };