import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM ambulances');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { reg_no, fuel_cost, operation_cost, target, status } = await req.json();
    await db.query('INSERT INTO ambulances (reg_no, fuel_cost, operation_cost, target, status) VALUES (?, ?, ?, ?, ?)', [reg_no, fuel_cost, operation_cost, target, status]);
    return new NextResponse('Ambulance created successfully', { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
