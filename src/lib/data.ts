import type { Transaction, Ambulance, Driver, EmergencyTechnician, User } from '@/lib/types';

// This is a placeholder for a real API URL.
// In a real app, you'd set this in your environment variables.
const API_URL = '/api';

async function fetchFromAPI(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, options);
    if (!res.ok) {
        // Try to parse the error message from the response body
        const errorBody = await res.json().catch(() => ({ message: `Request failed with status ${res.status}` }));
        throw new Error(errorBody.message);
    }
    // Handle 204 No Content response
    if (res.status === 204) {
        return null;
    }
    return res.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    // Re-throw the error so the calling component can handle it
    throw error;
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  return fetchFromAPI('transactions');
}

export async function getAmbulances(): Promise<Ambulance[]> {
  return fetchFromAPI('ambulances');
}

export async function getAmbulanceById(id: number): Promise<Ambulance | undefined> {
  const ambulances = await getAmbulances();
  return ambulances.find(a => a.id === id);
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
