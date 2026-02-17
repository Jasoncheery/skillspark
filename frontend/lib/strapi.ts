/**
 * Strapi API Client
 * Handles all API requests to the Strapi backend
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api`;

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

/**
 * Fetch data from Strapi API
 */
export async function fetchStrapi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<StrapiResponse<T>> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get single entity by ID
 */
export async function getStrapiEntity<T>(
  contentType: string,
  id: number | string,
  populate?: string
): Promise<T> {
  const populateParam = populate ? `?populate=${populate}` : '';
  const response = await fetchStrapi<T>(`/${contentType}/${id}${populateParam}`);
  return response.data;
}

/**
 * Get multiple entities with optional filters
 */
export async function getStrapiEntities<T>(
  contentType: string,
  options?: {
    populate?: string;
    filters?: Record<string, any>;
    sort?: string[];
    pagination?: {
      page?: number;
      pageSize?: number;
    };
  }
): Promise<{ data: T[]; meta?: StrapiResponse<T>['meta'] }> {
  const params = new URLSearchParams();
  
  if (options?.populate) {
    params.append('populate', options.populate);
  }
  
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      params.append(`filters[${key}]`, String(value));
    });
  }
  
  if (options?.sort) {
    options.sort.forEach((sort) => {
      params.append('sort', sort);
    });
  }
  
  if (options?.pagination) {
    if (options.pagination.page) {
      params.append('pagination[page]', String(options.pagination.page));
    }
    if (options.pagination.pageSize) {
      params.append('pagination[pageSize]', String(options.pagination.pageSize));
    }
  }

  const queryString = params.toString();
  const endpoint = `/${contentType}${queryString ? `?${queryString}` : ''}`;
  const response = await fetchStrapi<T[]>(endpoint);
  
  return {
    data: Array.isArray(response.data) ? response.data : [],
    meta: response.meta,
  };
}

/**
 * Create new entity
 */
export async function createStrapiEntity<T>(
  contentType: string,
  data: Record<string, any>
): Promise<T> {
  const response = await fetchStrapi<T>(`/${contentType}`, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  return response.data;
}

/**
 * Update entity
 */
export async function updateStrapiEntity<T>(
  contentType: string,
  id: number | string,
  data: Record<string, any>
): Promise<T> {
  const response = await fetchStrapi<T>(`/${contentType}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  return response.data;
}

/**
 * Delete entity
 */
export async function deleteStrapiEntity(
  contentType: string,
  id: number | string
): Promise<void> {
  await fetchStrapi(`/${contentType}/${id}`, {
    method: 'DELETE',
  });
}

export { STRAPI_URL, API_URL };
