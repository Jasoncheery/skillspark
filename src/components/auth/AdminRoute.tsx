import { ReactNode } from 'react';
import { ProtectedRoute } from './ProtectedRoute';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  return (
    <ProtectedRoute requireAuth allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
};

