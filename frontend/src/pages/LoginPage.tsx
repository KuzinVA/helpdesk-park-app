import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useTelegram } from '@/hooks/useTelegram';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuthStore();
  const { isTelegramApp, initTelegram, user, showAlert } = useTelegram();
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    initTelegram();
    
    // Показываем приветствие через небольшую задержку
    const timer = setTimeout(() => setShowWelcome(true), 300);
    return () => clearTimeout(timer);
  }, [initTelegram]);

  useEffect(() => {
    if (isAuthenticated) {
      // Перенаправление будет обработано в App.tsx
    }
  }, [isAuthenticated]);

  const handleTelegramLogin = async () => {
    if (!isTelegramApp) {
      showAlert('Это приложение работает только в Telegram. Откройте его через бота @helpdeskParkApp_bot');
      return;
    }

    if (!user) {
      showAlert('Не удалось получить данные пользователя Telegram');
      return;
    }

    setIsLoading(true);
    try {
      await login({
        id: user.id.toString(),
        firstName: user.first_name,
        lastName: user.last_name || '',
        username: user.username || '',
        photoUrl: user.photo_url || '',
      });
    } catch (error) {
      showAlert(`Ошибка входа: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login({
        id: 'demo',
        firstName: 'Демо',
        lastName: 'Пользователь',
        username: 'demo_user',
        photoUrl: '',
      });
    } catch (error) {
      showAlert(`Ошибка входа: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center apple-container" 
         style={{ background: 'var(--bg-grouped)' }}>
      <div className="w-full max-w-sm">
        {/* Основная карточка */}
        <div className="apple-card p-8 text-center space-y-6">
          {/* Логотип */}
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto apple-transition hover:scale-105" 
                 style={{ backgroundColor: 'var(--system-blue)' }}>
              <span className="text-white text-2xl font-semibold">H</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="apple-text-large-title" style={{ color: 'var(--label-primary)' }}>
                Helpdesk Park
              </h1>
              <p className="apple-text-footnote" style={{ color: 'var(--label-secondary)' }}>
                Система управления заявками парка аттракционов
              </p>
            </div>
          </div>

          {/* Приветствие */}
          {showWelcome && (
            <div className="fade-in">
              <div className="apple-card-grouped p-3" 
                   style={{ backgroundColor: 'var(--fill-quaternary)' }}>
                <p className="apple-text-footnote" style={{ color: 'var(--label-primary)' }}>
                  Добро пожаловать в систему управления заявками!
                </p>
              </div>
            </div>
          )}

          {/* Кнопки входа */}
          <div className="space-y-3">
            {/* Telegram вход */}
            <button
              onClick={handleTelegramLogin}
              disabled={!isTelegramApp || isLoading}
              className={`apple-button-primary w-full ${
                (!isTelegramApp || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Вход...</span>
                </div>
              ) : (
                <span>Войти через Telegram</span>
              )}
            </button>

            {/* Демо вход */}
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className={`apple-button-secondary w-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>Демо режим</span>
            </button>
          </div>

          {/* Информация */}
          <div className="space-y-3 text-xs text-gray-500 dark:text-gray-400">
            {!isTelegramApp && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p>⚠️ Для полноценной работы откройте приложение через Telegram бота</p>
              </div>
            )}
            
            <p>
              🔐 Вход через Telegram обеспечивает безопасность и удобство
            </p>
            
            <p>
              📱 Оптимизировано для мобильных устройств
            </p>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 text-center">
          <div className="glass-card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🚀 Возможности системы
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
              <div>📋 Создание заявок</div>
              <div>👥 Назначение ответственных</div>
              <div>📊 Статистика и аналитика</div>
              <div>🔔 Уведомления</div>
            </div>
          </div>
        </div>

        {/* Индикатор загрузки */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Выполняется вход...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
