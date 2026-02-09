import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM ambulances ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { reg_no, fuel_cost, operation_cost, target, status } = await req.json();
    const [result] = await db.query(
      'INSERT INTO ambulances (reg_no, fuel_cost, operation_cost, target, status) VALUES (?, ?, ?, ?, ?)',
      [reg_no, fuel_cost, operation_cost, target, status]
    );
    const insertId = (result as any).insertId;
    const [rows] = await db.query('SELECT * FROM ambulances WHERE id = ?', [insertId]);
    return NextResponse.json({ message: 'Ambulance created successfully', ambulance: (rows as any)[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
     if ((error as any).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'An ambulance with this registration number already exists.' }, { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
