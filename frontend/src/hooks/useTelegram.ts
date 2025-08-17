import { useEffect, useCallback, useState } from 'react';
import { TelegramWebApp, TelegramUser } from '@/types/telegram';

export const useTelegram = () => {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const initTelegram = useCallback(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Инициализируем Telegram WebApp
      tg.ready();
      setIsReady(true);
      
      // Получаем пользователя
      const telegramUser = tg.initDataUnsafe.user;
      if (telegramUser) {
        setUser(telegramUser);
      }
      
      // Настраиваем тему
      const currentTheme = tg.colorScheme;
      setTheme(currentTheme);
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Слушаем изменения темы
      tg.onEvent('themeChanged', () => {
        const newTheme = tg.colorScheme;
        setTheme(newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });
      
      // Настраиваем кнопку назад
      tg.backButton.onClick(() => {
        window.history.back();
      });
      
      // Настраиваем главную кнопку по умолчанию
      tg.mainButton.setText('Создать заявку');
      tg.mainButton.onClick(() => {
        window.location.href = '/create';
      });
      
      // Настраиваем цвет кнопки в соответствии с темой
      if (currentTheme === 'dark') {
        tg.mainButton.setColor('#3B82F6'); // blue-500
        tg.mainButton.setTextColor('#FFFFFF');
      } else {
        tg.mainButton.setColor('#1E40AF'); // blue-700
        tg.mainButton.setTextColor('#FFFFFF');
      }
      
      console.log('Telegram WebApp initialized successfully');
    }
  }, []);

  const showMainButton = useCallback((text: string, onClick: () => void, color?: string) => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.mainButton.setText(text);
      tg.mainButton.onClick(onClick);
      
      if (color) {
        tg.mainButton.setColor(color);
      }
      
      tg.mainButton.show();
    }
  }, []);

  const hideMainButton = useCallback(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.mainButton.hide();
    }
  }, []);

  const showBackButton = useCallback(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.backButton.show();
    }
  }, []);

  const hideBackButton = useCallback(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.backButton.hide();
    }
  }, []);

  const hapticFeedback = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.hapticFeedback.impactOccurred(style);
    }
  }, []);

  const getInitData = useCallback(() => {
    if (window.Telegram?.WebApp) {
      return window.Telegram.WebApp.initData;
    }
    return '';
  }, []);

  const getUser = useCallback(() => {
    if (window.Telegram?.WebApp) {
      return window.Telegram.WebApp.initDataUnsafe.user;
    }
    return null;
  }, []);

  const expandApp = useCallback(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
    }
  }, []);

  const closeApp = useCallback(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.close();
    }
  }, []);

  const showAlert = useCallback((message: string) => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.showAlert(message);
    }
  }, []);

  const showConfirm = useCallback((message: string, callback: (confirmed: boolean) => void) => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.showConfirm(message, (confirmed: boolean) => {
        callback(confirmed);
      });
    }
  }, []);

  const setHeaderColor = useCallback((color: string) => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.setHeaderColor(color);
    }
  }, []);

  const setBackgroundColor = useCallback((color: string) => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.setBackgroundColor(color);
    }
  }, []);

  return {
    isReady,
    user,
    theme,
    initTelegram,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    getInitData,
    getUser,
    expandApp,
    closeApp,
    showAlert,
    showConfirm,
    setHeaderColor,
    setBackgroundColor,
  };
};
