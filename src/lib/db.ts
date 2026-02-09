
import mysql from 'mysql2/promise';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var db: mysql.Pool | undefined;
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
});

if (process.env.NODE_ENV !== 'production') global.db = db;

export { db };
