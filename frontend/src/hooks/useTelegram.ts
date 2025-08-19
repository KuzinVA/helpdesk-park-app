import { useState, useEffect } from 'react';
import { TelegramWebApp } from '../types/telegram';

export const useTelegram = () => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp;
    
    if (telegramWebApp) {
      setTg(telegramWebApp);
      
      // Проверяем, запущено ли приложение в Telegram
      const hasInitData = telegramWebApp.initDataUnsafe.query_id || telegramWebApp.initDataUnsafe.user;
      setIsTelegramApp(!!hasInitData);
      
      if (hasInitData) {
        // Настраиваем цвета в зависимости от темы
        const currentTheme = telegramWebApp.colorScheme;
        telegramWebApp.setHeaderColor(currentTheme === 'dark' ? '#1F2937' : '#FFFFFF');
        telegramWebApp.setBackgroundColor(currentTheme === 'dark' ? '#111827' : '#F9FAFB');
        
        // Готовим приложение
        telegramWebApp.ready();
        setIsReady(true);
        
        console.log('Telegram WebApp initialized:', {
          version: telegramWebApp.version,
          platform: telegramWebApp.platform,
          theme: currentTheme,
          user: telegramWebApp.initDataUnsafe.user,
          chat: telegramWebApp.initDataUnsafe.chat,
        });
      }
    }
  }, []);

  const expand = () => {
    if (tg) {
      tg.expand();
    }
  };

  const close = () => {
    if (tg) {
      tg.close();
    }
  };

  const showAlert = (message: string) => {
    if (tg) {
      tg.showAlert(message);
    }
  };

  const showConfirm = (message: string, callback?: (confirmed: boolean) => void) => {
    if (tg) {
      tg.showConfirm(message, (confirmed: boolean) => {
        if (callback) callback(confirmed);
      });
    }
  };

  const hapticFeedback = {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(style);
      }
    },
    notificationOccurred: (type: 'error' | 'success' | 'warning') => {
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred(type);
      }
    },
    selectionChanged: () => {
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
      }
    },
  };

  return {
    tg,
    isTelegramApp,
    isReady,
    expand,
    close,
    showAlert,
    showConfirm,
    hapticFeedback,
  };
};
