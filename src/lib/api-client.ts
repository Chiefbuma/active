class ApiClient {
  private baseApiUrl: string;

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    // If baseUrl is 'http://domain.com/', remove trailing slash
    const cleanedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.baseApiUrl = `${cleanedBaseUrl}/api`;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
        console.error(`API Error: ${response.status}`, errorBody);
        throw new Error(errorBody.message || 'An API error occurred.');
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
  }

  async fetch(endpoint: string, options: RequestInit = {}) {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseApiUrl}${path}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-store'
    });

    return this.handleResponse(response);
  }

  get<T>(endpoint: string): Promise<T> {
    return this.fetch(endpoint, { method: 'GET' }) as Promise<T>;
  }

  post<T>(endpoint:string, data: any): Promise<T> {
    return this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<T>;
  }
  
  put<T>(endpoint: string, data: any): Promise<T> {
    return this.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }) as Promise<T>;
  }

  delete<T>(endpoint: string): Promise<T | null> {
    return this.fetch(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
