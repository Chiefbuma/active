import { executeQuery } from '@/lib/db-helpers';
import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name } = await req.json();
    await executeQuery('UPDATE emergency_technicians SET name = ? WHERE id = ?', [name, params.id]);
    const rows = await executeQuery<RowDataPacket[]>('SELECT id, name FROM emergency_technicians WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Technician updated successfully', technician: rows[0] });
  } catch (error) {
    console.error("Caught error in PUT /api/emergency-technicians/[id]:", error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await executeQuery('DELETE FROM emergency_technicians WHERE id = ?', [params.id]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Caught error in DELETE /api/emergency-technicians/[id]:", error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
