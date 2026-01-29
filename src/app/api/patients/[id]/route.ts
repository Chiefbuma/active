import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function getPatientWithRelations(patientId: string) {
  const connection = await db.getConnection();
  try {
    // Fetch patient
    const [patientRows] = await connection.query('SELECT * FROM patients WHERE id = ?', [patientId]);
    if ((patientRows as any).length === 0) {
      return null;
    }
    const patient = (patientRows as any)[0];

    // Fetch related data
    const [vitals] = await connection.query('SELECT * FROM vitals WHERE patient_id = ? ORDER BY measured_at DESC', [patientId]);
    const [nutrition] = await connection.query('SELECT * FROM nutrition WHERE patient_id = ? ORDER BY created_at DESC', [patientId]);
    const [goals] = await connection.query('SELECT * FROM goals WHERE patient_id = ? ORDER BY created_at DESC', [patientId]);
    const [clinical] = await connection.query('SELECT * FROM clinical_reviews WHERE patient_id = ? ORDER BY created_at DESC', [patientId]);

    // Assemble the patient object
    return {
      ...patient,
      vitals,
      nutrition,
      goals,
      clinical,
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
        await connection.query('DELETE FROM patients WHERE id = ?', [params.id]);
        connection.release();
        return NextResponse.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error deleting patient' }, { status: 500 });
    }
}
