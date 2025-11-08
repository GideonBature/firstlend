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
  phone?: string;
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
  register: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUserData: () => Promise<void>;
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

      if (response.data) {
        setUser(response.data.user);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register({
        fullName,
        email,
        phone,
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
          setUser({
            userId: response.data.userId,
            email: response.data.email,
            fullName: response.data.fullName,
            phone: response.data.phone,
            userType: response.data.userType,
            status: response.data.status,
            emailVerified: response.data.emailVerified,
            createdAt: response.data.createdAt,
          });
        }
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
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
