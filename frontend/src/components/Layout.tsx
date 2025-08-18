import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTelegram } from '@/hooks/useTelegram';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isTelegramApp, setHeaderColor, setBackgroundColor } = useTelegram();

  // Определяем активный маршрут
  const isActive = (path: string) => location.pathname === path;

  // Навигационные элементы
  const navItems = [
    { path: '/tickets', label: '📋 Заявки', icon: '📋' },
    { path: '/create', label: '➕ Создать', icon: '➕' },
    { path: '/stats', label: '📊 Статистика', icon: '📊' },
    { path: '/profile', label: '👤 Профиль', icon: '👤' },
  ];

  // Устанавливаем цвета заголовка для Telegram
  React.useEffect(() => {
    if (isTelegramApp) {
      setHeaderColor('rgba(255, 255, 255, 0.9)');
      setBackgroundColor('rgba(254, 243, 199, 0.8)');
    }
  }, [isTelegramApp, setHeaderColor, setBackgroundColor]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-grouped)' }}>
      {/* Верхняя панель навигации */}
      <header className="sticky top-0 z-50 apple-card border-b border-separator-non-opaque backdrop-blur-xl" 
              style={{ 
                background: 'var(--bg-primary)', 
                borderColor: 'var(--separator-non-opaque)'
              }}>
        <div className="apple-container flex items-center justify-between py-2">
          {/* Логотип */}
          <Link to="/" className="flex items-center space-x-3 group apple-transition">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center apple-transition group-hover:scale-105" 
                 style={{ backgroundColor: 'var(--system-blue)' }}>
              <span className="text-white text-lg font-semibold">H</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="apple-text-headline" style={{ color: 'var(--label-primary)' }}>
                Helpdesk Park
              </h1>
              <p className="apple-text-caption">Управление заявками</p>
            </div>
          </Link>

          {/* Мобильное меню */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg apple-transition"
            style={{ backgroundColor: 'var(--fill-quaternary)' }}
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
              <span className={`w-4 h-0.5 apple-transition ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}
                    style={{ backgroundColor: 'var(--label-primary)' }}></span>
              <span className={`w-4 h-0.5 apple-transition ${isMenuOpen ? 'opacity-0' : ''}`}
                    style={{ backgroundColor: 'var(--label-primary)' }}></span>
              <span className={`w-4 h-0.5 apple-transition ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}
                    style={{ backgroundColor: 'var(--label-primary)' }}></span>
            </div>
          </button>

          {/* Десктопная навигация */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg apple-transition apple-text-body ${
                  isActive(item.path)
                    ? 'apple-button-primary'
                    : ''
                }`}
                style={!isActive(item.path) ? { 
                  color: 'var(--label-primary)',
                  backgroundColor: 'transparent'
                } : {}}
              >
                <span className="hidden sm:inline mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="lg:hidden glass-card mx-4 mb-4 p-4 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Основной контент */}
      <main className="container-padding pb-20">
        <div className="fade-in">
          {children}
        </div>
      </main>

      {/* Нижняя навигация для мобильных устройств */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="glass-card mx-4 mb-4 p-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Индикатор прокрутки */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform origin-left scale-x-0 transition-transform duration-300 ease-out" 
           style={{ transform: `scaleX(${Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1)})` }}>
      </div>
    </div>
  );
};
