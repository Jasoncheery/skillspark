import { supabase } from './supabase';
import type { AITool } from '../types/database';

export const aiToolsService = {
  // Get all AI tools
  getAll: async (options?: { featured?: boolean; category?: string; includeInactive?: boolean }): Promise<AITool[]> => {
    let query = supabase
      .from('ai_tools')
      .select('*')
      .order('order_index', { ascending: true });

    if (!options?.includeInactive) {
      query = query.eq('is_active', true);
    }

    if (options?.featured) {
      query = query.eq('is_featured', true);
    }

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get tool by slug
  getBySlug: async (slug: string): Promise<AITool | null> => {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Get categories
  getCategories: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('category')
      .eq('is_active', true)
      .not('category', 'is', null);

    if (error) throw error;
    const categories = new Set((data || []).map((item: any) => item.category).filter(Boolean));
    return Array.from(categories) as string[];
  },

  // Admin: Create tool
  create: async (tool: Omit<AITool, 'id' | 'created_at' | 'updated_at'>): Promise<AITool> => {
    const { data, error } = await supabase
      .from('ai_tools')
      .insert(tool as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Update tool
  update: async (id: string, updates: Partial<AITool>): Promise<AITool> => {
    const { data, error } = await supabase
      .from('ai_tools')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Delete tool
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('ai_tools')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

