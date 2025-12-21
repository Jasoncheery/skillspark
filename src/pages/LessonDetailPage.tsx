import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Video, CheckCircle, Play } from 'lucide-react';
import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { lessonsService } from '../services/lessonsService';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';
import ReactPlayer from 'react-player';

export const LessonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonsService.getById(id!),
    enabled: !!id,
  });

  const { data: content = [] } = useQuery({
    queryKey: ['lesson-content', id],
    queryFn: () => lessonsService.getContent(id!),
    enabled: !!id && !!lesson,
  });

  const { data: registration } = useQuery({
    queryKey: ['lesson-registration', id, user?.id],
    queryFn: () => lessonsService.getRegistration(id!, user?.id || ''),
    enabled: !!id && !!user,
  });

  const registerMutation = useMutation({
    mutationFn: () => lessonsService.register(id!, user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-registration', id, user?.id] });
    },
  });

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await registerMutation.mutateAsync();
  };

  if (lessonLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!lesson) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="heading-2 mb-4">課程未找到</h1>
          <Link to="/lessons" className="btn-primary inline-flex items-center">
            <ArrowLeft className="mr-2 w-5 h-5" />
            返回課程列表
          </Link>
        </div>
      </Layout>
    );
  }

  const isRegistered = !!registration;
  const canAccessContent = isRegistered && (lesson.lesson_type === 'online' || lesson.lesson_type === 'hybrid');

  return (
    <Layout>
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/lessons"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回課程列表
            </Link>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="heading-1 mb-4">{lesson.title}</h1>
                {lesson.title_chinese && (
                  <p className="text-2xl text-gray-600 mb-6">{lesson.title_chinese}</p>
                )}
                {lesson.description && (
                  <div className="text-body-lg text-gray-700 whitespace-pre-line mb-6">
                    {lesson.description}
                  </div>
                )}
                <div className="flex flex-wrap gap-4 mb-6">
                  {lesson.duration_minutes && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{lesson.duration_minutes} 分鐘</span>
                    </div>
                  )}
                  {lesson.difficulty_level && (
                    <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {lesson.difficulty_level === 'beginner' ? '初級' : 
                       lesson.difficulty_level === 'intermediate' ? '中級' : '高級'}
                    </div>
                  )}
                  {lesson.price !== null && (
                    <div className="text-2xl font-bold text-primary-600">
                      {lesson.price === 0 ? '免費' : `$${lesson.price}`}
                    </div>
                  )}
                </div>
                {lesson.lesson_type === 'offline' && lesson.location && (
                  <div className="flex items-center space-x-2 text-gray-600 mb-4">
                    <MapPin className="w-5 h-5" />
                    <span>{lesson.location}</span>
                  </div>
                )}
                {lesson.start_date && (
                  <div className="flex items-center space-x-2 text-gray-600 mb-6">
                    <Calendar className="w-5 h-5" />
                    <span>{format(new Date(lesson.start_date), 'yyyy年MM月dd日')}</span>
                  </div>
                )}
                {!isRegistered && (
                  <button
                    onClick={handleRegister}
                    disabled={registerMutation.isPending}
                    className="btn-primary"
                  >
                    {registerMutation.isPending ? '註冊中...' : '立即註冊'}
                  </button>
                )}
                {isRegistered && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">已註冊</span>
                  </div>
                )}
              </div>
              {lesson.cover_image_url && (
                <div className="lg:col-span-1">
                  <img
                    src={lesson.cover_image_url}
                    alt={lesson.title}
                    className="w-full rounded-xl shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {canAccessContent && content.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="heading-2 mb-8">課程內容</h2>
            <div className="space-y-6">
              {content.map((item) => (
                <div key={item.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="heading-3 mb-2">{item.title}</h3>
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                        {item.content_type}
                      </span>
                    </div>
                    {item.is_required && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        必讀
                      </span>
                    )}
                  </div>
                  {item.content_type === 'video' && item.video_url && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4">
                      <ReactPlayer
                        url={item.video_url}
                        width="100%"
                        height="100%"
                        controls
                      />
                    </div>
                  )}
                  {item.content && (
                    <div className="text-body whitespace-pre-line">{item.content}</div>
                  )}
                  {item.material_urls && item.material_urls.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">相關材料：</h4>
                      <div className="space-y-2">
                        {item.material_urls.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-primary-600 hover:text-primary-700"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!canAccessContent && isRegistered && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="card text-center">
              <p className="text-body-lg text-gray-600">
                {lesson.lesson_type === 'offline'
                  ? '此為線下工作坊，請在指定時間和地點參加。'
                  : '課程內容將在開始後開放。'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

