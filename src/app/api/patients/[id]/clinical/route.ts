import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: patient_id } = params;
    const body = await request.json();

    const { notes_doctor, notes_psychologist, user_id } = body;

    if (!patient_id) {
      return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
    }

    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO clinical_reviews (patient_id, notes_doctor, notes_psychologist, user_id) VALUES (?, ?, ?, ?)',
      [patient_id, notes_doctor, notes_psychologist, user_id ?? 1] // Default user_id to 1 if not provided
    );
    connection.release();

    const insertId = (result as any).insertId;
    const [rows] = await connection.query('SELECT * FROM clinical_reviews WHERE id = ?', [insertId]);

    return NextResponse.json({ message: 'Clinical review added successfully', clinical: (rows as any)[0] }, { status: 201 });

  } catch (error) {
    console.error('Error adding clinical review:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
