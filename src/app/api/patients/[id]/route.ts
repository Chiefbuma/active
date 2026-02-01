import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function getPatientWithRelations(patientId: string) {
  const connection = await db.getConnection();
  try {
    // Fetch patient with corporate info
    const [patientRows] = await connection.query(`
      SELECT p.*, c.name as corporate_name
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
    try {
        const patientId = params.id;
        const body = await request.json();
        const {
            first_name,
            middle_name,
            surname,
            dob,
            age,
            sex,
            phone,
            email,
            wellness_date,
            corporate_id
        } = body;

        // Basic validation
        if (!first_name || !surname || !sex || !wellness_date) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const connection = await db.getConnection();
        await connection.query(
            `UPDATE registrations SET 
                first_name = ?, 
                middle_name = ?, 
                surname = ?, 
                dob = ?, 
                age = ?, 
                sex = ?, 
                phone = ?, 
                email = ?, 
                wellness_date = ?, 
                corporate_id = ?
            WHERE id = ?`,
            [
                first_name,
                middle_name || null,
                surname,
                dob || null,
                age ? parseInt(age, 10) : null,
                sex,
                phone || null,
                email || null,
                wellness_date,
                (corporate_id && corporate_id !== 'null' && corporate_id !== '') ? parseInt(corporate_id, 10) : null,
                patientId
            ]
        );
        connection.release();

        const updatedPatient = await getPatientWithRelations(patientId);

        return NextResponse.json({ message: 'Patient updated successfully', patient: updatedPatient });

    } catch (error) {
        console.error('Error updating patient:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
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
