import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';

/**
 * Объединенный Telegram сервис
 * Включает основную функциональность + MCP интеграцию + гибридные возможности
 */
@Injectable()
export class UnifiedTelegramService {
  private readonly logger = new Logger(UnifiedTelegramService.name);
  private readonly botToken: string;
  private readonly botUsername: string;
  private readonly baseUrl: string;
  private readonly frontendUrl: string;

  // MCP клиенты (опционально)
  private nodeMCPClient: any;
  private pythonMCPClient: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.botUsername = this.configService.get<string>('TELEGRAM_BOT_USERNAME');
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  // ========================================
  // ОСНОВНЫЕ TELEGRAM ФУНКЦИИ
  // ========================================

  /**
   * Отправка сообщения в чат
   */
  async sendMessage(chatId: string, message: string, keyboard?: any) {
    try {
      const url = `${this.baseUrl}/sendMessage`;
      const payload: any = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      };

      if (keyboard) {
        payload.reply_markup = keyboard;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
      }

      const result = await response.json();
      this.logger.log(`Message sent to chat ${chatId}: ${result.ok}`);
      return result;
    } catch (error) {
      this.logger.error(`Error sending message to chat ${chatId}:`, error);
      throw error;
    }
  }

  /**
   * Установка webhook
   */
  async setWebhook(url: string) {
    try {
      const webhookUrl = `${this.baseUrl}/setWebhook`;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      this.logger.log(`Webhook set: ${result.ok}`);
      return result;
    } catch (error) {
      this.logger.error('Error setting webhook:', error);
      throw error;
    }
  }

  /**
   * Удаление webhook
   */
  async deleteWebhook() {
    try {
      const webhookUrl = `${this.baseUrl}/deleteWebhook`;
      const response = await fetch(webhookUrl, {
        method: 'POST',
      });

      const result = await response.json();
      this.logger.log(`Webhook deleted: ${result.ok}`);
      return result;
    } catch (error) {
      this.logger.error('Error deleting webhook:', error);
      throw error;
    }
  }

  // ========================================
  // УВЕДОМЛЕНИЯ О ЗАЯВКАХ
  // ========================================

  /**
   * Отправка уведомления о заявке
   */
  async sendTicketNotification(chatId: string, ticket: any, type: string) {
    const emoji = this.getNotificationEmoji(type);
    const status = this.getStatusText(ticket.status);
    const priority = this.getPriorityText(ticket.priority);

    const message = `${emoji} <b>${type}</b>\n\n` +
      `Заявка #${ticket.id.slice(-6)}\n` +
      `Статус: ${status}\n` +
      `Приоритет: ${priority}\n` +
      `Служба: ${ticket.service?.name || 'Не указана'}\n` +
      `Локация: ${ticket.location?.name || 'Не указана'}\n\n` +
      `📝 ${ticket.title}`;

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: 'Открыть заявку',
            web_app: {
              url: `${this.frontendUrl}/tickets/${ticket.id}`
            }
          }
        ]
      ]
    };

    return this.sendMessage(chatId, message, keyboard);
  }

  /**
   * Отправка SLA предупреждения
   */
  async sendSLAWarning(chatId: string, ticket: any) {
    const message = `⏰ <b>SLA ПРЕДУПРЕЖДЕНИЕ</b>\n\n` +
      `Заявка #${ticket.id.slice(-6)} скоро просрочится!\n` +
      `Дедлайн: ${new Date(ticket.slaDeadline).toLocaleString('ru-RU')}\n\n` +
      `📝 ${ticket.title}`;

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: 'Открыть заявку',
            web_app: {
              url: `${this.frontendUrl}/tickets/${ticket.id}`
            }
          }
        ]
      ]
    };

    return this.sendMessage(chatId, message, keyboard);
  }

  /**
   * Отправка SLA нарушения
   */
  async sendSLABreach(chatId: string, ticket: any) {
    const message = `🚨 <b>SLA НАРУШЕНИЕ</b>\n\n` +
      `Заявка #${ticket.id.slice(-6)} просрочена!\n` +
      `Дедлайн: ${new Date(ticket.slaDeadline).toLocaleString('ru-RU')}\n` +
      `Просрочка: ${this.calculateDelay(ticket.slaDeadline)} мин\n\n` +
      `📝 ${ticket.title}`;

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: 'Открыть заявку',
            web_app: {
              url: `${this.frontendUrl}/tickets/${ticket.id}`
            }
          }
        ]
      ]
    };

    return this.sendMessage(chatId, message, keyboard);
  }

  // ========================================
  // MCP ИНТЕГРАЦИЯ (ОПЦИОНАЛЬНО)
  // ========================================

  /**
   * Установка Node.js MCP клиента
   */
  setNodeMCPClient(client: any) {
    this.nodeMCPClient = client;
    this.logger.log('Node.js MCP client set');
  }

  /**
   * Установка Python MCP клиента
   */
  setPythonMCPClient(client: any) {
    this.pythonMCPClient = client;
    this.logger.log('Python MCP client set');
  }

  /**
   * Проверка доступности MCP клиентов
   */
  isNodeMCPReady(): boolean {
    return !!this.nodeMCPClient;
  }

  isPythonMCPReady(): boolean {
    return !!this.pythonMCPClient;
  }

  /**
   * Отправка уведомления через MCP (если доступно)
   */
  async sendTicketNotificationViaMCP(
    chatId: string,
    ticket: any,
    notificationType: 'ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT_ADDED' | 'SLA_WARNING' | 'SLA_BREACH'
  ) {
    try {
      if (this.nodeMCPClient) {
        // Попробуем через Node.js MCP
        const result = await this.nodeMCPClient.callTool('send_ticket_notification', {
          chat_id: chatId,
          ticket,
          notification_type: notificationType
        });
        this.logger.log(`Ticket notification sent via Node.js MCP to chat ${chatId}`);
        return result;
      } else {
        // Fallback на обычную отправку
        return this.sendTicketNotification(chatId, ticket, notificationType);
      }
    } catch (error) {
      this.logger.warn(`MCP failed, falling back to standard method: ${error.message}`);
      return this.sendTicketNotification(chatId, ticket, notificationType);
    }
  }

  // ========================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ========================================

  private getNotificationEmoji(type: string): string {
    const emojiMap: Record<string, string> = {
      'ASSIGNED': '👤',
      'STATUS_CHANGED': '🔄',
      'COMMENT_ADDED': '💬',
      'SLA_WARNING': '⏰',
      'SLA_BREACH': '🚨',
      'default': '📢'
    };
    return emojiMap[type] || emojiMap.default;
  }

  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'NEW': 'Новая',
      'ASSIGNED': 'Назначена',
      'IN_PROGRESS': 'В работе',
      'ON_HOLD': 'На паузе',
      'RESOLVED': 'Решена',
      'CLOSED': 'Закрыта',
      'default': status
    };
    return statusMap[status] || statusMap.default;
  }

  private getPriorityText(priority: string): string {
    const priorityMap: Record<string, string> = {
      'LOW': 'Низкий',
      'MEDIUM': 'Средний',
      'HIGH': 'Высокий',
      'CRITICAL': 'Критический',
      'default': priority
    };
    return priorityMap[priority] || priorityMap.default;
  }

  private calculateDelay(deadline: Date): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return Math.floor((now.getTime() - deadlineDate.getTime()) / (1000 * 60));
  }

  /**
   * Получение информации о боте
   */
  async getBotInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/getMe`);
      const result = await response.json();
      return result.result;
    } catch (error) {
      this.logger.error('Error getting bot info:', error);
      throw error;
    }
  }

  /**
   * Получение информации о чате
   */
  async getChatInfo(chatId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/getChat?chat_id=${chatId}`);
      const result = await response.json();
      return result.result;
    } catch (error) {
      this.logger.error('Error getting chat info:', error);
      throw error;
    }
  }

  /**
   * Получение участников чата
   */
  async getChatMembers(chatId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/getChatAdministrators?chat_id=${chatId}`);
      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(`Telegram API error: ${result.description}`);
      }

      // Получаем всех участников (ограничение Telegram API - только администраторы)
      // Для полного списка участников нужно использовать getChatMemberCount
      const memberCountResponse = await fetch(`${this.baseUrl}/getChatMemberCount?chat_id=${chatId}`);
      const memberCountResult = await memberCountResponse.json();
      
      if (memberCountResult.ok) {
        this.logger.log(`Chat ${chatId} has ${memberCountResult.result} members`);
      }

      return result.result || [];
    } catch (error) {
      this.logger.error(`Error getting chat members for chat ${chatId}:`, error);
      // Возвращаем пустой массив в случае ошибки
      return [];
    }
  }

  /**
   * Отправка уведомления об упоминании пользователя
   */
  async sendMentionNotification(chatId: string, data: {
    ticket: any;
    author: any;
    context: string;
    mentionedUser: any;
  }) {
    try {
      const { ticket, author, context, mentionedUser } = data;
      
      const message = `
🔔 <b>Упоминание в заявке</b>

👤 <b>Вас упомянул:</b> ${author.firstName} ${author.lastName || ''}
📋 <b>Заявка:</b> #${ticket.id} - ${ticket.title}
📝 <b>Контекст:</b> ${this.getContextText(context)}
🔗 <b>Ссылка:</b> <a href="${this.frontendUrl}/tickets/${ticket.id}">Открыть заявку</a>
      `.trim();

      await this.sendMessage(chatId, message);
      this.logger.log(`Mention notification sent to user ${mentionedUser.telegramUsername} in chat ${chatId}`);
      
    } catch (error) {
      this.logger.error(`Error sending mention notification to chat ${chatId}:`, error);
      throw error;
    }
  }

  private getContextText(context: string): string {
    switch (context) {
      case 'ticket_creation': return 'заявке';
      case 'comment': return 'комментарии';
      case 'assignment': return 'назначении';
      default: return 'заявке';
    }
  }
}
