import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, profile, loading, initialized } = useAuthStore();
  const location = useLocation();

  // Wait for auth to initialize
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required
  if (allowedRoles && allowedRoles.length > 0) {
    if (!profile || !allowedRoles.includes(profile.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

