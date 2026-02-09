import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name } = await req.json();
    await db.query('UPDATE drivers SET name = ? WHERE id = ?', [name, params.id]);
    const [rows] = await db.query('SELECT * FROM drivers WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Driver updated successfully', driver: (rows as any)[0] });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.query('DELETE FROM drivers WHERE id = ?', [params.id]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
