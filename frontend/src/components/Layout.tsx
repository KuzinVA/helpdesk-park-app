import React, { useState, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTelegram } from '../hooks/useTelegram';

interface LayoutProps {
  children: ReactNode;
}

// 🎨 Mobile-first Layout с Apple-style дизайном и Mini App интеграцией
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { 
    hapticFeedback, 
    isTelegramApp, 
    showBackButton, 
    hideBackButton,
    showMainButton,
    hideMainButton 
  } = useTelegram();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Настройка Mini App навигации
  useEffect(() => {
    if (isTelegramApp) {
      // Показываем кнопку "Назад" для всех страниц кроме главной
      if (location.pathname !== '/dashboard') {
        showBackButton(() => {
          navigate(-1);
          hapticFeedback?.impactOccurred('light');
        });
      } else {
        hideBackButton();
      }

      // Показываем главную кнопку для создания заявки
      if (location.pathname === '/tickets/create') {
        showMainButton('📝 Создать заявку', () => {
          // Логика создания заявки
          hapticFeedback?.impactOccurred('medium');
        });
      } else {
        hideMainButton();
      }
    }
  }, [location.pathname, isTelegramApp, showBackButton, hideBackButton, showMainButton, hideMainButton, navigate, hapticFeedback]);

  const handleNavigation = (path: string) => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('medium');
    }
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-system-background">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🎠</span>
            </div>
            <div>
              <h1 className="apple-text-title-2 text-white font-bold">Helpdesk Park</h1>
              <p className="apple-text-caption-1 text-white/80">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
          
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-sm">☰</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск заявок, пользователей..."
              className="search-bar w-full pl-10"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-label-tertiary">
              🔍
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <div className="flex justify-around">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="text-xl mb-1">🏠</span>
            <span className="apple-text-caption-2">Дашборд</span>
          </button>

          <button
            onClick={() => handleNavigation('/tickets')}
            className={`mobile-nav-item ${isActive('/tickets') ? 'active' : ''}`}
          >
            <span className="text-xl mb-1">📋</span>
            <span className="apple-text-caption-2">Заявки</span>
          </button>

          <button
            onClick={() => handleNavigation('/tickets/create')}
            className={`mobile-nav-item ${isActive('/tickets/create') ? 'active' : ''}`}
          >
            <span className="text-xl mb-1">➕</span>
            <span className="apple-text-caption-2">Создать</span>
          </button>

          <button
            onClick={() => handleNavigation('/stats')}
            className={`mobile-nav-item ${isActive('/stats') ? 'active' : ''}`}
          >
            <span className="text-xl mb-1">📊</span>
            <span className="apple-text-caption-2">Статистика</span>
          </button>

          <button
            onClick={() => handleNavigation('/profile')}
            className={`mobile-nav-item ${isActive('/profile') ? 'active' : ''}`}
          >
            <span className="text-xl mb-1">👤</span>
            <span className="apple-text-caption-2">Профиль</span>
          </button>
        </div>
      </nav>

      {/* Mini App Status Indicator */}
      {isTelegramApp && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
          📱 Mini App
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <h3 className="apple-text-title-3 text-white">Меню</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="mobile-menu-items">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="mobile-menu-item"
              >
                🏠 Дашборд
              </button>
              
              <button
                onClick={() => handleNavigation('/tickets')}
                className="mobile-menu-item"
              >
                📋 Заявки
              </button>
              
              <button
                onClick={() => handleNavigation('/tickets/create')}
                className="mobile-menu-item"
              >
                ➕ Создать заявку
              </button>
              
              <button
                onClick={() => handleNavigation('/stats')}
                className="mobile-menu-item"
              >
                📊 Статистика
              </button>
              
              <button
                onClick={() => handleNavigation('/profile')}
                className="mobile-menu-item"
              >
                👤 Профиль
              </button>
              
              <div className="border-t border-white/20 my-2"></div>
              
              <button
                onClick={handleLogout}
                className="mobile-menu-item text-red-400"
              >
                🚪 Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
