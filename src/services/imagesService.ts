import { supabase } from './supabase';
import type { Image } from '../types/database';
import { getCurrentUser } from './supabase';

const STORAGE_BUCKET = 'images';

export const imagesService = {
  // Get all images
  getAll: async (options?: { category?: string }): Promise<Image[]> => {
    let query = supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get image by ID
  getById: async (id: string): Promise<Image | null> => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Upload image to Supabase Storage and create record
  upload: async (
    file: File,
    metadata?: {
      alt_text?: string | null;
      alt_text_chinese?: string | null;
      category?: string | null;
      tags?: string[];
    }
  ): Promise<Image> => {
    const user = await getCurrentUser();
    if (!user) throw new Error('User must be authenticated to upload images');

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    // Get image dimensions (if it's an image)
    let width: number | null = null;
    let height: number | null = null;
    if (file.type.startsWith('image/')) {
      try {
        const imgElement = document.createElement('img');
        const objectUrl = URL.createObjectURL(file);
        await new Promise<void>((resolve, reject) => {
          imgElement.onload = () => {
            width = imgElement.naturalWidth;
            height = imgElement.naturalHeight;
            URL.revokeObjectURL(objectUrl);
            resolve();
          };
          imgElement.onerror = reject;
          imgElement.src = objectUrl;
        });
      } catch (err) {
        // If we can't get dimensions, continue without them
        console.warn('Could not get image dimensions', err);
      }
    }

    // Create database record
    const imageRecord: Omit<Image, 'id' | 'created_at'> = {
      filename: fileName,
      original_filename: file.name,
      storage_path: filePath,
      url: urlData.publicUrl,
      mime_type: file.type,
      file_size: file.size,
      width,
      height,
      alt_text: metadata?.alt_text || null,
      alt_text_chinese: metadata?.alt_text_chinese || null,
      category: metadata?.category || null,
      tags: metadata?.tags || [],
      uploaded_by: user.id,
    };

    const { data, error } = await supabase
      .from('images')
      .insert(imageRecord)
      .select()
      .single();

    if (error) {
      // If database insert fails, try to clean up the uploaded file
      await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
      throw error;
    }

    return data;
  },

  // Update image metadata
  update: async (id: string, updates: Partial<Image>): Promise<Image> => {
    const { data, error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete image (removes from storage and database)
  delete: async (id: string): Promise<void> => {
    // Get image record first
    const image = await imagesService.getById(id);
    if (!image) throw new Error('Image not found');

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([image.storage_path]);

    if (storageError) {
      console.warn('Failed to delete from storage:', storageError);
      // Continue to delete from database even if storage delete fails
    }

    // Delete from database
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get categories
  getCategories: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('images')
      .select('category')
      .not('category', 'is', null);

    if (error) throw error;
    const categories = new Set(data?.map(item => item.category).filter(Boolean) || []);
    return Array.from(categories);
  },
};

