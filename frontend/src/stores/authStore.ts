import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  login: (userData: any) => Promise<void>;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
        localStorage.setItem('auth_token', token);
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth_token');
      },

      login: async (userData: any) => {
        // Temporary mock login for deployment
        const mockUser: User = {
          id: userData.id || 'demo',
          firstName: userData.firstName || 'Demo',
          lastName: userData.lastName || 'User',
          username: userData.username || 'demo_user',
          photoUrl: userData.photoUrl || '',
        };
        set({ 
          user: mockUser, 
          isAuthenticated: true,
          token: 'demo_token'
        });
        localStorage.setItem('auth_token', 'demo_token');
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          set({ token, isLoading: false });
          // TODO: Validate token with backend
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
