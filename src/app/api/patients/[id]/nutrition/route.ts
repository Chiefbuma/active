import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: registration_id } = params;
    const body = await request.json();
    
    const { height, weight, visceral_fat, body_fat_percent, notes_nutritionist } = body;
    
    if (!registration_id) {
      return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
    }

    let bmi = null;
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
      bmi = parseFloat(bmi.toFixed(1));
    }
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO nutritions (registration_id, height, weight, bmi, visceral_fat, body_fat_percent, notes_nutritionist) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [registration_id, height, weight, bmi, visceral_fat, body_fat_percent, notes_nutritionist]
    );
    
    const insertId = (result as any).insertId;
    const [rows] = await connection.query('SELECT * FROM nutritions WHERE id = ?', [insertId]);
    connection.release();

    return NextResponse.json({ message: 'Nutrition record added successfully', nutrition: (rows as any)[0] }, { status: 201 });

  } catch (error) {
    console.error('Error adding nutrition record:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
