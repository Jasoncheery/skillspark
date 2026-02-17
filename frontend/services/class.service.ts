import { strapi } from '@/lib/strapi';
import { Class, StrapiEntity, StrapiResponse } from '@/types/strapi';
import { authService } from './auth.service';

export const classService = {
  // Get all classes
  async getAll(params?: any): Promise<StrapiResponse<StrapiEntity<Class>[]>> {
    const token = authService.getToken();
    return strapi.get('/classes', {
      populate: ['teacher', 'students', 'assignments'],
      ...params,
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Get single class by ID
  async getById(id: number): Promise<StrapiResponse<StrapiEntity<Class>>> {
    const token = authService.getToken();
    return strapi.get(`/classes/${id}`, {
      populate: ['teacher', 'students', 'assignments'],
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Create new class
  async create(data: Partial<Class>): Promise<StrapiResponse<StrapiEntity<Class>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.post('/classes', { data }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Update class
  async update(id: number, data: Partial<Class>): Promise<StrapiResponse<StrapiEntity<Class>>> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.put(`/classes/${id}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Delete class
  async delete(id: number): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');

    return strapi.delete(`/classes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get classes by teacher
  async getByTeacher(teacherId: number): Promise<StrapiResponse<StrapiEntity<Class>[]>> {
    const token = authService.getToken();
    return strapi.get('/classes', {
      filters: {
        teacher: {
          id: { $eq: teacherId },
        },
      },
      populate: ['students', 'assignments'],
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Get classes by student
  async getByStudent(studentId: number): Promise<StrapiResponse<StrapiEntity<Class>[]>> {
    const token = authService.getToken();
    return strapi.get('/classes', {
      filters: {
        students: {
          id: { $eq: studentId },
        },
      },
      populate: ['teacher', 'assignments'],
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};
