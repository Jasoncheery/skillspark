import { supabase } from './supabase';
import type { UserProfile, UserRole } from '../types/database';

export const usersService = {
  // Get all users (admin only)
  getAll: async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get user by ID
  getById: async (id: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Admin: Update user profile
  update: async (id: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Update user role
  updateRole: async (id: string, role: UserRole): Promise<UserProfile> => {
    return usersService.update(id, { role });
  },

  // Note: User creation is handled by Supabase Auth
  // Note: User deletion should be handled through Supabase Auth admin API
  // We only manage user profiles here, not auth accounts
};

