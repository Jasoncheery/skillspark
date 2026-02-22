'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService, classService } from '@/services';
import { StrapiUser, StrapiEntity, Class } from '@/types/strapi';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StrapiUser | null>(null);
  const [classes, setClasses] = useState<StrapiEntity<Class>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/auth/login');
          return;
        }

        setUser(currentUser);

        // Fetch user's classes
        const classesResponse = await classService.getAll();
        setClasses(classesResponse.data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-xl shadow-lg p-8 mb-8 border-2 border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-foreground mb-2">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl shadow-md p-6 border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">My Classes</p>
                <p className="text-3xl font-bold text-primary">{classes.length}</p>
              </div>
              <svg className="w-12 h-12 text-primary-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-md p-6 border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Assignments</p>
                <p className="text-3xl font-bold text-secondary">
                  {classes.reduce((acc, c) => acc + (c.attributes.assignments?.length || 0), 0)}
                </p>
              </div>
              <svg className="w-12 h-12 text-secondary-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-md p-6 border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Progress</p>
                <p className="text-3xl font-bold text-green-600">85%</p>
              </div>
              <svg className="w-12 h-12 text-success-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* My Classes */}
        <div className="bg-card rounded-xl shadow-lg p-8 mb-8 border-2 border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">My Classes</h2>
          {classes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You're not enrolled in any classes yet.</p>
              <Link
                href="/lessons"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Browse Classes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <Link
                  key={classItem.id}
                  href={`/lessons/${classItem.id}`}
                  className="border-2 border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all bg-card"
                >
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {classItem.attributes.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {classItem.attributes.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{classItem.attributes.assignments?.length || 0} assignments</span>
                    <span className="text-primary-600 font-medium">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Explore AI Tools</h3>
            <p className="mb-6">Discover the latest AI tools to enhance your learning experience.</p>
            <Link
              href="/ai-tools"
              className="inline-block px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-neutral-100 transition-colors font-medium"
            >
              Explore Now
            </Link>
          </div>

          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Read Our Blog</h3>
            <p className="mb-6">Stay updated with the latest insights on AI in education.</p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-white text-secondary-600 rounded-lg hover:bg-neutral-100 transition-colors font-medium"
            >
              Read Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
