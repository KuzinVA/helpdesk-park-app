import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTelegram } from '@/hooks/useTelegram';
import { useAuthStore } from '@/stores/authStore';

export const LoginPage: React.FC = () => {
  const { loginWithTelegram } = useAuth();
  const { user, isReady, showMainButton, hideMainButton, hapticFeedback, showAlert } = useTelegram();
  const { isLoading } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (isReady && user) {
      // Автоматически входим если есть данные пользователя
      handleAutoLogin();
    } else if (isReady) {
      // Показываем кнопку входа
      showMainButton('Войти через Telegram', handleManualLogin);
    }

    return () => {
      hideMainButton();
    };
  }, [isReady, user, showMainButton, hideMainButton]);

  const handleAutoLogin = async () => {
    try {
      setIsLoggingIn(true);
      hapticFeedback('light');
      await loginWithTelegram();
    } catch (error) {
      console.error('Auto-login failed:', error);
      showAlert('Ошибка автоматического входа. Попробуйте войти вручную.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleManualLogin = async () => {
    try {
      setIsLoggingIn(true);
      hapticFeedback('medium');
      await loginWithTelegram();
    } catch (error) {
      console.error('Manual login failed:', error);
      hapticFeedback('heavy');
      showAlert('Ошибка входа. Проверьте подключение к интернету и попробуйте снова.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading || isLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {isLoggingIn ? 'Выполняется вход...' : 'Загрузка...'}
          </p>
          {isLoggingIn && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Пожалуйста, подождите
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Helpdesk Park
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Система управления заявками парка аттракционов
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Вход в систему
            </h2>
            
            {user ? (
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  {user.photo_url ? (
                    <img 
                      src={user.photo_url} 
                      alt={user.first_name}
                      className="h-16 w-16 rounded-full border-4 border-blue-200 dark:border-blue-700"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {user.first_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Привет, <span className="font-semibold">{user.first_name}</span>!
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Выполняется автоматический вход...
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <div className="mx-auto h-16 w-16 text-blue-600 dark:text-blue-400 mb-4">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Войти через Telegram
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Используйте кнопку внизу экрана для входа в систему
                </p>
              </div>
            )}
            
            <button
              onClick={handleManualLogin}
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {isLoggingIn ? 'Вход...' : 'Войти через Telegram'}
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Система автоматически определит ваши права доступа
          </p>
        </div>
      </div>
    </div>
  );
};
