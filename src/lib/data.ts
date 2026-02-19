import type { Transaction, Ambulance, Driver, EmergencyTechnician, User } from '@/lib/types';
import { apiClient } from './api-client';

// All functions now use the apiClient. This centralizes the fetching logic.
// The component-facing function signatures remain the same.

export async function getTransactions(): Promise<Transaction[]> {
  return apiClient.get('/transactions');
}

export async function getAmbulances(): Promise<Ambulance[]> {
  return apiClient.get('/ambulances');
}

export async function getAmbulanceById(id: number): Promise<Ambulance> {
  return apiClient.get(`/ambulances/${id}`);
}

export async function getTransactionsByAmbulanceId(ambulanceId: number): Promise<Transaction[]> {
  return apiClient.get(`/transactions?ambulanceId=${ambulanceId}`);
}

export async function getDrivers(): Promise<Driver[]> {
  return apiClient.get('/drivers');
}

export async function getEmergencyTechnicians(): Promise<EmergencyTechnician[]> {
  return apiClient.get('/emergency-technicians');
}

export async function getUsers(): Promise<User[]> {
  return apiClient.get('/users');
}
