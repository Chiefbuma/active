import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT id, name, email, role FROM users WHERE id = ?', [params.id]);
    connection.release();

    if ((rows as any).length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json((rows as any)[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email, role, password } = await request.json();
    if (!name || !email || !role) {
      return NextResponse.json({ message: 'Missing required fields (name, email, role)' }, { status: 400 });
    }

    const connection = await db.getConnection();

    if (password) {
      // If password is provided, hash it and update it
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.query(
        'UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?',
        [name, email, role, hashedPassword, params.id]
      );
    } else {
      // If password is not provided, update other fields
      await connection.query(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [name, email, role, params.id]
      );
    }
    
    const [rows] = await connection.query('SELECT id, name, email, role FROM users WHERE id = ?', [params.id]);
    connection.release();

    if ((rows as any).length === 0) {
      return NextResponse.json({ message: 'User not found after update' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully', user: (rows as any)[0] });
  } catch (error) {
    console.error(error);
    if ((error as any).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await db.getConnection();
    await connection.query('DELETE FROM users WHERE id = ?', [params.id]);
    connection.release();
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}
