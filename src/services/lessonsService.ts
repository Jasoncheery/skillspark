import { supabase } from './supabase';
import type { Lesson, LessonContent, LessonRegistration } from '../types/database';

export const lessonsService = {
  // Get all lessons
  getAll: async (options?: { type?: 'online' | 'offline' | 'hybrid'; featured?: boolean; includeUnpublished?: boolean }): Promise<Lesson[]> => {
    let query = supabase
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true });

    if (!options?.includeUnpublished) {
      query = query.eq('is_published', true);
    }

    if (options?.type) {
      query = query.eq('lesson_type', options.type);
    }

    if (options?.featured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get lesson by ID
  getById: async (id: string): Promise<Lesson | null> => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Get lesson content
  getContent: async (lessonId: string): Promise<LessonContent[]> => {
    const { data, error } = await supabase
      .from('lesson_content')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Register for lesson
  register: async (lessonId: string, userId: string): Promise<LessonRegistration> => {
    const { data, error } = await supabase
      .from('lesson_registrations')
      .insert({
        lesson_id: lessonId,
        user_id: userId,
        status: 'registered',
        progress_percentage: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user registration
  getRegistration: async (lessonId: string, userId: string): Promise<LessonRegistration | null> => {
    const { data, error } = await supabase
      .from('lesson_registrations')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Update registration progress
  updateProgress: async (
    registrationId: string,
    progress: number,
    status?: 'registered' | 'attended' | 'completed'
  ): Promise<LessonRegistration> => {
    const updates: any = { progress_percentage: progress };
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    if (status) {
      updates.status = status;
    }

    const { data, error } = await supabase
      .from('lesson_registrations')
      .update(updates)
      .eq('id', registrationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Create lesson
  create: async (lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<Lesson> => {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Update lesson
  update: async (id: string, updates: Partial<Lesson>): Promise<Lesson> => {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Delete lesson
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

