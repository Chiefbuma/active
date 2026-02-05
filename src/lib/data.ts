import { transactions, ambulances, drivers, medicalStaff, users } from '@/lib/mock-data';
import type { Transaction, Ambulance, Driver, MedicalStaff, User } from '@/lib/types';

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getTransactions(): Promise<Transaction[]> {
  await delay(300);
  return transactions;
}

export async function getAmbulances(): Promise<Ambulance[]> {
  await delay(300);
  return ambulances;
}

export async function getAmbulanceById(id: number): Promise<Ambulance | undefined> {
    await delay(100);
    return ambulances.find(a => a.id === id);
}

export async function getTransactionsByAmbulanceId(ambulanceId: number): Promise<Transaction[]> {
    await delay(200);
    return transactions.filter(t => t.ambulance.id === ambulanceId);
}

export async function getDrivers(): Promise<Driver[]> {
  await delay(300);
  return drivers;
}

export async function getMedicalStaff(): Promise<MedicalStaff[]> {
  await delay(300);
  return medicalStaff;
}

export async function getUsers(): Promise<User[]> {
  await delay(300);
  return users;
}
