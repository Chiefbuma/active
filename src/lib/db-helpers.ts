import { db, testDatabaseConnection } from './db';
import type { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

// This union type is broad to cover various return types from mysql2
export type QueryResult = RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader;

export async function executeQuery<T extends QueryResult>(
  query: string,
  params?: any[]
): Promise<T> {
  const isConnected = await testDatabaseConnection();
  if (!isConnected) {
    throw new Error('Database connection failed. Check server logs for details.');
  }
  
  try {
    const [rows] = await db.execute(query, params);
    return rows as T;
  } catch (error) {
    console.error('Query execution failed:', error);
    // Re-throw to be handled by the API route
    throw error;
  }
}
