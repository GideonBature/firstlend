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
  address?: string;
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
  phoneNumber?: string;
  address?: string;
  userType: string; // "Customer" or "Admin" from backend
  status: string; // "Active", "Inactive", etc.
  emailVerified?: boolean;
  createdAt?: string;
}

interface UpdateProfileRequest {
  address?: string;
  phoneNumber?: string;
  fullName?: string;
}

/**
 * Loan API Types
 */
interface LoanType {
  id: string;
  name: string;
  description?: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  minDuration: number;
  maxDuration: number;
  isActive: boolean;
}

interface MyLoansResponse {
  loans: LoanResponse[];
  total: number;
  page: number;
  pageSize: number;
}

interface CreateLoanRequest {
  loanTypeName: string;
  principal: number;
  rate?: number;
  term: number;
  employmentStatus: string;
  monthlyIncome: number;
  purpose: string;
}

interface LoanResponse {
  id: string;
  borrowerId: string;
  borrowerName: string;
  borrowerEmail: string;
  loanTypeId: string;
  loanTypeName: string;
  loanTypeInterest: number;
  status: string;
  principal: number;
  rate: number;
  term: number;
  outstandingBalance: number;
  amountDue: number;
  employmentStatus: string;
  monthlyIncome: number;
  purpose: string;
  nextPaymentDate: string;
  createdAt: string;
  dueAt: string;
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

    // Check if the response is already wrapped (has success/data properties)
    // or if it's a direct data response
    const isWrapped = typeof data === 'object' && data !== null && 'data' in data;

    return {
      success: response.ok,
      message: data.message || (response.ok ? 'Success' : 'Error'),
      data: isWrapped ? data.data : (response.ok ? data : undefined),
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

  /**
   * Change password for authenticated user
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    return fetchApi<null>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }, true);
  },

  /**
   * Update user profile
   */
  async updateProfile(payload: UpdateProfileRequest): Promise<ApiResponse<CurrentUserResponse>> {
    return fetchApi<CurrentUserResponse>('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, true);
  },
};

/**
 * Loan API calls
 */
export const loanApi = {
  /**
   * Apply for a new loan
   */
  async applyLoan(payload: CreateLoanRequest): Promise<ApiResponse<LoanResponse>> {
    return fetchApi<LoanResponse>('/loan', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },

  /**
   * Get loan types available
   */
  async getLoanTypes(page: number = 1, pageSize: number = 50): Promise<ApiResponse<LoanType[]>> {
    return fetchApi<LoanType[]>(`/loantype?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    }, true);
  },

  /**
   * Get user's loans
   */
  async getMyLoans(params?: { page?: number; pageSize?: number }): Promise<ApiResponse<LoanResponse[]>> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    return fetchApi<LoanResponse[]>(`/Loan/my-loans?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    }, true);
  },

  /**
   * Get loan details
   */
  async getLoanDetails(loanId: string): Promise<ApiResponse<any>> {
    return fetchApi<any>(`/loan/${loanId}`, {
      method: 'GET',
    }, true);
  },
};

/**
 * Admin API Types
 */
interface AdminLoansParams {
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

interface AdminLoansResponse {
  success: boolean;
  message: string;
  code: string;
  data: LoanResponse[];
  errors: null;
  totalCount: number;
  page: number;
  pageSize: number;
}

interface RejectLoanRequest {
  reason: string;
}

/**
 * Admin API calls
 */
export const adminApi = {
  /**
   * Get all loan applications (admin only)
   */
  async getLoans(params?: AdminLoansParams): Promise<AdminLoansResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy || 'date');
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder || 'desc');
    queryParams.append('page', String(params?.page || 1));
    queryParams.append('pageSize', String(params?.pageSize || 10));

    const response = await fetch(`${API_BASE_URL}/admin/loans?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    return response.json();
  },

  /**
   * Approve a loan application
   */
  async approveLoan(loanId: string): Promise<ApiResponse<void>> {
    return fetchApi<void>(`/admin/loans/${loanId}/approve`, {
      method: 'PUT',
    }, true);
  },

  /**
   * Reject a loan application
   */
  async rejectLoan(loanId: string, reason: string): Promise<ApiResponse<void>> {
    return fetchApi<void>(`/admin/loans/${loanId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }, true);
  },
};

/**
 * Payment API Types
 */
interface InitiatePaymentRequest {
  loanId: string;
  amount: number;
}

interface InitiatePaymentResponse {
  success: boolean;
  message: string;
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  amount: number;
  status: string;
  reference: string;
  paidAt: string;
  channel: string;
}

export interface PaymentHistoryRecord {
  id: string;
  transactionId: string;
  loanId: string;
  loanReference: string;
  amount: number;
  principal: number;
  interest: number;
  method: string;
  status: string;
  createdAt: string;
}

/**
 * Payment API calls
 */
export const paymentApi = {
  /**
   * Initialize a payment with Paystack
   */
  async initializePayment(payload: InitiatePaymentRequest): Promise<ApiResponse<InitiatePaymentResponse>> {
    return fetchApi<InitiatePaymentResponse>('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, true);
  },

  /**
   * Verify a payment
   */
  async verifyPayment(reference: string): Promise<ApiResponse<VerifyPaymentResponse>> {
    return fetchApi<VerifyPaymentResponse>(`/payments/verify/${reference}`, {
      method: 'GET',
    }, true);
  },

  /**
   * Get payment history
   */
  async getPaymentHistory(params?: { page?: number; pageSize?: number; loanId?: string }): Promise<ApiResponse<PaymentHistoryRecord[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.pageSize) queryParams.append('pageSize', String(params.pageSize));
    if (params?.loanId) queryParams.append('loanId', params.loanId);
    
    const queryString = queryParams.toString();
    const endpoint = `/payment-history${queryString ? `?${queryString}` : ''}`;
    
    return fetchApi<PaymentHistoryRecord[]>(endpoint, {
      method: 'GET',
    }, true);
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

// Export types for use in components
export type { 
  LoanType, 
  LoanResponse, 
  CreateLoanRequest, 
  MyLoansResponse, 
  AdminLoansParams, 
  AdminLoansResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  VerifyPaymentResponse
};
