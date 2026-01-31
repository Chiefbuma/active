import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT id, name, email, role FROM users ORDER BY name ASC');
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, role, password } = await request.json();

    if (!name || !email || !role || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)',
      [name, email, role, hashedPassword]
    );

    const insertId = (result as any).insertId;
    const [rows] = await connection.query('SELECT id, name, email, role FROM users WHERE id = ?', [insertId]);
    connection.release();

    return NextResponse.json({ message: 'User added successfully', user: (rows as any)[0] }, { status: 201 });

  } catch (error) {
    console.error('Error adding user:', error);
    // Check for duplicate email error (ER_DUP_ENTRY)
    if ((error as any).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: 'User IDs are required' }, { status: 400 });
        }

        const connection = await db.getConnection();
        const query = 'DELETE FROM users WHERE id IN (?)';
        await connection.query(query, [ids]);
        connection.release();

        return NextResponse.json({ message: 'Users deleted successfully' });
    } catch (error) {
        console.error('Error deleting users:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
