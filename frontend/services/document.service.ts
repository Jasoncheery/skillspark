import { strapi } from '@/lib/strapi';
import { Document, StrapiEntity, StrapiResponse } from '@/types/strapi';
import { authService } from './auth.service';

export const documentService = {
  // Get all documents
  async getAll(params?: any): Promise<StrapiResponse<StrapiEntity<Document>[]>> {
    const token = authService.getToken();
    return strapi.get('/documents', {
      populate: ['owner', 'file', 'embeddings'],
      ...params,
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Get single document by ID
  async getById(id: number): Promise<StrapiResponse<StrapiEntity<Document>>> {
    const token = authService.getToken();
    return strapi.get(`/documents/${id}`, {
      populate: ['owner', 'file', 'embeddings'],
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Create new document
  async create(data: Partial<Document>): Promise<StrapiResponse<StrapiEntity<Document>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.post('/documents', { data }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Update document
  async update(id: number, data: Partial<Document>): Promise<StrapiResponse<StrapiEntity<Document>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.put(`/documents/${id}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Delete document
  async delete(id: number): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.delete(`/documents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get documents by owner
  async getByOwner(ownerId: number): Promise<StrapiResponse<StrapiEntity<Document>[]>> {
    const token = authService.getToken();
    return strapi.get('/documents', {
      filters: {
        owner: {
          id: { $eq: ownerId },
        },
      },
      populate: ['file'],
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Upload document file
  async uploadFile(file: File): Promise<any> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace('/api', '')}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  },
};
