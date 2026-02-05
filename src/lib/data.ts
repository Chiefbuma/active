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
