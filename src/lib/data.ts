import type { Transaction, Ambulance, Driver, EmergencyTechnician, User } from '@/lib/types';

// Get the API URL based on environment
// On the server: use full URL, on the client: use relative path
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const protocol = process.env.VERCEL_URL ? 'https' : 'http';
    return `${protocol}://${host}/api`;
  }
  // Client-side
  return '/api';
};

const API_URL = getApiUrl();

async function fetchFromAPI(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, { ...options, cache: 'no-store' });
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
