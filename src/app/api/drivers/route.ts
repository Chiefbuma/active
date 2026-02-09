import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM drivers ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const [result] = await db.query('INSERT INTO drivers (name) VALUES (?)', [name]);
    const insertId = (result as any).insertId;
    const [rows] = await db.query('SELECT * FROM drivers WHERE id = ?', [insertId]);
    return NextResponse.json({ message: 'Driver created successfully', driver: (rows as any)[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
