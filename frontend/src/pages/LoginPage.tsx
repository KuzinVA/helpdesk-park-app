import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTelegram } from '../hooks/useTelegram';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, mockLogin } = useAuthStore();
  const { isTelegramApp, isReady, hapticFeedback } = useTelegram();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/tickets');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isReady && isTelegramApp) {
      hapticFeedback.notificationOccurred('success');
    }
  }, [isReady, isTelegramApp, hapticFeedback]);

  const handleTelegramLogin = () => {
    if (isTelegramApp) {
      hapticFeedback.impactOccurred('medium');
      // Здесь будет логика входа через Telegram
      console.log('Telegram login initiated');
    }
  };

  const handleMockLogin = () => {
    hapticFeedback.impactOccurred('medium');
    mockLogin();
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-system-background px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-system-blue rounded-2xl flex items-center justify-center mb-6">
            <span className="text-white text-3xl font-bold">H</span>
          </div>
          <h1 className="apple-text-large-title text-label-primary mb-2">
            Helpdesk Park
          </h1>
          <p className="apple-text-body text-label-secondary">
            Система управления заявками для парка аттракционов
          </p>
        </div>

        {/* Login Card */}
        <div className="apple-card p-8 space-y-6">
          <div className="text-center">
            <h2 className="apple-text-title-2 text-label-primary mb-2">
              Войти в систему
            </h2>
            <p className="apple-text-callout text-label-tertiary">
              {isTelegramApp 
                ? 'Используйте Telegram для входа' 
                : 'Откройте приложение в Telegram'
              }
            </p>
          </div>

          {/* Telegram Login Button */}
          <button
            onClick={handleTelegramLogin}
            disabled={!isTelegramApp}
            className={`w-full apple-button-primary py-4 text-lg font-medium ${
              !isTelegramApp 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 apple-transition'
            }`}
          >
            {isTelegramApp ? (
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">📱</span>
                <span>Войти через Telegram</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">🔗</span>
                <span>Открыть в Telegram</span>
              </div>
            )}
          </button>

          {/* Mock Login Button for Testing */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-separator-non-opaque" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-secondary-system-background text-label-tertiary">
                Или
              </span>
            </div>
          </div>

          <button
            onClick={handleMockLogin}
            className="w-full apple-button-secondary py-4 text-lg font-medium hover:scale-105 apple-transition"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-xl">🧪</span>
              <span>Тестовый вход (без backend)</span>
            </div>
          </button>

          {/* Info */}
          <div className="text-center">
            <p className="apple-text-footnote text-label-tertiary">
              {isTelegramApp 
                ? 'Нажмите кнопку выше для входа в систему'
                : 'Для входа откройте это приложение в Telegram'
              }
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="apple-card p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="apple-text-headline text-label-primary">
                  Быстрое создание заявок
                </h3>
                <p className="apple-text-caption-1 text-label-tertiary">
                  Создавайте заявки за 30 секунд
                </p>
              </div>
            </div>
          </div>

          <div className="apple-card p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👥</span>
              <div>
                <h3 className="apple-text-headline text-label-primary">
                  Упоминания @username
                </h3>
                <p className="apple-text-caption-1 text-label-tertiary">
                  Быстро назначайте ответственных
                </p>
              </div>
            </div>
          </div>

          <div className="apple-card p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="apple-text-headline text-label-primary">
                  Статистика и аналитика
                </h3>
                <p className="apple-text-caption-1 text-label-tertiary">
                  Отслеживайте эффективность работы
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="apple-text-caption-1 text-label-quaternary">
            © 2024 Helpdesk Park. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
