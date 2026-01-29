import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: patient_id } = params;
    const body = await request.json();

    const { discussion, goal, user_id } = body;

    if (!patient_id) {
      return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
    }
     if (!goal) {
      return NextResponse.json({ message: 'Goal is required' }, { status: 400 });
    }

    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO goals (patient_id, discussion, goal, user_id) VALUES (?, ?, ?, ?)',
      [patient_id, discussion, goal, user_id ?? 1] // Default user_id to 1 if not provided
    );
    connection.release();
    
    const insertId = (result as any).insertId;
    const [rows] = await connection.query('SELECT * FROM goals WHERE id = ?', [insertId]);

    return NextResponse.json({ message: 'Goal added successfully', goal: (rows as any)[0] }, { status: 201 });

  } catch (error) {
    console.error('Error adding goal:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
