import React, { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTelegram } from '../hooks/useTelegram';

interface LayoutProps {
  children: ReactNode;
}

// 🎨 Mobile-first Layout с Apple-style дизайном
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { hapticFeedback } = useTelegram();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            className="mobile-nav-item"
          >
            <div className="w-12 h-12 bg-system-blue rounded-full flex items-center justify-center mb-1">
              <span className="text-white text-xl">+</span>
            </div>
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute right-4 top-20 bg-system-secondary-background rounded-16 p-4 min-w-48 shadow-lg">
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full text-left p-3 rounded-12 hover:bg-system-fill-secondary apple-transition"
              >
                <div className="flex items-center space-x-3">
                  <span>👤</span>
                  <span className="apple-text-body">Профиль</span>
                </div>
              </button>
              
              <button
                onClick={() => handleNavigation('/stats')}
                className="w-full text-left p-3 rounded-12 hover:bg-system-fill-secondary apple-transition"
              >
                <div className="flex items-center space-x-3">
                  <span>📊</span>
                  <span className="apple-text-body">Статистика</span>
                </div>
              </button>
              
              <div className="border-t border-separator-opaque my-2"></div>
              
              <button
                onClick={handleLogout}
                className="w-full text-left p-3 rounded-12 hover:bg-system-fill-secondary apple-transition text-system-red"
              >
                <div className="flex items-center space-x-3">
                  <span>🚪</span>
                  <span className="apple-text-body">Выйти</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fab" onClick={() => handleNavigation('/tickets/create')}>
        <span>+</span>
      </div>
    </div>
  );
};

export default Layout;
