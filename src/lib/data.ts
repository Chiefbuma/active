import type { Transaction, Ambulance, Driver, EmergencyTechnician, User } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchFromAPI(endpoint: string) {
  const res = await fetch(`${API_URL}/${endpoint}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return res.json();
}

export async function getTransactions(): Promise<Transaction[]> {
  return fetchFromAPI('transactions');
}

export async function getAmbulances(): Promise<Ambulance[]> {
  return fetchFromAPI('ambulances');
}

export async function getAmbulanceById(id: number): Promise<Ambulance | undefined> {
  return fetchFromAPI(`ambulances/${id}`);
}

export async function getTransactionsByAmbulanceId(ambulanceId: number): Promise<Transaction[]> {
  return fetchFromAPI(`transactions?ambulanceId=${ambulanceId}`);
}

export async function getDrivers(): Promise<Driver[]> {
  return fetchFromAPI('drivers');
}

export async function getEmergencyTechnicians(): Promise<EmergencyTechnician[]> {
  return fetchFromAPI('emergency-technicians');
}

export async function getUsers(): Promise<User[]> {
  return fetchFromAPI('users');
}
