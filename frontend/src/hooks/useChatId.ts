import { useState, useEffect } from 'react';
import { useTelegram } from './useTelegram';

export const useChatId = () => {
  const { webApp } = useTelegram();
  const [chatId, setChatId] = useState<string | number | undefined>(undefined);
  const [chatInfo] = useState<any>(null);

  useEffect(() => {
    if (webApp) {
      // Пытаемся получить chatId из разных источников
      const extractedChatId = 
        webApp.initDataUnsafe?.chat_instance || 
        webApp.initDataUnsafe?.start_param; // start_param может содержать chat ID

      if (extractedChatId) {
        setChatId(extractedChatId);
        console.log('✅ Chat ID найден:', extractedChatId);
      } else {
        console.log('⚠️ Chat ID не найден в WebApp данных');
        
        // Попробуем получить из URL параметров
        const urlParams = new URLSearchParams(window.location.search);
        const urlChatId = urlParams.get('chat_id') || urlParams.get('chat');
        
        if (urlChatId) {
          setChatId(urlChatId);
          console.log('✅ Chat ID найден в URL:', urlChatId);
        }
      }
    }
  }, [webApp]);

  // Функция для установки chatId вручную
  const setChatIdManually = (id: string | number) => {
    setChatId(id);
    console.log('✅ Chat ID установлен вручную:', id);
  };

  // Функция для получения полной информации о чате
  const getChatInfo = () => {
    return chatInfo;
  };

  // Функция для проверки, является ли чат группой
  const isGroupChat = () => {
    const chat = getChatInfo();
    return chat?.type === 'group' || chat?.type === 'supergroup';
  };

  // Функция для получения названия чата
  const getChatTitle = () => {
    const chat = getChatInfo();
    return chat?.title || chat?.first_name || 'Неизвестный чат';
  };

  // Функция для получения username чата
  const getChatUsername = () => {
    const chat = getChatInfo();
    return chat?.username;
  };

  return {
    chatId,
    chatInfo: getChatInfo(),
    setChatId: setChatIdManually,
    isGroupChat: isGroupChat(),
    chatTitle: getChatTitle(),
    chatUsername: getChatUsername(),
    hasChatId: !!chatId,
    isLoading: !webApp,
  };
};
