import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function getPatientWithRelations(patientId: string) {
  const connection = await db.getConnection();
  try {
    // Fetch patient with corporate info
    const [patientRows] = await connection.query(`
      SELECT p.*, c.name as corporate_name, c.wellness_date 
      FROM registrations p
      LEFT JOIN corporates c ON p.corporate_id = c.id
      WHERE p.id = ?
    `, [patientId]);

    if ((patientRows as any).length === 0) {
      return null;
    }
    const patient = (patientRows as any)[0];

    // Fetch related data
    const [vitals] = await connection.query('SELECT * FROM vitals WHERE registration_id = ? ORDER BY measured_at DESC', [patientId]);
    const [nutrition] = await connection.query('SELECT * FROM nutritions WHERE registration_id = ? ORDER BY created_at DESC', [patientId]);
    const [goals] = await connection.query('SELECT * FROM goals WHERE registration_id = ? ORDER BY created_at DESC', [patientId]);
    const [clinicals] = await connection.query('SELECT * FROM clinicals WHERE registration_id = ? ORDER BY created_at DESC', [patientId]);

    // Assemble the patient object
    return {
      ...patient,
      vitals,
      nutrition,
      goals,
      clinicals,
    };
  } finally {
    connection.release();
  }
}


export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const patient = await getPatientWithRelations(params.id);
    if (!patient) {
      return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching patient' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    // This would be for updating patient details, can be implemented later
    return NextResponse.json({ message: 'Method not implemented' }, { status: 501 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const connection = await db.getConnection();
        await connection.query('DELETE FROM registrations WHERE id = ?', [params.id]);
        connection.release();
        return NextResponse.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error deleting patient' }, { status: 500 });
    }
}
