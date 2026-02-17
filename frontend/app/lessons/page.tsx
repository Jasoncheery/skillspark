'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { classService } from '@/services';
import { StrapiEntity, Class } from '@/types/strapi';

export default function LessonsPage() {
  const [classes, setClasses] = useState<StrapiEntity<Class>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classService.getAll();
        setClasses(response.data);
      } catch (err) {
        setError('Failed to load classes');
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-neutral-900 mb-4">
            Explore Our Classes
          </h1>
          <p className="text-xl text-neutral-600">
            Join engaging online courses and offline workshops
          </p>
        </div>

        {error && (
          <div className="bg-error-100 border border-error-400 text-error-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {classes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-600">No classes available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Link
                key={classItem.id}
                href={`/lessons/${classItem.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {classItem.attributes.name}
                  </h3>
                  <p className="text-neutral-600 mb-4 line-clamp-3">
                    {classItem.attributes.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-neutral-500">
                    <span>
                      {classItem.attributes.students?.length || 0} students
                    </span>
                    <span>
                      {classItem.attributes.assignments?.length || 0} assignments
                    </span>
                  </div>
                </div>
                <div className="bg-primary-50 px-6 py-3 group-hover:bg-primary-100 transition-colors">
                  <span className="text-primary-700 font-medium">View Class →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
