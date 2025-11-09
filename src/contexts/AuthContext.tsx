/**
 * Authentication Context - Global state management for authentication
 * Provides auth state and methods to all components
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, getStoredUser, isAuthenticated, clearAuthData } from '@/services/api';

export interface User {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  userType: 'customer' | 'admin';
  status: string;
  emailVerified?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: 'customer' | 'admin' | null;
  error: string | null;
  login: (emailOrUsername: string, password: string, userType: 'customer' | 'admin') => Promise<void>;
  register: (fullName: string, email: string, phone: string, password: string, address?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUserData: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (address?: string, phoneNumber?: string, fullName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const storedUser = getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (emailOrUsername: string, password: string, userType: 'customer' | 'admin') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({
        emailOrUsername,
        password,
        userType,
      });

      if (!response.success) {
        setError(response.message || 'Login failed');
        throw new Error(response.message);
      }

      if (response.data && response.data.user) {
        // Ensure userType is lowercase for consistency
        const userData: User = {
          userId: response.data.user.userId,
          email: response.data.user.email,
          fullName: response.data.user.fullName,
          userType: response.data.user.userType?.toLowerCase() as 'customer' | 'admin',
          status: response.data.user.status?.toLowerCase() || 'active',
        };
        setUser(userData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, phone: string, password: string, address?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register({
        fullName,
        email,
        phone,
        address,
        password,
      });

      if (!response.success) {
        setError(response.message || 'Registration failed');
        throw new Error(response.message);
      }

      // Auto-login after successful registration (optional)
      // You can comment this out if you want users to manually login
      // await login(email, password, 'customer');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authApi.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Clear auth data anyway
      clearAuthData();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      if (isAuthenticated()) {
        const response = await authApi.getCurrentUser();
        if (response.success && response.data) {
          // Convert backend string values to lowercase for consistency
          const userType = response.data.userType?.toLowerCase() as 'customer' | 'admin';
          const status = response.data.status?.toLowerCase() || 'active';

          const userData = {
            userId: response.data.userId,
            email: response.data.email,
            fullName: response.data.fullName,
            phoneNumber: response.data.phoneNumber,
            address: response.data.address,
            userType: userType,
            status: status,
            emailVerified: response.data.emailVerified,
            createdAt: response.data.createdAt,
          };

          setUser(userData);
          
          // Also update localStorage
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.changePassword(currentPassword, newPassword);

      if (!response.success) {
        setError(response.message || 'Password change failed');
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password change failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (address?: string, phoneNumber?: string, fullName?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.updateProfile({
        address,
        phoneNumber,
        fullName,
      });

      if (!response.success || !response.data) {
        setError(response.message || 'Profile update failed');
        throw new Error(response.message);
      }

      // Update user state with new data
      const userType = response.data.userType?.toLowerCase() as 'customer' | 'admin';
      const status = response.data.status?.toLowerCase() || 'active';

      const userData: User = {
        userId: response.data.userId,
        email: response.data.email,
        fullName: response.data.fullName,
        phoneNumber: response.data.phoneNumber,
        address: response.data.address,
        userType: userType,
        status: status,
        emailVerified: response.data.emailVerified,
        createdAt: response.data.createdAt,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    userType: user?.userType || null,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUserData,
    changePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
