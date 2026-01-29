import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM corporates WHERE id = ?', [params.id]);
    connection.release();

    if ((rows as any).length === 0) {
      return NextResponse.json({ message: 'Corporate not found' }, { status: 404 });
    }

    return NextResponse.json((rows as any)[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching corporate' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, wellness_date } = await request.json();
    if (!name || !wellness_date) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const connection = await db.getConnection();
    await connection.query(
      'UPDATE corporates SET name = ?, wellness_date = ? WHERE id = ?',
      [name, wellness_date, params.id]
    );
    
    const [rows] = await connection.query('SELECT * FROM corporates WHERE id = ?', [params.id]);
    connection.release();

    if ((rows as any).length === 0) {
      return NextResponse.json({ message: 'Corporate not found after update' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Corporate updated successfully', corporate: (rows as any)[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating corporate' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await db.getConnection();
    // The schema has ON DELETE CASCADE, so the database will handle deleting associated registrations (patients).
    await connection.query('DELETE FROM corporates WHERE id = ?', [params.id]);
    connection.release();
    return NextResponse.json({ message: 'Corporate deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting corporate' }, { status: 500 });
  }
}
