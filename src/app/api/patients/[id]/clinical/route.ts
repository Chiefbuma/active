import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: registration_id } = params;
    const body = await request.json();

    const { notes_doctor, notes_psychologist, user_id } = body;

    if (!registration_id) {
      return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
    }

    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO clinicals (registration_id, notes_doctor, notes_psychologist, user_id) VALUES (?, ?, ?, ?)',
      [registration_id, notes_doctor, notes_psychologist, user_id ?? 1] // Default user_id to 1 if not provided
    );
    
    const insertId = (result as any).insertId;
    const [rows] = await connection.query('SELECT * FROM clinicals WHERE id = ?', [insertId]);
    connection.release();

    return NextResponse.json({ message: 'Clinical review added successfully', clinical: (rows as any)[0] }, { status: 201 });

  } catch (error) {
    console.error('Error adding clinical review:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
