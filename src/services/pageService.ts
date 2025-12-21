import { supabase } from './supabase';
import type { Page } from '../types/database';

export const pageService = {
  // Get all pages
  getAll: async (options?: { published?: boolean }): Promise<Page[]> => {
    let query = supabase
      .from('pages')
      .select('*')
      .order('order_index', { ascending: true });

    if (options?.published !== undefined) {
      query = query.eq('is_published', options.published);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get page by slug
  getBySlug: async (slug: string): Promise<Page | null> => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Get page by ID
  getById: async (id: string): Promise<Page | null> => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Admin: Create page
  create: async (page: Omit<Page, 'id' | 'created_at' | 'updated_at'>): Promise<Page> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('pages')
      .insert({
        ...page,
        created_by: user?.id || null,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Update page
  update: async (id: string, updates: Partial<Page>): Promise<Page> => {
    const { data, error } = await supabase
      .from('pages')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Delete page
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

