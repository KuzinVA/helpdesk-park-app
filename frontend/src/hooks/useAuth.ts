import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useTelegram } from '@/hooks/useTelegram';
import { User } from '@/types';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

export const useAuth = () => {
  const { setUser, setToken, logout, setLoading } = useAuthStore();
  const { getInitData } = useTelegram();

  const loginWithTelegram = useCallback(async () => {
    try {
      setLoading(true);
      
      const initData = getInitData();
      if (!initData) {
        throw new Error('No Telegram initData available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      setToken(data.accessToken);
      setUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getInitData, setToken, setUser, setLoading]);

  const logoutUser = useCallback(() => {
    logout();
  }, [logout]);

  const getAuthHeaders = useCallback(() => {
    const token = useAuthStore.getState().token;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, []);

  return {
    loginWithTelegram,
    logoutUser,
    getAuthHeaders,
  };
};
