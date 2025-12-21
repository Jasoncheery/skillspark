import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { lessonsService } from '../../services/lessonsService';
import { LessonAdminForm } from '../lessons/LessonAdminForm';
import type { Lesson } from '../../types/database';

export const AdminLessons = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['admin-lessons'],
    queryFn: () => lessonsService.getAll({ includeUnpublished: true }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => lessonsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
    },
  });

  const filteredLessons = lessons.filter(lesson => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return lesson.title.toLowerCase().includes(query);
  });

  const handleSubmit = async (data: any) => {
    try {
      // Convert empty date strings to null
      const processedData = {
        ...data,
        registration_deadline: data.registration_deadline || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        instructor_id: data.instructor_id || null,
        price: data.price || null,
        duration_minutes: data.duration_minutes || null,
        max_participants: data.max_participants || null,
      };

      if (editingLesson) {
        await lessonsService.update(editingLesson.id, processedData);
      } else {
        await lessonsService.create(processedData);
      }
      setShowForm(false);
      setEditingLesson(null);
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
    } catch (error: any) {
      console.error('Error saving lesson:', error);
      alert(error.message || '儲存失敗，請稍後再試');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">課程管理</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          新增課程
        </button>
      </div>

      {showForm && (
        <div className="card">
          <LessonAdminForm
            lesson={editingLesson || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingLesson(null);
            }}
          />
        </div>
      )}

      <div className="card">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜尋課程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">載入中...</div>
        ) : (
          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{lesson.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>類型: {lesson.lesson_type}</span>
                      {lesson.price !== null && <span>價格: ${lesson.price}</span>}
                      <span className={lesson.is_published ? 'text-green-600' : 'text-gray-500'}>
                        {lesson.is_published ? '已發布' : '未發布'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingLesson(lesson);
                        setShowForm(true);
                      }}
                      className="p-2 text-gray-600 hover:text-primary-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('確定要刪除此課程嗎？')) {
                          deleteMutation.mutate(lesson.id);
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

