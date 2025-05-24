import { getAccessToken } from '@/lib/auth/authStore';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * A utility for making API requests to our backend
 */
class ApiClient {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const headers = this.getHeaders();
      const response = await fetch(url, { headers });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API GET error:', error);
      return { status: 500, error: 'Network error' };
    }
  }

  async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const headers = this.getHeaders();
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API POST error:', error);
      return { status: 500, error: 'Network error' };
    }
  }

  async patch<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const headers = this.getHeaders();
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data)
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API PATCH error:', error);
      return { status: 500, error: 'Network error' };
    }
  }

  async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const headers = this.getHeaders();
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API PUT error:', error);
      return { status: 500, error: 'Network error' };
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const headers = this.getHeaders();
      const response = await fetch(url, {
        method: 'DELETE',
        headers
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API DELETE error:', error);
      return { status: 500, error: 'Network error' };
    }
  }

  async downloadFile(url: string): Promise<{ blob?: Blob; error?: string; status: number }> {
    try {
      const headers = this.getHeaders();
      const response = await fetch(url, { headers });
      
      if (response.ok) {
        const blob = await response.blob();
        return { blob, status: response.status };
      } else {
        const text = await response.text();
        return { error: text || 'Download failed', status: response.status };
      }
    } catch (error) {
      console.error('API download error:', error);
      return { status: 500, error: 'Network error' };
    }
  }

  private getHeaders(): HeadersInit {
    const token = getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      
      // Add user ID from token if possible (for server-side compatibility)
      try {
        // Extract user ID from JWT token if available
        // This is a cleaner approach than trying to access Zustand store
        // which may not be available in all contexts
        if (token && typeof window !== 'undefined') {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            try {
              const payload = JSON.parse(atob(tokenParts[1]));
              if (payload && payload.userId) {
                headers['X-User-ID'] = payload.userId;
              }
            } catch {
              // Silent fail if token parsing fails
            }
          }
        }
      } catch {
        // Don't log anything to avoid console spam
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const status = response.status;
    
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        
        if (response.ok) {
          return { data: json, status };
        } else {
          return { error: json.error || 'Unknown error', status };
        }
      } else {
        const text = await response.text();
        return {
          error: response.ok ? undefined : text || 'Unknown error',
          status
        };
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      return { status, error: 'Failed to parse server response' };
    }
  }
}

export const api = new ApiClient();
