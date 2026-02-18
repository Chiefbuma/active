import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name } = await req.json();
    await db.query('UPDATE emergency_technicians SET name = ? WHERE id = ?', [name, params.id]);
    const [rows] = await db.query('SELECT id, name FROM emergency_technicians WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Technician updated successfully', technician: (rows as any)[0] });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.query('DELETE FROM emergency_technicians WHERE id = ?', [params.id]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
