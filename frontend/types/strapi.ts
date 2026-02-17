// Strapi API Types

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  name: string;
  description?: string;
  teacher?: StrapiEntity<StrapiUser>;
  students?: StrapiEntity<StrapiUser>[];
  assignments?: StrapiEntity<Assignment>[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  title: string;
  description?: string;
  dueDate?: string;
  class?: StrapiEntity<Class>;
  submissions?: StrapiEntity<Submission>[];
  attachments?: any[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  student?: StrapiEntity<StrapiUser>;
  assignment?: StrapiEntity<Assignment>;
  content?: string;
  files?: any[];
  grade?: number;
  feedback?: string;
  aiCheck?: any;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  title: string;
  file: any;
  owner?: StrapiEntity<StrapiUser>;
  fileType?: 'pdf' | 'docx' | 'txt' | 'other';
  extractedText?: string;
  status?: 'uploading' | 'processing' | 'completed' | 'failed';
  embeddings?: StrapiEntity<DocumentEmbedding>[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentEmbedding {
  document?: StrapiEntity<Document>;
  chunkText: string;
  chunkIndex: number;
  embedding?: any;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  name: string;
  description?: string;
  template: string;
  category?: 'teacher' | 'student' | 'admin' | 'general';
  variables?: any;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LLMConfig {
  qwenEnabled?: boolean;
  openaiEnabled?: boolean;
  claudeEnabled?: boolean;
  geminiEnabled?: boolean;
  defaultModel?: 'qwen' | 'openai' | 'claude' | 'gemini';
  embeddingModel?: 'openai' | 'qwen' | 'local';
  settings?: any;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: StrapiUser;
}
