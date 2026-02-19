import { NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const isConnected = await testDatabaseConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        status: 'connected',
        env: {
          NODE_ENV: process.env.NODE_ENV,
          DB_HOST: process.env.DB_HOST ? 'set' : 'missing',
          DB_USER: process.env.DB_USER ? 'set' : 'missing',
          DB_DATABASE: process.env.DB_DATABASE ? 'set' : 'missing',
        }
      });
    } else {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Test failed', details: String(error) }, { status: 500 });
  }
}
