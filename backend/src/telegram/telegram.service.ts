import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly botUsername: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.botUsername = this.configService.get<string>('TELEGRAM_BOT_USERNAME');
  }

  async sendMessage(chatId: string, message: string, keyboard?: any) {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
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
              url: `${this.configService.get('FRONTEND_URL')}/tickets/${ticket.id}`
            }
          }
        ]
      ]
    };

    return this.sendMessage(chatId, message, keyboard);
  }

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
              url: `${this.configService.get('FRONTEND_URL')}/tickets/${ticket.id}`
            }
          }
        ]
      ]
    };

    return this.sendMessage(chatId, message, keyboard);
  }

  async sendSLABreach(chatId: string, ticket: any) {
    const message = `⚠️ <b>SLA ПРОСРОЧЕН</b>\n\n` +
      `Заявка #${ticket.id.slice(-6)} просрочена!\n` +
      `Дедлайн: ${new Date(ticket.slaDeadline).toLocaleString('ru-RU')}\n\n` +
      `📝 ${ticket.title}`;

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: 'Открыть заявку',
            web_app: {
              url: `${this.configService.get('FRONTEND_URL')}/tickets/${ticket.id}`
            }
          }
        ]
      ]
    };

    return this.sendMessage(chatId, message, keyboard);
  }

  async setWebhook(url: string) {
    try {
      const webhookUrl = `https://api.telegram.org/bot${this.botToken}/setWebhook`;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Failed to set webhook: ${response.statusText}`);
      }

      const result = await response.json();
      this.logger.log(`Webhook set: ${result.ok}`);
      return result;
    } catch (error) {
      this.logger.error('Error setting webhook:', error);
      throw error;
    }
  }

  async deleteWebhook() {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/deleteWebhook`;
      const response = await fetch(url, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete webhook: ${response.statusText}`);
      }

      const result = await response.json();
      this.logger.log(`Webhook deleted: ${result.ok}`);
      return result;
    } catch (error) {
      this.logger.error('Error deleting webhook:', error);
      throw error;
    }
  }

  private getNotificationEmoji(type: string): string {
    switch (type) {
      case 'ASSIGNED': return '👤';
      case 'STATUS_CHANGED': return '🔄';
      case 'COMMENT_ADDED': return '💬';
      case 'SLA_WARNING': return '⏰';
      case 'SLA_BREACH': return '⚠️';
      default: return '📢';
    }
  }

  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'NEW': 'Новая',
      'ASSIGNED': 'Назначена',
      'IN_PROGRESS': 'В работе',
      'ON_HOLD': 'Приостановлена',
      'RESOLVED': 'Решена',
      'CLOSED': 'Закрыта',
    };
    return statusMap[status] || status;
  }

  private getPriorityText(priority: string): string {
    const priorityMap: Record<string, string> = {
      'LOW': 'Низкий',
      'MEDIUM': 'Средний',
      'HIGH': 'Высокий',
      'CRITICAL': 'Критический',
    };
    return priorityMap[priority] || priority;
  }
}
