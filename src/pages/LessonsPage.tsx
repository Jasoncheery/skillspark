import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Video, BookOpen, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { lessonsService } from '../services/lessonsService';
import type { LessonType } from '../types/database';
import { format } from 'date-fns';

interface LessonsPageProps {
  type?: LessonType;
}

export const LessonsPage = ({ type: propType }: LessonsPageProps) => {
  const [searchParams] = useSearchParams();
  const type = propType || (searchParams.get('type') as LessonType) || undefined;
  const [searchQuery, setSearchQuery] = useState('');

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons', type],
    queryFn: () => lessonsService.getAll({ type }),
  });

  const filteredLessons = lessons.filter(lesson => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lesson.title.toLowerCase().includes(query) ||
      lesson.title_chinese?.toLowerCase().includes(query) ||
      lesson.description?.toLowerCase().includes(query)
    );
  });

  const getTypeLabel = (lessonType: LessonType) => {
    switch (lessonType) {
      case 'online':
        return '線上課程';
      case 'offline':
        return '線下工作坊';
      case 'hybrid':
        return '混合式';
      default:
        return '';
    }
  };

  const getTypeIcon = (lessonType: LessonType) => {
    switch (lessonType) {
      case 'online':
        return <Video className="w-5 h-5" />;
      case 'offline':
        return <MapPin className="w-5 h-5" />;
      case 'hybrid':
        return <BookOpen className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-1 mb-4">
              {type === 'online' ? '線上課程' : type === 'offline' ? '線下工作坊' : '課程'}
            </h1>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              探索我們的 AI 教學課程，提升您的教學技能
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜尋課程..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <div className="flex space-x-2">
              <Link
                to="/lessons"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !type
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                全部
              </Link>
              <Link
                to="/lessons/online"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  type === 'online'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                線上
              </Link>
              <Link
                to="/lessons/offline"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  type === 'offline'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                線下
              </Link>
            </div>
          </div>

          {/* Lessons Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-body-lg text-gray-600">找不到相關的課程</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const LessonCard = ({ lesson }: { lesson: any }) => {
  const getTypeLabel = (lessonType: string) => {
    switch (lessonType) {
      case 'online':
        return '線上課程';
      case 'offline':
        return '線下工作坊';
      case 'hybrid':
        return '混合式';
      default:
        return '';
    }
  };

  return (
    <Link to={`/lessons/${lesson.id}`} className="card-hover group block">
      {lesson.cover_image_url && (
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={lesson.cover_image_url}
            alt={lesson.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {lesson.is_featured && (
            <div className="absolute top-2 right-2 bg-secondary-500 text-white px-2 py-1 rounded text-xs font-semibold">
              精選
            </div>
          )}
          <div className="absolute bottom-2 left-2">
            <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
              {getTypeLabel(lesson.lesson_type)}
            </span>
          </div>
        </div>
      )}
      <h3 className="heading-3 mb-2 group-hover:text-primary-600 transition-colors">
        {lesson.title}
      </h3>
      {lesson.title_chinese && (
        <p className="text-sm text-gray-600 mb-3">{lesson.title_chinese}</p>
      )}
      {lesson.short_description && (
        <p className="text-body text-gray-600 line-clamp-2 mb-4">
          {lesson.short_description}
        </p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500">
        {lesson.duration_minutes && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration_minutes} 分鐘</span>
          </div>
        )}
        {lesson.price !== null && (
          <div className="font-semibold text-primary-600">
            {lesson.price === 0 ? '免費' : `$${lesson.price}`}
          </div>
        )}
      </div>
      {lesson.start_date && (
        <div className="mt-2 flex items-center space-x-1 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(lesson.start_date), 'yyyy-MM-dd')}</span>
        </div>
      )}
    </Link>
  );
};

