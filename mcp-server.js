#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Telegram Bot API интеграция
class TelegramMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'telegram-miniapp-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.botUsername = process.env.TELEGRAM_BOT_USERNAME;
    this.baseUrl = 'https://api.telegram.org/bot';

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // Обработчик списка инструментов
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'send_telegram_message',
            description: 'Отправить сообщение в Telegram чат',
            inputSchema: {
              type: 'object',
              properties: {
                chat_id: {
                  type: 'string',
                  description: 'ID чата или username',
                },
                message: {
                  type: 'string',
                  description: 'Текст сообщения',
                },
                parse_mode: {
                  type: 'string',
                  enum: ['HTML', 'Markdown'],
                  description: 'Режим парсинга',
                },
                keyboard: {
                  type: 'object',
                  description: 'Клавиатура (inline_keyboard или reply_markup)',
                },
              },
              required: ['chat_id', 'message'],
            },
          },
          {
            name: 'get_chat_info',
            description: 'Получить информацию о чате',
            inputSchema: {
              type: 'object',
              properties: {
                chat_id: {
                  type: 'string',
                  description: 'ID чата или username',
                },
              },
              required: ['chat_id'],
            },
          },
          {
            name: 'get_chat_members',
            description: 'Получить список участников чата',
            inputSchema: {
              type: 'object',
              properties: {
                chat_id: {
                  type: 'string',
                  description: 'ID чата или username',
                },
              },
              required: ['chat_id'],
            },
          },
          {
            name: 'set_webhook',
            description: 'Установить webhook для бота',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL для webhook',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'delete_webhook',
            description: 'Удалить webhook бота',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_webhook_info',
            description: 'Получить информацию о текущем webhook',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'send_ticket_notification',
            description: 'Отправить уведомление о заявке',
            inputSchema: {
              type: 'object',
              properties: {
                chat_id: {
                  type: 'string',
                  description: 'ID чата',
                },
                ticket: {
                  type: 'object',
                  description: 'Объект заявки',
                },
                notification_type: {
                  type: 'string',
                  enum: ['ASSIGNED', 'STATUS_CHANGED', 'COMMENT_ADDED', 'SLA_WARNING', 'SLA_BREACH'],
                  description: 'Тип уведомления',
                },
              },
              required: ['chat_id', 'ticket', 'notification_type'],
            },
          },
          {
            name: 'create_inline_keyboard',
            description: 'Создать inline клавиатуру для Telegram',
            inputSchema: {
              type: 'object',
              properties: {
                buttons: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      text: { type: 'string' },
                      callback_data: { type: 'string' },
                      url: { type: 'string' },
                      web_app: { type: 'object' },
                    },
                  },
                  description: 'Массив кнопок',
                },
                rows: {
                  type: 'number',
                  description: 'Количество строк (по умолчанию автоматически)',
                },
              },
              required: ['buttons'],
            },
          },
          {
            name: 'get_bot_info',
            description: 'Получить информацию о боте',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // Обработчик вызовов инструментов
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'send_telegram_message':
            return await this.sendMessage(args);
          case 'get_chat_info':
            return await this.getChatInfo(args);
          case 'get_chat_members':
            return await this.getChatMembers(args);
          case 'set_webhook':
            return await this.setWebhook(args);
          case 'delete_webhook':
            return await this.deleteWebhook();
          case 'get_webhook_info':
            return await this.getWebhookInfo();
          case 'send_ticket_notification':
            return await this.sendTicketNotification(args);
          case 'create_inline_keyboard':
            return await this.createInlineKeyboard(args);
          case 'get_bot_info':
            return await this.getBotInfo();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async sendMessage({ chat_id, message, parse_mode = 'HTML', keyboard }) {
    const url = `${this.baseUrl}${this.botToken}/sendMessage`;
    const payload = {
      chat_id,
      text: message,
      parse_mode,
    };

    if (keyboard) {
      payload.reply_markup = keyboard;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: `Message sent successfully to chat ${chat_id}`,
        },
      ],
    };
  }

  async getChatInfo({ chat_id }) {
    const url = `${this.baseUrl}${this.botToken}/getChat`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get chat info: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: `Chat info: ${JSON.stringify(result.result, null, 2)}`,
        },
      ],
    };
  }

  async getChatMembers({ chat_id }) {
    const url = `${this.baseUrl}${this.botToken}/getChatAdministrators`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get chat members: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: `Chat administrators: ${JSON.stringify(result.result, null, 2)}`,
        },
      ],
    };
  }

  async setWebhook({ url }) {
    const webhookUrl = `${this.baseUrl}${this.botToken}/setWebhook`;
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set webhook: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: `Webhook set successfully: ${result.ok}`,
        },
      ],
    };
  }

  async deleteWebhook() {
    const url = `${this.baseUrl}${this.botToken}/deleteWebhook`;
    const response = await fetch(url, { method: 'POST' });

    if (!response.ok) {
      throw new Error(`Failed to delete webhook: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: `Webhook deleted successfully: ${result.ok}`,
        },
      ],
    };
  }

  async getWebhookInfo() {
    const url = `${this.baseUrl}${this.botToken}/getWebhookInfo`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to get webhook info: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: `Webhook info: ${JSON.stringify(result.result, null, 2)}`,
        },
      ],
    };
  }

  async sendTicketNotification({ chat_id, ticket, notification_type }) {
    const emoji = this.getNotificationEmoji(notification_type);
    const status = this.getStatusText(ticket.status);
    const priority = this.getPriorityText(ticket.priority);

    const message = `${emoji} <b>${notification_type}</b>\n\n` +
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
              url: `${process.env.FRONTEND_URL || 'https://your-app.com'}/tickets/${ticket.id}`
            }
          }
        ]
      ]
    };

    return await this.sendMessage({ chat_id, message, keyboard });
  }

  async createInlineKeyboard({ buttons, rows }) {
    let keyboard = [];
    let currentRow = [];

    if (rows) {
      // Если указано количество строк, группируем кнопки по строкам
      for (let i = 0; i < buttons.length; i += rows) {
        keyboard.push(buttons.slice(i, i + rows));
      }
    } else {
      // Автоматическое группирование по одной кнопке в строке
      buttons.forEach(button => {
        keyboard.push([button]);
      });
    }

    return {
      content: [
        {
          type: 'text',
          text: `Inline keyboard created: ${JSON.stringify({ inline_keyboard: keyboard }, null, 2)}`,
        },
      ],
    };
  }

  async getBotInfo() {
    const url = `${this.baseUrl}${this.botToken}/getMe`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to get bot info: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: `Bot info: ${JSON.stringify(result.result, null, 2)}`,
        },
      ],
    };
  }

  private getNotificationEmoji(type) {
    const emojiMap = {
      'ASSIGNED': '👤',
      'STATUS_CHANGED': '🔄',
      'COMMENT_ADDED': '💬',
      'SLA_WARNING': '⏰',
      'SLA_BREACH': '⚠️',
    };
    return emojiMap[type] || '📢';
  }

  private getStatusText(status) {
    const statusMap = {
      'NEW': 'Новая',
      'ASSIGNED': 'Назначена',
      'IN_PROGRESS': 'В работе',
      'ON_HOLD': 'Приостановлена',
      'RESOLVED': 'Решена',
      'CLOSED': 'Закрыта',
    };
    return statusMap[status] || status;
  }

  private getPriorityText(priority) {
    const priorityMap = {
      'LOW': 'Низкий',
      'MEDIUM': 'Средний',
      'HIGH': 'Высокий',
      'CRITICAL': 'Критический',
    };
    return priorityMap[priority] || priority;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Telegram Mini App server started');
  }
}

// Запуск сервера
const server = new TelegramMCPServer();
server.run().catch(console.error);
