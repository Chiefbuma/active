import { transactions, ambulances, drivers, medicalStaff, users } from '@/lib/mock-data';
import type { Transaction, Ambulance, Driver, MedicalStaff, User } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getTransactions(): Promise<Transaction[]> {
  noStore();
  await delay(300);
  return transactions;
}

export async function getAmbulances(): Promise<Ambulance[]> {
  noStore();
  await delay(300);
  return ambulances;
}

export async function getDrivers(): Promise<Driver[]> {
  noStore();
  await delay(300);
  return drivers;
}

export async function getMedicalStaff(): Promise<MedicalStaff[]> {
  noStore();
  await delay(300);
  return medicalStaff;
}

export async function getUsers(): Promise<User[]> {
  noStore();
  await delay(300);
  return users;
}
