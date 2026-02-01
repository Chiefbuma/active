import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query(`
        SELECT p.*, c.name as corporate_name
        FROM registrations p
        LEFT JOIN corporates c ON p.corporate_id = c.id
        ORDER BY p.created_at DESC
    `);
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { first_name, middle_name, surname, dob, age, sex, phone, email, wellness_date, corporate_id } = body;

        // Basic validation
        if (!first_name || !surname || !sex || !wellness_date) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const connection = await db.getConnection();
        const [result] = await connection.query(
            'INSERT INTO registrations (first_name, middle_name, surname, dob, sex, age, phone, email, wellness_date, corporate_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, middle_name, surname, dob || null, sex, age || null, phone, email, wellness_date, corporate_id || null]
        );
        connection.release();

        const insertId = (result as any).insertId;

        return NextResponse.json({ message: 'Patient registered successfully', patientId: insertId }, { status: 201 });
    } catch (error) {
        console.error('Error creating patient:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: 'Patient IDs are required' }, { status: 400 });
        }

        const connection = await db.getConnection();
        const query = 'DELETE FROM registrations WHERE id IN (?)';
        await connection.query(query, [ids]);
        connection.release();

        return NextResponse.json({ message: 'Patients deleted successfully' });
    } catch (error) {
        console.error('Error deleting patients:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
