import { useForm } from 'react-hook-form';
import type { Lesson, LessonType, DifficultyLevel } from '../../types/database';

interface LessonFormData {
  slug: string;
  title: string;
  title_chinese: string;
  description: string;
  description_chinese: string;
  lesson_type: LessonType;
  cover_image_url: string;
  instructor_id: string;
  duration_minutes: number;
  difficulty_level: DifficultyLevel;
  price: number;
  currency: string;
  max_participants: number;
  registration_deadline: string;
  start_date: string;
  end_date: string;
  location: string;
  location_chinese: string;
  is_published: boolean;
  is_featured: boolean;
  order_index: number;
}

interface LessonAdminFormProps {
  lesson?: Lesson;
  onSubmit: (data: LessonFormData) => Promise<void>;
  onCancel: () => void;
}

export const LessonAdminForm = ({ lesson, onSubmit, onCancel }: LessonAdminFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LessonFormData>({
    defaultValues: lesson ? {
      slug: lesson.slug,
      title: lesson.title,
      title_chinese: lesson.title_chinese || '',
      description: lesson.description || '',
      description_chinese: lesson.description_chinese || '',
      lesson_type: lesson.lesson_type,
      cover_image_url: lesson.cover_image_url || '',
      instructor_id: lesson.instructor_id || '',
      duration_minutes: lesson.duration_minutes || 0,
      difficulty_level: lesson.difficulty_level || 'beginner',
      price: lesson.price || 0,
      currency: lesson.currency || 'HKD',
      max_participants: lesson.max_participants || 0,
      registration_deadline: lesson.registration_deadline ? new Date(lesson.registration_deadline).toISOString().slice(0, 16) : '',
      start_date: lesson.start_date ? new Date(lesson.start_date).toISOString().slice(0, 16) : '',
      end_date: lesson.end_date ? new Date(lesson.end_date).toISOString().slice(0, 16) : '',
      location: lesson.location || '',
      location_chinese: lesson.location_chinese || '',
      is_published: lesson.is_published,
      is_featured: lesson.is_featured,
      order_index: lesson.order_index,
    } : {
      lesson_type: 'online',
      currency: 'HKD',
      difficulty_level: 'beginner',
      is_published: false,
      is_featured: false,
      order_index: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            {...register('slug', { required: true })}
            className="input-field"
            placeholder="introduction-to-ai"
          />
          {errors.slug && <p className="text-error text-sm mt-1">Slug is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            {...register('title', { required: true })}
            className="input-field"
            placeholder="Introduction to AI"
          />
          {errors.title && <p className="text-error text-sm mt-1">Title is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chinese Title
          </label>
          <input
            {...register('title_chinese')}
            className="input-field"
            placeholder="AI 入門"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Type *
          </label>
          <select
            {...register('lesson_type', { required: true })}
            className="input-field"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            {...register('difficulty_level')}
            className="input-field"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            {...register('duration_minutes', { valueAsNumber: true })}
            type="number"
            className="input-field"
            placeholder="60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="input-field"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <input
            {...register('currency')}
            className="input-field"
            placeholder="HKD"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Participants
          </label>
          <input
            {...register('max_participants', { valueAsNumber: true })}
            type="number"
            className="input-field"
            placeholder="50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Deadline
          </label>
          <input
            {...register('registration_deadline')}
            type="datetime-local"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            {...register('start_date')}
            type="datetime-local"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            {...register('end_date')}
            type="datetime-local"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            {...register('location')}
            className="input-field"
            placeholder="Online / Physical location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Chinese)
          </label>
          <input
            {...register('location_chinese')}
            className="input-field"
            placeholder="線上 / 實體地點"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL
          </label>
          <input
            {...register('cover_image_url')}
            type="url"
            className="input-field"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Index
          </label>
          <input
            {...register('order_index', { valueAsNumber: true })}
            type="number"
            className="input-field"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          className="input-field"
          rows={4}
          placeholder="Full description..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Chinese)
        </label>
        <textarea
          {...register('description_chinese')}
          className="input-field"
          rows={4}
          placeholder="完整描述..."
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            {...register('is_published')}
            type="checkbox"
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Published</span>
        </label>
        <label className="flex items-center">
          <input
            {...register('is_featured')}
            type="checkbox"
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {lesson ? 'Update' : 'Create'} Lesson
        </button>
      </div>
    </form>
  );
};

