import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: patient_id } = params;
    const body = await request.json();

    const { bp_systolic, bp_diastolic, pulse, temp, rbs } = body;
    
    if (!patient_id) {
      return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
    }

    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO vitals (patient_id, bp_systolic, bp_diastolic, pulse, temp, rbs) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, bp_systolic, bp_diastolic, pulse, temp, rbs]
    );
    connection.release();

    const insertId = (result as any).insertId;
    const [rows] = await connection.query('SELECT * FROM vitals WHERE id = ?', [insertId]);
    
    return NextResponse.json({ message: 'Vitals added successfully', vital: (rows as any)[0] }, { status: 201 });

  } catch (error) {
    console.error('Error adding vitals:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
