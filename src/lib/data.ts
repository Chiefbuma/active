import type { Transaction, Ambulance, Driver, EmergencyTechnician, User } from '@/lib/types';

// Get the API URL based on environment
const getApiUrl = () => {
  // For client-side requests, use a relative path.
  if (typeof window !== 'undefined') {
    return '/api';
  }

  // For server-side requests, use the absolute URL from the environment variable.
  // This is crucial for environments like yours (Passenger) where the app
  // needs to call its own public-facing API.
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Fallback for local development.
  return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

async function fetchFromAPI(endpoint: string, options?: RequestInit) {
  try {
    const fullUrl = `${API_URL}/${endpoint}`;
    console.log(`Attempting to fetch from API: ${fullUrl}`);
    const res = await fetch(fullUrl, { ...options, cache: 'no-store' });
    
    if (!res.ok) {
        // Try to parse the error message from the response body
        const errorBody = await res.json().catch(() => ({ message: `Request failed with status ${res.status}` }));
        console.error(`API response not OK for ${fullUrl}. Status: ${res.status}. Body:`, errorBody);
        throw new Error(errorBody.message);
    }
    
    console.log(`Successfully fetched from API: ${fullUrl}`);
    
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

export async function getAmbulanceById(id: number): Promise<Ambulance> {
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
