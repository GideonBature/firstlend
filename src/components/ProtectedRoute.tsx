import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes: ('customer' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedUserTypes }) => {
  const { user, isLoading, userType } = useAuth();

  console.log('ProtectedRoute Debug:', {
    user: !!user,
    userType,
    isLoading,
    allowedUserTypes,
    userObject: user
  });

  // While loading, show a loading component
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.warn('ProtectedRoute: User not authenticated');
    const requiresAdminOnly = allowedUserTypes.includes('admin') && !allowedUserTypes.includes('customer');
    const redirectPath = requiresAdminOnly ? '/admin/login' : '/login';
    return <Navigate to={redirectPath} replace />;
  }

  // If user type is not allowed, redirect to appropriate dashboard
  if (userType && !allowedUserTypes.includes(userType)) {
    console.warn('ProtectedRoute: User type not allowed', { userType, allowedUserTypes });
    // Normalize to lowercase for comparison
    const normalizedUserType = userType.toLowerCase();
    if (normalizedUserType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  // If user is authenticated, show content (even if userType is not set yet)
  console.log('ProtectedRoute: Showing content');
  return <>{children}</>;
};
