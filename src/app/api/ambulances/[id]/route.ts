import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { reg_no, fuel_cost, operation_cost, target, status } = await req.json();
    await db.query(
      'UPDATE ambulances SET reg_no = ?, fuel_cost = ?, operation_cost = ?, target = ?, status = ? WHERE id = ?',
      [reg_no, fuel_cost, operation_cost, target, status, params.id]
    );
    const [rows] = await db.query('SELECT * FROM ambulances WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Ambulance updated successfully', ambulance: (rows as any)[0] });
  } catch (error) {
    console.error(error);
    if ((error as any).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'An ambulance with this registration number already exists.' }, { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.query('DELETE FROM ambulances WHERE id = ?', [params.id]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
