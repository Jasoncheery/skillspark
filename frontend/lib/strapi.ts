/**
 * Strapi API Client
 * Handles all API requests to the Strapi backend
 */

import qs from 'qs';

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';

async function fetchApi(path: string, urlParamsObject = {}, options = {}) {
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${STRAPI_API_URL}${path}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(requestUrl, mergedOptions);

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`An error occured please try again.`);
  }

  const data = await response.json();
  return data;
}

export const strapi = {
  get: async (path: string, params?: object, options?: object) => fetchApi(path, params, options),
  post: async (path: string, data: object, options?: object) => fetchApi(path, {}, { method: 'POST', body: JSON.stringify(data), ...options }),
  put: async (path: string, data: object, options?: object) => fetchApi(path, {}, { method: 'PUT', body: JSON.stringify(data), ...options }),
  delete: async (path: string, options?: object) => fetchApi(path, {}, { method: 'DELETE', ...options }),
};

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

export interface StrapiEntity {
  id: number;
  attributes: Record<string, any>;
}

// Legacy exports for backward compatibility
export { STRAPI_API_URL };
