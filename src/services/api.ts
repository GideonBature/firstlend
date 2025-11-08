/**
 * API Service - Centralized API communication layer
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5128/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

interface LoginRequest {
  emailOrUsername: string;
  password: string;
  userType: 'customer' | 'admin';
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    userId: string;
    email: string;
    fullName: string;
    userType: 'customer' | 'admin';
    status: string;
  };
}

interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterResponse {
  userId: string;
  email: string;
  fullName: string;
  userType: string;
}

interface CurrentUserResponse {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  userType: 'customer' | 'admin';
  status: string;
  emailVerified: boolean;
  createdAt: string;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization token if required
  if (requiresAuth) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401 && requiresAuth) {
      // Try to refresh token
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        return fetchApi<T>(endpoint, options, requiresAuth);
      }
      // If refresh fails, clear auth data
      clearAuthData();
    }

    return {
      success: response.ok,
      message: data.message || (response.ok ? 'Success' : 'Error'),
      data: data.data,
      code: data.code,
      errors: data.errors,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
      code: 'NETWORK_ERROR',
    };
  }
}

/**
 * Authentication API calls
 */

export const authApi = {
  /**
   * Register a new user
   */
  async register(payload: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return fetchApi<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Login user
   */
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // Store tokens if login successful
    if (response.success && response.data) {
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<null>> {
    const response = await fetchApi<null>('/auth/logout', {
      method: 'POST',
    }, true);

    // Clear auth data regardless of response
    clearAuthData();

    return response;
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<ApiResponse<CurrentUserResponse>> {
    return fetchApi<CurrentUserResponse>('/auth/me', {
      method: 'GET',
    }, true);
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return {
        success: false,
        message: 'No refresh token available',
      };
    }

    const response = await fetchApi<{ token: string; refreshToken: string }>(
      '/auth/refresh-token',
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (response.success && response.data) {
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response;
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return fetchApi<null>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
    return fetchApi<null>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

/**
 * Helper functions
 */

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

export function getStoredUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function getUserType(): 'customer' | 'admin' | null {
  const user = getStoredUser();
  return user?.userType || null;
}

export function clearAuthData(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await authApi.refreshToken();
    return response.success;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

export default authApi;
