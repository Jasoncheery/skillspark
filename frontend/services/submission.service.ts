import { strapi } from '@/lib/strapi';
import { Submission, StrapiEntity, StrapiResponse } from '@/types/strapi';
import { authService } from './auth.service';

export const submissionService = {
  // Get all submissions
  async getAll(params?: any): Promise<StrapiResponse<StrapiEntity<Submission>[]>> {
    const token = authService.getToken();
    return strapi.get('/submissions', {
      populate: ['student', 'assignment', 'files'],
      ...params,
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Get single submission by ID
  async getById(id: number): Promise<StrapiResponse<StrapiEntity<Submission>>> {
    const token = authService.getToken();
    return strapi.get(`/submissions/${id}`, {
      populate: ['student', 'assignment', 'files'],
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Create new submission
  async create(data: Partial<Submission>): Promise<StrapiResponse<StrapiEntity<Submission>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.post('/submissions', { data }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Update submission
  async update(id: number, data: Partial<Submission>): Promise<StrapiResponse<StrapiEntity<Submission>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.put(`/submissions/${id}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Delete submission
  async delete(id: number): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.delete(`/submissions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get submissions by assignment
  async getByAssignment(assignmentId: number): Promise<StrapiResponse<StrapiEntity<Submission>[]>> {
    const token = authService.getToken();
    return strapi.get('/submissions', {
      filters: {
        assignment: {
          id: { $eq: assignmentId },
        },
      },
      populate: ['student', 'files'],
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Get submissions by student
  async getByStudent(studentId: number): Promise<StrapiResponse<StrapiEntity<Submission>[]>> {
    const token = authService.getToken();
    return strapi.get('/submissions', {
      filters: {
        student: {
          id: { $eq: studentId },
        },
      },
      populate: ['assignment', 'files'],
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Grade submission
  async grade(id: number, grade: number, feedback?: string): Promise<StrapiResponse<StrapiEntity<Submission>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.put(`/submissions/${id}`, {
      data: { grade, feedback },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
