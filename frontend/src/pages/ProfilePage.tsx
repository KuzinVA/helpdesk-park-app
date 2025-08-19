import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTelegram } from '../hooks/useTelegram';
import { useNotifications } from '../components/NotificationProvider';

// 🎨 Mobile-first ProfilePage с Apple-style дизайном
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { hapticFeedback } = useTelegram();
  const { addNotification } = useNotifications();
  
  const [isEditing, setIsEditing] = useState(false);

  const handleBack = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
  };

  const handleLogout = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('medium');
    }
    
    addNotification({
      type: 'info',
      message: 'Выход из системы...',
    });
    
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1000);
  };

  const handleSetting = (setting: string) => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('light');
    }
    
    addNotification({
      type: 'info',
      message: `${setting} - функция в разработке`,
    });
  };

  return (
    <div className="container mobile-padding space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBack}
          className="w-10 h-10 bg-system-fill-secondary rounded-full flex items-center justify-center hover:bg-system-fill-tertiary apple-transition"
        >
          <span className="text-label-primary">←</span>
        </button>
        <div className="flex-1">
          <h1 className="apple-text-title-1 text-label-primary">Профиль</h1>
          <p className="apple-text-caption-1 text-label-tertiary">Управление аккаунтом</p>
        </div>
        <button
          onClick={handleEdit}
          className="w-10 h-10 bg-system-fill-secondary rounded-full flex items-center justify-center hover:bg-system-fill-tertiary apple-transition"
        >
          <span className="text-label-primary">✏️</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="apple-card p-6 text-center space-y-4">
        <div className="w-24 h-24 bg-system-blue/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-system-blue text-4xl">👤</span>
        </div>
        
        <div className="space-y-2">
          <h2 className="apple-text-title-2 text-label-primary">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="apple-text-body text-label-secondary">
            @{user?.username}
          </p>
          <p className="apple-text-caption-1 text-label-tertiary">
            {user?.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <p className="apple-text-title-3 font-bold text-label-primary">15</p>
            <p className="apple-text-caption-1 text-label-tertiary">Заявок</p>
          </div>
          <div className="w-px h-8 bg-separator-opaque"></div>
          <div className="text-center">
            <p className="apple-text-title-3 font-bold text-label-primary">8</p>
            <p className="apple-text-caption-1 text-label-tertiary">Решено</p>
          </div>
          <div className="w-px h-8 bg-separator-opaque"></div>
          <div className="text-center">
            <p className="apple-text-title-3 font-bold text-label-primary">92%</p>
            <p className="apple-text-caption-1 text-label-tertiary">Эффективность</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mobile-grid">
        <div className="apple-card p-4 text-center">
          <div className="w-12 h-12 bg-system-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-system-green text-xl">📈</span>
          </div>
          <p className="apple-text-headline text-label-primary">Активность</p>
          <p className="apple-text-caption-1 text-label-tertiary">Высокая</p>
        </div>

        <div className="apple-card p-4 text-center">
          <div className="w-12 h-12 bg-system-blue/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-system-blue text-xl">⏱️</span>
          </div>
          <p className="apple-text-headline text-label-primary">Время ответа</p>
          <p className="apple-text-caption-1 text-label-tertiary">2.5 часа</p>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <h3 className="apple-text-headline text-label-primary">Настройки</h3>
        
        <div className="space-y-2">
          {[
            { icon: '🔔', title: 'Уведомления', subtitle: 'Настройка уведомлений' },
            { icon: '🌙', title: 'Темная тема', subtitle: 'Автоматическое переключение' },
            { icon: '🔒', title: 'Безопасность', subtitle: 'Двухфакторная аутентификация' },
            { icon: '🌐', title: 'Язык', subtitle: 'Русский' },
          ].map((setting, index) => (
            <button
              key={index}
              onClick={() => handleSetting(setting.title)}
              className="apple-card p-4 w-full text-left hover:scale-105 apple-transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-system-fill-secondary rounded-full flex items-center justify-center">
                  <span className="text-label-primary text-lg">{setting.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="apple-text-headline text-label-primary">{setting.title}</h4>
                  <p className="apple-text-caption-1 text-label-tertiary">{setting.subtitle}</p>
                </div>
                <span className="text-label-tertiary">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-3">
        <h3 className="apple-text-headline text-label-primary">Аккаунт</h3>
        
        <div className="space-y-2">
          <button
            onClick={() => handleSetting('Экспорт данных')}
            className="apple-card p-4 w-full text-left hover:scale-105 apple-transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-system-blue/10 rounded-full flex items-center justify-center">
                <span className="text-system-blue text-lg">📤</span>
              </div>
              <div className="flex-1">
                <h4 className="apple-text-headline text-label-primary">Экспорт данных</h4>
                <p className="apple-text-caption-1 text-label-tertiary">Скачать ваши данные</p>
              </div>
              <span className="text-label-tertiary">→</span>
            </div>
          </button>

          <button
            onClick={() => handleSetting('Удалить аккаунт')}
            className="apple-card p-4 w-full text-left hover:scale-105 apple-transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-system-red/10 rounded-full flex items-center justify-center">
                <span className="text-system-red text-lg">🗑️</span>
              </div>
              <div className="flex-1">
                <h4 className="apple-text-headline text-system-red">Удалить аккаунт</h4>
                <p className="apple-text-caption-1 text-label-tertiary">Безвозвратное удаление</p>
              </div>
              <span className="text-label-tertiary">→</span>
            </div>
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full apple-button-secondary py-4 text-lg font-medium hover:scale-105 apple-transition text-system-red"
      >
        <div className="flex items-center justify-center space-x-3">
          <span className="text-xl">🚪</span>
          <span>Выйти из системы</span>
        </div>
      </button>

      {/* App Info */}
      <div className="text-center space-y-2">
        <p className="apple-text-caption-2 text-label-tertiary">
          Helpdesk Park v1.0.0
        </p>
        <p className="apple-text-caption-2 text-label-tertiary">
          © 2024 Все права защищены
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
