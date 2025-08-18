import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Сервис для интеграции с MCP (Model Context Protocol) инструментами Telegram
 * Предоставляет высокоуровневый API для работы с Telegram через MCP
 */
@Injectable()
export class TelegramMCPService {
  private readonly logger = new Logger(TelegramMCPService.name);
  private readonly mcpClient: any; // MCP клиент будет инициализирован позже

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.logger.log('TelegramMCP service initialized');
  }

  /**
   * Инициализация MCP клиента
   * @param mcpClient Экземпляр MCP клиента
   */
  setMCPClient(mcpClient: any) {
    this.mcpClient = mcpClient;
    this.logger.log('MCP client set');
  }

  /**
   * Отправка простого сообщения в чат
   * @param chatId ID чата или username
   * @param message Текст сообщения
   * @param parseMode Режим парсинга (HTML/Markdown)
   * @param keyboard Клавиатура (опционально)
   */
  async sendMessage(
    chatId: string,
    message: string,
    parseMode: 'HTML' | 'Markdown' = 'HTML',
    keyboard?: any
  ) {
    try {
      if (!this.mcpClient) {
        throw new Error('MCP client not initialized');
      }

      const result = await this.mcpClient.callTool('send_telegram_message', {
        chat_id: chatId,
        message,
        parse_mode: parseMode,
        keyboard
      });

      this.logger.log(`Message sent to chat ${chatId} via MCP`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send message via MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Отправка уведомления о заявке
   * @param chatId ID чата
   * @param ticket Объект заявки
   * @param notificationType Тип уведомления
   */
  async sendTicketNotification(
    chatId: string,
    ticket: any,
    notificationType: 'ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT_ADDED' | 'SLA_WARNING' | 'SLA_BREACH'
  ) {
    try {
      if (!this.mcpClient) {
        throw new Error('MCP client not initialized');
      }

      const result = await this.mcpClient.callTool('send_ticket_notification', {
        chat_id: chatId,
        ticket,
        notification_type: notificationType
      });

      this.logger.log(`Ticket notification sent to chat ${chatId} via MCP`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send ticket notification via MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получение информации о чате
   * @param chatId ID чата или username
   */
  async getChatInfo(chatId: string) {
    try {
      if (!this.mcpClient) {
        throw new Error('MCP client not initialized');
      }

      const result = await this.mcpClient.callTool('get_chat_info', {
        chat_id: chatId
      });

      this.logger.log(`Chat info retrieved for ${chatId} via MCP`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to get chat info via MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получение списка участников чата
   * @param chatId ID чата или username
   */
  async getChatMembers(chatId: string) {
    try {
      if (!this.mcpClient) {
        throw new Error('MCP client not initialized');
      }

      const result = await this.mcpClient.callTool('get_chat_members', {
        chat_id: chatId
      });

      this.logger.log(`Chat members retrieved for ${chatId} via MCP`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to get chat members via MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Установка webhook для бота
   * @param url URL для webhook
   */
  async setWebhook(url: string) {
    try {
      if (!this.mcpClient) {
        throw new Error('MCP client not initialized');
      }

      const result = await this.mcpClient.callTool('set_webhook', { url });

      this.logger.log(`Webhook set to ${url} via MCP`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to set webhook via MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Удаление webhook
   */
  async deleteWebhook() {
    try {
      if (!this.mcpClient) {
        throw new Error('MCP client not initialized');
      }

      const result = await this.mcpClient.callTool('delete_webhook', {});

      this.logger.log('Webhook deleted via MCP');
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete webhook via MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получение информации о webhook
   */
  async getWebhookInfo() {
    try {
      if (!this.mcpClient) {
        throw new Error('MCP client not initialized');
      }

      const result = await this.mcpClient.callTool('get_webhook_info', {});

      this.logger.log('Webhook info retrieved via MCP');
      return result;
    } catch (error) {
      this.logger.error(`Failed to get webhook info via MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Создание inline клавиатуры
   * @param buttons Массив кнопок
   * @param rows Количество строк (опционально)
   */
  async createInlineKeyboard(buttons: any[], rows?: number) {
    try {
      if (!this.mcpClient) {
        throw new Error('MCP client not initialized');
      }

      const result = await this.mcpClient.callTool('create_inline_keyboard', {
        buttons,
        rows
      });

      this.logger.log('Inline keyboard created via MCP');
      return result;
    } catch (error) {
      this.logger.error(`Failed to create inline keyboard via MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получение информации о боте
   */
  async getBotInfo() {
    try {
      if (!this.mcpClient) {
        throw new Error('MCP client not initialized');
      }

      const result = await this.mcpClient.callTool('get_bot_info', {});

      this.logger.log('Bot info retrieved via MCP');
      return result;
    } catch (error) {
      this.logger.error(`Failed to get bot info via MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Отправка сообщения с готовой клавиатурой
   * @param chatId ID чата
   * @param message Текст сообщения
   * @param keyboard Готовая клавиатура
   */
  async sendMessageWithKeyboard(
    chatId: string,
    message: string,
    keyboard: any
  ) {
    return this.sendMessage(chatId, message, 'HTML', keyboard);
  }

  /**
   * Отправка SLA предупреждения
   * @param chatId ID чата
   * @param ticket Объект заявки
   */
  async sendSLAWarning(chatId: string, ticket: any) {
    return this.sendTicketNotification(chatId, ticket, 'SLA_WARNING');
  }

  /**
   * Отправка уведомления о нарушении SLA
   * @param chatId ID чата
   * @param ticket Объект заявки
   */
  async sendSLABreach(chatId: string, ticket: any) {
    return this.sendTicketNotification(chatId, ticket, 'SLA_BREACH');
  }

  /**
   * Отправка уведомления о назначении заявки
   * @param chatId ID чата
   * @param ticket Объект заявки
   */
  async sendAssignmentNotification(chatId: string, ticket: any) {
    return this.sendTicketNotification(chatId, ticket, 'ASSIGNED');
  }

  /**
   * Отправка уведомления об изменении статуса
   * @param chatId ID чата
   * @param ticket Объект заявки
   */
  async sendStatusChangeNotification(chatId: string, ticket: any) {
    return this.sendTicketNotification(chatId, ticket, 'STATUS_CHANGED');
  }

  /**
   * Отправка уведомления о добавлении комментария
   * @param chatId ID чата
   * @param ticket Объект заявки
   */
  async sendCommentNotification(chatId: string, ticket: any) {
    return this.sendTicketNotification(chatId, ticket, 'COMMENT_ADDED');
  }

  /**
   * Проверка состояния MCP клиента
   */
  isMCPReady(): boolean {
    return !!this.mcpClient;
  }

  /**
   * Получение списка доступных MCP инструментов
   */
  async getAvailableTools() {
    try {
      if (!this.mcpClient) {
        throw new Error('MCP client not initialized');
      }

      const tools = await this.mcpClient.listTools();
      this.logger.log(`Available MCP tools: ${tools.tools.length}`);
      return tools;
    } catch (error) {
      this.logger.error(`Failed to get available tools: ${error.message}`);
      throw error;
    }
  }
}
