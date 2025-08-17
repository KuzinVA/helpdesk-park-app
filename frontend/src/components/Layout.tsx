import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useTelegram } from '@/hooks/useTelegram';
import { useTelegramButtons } from '@/hooks/useTelegramButtons';
import { TelegramUserInfo } from './TelegramUserInfo';
import { 
  Home, 
  Plus, 
  BarChart3, 
  User,
  Bell,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user: authUser } = useAuthStore();
  const location = useLocation();
  const { 
    user: telegramUser, 
    theme,
    setHeaderColor,
    setBackgroundColor 
  } = useTelegram();
  
  // Используем новый хук для управления кнопками
  useTelegramButtons();
  
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    // Настраиваем цвета заголовка в соответствии с темой
    if (theme === 'dark') {
      setHeaderColor('#1F2937'); // gray-800
      setBackgroundColor('#111827'); // gray-900
    } else {
      setHeaderColor('#FFFFFF'); // white
      setBackgroundColor('#F9FAFB'); // gray-50
    }
  }, [theme, setHeaderColor, setBackgroundColor]);

  const navigation = [
    { name: 'Заявки', href: '/tickets', icon: Home },
    { name: 'Создать', href: '/create', icon: Plus },
    { name: 'Статистика', href: '/stats', icon: BarChart3 },
    { name: 'Профиль', href: '/profile', icon: User },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-2 lg:ml-0">
                Helpdesk Park
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Уведомления */}
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                <Bell className="h-6 w-6" />
              </button>
              
              {/* Пользователь */}
              {telegramUser ? (
                <TelegramUserInfo user={telegramUser} className="hidden sm:flex" />
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {authUser?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                    {authUser?.firstName || 'Пользователь'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={closeSidebar} />
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white dark:bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Меню</h2>
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={closeSidebar}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeSidebar}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* User info in mobile sidebar */}
            {telegramUser && (
              <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <TelegramUserInfo user={telegramUser} showDetails={true} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden z-40">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 text-sm font-medium ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <item.icon className="h-6 w-6 mb-1" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Helpdesk Park
              </h1>
            </div>
            
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-4 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* User info in desktop sidebar */}
            {telegramUser && (
              <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <TelegramUserInfo user={telegramUser} showDetails={true} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop main content offset */}
      <div className="hidden lg:block lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};
