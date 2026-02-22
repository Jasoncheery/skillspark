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
    let errorMessage = `An error occurred please try again.`;
    try {
      const errorData = await response.json();
      if (errorData.error && errorData.error.message) {
        errorMessage = errorData.error.message;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // If we can't parse JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    console.error(`Strapi API Error: ${errorMessage}`);
    throw new Error(errorMessage);
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
