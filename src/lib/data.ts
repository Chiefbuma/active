import { db } from '@/lib/db';
import type { Patient, Corporate, User } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchPatients() {
  noStore(); // Opt out of caching for this dynamic data
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query(`
        SELECT p.*, c.name as corporate_name, c.wellness_date
        FROM registrations p
        LEFT JOIN corporates c ON p.corporate_id = c.id
        ORDER BY p.created_at DESC
    `);
    connection.release();
    return rows as Patient[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch patients.');
  }
}

export async function fetchPatientById(id: string) {
  noStore();
  try {
    const connection = await db.getConnection();
    const [patientRows] = await connection.query(`
      SELECT p.*, c.name as corporate_name, c.wellness_date
      FROM registrations p
      LEFT JOIN corporates c ON p.corporate_id = c.id
      WHERE p.id = ?
    `, [id]);

    if ((patientRows as any).length === 0) {
      return null;
    }
    const patient = (patientRows as any)[0] as Patient;

    // Fetch related data
    const [vitals] = await connection.query('SELECT * FROM vitals WHERE registration_id = ? ORDER BY measured_at DESC', [id]);
    const [nutrition] = await connection.query('SELECT * FROM nutritions WHERE registration_id = ? ORDER BY created_at DESC', [id]);
    const [goals] = await connection.query('SELECT * FROM goals WHERE registration_id = ? ORDER BY created_at DESC', [id]);
    const [clinicals] = await connection.query('SELECT * FROM clinicals WHERE registration_id = ? ORDER BY created_at DESC', [id]);
    connection.release();

    patient.vitals = vitals as any[];
    patient.nutrition = nutrition as any[];
    patient.goals = goals as any[];
    patient.clinicals = clinicals as any[];

    return patient;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch patient.');
  }
}

export async function fetchCorporates() {
  noStore();
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM corporates ORDER BY name ASC');
    connection.release();
    return rows as Corporate[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch corporates.');
  }
}

export async function fetchUsers() {
  noStore();
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT id, name, email, role FROM users ORDER BY name ASC');
    connection.release();
    return rows as User[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}
