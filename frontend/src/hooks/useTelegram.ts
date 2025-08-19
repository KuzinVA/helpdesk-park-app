import { useState, useEffect } from 'react';

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat_instance?: string;
    chat_type?: string;
    start_param?: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    setParams: (params: { text?: string; color?: string; text_color?: string; is_visible?: boolean; is_progress_visible?: boolean; is_active?: boolean }) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  openTelegramLink: (url: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }> }) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: { text?: string }, callback: (data: string | null) => void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback: (data: string | null) => void) => void;
  requestWriteAccess: (callback: (access: boolean) => void) => void;
  requestContact: (callback: (contact: { phone_number: string; first_name: string; last_name?: string; user_id?: number } | null) => void) => void;
  invokeCustomMethod: (method: string, params: any, callback: (data: any) => void) => void;
  version: string;
  platform: string;
  isVersionAtLeast: (version: string) => boolean;
  sendData: (data: string) => void;
  openInvoice: (url: string, callback: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void) => void;
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }> }) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: { text?: string }, callback: (data: string | null) => void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback: (data: string | null) => void) => void;
  requestWriteAccess: (callback: (access: boolean) => void) => void;
  requestContact: (callback: (contact: { phone_number: string; first_name: string; last_name?: string; user_id?: number } | null) => void) => void;
  invokeCustomMethod: (method: string, params: any, callback: (data: any) => void) => void;
  version: string;
  platform: string;
  isVersionAtLeast: (version: string) => boolean;
  sendData: (data: string) => void;
  openInvoice: (url: string, callback: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegram = () => {
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      setIsTelegramApp(true);
      setWebApp(tg);
      
      // Настройка темы
      tg.setHeaderColor('#007AFF');
      tg.setBackgroundColor('#F2F2F7');
      
      // Установка темы
      setTheme(tg.colorScheme);
      
      // Обработчик изменения темы
      tg.onEvent('themeChanged', () => {
        setTheme(tg.colorScheme);
      });
      
      // Получение пользователя
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      // Уведомление о готовности
      tg.ready();
      setIsReady(true);
      
      console.log('✅ Telegram WebApp инициализирован');
    } else {
      console.log('⚠️ Telegram WebApp не доступен');
      setIsReady(true);
    }
  }, []);

  const expand = () => {
    if (webApp && !webApp.isExpanded) {
      webApp.expand();
    }
  };

  const close = () => {
    if (webApp) {
      webApp.close();
    }
  };

  const showMainButton = (text: string, callback: () => void) => {
    if (webApp) {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(callback);
      webApp.MainButton.show();
    }
  };

  const hideMainButton = () => {
    if (webApp) {
      webApp.MainButton.hide();
    }
  };

  const showBackButton = (callback: () => void) => {
    if (webApp) {
      webApp.BackButton.onClick(callback);
      webApp.BackButton.show();
    }
  };

  const hideBackButton = () => {
    if (webApp) {
      webApp.BackButton.hide();
    }
  };

  const hapticFeedback = {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
      if (webApp) {
        webApp.HapticFeedback.impactOccurred(style);
      }
    },
    notificationOccurred: (type: 'error' | 'success' | 'warning') => {
      if (webApp) {
        webApp.HapticFeedback.notificationOccurred(type);
      }
    },
    selectionChanged: () => {
      if (webApp) {
        webApp.HapticFeedback.selectionChanged();
      }
    }
  };

  const showAlert = (message: string, callback?: () => void) => {
    if (webApp) {
      webApp.showAlert(message, callback);
    }
  };

  const showConfirm = (message: string, callback?: (confirmed: boolean) => void) => {
    if (webApp) {
      webApp.showConfirm(message, callback);
    }
  };

  const openLink = (url: string, options?: { try_instant_view?: boolean }) => {
    if (webApp) {
      webApp.openLink(url, options);
    } else {
      window.open(url, '_blank');
    }
  };

  return {
    isTelegramApp,
    isReady,
    user,
    theme,
    webApp,
    expand,
    close,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    openLink
  };
};
