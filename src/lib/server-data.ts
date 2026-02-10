'use server';

import { db } from '@/lib/db';
import type { Ambulance } from '@/lib/types';

export async function getAmbulanceById(id: number): Promise<Ambulance | undefined> {
  try {
    const [rows] = await db.query('SELECT id, reg_no, fuel_cost, operation_cost, target, status, created_at FROM ambulances WHERE id = ?', [id]);
    return (rows as any)[0] as Ambulance | undefined;
  } catch (error) {
    console.error(`Failed to fetch ambulance ${id}:`, error);
    throw error;
  }
}
