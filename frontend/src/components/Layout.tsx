import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTelegram } from '../hooks/useTelegram';

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isTelegramApp, expand } = useTelegram();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Заявки', href: '/tickets', icon: '📋' },
    { name: 'Статистика', href: '/stats', icon: '📊' },
    { name: 'Профиль', href: '/profile', icon: '👤' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    if (isTelegramApp) {
      expand();
    }
  };

  return (
    <div className="min-h-screen bg-system-background">
      {/* Header */}
      <header className="bg-secondary-system-background border-b border-separator-non-opaque">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-system-blue rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">H</span>
                </div>
                <span className="apple-text-headline text-label-primary">
                  Helpdesk Park
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg apple-transition ${
                    isActive(item.href)
                      ? 'bg-system-blue text-white'
                      : 'text-label-secondary hover:text-label-primary hover:bg-fill-quaternary'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="apple-text-subheadline">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="apple-text-subheadline text-label-primary">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="apple-text-caption-1 text-label-tertiary">
                      {user.role}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="apple-button-secondary px-4 py-2"
                  >
                    Выйти
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-label-secondary hover:text-label-primary hover:bg-fill-quaternary"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-secondary-system-background border-b border-separator-non-opaque">
          <nav className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg apple-transition ${
                  isActive(item.href)
                    ? 'bg-system-blue text-white'
                    : 'text-label-secondary hover:text-label-primary hover:bg-fill-quaternary'
                }`}
              >
                <span>{item.icon}</span>
                <span className="apple-text-subheadline">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary-system-background border-t border-separator-non-opaque mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="apple-text-caption-1 text-label-tertiary">
              © 2024 Helpdesk Park. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
