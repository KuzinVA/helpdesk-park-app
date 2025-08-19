import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTelegram } from '../hooks/useTelegram';

// 🎨 Mobile-first Apple-style дизайн обновлен - FORCE DEPLOY v3.1.0
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, mockLogin } = useAuthStore();
  const { isTelegramApp, isReady, hapticFeedback } = useTelegram();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isReady && isTelegramApp) {
      // Автоматический вход через Telegram
      // handleTelegramLogin();
    }
  }, [isReady, isTelegramApp]);

  const handleTelegramLogin = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('medium');
    }
    // Логика входа через Telegram
  };

  const handleMockLogin = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('medium');
    }
    mockLogin();
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-system-background">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🎠</span>
            </div>
            <div>
              <h1 className="apple-text-title-2 text-white font-bold">Helpdesk Park</h1>
              <p className="apple-text-caption-1 text-white/80">Система управления заявками</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">⚙️</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mobile-padding">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h2 className="apple-text-title-1 text-label-primary">
              Добро пожаловать! 👋
            </h2>
            <p className="apple-text-body text-label-secondary">
              Создавайте и управляйте заявками быстро и эффективно
            </p>
          </div>

          {/* Login Card */}
          <div className="apple-card p-6 space-y-6">
            {/* Telegram Login Button */}
            <button
              onClick={handleTelegramLogin}
              className="w-full apple-button-primary py-4 text-lg font-medium hover:scale-105 apple-transition"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">📱</span>
                <span>Войти через Telegram</span>
              </div>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-separator-non-opaque" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-system-secondary-background text-label-tertiary apple-text-caption-1">
                  Или
                </span>
              </div>
            </div>

            {/* Mock Login Button */}
            <button
              onClick={handleMockLogin}
              className="w-full apple-button-secondary py-4 text-lg font-medium hover:scale-105 apple-transition"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">🧪</span>
                <span>Тестовый вход (без backend)</span>
              </div>
            </button>
          </div>

          {/* Features Grid */}
          <div className="mobile-grid space-y-4">
            {/* Fast Creation */}
            <div className="apple-card p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-system-blue/10 rounded-full flex items-center justify-center">
                  <span className="text-system-blue text-xl">⚡</span>
                </div>
                <div className="flex-1">
                  <h3 className="apple-text-headline text-label-primary mb-1">
                    Быстрое создание
                  </h3>
                  <p className="apple-text-caption-1 text-label-tertiary">
                    Создавайте заявки за 30 секунд
                  </p>
                </div>
              </div>
            </div>

            {/* Team Collaboration */}
            <div className="apple-card p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-system-green/10 rounded-full flex items-center justify-center">
                  <span className="text-system-green text-xl">👥</span>
                </div>
                <div className="flex-1">
                  <h3 className="apple-text-headline text-label-primary mb-1">
                    Командная работа
                  </h3>
                  <p className="apple-text-caption-1 text-label-tertiary">
                    Назначайте ответственных через @username
                  </p>
                </div>
              </div>
            </div>

            {/* Real-time Updates */}
            <div className="apple-card p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-system-purple/10 rounded-full flex items-center justify-center">
                  <span className="text-system-purple text-xl">🔄</span>
                </div>
                <div className="flex-1">
                  <h3 className="apple-text-headline text-label-primary mb-1">
                    Обновления в реальном времени
                  </h3>
                  <p className="apple-text-caption-1 text-label-tertiary">
                    Получайте уведомления мгновенно
                  </p>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="apple-card p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-system-orange/10 rounded-full flex items-center justify-center">
                  <span className="text-system-orange text-xl">📊</span>
                </div>
                <div className="flex-1">
                  <h3 className="apple-text-headline text-label-primary mb-1">
                    Аналитика и статистика
                  </h3>
                  <p className="apple-text-caption-1 text-label-tertiary">
                    Отслеживайте эффективность команды
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="apple-card p-4 bg-system-fill-secondary">
            <div className="text-center space-y-2">
              <p className="apple-text-caption-1 text-label-secondary">
                🚀 Приложение оптимизировано для мобильных устройств
              </p>
              <p className="apple-text-caption-2 text-label-tertiary">
                Используйте как веб-приложение или Telegram Mini App
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fab">
        <span>🎯</span>
      </div>
    </div>
  );
};

export default LoginPage;
