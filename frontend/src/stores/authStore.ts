import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  mockLogin: () => void; // Мок-вход для тестирования
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token: string) => set({ token }),
      
      login: (user: User, token: string) => set({
        user,
        token,
        isAuthenticated: true,
        error: null,
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      }),
      
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      setError: (error: string | null) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Мок-вход для тестирования
      mockLogin: () => {
        const mockUser: User = {
          id: 'mock-user-1',
          telegramId: 123456789,
          username: 'testuser',
          firstName: 'Тестовый',
          lastName: 'Пользователь',
          telegramUsername: 'testuser',
          role: UserRole.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({
          user: mockUser,
          token: 'mock-token-123',
          isAuthenticated: true,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
