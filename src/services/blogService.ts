import { supabase } from './supabase';
import type { BlogPost } from '../types/database';

export const blogService = {
  // Get all blog posts
  getAll: async (options?: { featured?: boolean; category?: string; limit?: number; includeUnpublished?: boolean }): Promise<BlogPost[]> => {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (!options?.includeUnpublished) {
      query = query.eq('is_published', true);
    }

    if (options?.featured) {
      query = query.eq('is_featured', true);
    }

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get post by slug
  getBySlug: async (slug: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    // Increment view count
    if (data) {
      await supabase
        .from('blog_posts')
        .update({ view_count: ((data as any).view_count || 0) + 1 } as any)
        .eq('id', (data as any).id);
    }

    return data;
  },

  // Get categories
  getCategories: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('is_published', true)
      .not('category', 'is', null);

    if (error) throw error;
    const categories = new Set((data || []).map((item: any) => (item as any).category).filter(Boolean));
    return Array.from(categories) as string[];
  },

  // Admin: Create post
  create: async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<BlogPost> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Update post
  update: async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Delete post
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

