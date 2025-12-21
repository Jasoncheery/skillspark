import { supabase } from './supabase';
import { aiService } from './aiService';
import type { ContentGenerationJob, JobType } from '../types/database';

export const contentService = {
  // Create generation job
  createJob: async (
    jobType: JobType,
    prompt: string,
    targetType?: string,
    targetId?: string
  ): Promise<ContentGenerationJob> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('content_generation_jobs')
      .insert({
        job_type: jobType,
        target_type: targetType,
        target_id: targetId,
        prompt,
        status: 'pending',
        created_by: user?.id || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's jobs
  getUserJobs: async (): Promise<ContentGenerationJob[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('content_generation_jobs')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get all jobs (admin)
  getAllJobs: async (): Promise<ContentGenerationJob[]> => {
    const { data, error } = await supabase
      .from('content_generation_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update job status
  updateJobStatus: async (
    jobId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    resultData?: any,
    errorMessage?: string
  ): Promise<ContentGenerationJob> => {
    const updates: any = {
      status,
      result_data: resultData,
      error_message: errorMessage,
    };

    if (status === 'completed' || status === 'failed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('content_generation_jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Generate and save content
  generateAndSave: async (
    jobType: JobType,
    prompt: string,
    targetType?: string,
    targetId?: string
  ): Promise<ContentGenerationJob> => {
    // Create job
    const job = await contentService.createJob(jobType, prompt, targetType, targetId);

    try {
      // Update status to processing
      await contentService.updateJobStatus(job.id, 'processing');

      // Call AI service
      let response;
      if (jobType === 'image') {
        response = await aiService.generateImage({ prompt });
      } else {
        response = await aiService.generateText({
          prompt,
          jobType,
          targetType,
          targetId,
        });
      }

      if (response.success && response.data) {
        // Update job with result
        await contentService.updateJobStatus(job.id, 'completed', response.data);
        return { ...job, status: 'completed', result_data: response.data };
      } else {
        // Update job with error
        await contentService.updateJobStatus(job.id, 'failed', null, response.error);
        throw new Error(response.error || '生成失敗');
      }
    } catch (error: any) {
      await contentService.updateJobStatus(job.id, 'failed', null, error.message);
      throw error;
    }
  },
};

