import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUserProfile } from '../services/supabase';
import type { UserProfile } from '../types/database';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    try {
      set({ loading: true });
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({ user: session.user });
        
        // Get user profile
        try {
          const profile = await getCurrentUserProfile();
          set({ profile });
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event: any, session: any) => {
        if (session?.user) {
          set({ user: session.user });
          try {
            const profile = await getCurrentUserProfile();
            set({ profile });
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          set({ user: null, profile: null });
        }
      });
      
      set({ initialized: true, loading: false });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false, initialized: true });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));

