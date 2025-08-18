import { useCallback, useState } from 'react';

/**
 * React hook для работы с гибридной MCP системой
 * Объединяет функции Node.js MCP (Mini App) и Python MCP (общие функции)
 */
export const useHybridTelegramMCP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Базовый API URL
  const API_BASE = '/api/telegram-hybrid';

  // Утилита для API запросов
  const apiRequest = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // ГИБРИДНЫЕ ФУНКЦИИ (Используют оба MCP)
  // ========================================

  /**
   * Отправка комплексного уведомления с использованием обоих MCP
   */
  const sendComplexNotification = useCallback(async (
    chatId: string,
    ticket: any,
    notificationType: string,
    includeMedia: boolean = false
  ) => {
    return await apiRequest('/send-complex-notification', {
      method: 'POST',
      body: JSON.stringify({
        chat_id: chatId,
        ticket,
        notification_type: notificationType,
        include_media: includeMedia
      })
    });
  }, [apiRequest]);

  /**
   * Создание группы поддержки с автоматическими уведомлениями
   */
  const createSupportGroup = useCallback(async (
    title: string,
    userIds: number[],
    initialMessage: string
  ) => {
    return await apiRequest('/create-support-group', {
      method: 'POST',
      body: JSON.stringify({
        title,
        user_ids: userIds,
        initial_message: initialMessage
      })
    });
  }, [apiRequest]);

  // ========================================
  // NODE.JS MCP ФУНКЦИИ (Mini App + Helpdesk)
  // ========================================

  /**
   * Отправка уведомления о заявке через Node.js MCP
   */
  const sendTicketNotification = useCallback(async (
    chatId: string,
    ticket: any,
    notificationType: 'ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT_ADDED' | 'SLA_WARNING' | 'SLA_BREACH'
  ) => {
    return await apiRequest('/send-ticket-notification', {
      method: 'POST',
      body: JSON.stringify({
        chat_id: chatId,
        ticket,
        notification_type: notificationType
      })
    });
  }, [apiRequest]);

  /**
   * Создание inline клавиатуры через Node.js MCP
   */
  const createInlineKeyboard = useCallback(async (
    buttons: any[],
    rows?: number
  ) => {
    return await apiRequest('/create-keyboard', {
      method: 'POST',
      body: JSON.stringify({ buttons, rows })
    });
  }, [apiRequest]);

  /**
   * Управление webhook через Node.js MCP
   */
  const setWebhook = useCallback(async (url: string) => {
    return await apiRequest('/set-webhook', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  }, [apiRequest]);

  // ========================================
  // PYTHON MCP ФУНКЦИИ (Общие Telegram функции)
  // ========================================

  /**
   * Получение списка чатов через Python MCP
   */
  const getChats = useCallback(async (limit: number = 20) => {
    return await apiRequest(`/chats?limit=${limit}`);
  }, [apiRequest]);

  /**
   * Создание группы через Python MCP
   */
  const createGroup = useCallback(async (
    title: string,
    userIds: number[]
  ) => {
    return await apiRequest('/create-group', {
      method: 'POST',
      body: JSON.stringify({
        title,
        user_ids: userIds
      })
    });
  }, [apiRequest]);

  /**
   * Добавление контакта через Python MCP
   */
  const addContact = useCallback(async (
    phone: string,
    firstName: string,
    lastName?: string
  ) => {
    return await apiRequest('/add-contact', {
      method: 'POST',
      body: JSON.stringify({
        phone,
        first_name: firstName,
        last_name: lastName
      })
    });
  }, [apiRequest]);

  /**
   * Скачивание медиа через Python MCP
   */
  const downloadMedia = useCallback(async (
    messageId: number,
    chatId: number,
    savePath?: string
  ) => {
    return await apiRequest('/download-media', {
      method: 'POST',
      body: JSON.stringify({
        message_id: messageId,
        chat_id: chatId,
        save_path: savePath
      })
    });
  }, [apiRequest]);

  /**
   * Поиск публичных чатов через Python MCP
   */
  const searchPublicChats = useCallback(async (query: string) => {
    return await apiRequest(`/search-public-chats?query=${encodeURIComponent(query)}`);
  }, [apiRequest]);

  // ========================================
  // УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ========================================

  /**
   * Проверка статуса всех MCP клиентов
   */
  const getMCPStatus = useCallback(async () => {
    return await apiRequest('/status');
  }, [apiRequest]);

  /**
   * Получение системной аналитики
   */
  const getSystemAnalytics = useCallback(async () => {
    return await apiRequest('/analytics');
  }, [apiRequest]);

  /**
   * Получение информации о доступных инструментах
   */
  const getAvailableTools = useCallback(async () => {
    return await apiRequest('/tools');
  }, [apiRequest]);

  /**
   * Health check для гибридной системы
   */
  const healthCheck = useCallback(async () => {
    return await apiRequest('/health');
  }, [apiRequest]);

  /**
   * Тестирование гибридной системы
   */
  const testHybridSystem = useCallback(async (action: string, params?: any) => {
    return await apiRequest('/test', {
      method: 'POST',
      body: JSON.stringify({ action, params })
    });
  }, [apiRequest]);

  /**
   * Очистка ошибки
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Состояние
    loading,
    error,
    
    // Утилиты
    clearError,
    
    // Гибридные функции
    sendComplexNotification,
    createSupportGroup,
    
    // Node.js MCP функции
    sendTicketNotification,
    createInlineKeyboard,
    setWebhook,
    
    // Python MCP функции
    getChats,
    createGroup,
    addContact,
    downloadMedia,
    searchPublicChats,
    
    // Утилиты
    getMCPStatus,
    getSystemAnalytics,
    getAvailableTools,
    healthCheck,
    testHybridSystem,
  };
};
