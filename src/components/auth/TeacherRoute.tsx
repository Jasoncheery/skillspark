import { ReactNode } from 'react';
import { ProtectedRoute } from './ProtectedRoute';

interface TeacherRouteProps {
  children: ReactNode;
}

export const TeacherRoute = ({ children }: TeacherRouteProps) => {
  return (
    <ProtectedRoute requireAuth allowedRoles={['admin', 'teacher']}>
      {children}
    </ProtectedRoute>
  );
};

