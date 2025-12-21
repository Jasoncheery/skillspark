import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { TeacherDashboard } from '@/pages/dashboard/TeacherDashboard';
import { StudentDashboard } from '@/pages/dashboard/StudentDashboard';
import { AdminDashboard } from '@/pages/dashboard/AdminDashboard';
import { AIToolsPage } from '@/pages/AIToolsPage';
import { AIToolDetailPage } from '@/pages/AIToolDetailPage';
import { LessonsPage } from '@/pages/LessonsPage';
import { LessonDetailPage } from '@/pages/LessonDetailPage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { DynamicPage } from '@/pages/DynamicPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { TeacherRoute } from '@/components/auth/TeacherRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* AI Tools Routes */}
      <Route path="/ai-tools" element={<AIToolsPage />} />
      <Route path="/ai-tools/:slug" element={<AIToolDetailPage />} />
      
      {/* Lessons Routes */}
      <Route path="/lessons" element={<LessonsPage />} />
      <Route path="/lessons/online" element={<LessonsPage type="online" />} />
      <Route path="/lessons/offline" element={<LessonsPage type="offline" />} />
      <Route path="/lessons/:id" element={<LessonDetailPage />} />
      
      {/* Blog Routes */}
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard/teacher"
        element={
          <TeacherRoute>
            <TeacherDashboard />
          </TeacherRoute>
        }
      />
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      
      {/* Dynamic Pages (catch custom pages, must be last before 404) */}
      <Route path="/:slug" element={<DynamicPage />} />
      
      {/* Catch-all route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p>Page Not Found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
