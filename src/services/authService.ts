import { supabase } from './supabase';
import type { UserProfile } from '../types/database';

export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
}

export const authService = {
  // Sign up new user
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name || '',
          },
        },
      });

      if (authError) {
        return {
          success: false,
          error: authError.message,
        };
      }

      if (authData.user) {
        // Create user profile
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: authData.user.id,
              email: authData.user.email || data.email,
              full_name: data.full_name || null,
              role: 'student', // Default role
            });

          if (profileError) {
            console.error('Error creating user profile:', profileError);
            // Don't fail the signup if profile creation fails
            // Profile might be created via trigger
          }
        } catch (error) {
          console.error('Error creating user profile:', error);
        }
      }

      return {
        success: true,
        user: authData.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred during sign up',
      };
    }
  },

  // Sign in existing user
  signIn: async (data: SignInData): Promise<AuthResponse> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return {
          success: false,
          error: authError.message,
        };
      }

      return {
        success: true,
        user: authData.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred during sign in',
      };
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await supabase.auth.signOut();
  },

  // Reset password
  resetPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred',
      };
    }
  },

  // Update password
  updatePassword: async (newPassword: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred',
      };
    }
  },

  // Resend confirmation email
  resendConfirmation: async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred',
      };
    }
  },
};

