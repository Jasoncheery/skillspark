'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { classService, assignmentService } from '@/services';
import { StrapiEntity, Class, Assignment } from '@/types/strapi';

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = Number(params.id);

  const [classData, setClassData] = useState<StrapiEntity<Class> | null>(null);
  const [assignments, setAssignments] = useState<StrapiEntity<Assignment>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classResponse, assignmentsResponse] = await Promise.all([
          classService.getById(classId),
          assignmentService.getByClass(classId),
        ]);
        setClassData(classResponse.data);
        setAssignments(assignmentsResponse.data);
      } catch (err) {
        setError('Failed to load class details');
        console.error('Error fetching class:', err);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchData();
    }
  }, [classId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-xl text-destructive mb-4">{error || 'Class not found'}</p>
          <Link href="/lessons" className="text-primary hover:text-primary/80">
            ← Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/lessons" className="text-primary hover:text-primary/80 mb-6 inline-block">
          ← Back to Classes
        </Link>

        <div className="bg-card rounded-xl shadow-lg p-8 mb-8 border-2 border-border">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">
            {classData.attributes.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {classData.attributes.description || 'No description available'}
          </p>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{classData.attributes.students?.length || 0} students enrolled</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{assignments.length} assignments</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Assignments</h2>
          {assignments.length === 0 ? (
            <div className="bg-card rounded-xl shadow-md p-8 text-center border-2 border-border">
              <p className="text-muted-foreground">No assignments yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-card rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-2 border-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {assignment.attributes.title}
                      </h3>
                      <div
                        className="text-muted-foreground mb-4 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: assignment.attributes.description || '' }}
                      />
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        {assignment.attributes.dueDate && (
                          <span>
                            Due: {new Date(assignment.attributes.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span>
                          {assignment.attributes.submissions?.length || 0} submissions
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/assignments/${assignment.id}`}
                      className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
