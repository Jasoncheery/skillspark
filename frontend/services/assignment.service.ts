import { strapi } from '@/lib/strapi';
import { Assignment, StrapiEntity, StrapiResponse } from '@/types/strapi';
import { authService } from './auth.service';

export const assignmentService = {
  // Get all assignments
  async getAll(params?: any): Promise<StrapiResponse<StrapiEntity<Assignment>[]>> {
    const token = authService.getToken();
    return strapi.get('/assignments', {
      populate: ['class', 'submissions', 'attachments'],
      ...params,
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Get single assignment by ID
  async getById(id: number): Promise<StrapiResponse<StrapiEntity<Assignment>>> {
    const token = authService.getToken();
    return strapi.get(`/assignments/${id}`, {
      populate: ['class', 'submissions', 'attachments'],
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Create new assignment
  async create(data: Partial<Assignment>): Promise<StrapiResponse<StrapiEntity<Assignment>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.post('/assignments', { data }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Update assignment
  async update(id: number, data: Partial<Assignment>): Promise<StrapiResponse<StrapiEntity<Assignment>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.put(`/assignments/${id}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Delete assignment
  async delete(id: number): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.delete(`/assignments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get assignments by class
  async getByClass(classId: number): Promise<StrapiResponse<StrapiEntity<Assignment>[]>> {
    const token = authService.getToken();
    return strapi.get('/assignments', {
      filters: {
        class: {
          id: { $eq: classId },
        },
      },
      populate: ['submissions', 'attachments'],
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Publish assignment
  async publish(id: number): Promise<StrapiResponse<StrapiEntity<Assignment>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.put(`/assignments/${id}`, {
      data: { publishedAt: new Date().toISOString() },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Unpublish assignment
  async unpublish(id: number): Promise<StrapiResponse<StrapiEntity<Assignment>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.put(`/assignments/${id}`, {
      data: { publishedAt: null },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
