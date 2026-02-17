import { strapi } from '@/lib/strapi';
import { AuthResponse, LoginCredentials, RegisterData, StrapiUser } from '@/types/strapi';

const AUTH_TOKEN_KEY = 'strapi_jwt';
const USER_KEY = 'strapi_user';

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await strapi.post('/auth/local', credentials);
    if (response.jwt) {
      this.setToken(response.jwt);
      this.setUser(response.user);
    }
    return response;
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await strapi.post('/auth/local/register', data);
    if (response.jwt) {
      this.setToken(response.jwt);
      this.setUser(response.user);
    }
    return response;
  },

  // Logout
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // Get current user
  async getCurrentUser(): Promise<StrapiUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await strapi.get('/users/me', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Failed to get current user:', error);
      this.logout();
      return null;
    }
  },

  // Token management
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return null;
  },

  // User management
  setUser(user: StrapiUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  getUser(): StrapiUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
