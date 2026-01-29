import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM corporates ORDER BY name ASC');
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching corporates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, wellness_date } = await request.json();

    if (!name || !wellness_date) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO corporates (name, wellness_date) VALUES (?, ?)',
      [name, wellness_date]
    );
    
    const insertId = (result as any).insertId;
    const [rows] = await connection.query('SELECT * FROM corporates WHERE id = ?', [insertId]);
    connection.release();


    return NextResponse.json({ message: 'Corporate added successfully', corporate: (rows as any)[0] }, { status: 201 });

  } catch (error) {
    console.error('Error adding corporate:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
