import axios from 'axios';
import { supabase } from './supabase';
import type { JobType } from '../types/database';

// Determine API endpoint: Supabase Edge Function (preferred) or FastAPI
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const FASTAPI_URL = import.meta.env.VITE_API_URL;
const USE_EDGE_FUNCTION = !FASTAPI_URL && SUPABASE_URL; // Use Edge Function if no FastAPI URL set
const EDGE_FUNCTION_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/generate-content` : null;
const API_BASE_URL = FASTAPI_URL || EDGE_FUNCTION_URL || 'http://localhost:8000';

export interface GenerateTextRequest {
  prompt: string;
  jobType: JobType;
  targetType?: string;
  targetId?: string;
  maxLength?: number;
}

export interface GenerateImageRequest {
  prompt: string;
  width?: number;
  height?: number;
  style?: string;
}

export interface GenerationResponse {
  success: boolean;
  data?: any;
  error?: string;
  jobId?: string;
}

export const aiService = {
  // Generate text content (blog post, tool description, etc.)
  generateText: async (request: GenerateTextRequest): Promise<GenerationResponse> => {
    try {
      const url = USE_EDGE_FUNCTION 
        ? `${EDGE_FUNCTION_URL}/generate-text`
        : `${API_BASE_URL}/api/ai/generate-text`;
      
      const payload = USE_EDGE_FUNCTION
        ? {
            prompt: request.prompt,
            job_type: request.jobType,
            max_length: request.maxLength,
          }
        : {
            prompt: request.prompt,
            job_type: request.jobType,
            target_type: request.targetType,
            target_id: request.targetId,
            max_length: request.maxLength,
          };

      // For Edge Functions, use Supabase client for auth
      if (USE_EDGE_FUNCTION) {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await axios.post(url, payload, {
          headers: {
            'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.data.success) {
          return {
            success: true,
            data: response.data.data,
            jobId: response.data.job_id,
          };
        } else {
          return {
            success: false,
            error: response.data.error || '生成失敗',
          };
        }
      }

      // For FastAPI
      const response = await axios.post(url, payload);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          jobId: response.data.job_id,
        };
      } else {
        return {
          success: false,
          error: response.data.error || '生成失敗',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.detail || error.message || '生成失敗',
      };
    }
  },

  // Generate image
  generateImage: async (request: GenerateImageRequest): Promise<GenerationResponse> => {
    try {
      const url = USE_EDGE_FUNCTION
        ? `${EDGE_FUNCTION_URL}/generate-image`
        : `${API_BASE_URL}/api/ai/generate-image`;
      
      const payload = {
        prompt: request.prompt,
        width: request.width,
        height: request.height,
        style: request.style,
      };

      // For Edge Functions, use Supabase client for auth
      if (USE_EDGE_FUNCTION) {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await axios.post(url, payload, {
          headers: {
            'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.data.success) {
          return {
            success: true,
            data: response.data.data,
            jobId: response.data.job_id,
          };
        } else {
          return {
            success: false,
            error: response.data.error || '生成失敗',
          };
        }
      }

      // For FastAPI
      const response = await axios.post(url, payload);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          jobId: response.data.job_id,
        };
      } else {
        return {
          success: false,
          error: response.data.error || '生成失敗',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.detail || error.message || '生成失敗',
      };
    }
  },

  // Get generation job status
  getJobStatus: async (jobId: string): Promise<GenerationResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/ai/jobs/${jobId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message || '查詢失敗',
      };
    }
  },

  // Generate blog post
  generateBlogPost: async (topic: string, category?: string): Promise<GenerationResponse> => {
    return aiService.generateText({
      prompt: `撰寫一篇關於「${topic}」的詳細文章，包含介紹、功能、使用場景和總結。`,
      jobType: 'blog_post',
      maxLength: 2000,
    });
  },

  // Generate tool description
  generateToolDescription: async (toolName: string, toolInfo?: string): Promise<GenerationResponse> => {
    return aiService.generateText({
      prompt: `為 AI 工具「${toolName}」撰寫詳細介紹，包括功能、特色、使用場景和優勢。${toolInfo ? `工具資訊：${toolInfo}` : ''}`,
      jobType: 'tool_description',
      maxLength: 1500,
    });
  },

  // Generate SEO content
  generateSEOContent: async (title: string, content: string): Promise<GenerationResponse> => {
    return aiService.generateText({
      prompt: `為以下內容生成 SEO 優化的標題、描述和關鍵詞：\n標題：${title}\n內容：${content.substring(0, 500)}...`,
      jobType: 'seo_content',
    });
  },
};

