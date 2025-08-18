import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Гибридный сервис для интеграции с двумя MCP серверами
 * Node.js MCP (Mini App + Helpdesk) + Python MCP (общие Telegram функции)
 */
@Injectable()
export class HybridTelegramService {
  private readonly logger = new Logger(HybridTelegramService.name);
  private nodeMCPClient: any; // Node.js MCP клиент
  private pythonMCPClient: any; // Python MCP клиент

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.logger.log('HybridTelegram service initialized');
  }

  /**
   * Инициализация Node.js MCP клиента
   */
  setNodeMCPClient(client: any) {
    this.nodeMCPClient = client;
    this.logger.log('Node.js MCP client set');
  }

  /**
   * Инициализация Python MCP клиента
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
   * ========================================
   * NODE.JS MCP ФУНКЦИИ (Mini App + Helpdesk)
   * ========================================
   */

  /**
   * Отправка уведомления о заявке через Node.js MCP
   */
  async sendTicketNotification(
    chatId: string,
    ticket: any,
    notificationType: 'ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT_ADDED' | 'SLA_WARNING' | 'SLA_BREACH'
  ) {
    try {
      if (!this.nodeMCPClient) {
        throw new Error('Node.js MCP client not initialized');
      }

      const result = await this.nodeMCPClient.callTool('send_ticket_notification', {
        chat_id: chatId,
        ticket,
        notification_type: notificationType
      });

      this.logger.log(`Ticket notification sent via Node.js MCP to chat ${chatId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send ticket notification via Node.js MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Создание inline клавиатуры через Node.js MCP
   */
  async createInlineKeyboard(buttons: any[], rows?: number) {
    try {
      if (!this.nodeMCPClient) {
        throw new Error('Node.js MCP client not initialized');
      }

      const result = await this.nodeMCPClient.callTool('create_inline_keyboard', {
        buttons,
        rows
      });

      this.logger.log('Inline keyboard created via Node.js MCP');
      return result;
    } catch (error) {
      this.logger.error(`Failed to create inline keyboard via Node.js MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Управление webhook через Node.js MCP
   */
  async setWebhook(url: string) {
    try {
      if (!this.nodeMCPClient) {
        throw new Error('Node.js MCP client not initialized');
      }

      const result = await this.nodeMCPClient.callTool('set_webhook', { url });
      this.logger.log(`Webhook set via Node.js MCP to ${url}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to set webhook via Node.js MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * ========================================
   * PYTHON MCP ФУНКЦИИ (Общие Telegram функции)
   * ========================================
   */

  /**
   * Получение списка чатов через Python MCP
   */
  async getChats(limit: number = 20) {
    try {
      if (!this.pythonMCPClient) {
        throw new Error('Python MCP client not initialized');
      }

      const result = await this.pythonMCPClient.callTool('get_chats', { limit });
      this.logger.log(`Chats retrieved via Python MCP (${limit} chats)`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to get chats via Python MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Создание группы через Python MCP
   */
  async createGroup(title: string, userIds: number[]) {
    try {
      if (!this.pythonMCPClient) {
        throw new Error('Python MCP client not initialized');
      }

      const result = await this.pythonMCPClient.callTool('create_group', {
        title,
        user_ids: userIds
      });

      this.logger.log(`Group "${title}" created via Python MCP`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create group via Python MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Добавление контакта через Python MCP
   */
  async addContact(phone: string, firstName: string, lastName?: string) {
    try {
      if (!this.pythonMCPClient) {
        throw new Error('Python MCP client not initialized');
      }

      const result = await this.pythonMCPClient.callTool('add_contact', {
        phone,
        first_name: firstName,
        last_name: lastName
      });

      this.logger.log(`Contact ${firstName} ${lastName || ''} added via Python MCP`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to add contact via Python MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Скачивание медиа через Python MCP
   */
  async downloadMedia(messageId: number, chatId: number, savePath?: string) {
    try {
      if (!this.pythonMCPClient) {
        throw new Error('Python MCP client not initialized');
      }

      const result = await this.pythonMCPClient.callTool('download_media', {
        message_id: messageId,
        chat_id: chatId,
        save_path: savePath
      });

      this.logger.log(`Media downloaded via Python MCP from message ${messageId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to download media via Python MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Поиск публичных чатов через Python MCP
   */
  async searchPublicChats(query: string) {
    try {
      if (!this.pythonMCPClient) {
        throw new Error('Python MCP client not initialized');
      }

      const result = await this.pythonMCPClient.callTool('search_public_chats', { query });
      this.logger.log(`Public chats search completed via Python MCP for query: ${query}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to search public chats via Python MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * ========================================
   * ГИБРИДНЫЕ ФУНКЦИИ (Используют оба сервера)
   * ========================================
   */

  /**
   * Отправка комплексного уведомления с использованием обоих MCP
   */
  async sendComplexNotification(
    chatId: string,
    ticket: any,
    notificationType: string,
    includeMedia: boolean = false
  ) {
    try {
      // 1. Отправка основного уведомления через Node.js MCP
      const notificationResult = await this.sendTicketNotification(chatId, ticket, notificationType);

      // 2. Если нужно добавить медиа, используем Python MCP
      if (includeMedia && this.isPythonMCPReady()) {
        try {
          // Получаем информацию о чате через Python MCP для дополнительного контекста
          const chatInfo = await this.pythonMCPClient.callTool('get_chat_info', { chat_id: chatId });
          this.logger.log(`Additional chat info retrieved via Python MCP: ${chatInfo}`);
        } catch (error) {
          this.logger.warn(`Failed to get additional chat info via Python MCP: ${error.message}`);
        }
      }

      return {
        notification: notificationResult,
        hybrid: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Failed to send complex notification: ${error.message}`);
      throw error;
    }
  }

  /**
   * Создание группы поддержки с автоматическими уведомлениями
   */
  async createSupportGroup(
    title: string,
    userIds: number[],
    initialMessage: string
  ) {
    try {
      // 1. Создание группы через Python MCP
      const groupResult = await this.createGroup(title, userIds);

      // 2. Отправка приветственного сообщения через Node.js MCP
      if (this.isNodeMCPReady() && groupResult.chat_id) {
        try {
          await this.nodeMCPClient.callTool('send_telegram_message', {
            chat_id: groupResult.chat_id,
            message: initialMessage,
            parse_mode: 'HTML'
          });
          this.logger.log(`Welcome message sent to new support group via Node.js MCP`);
        } catch (error) {
          this.logger.warn(`Failed to send welcome message via Node.js MCP: ${error.message}`);
        }
      }

      return {
        group: groupResult,
        hybrid: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Failed to create support group: ${error.message}`);
      throw error;
    }
  }

  /**
   * Мониторинг и аналитика через оба MCP
   */
  async getSystemAnalytics() {
    try {
      const analytics = {
        timestamp: new Date().toISOString(),
        node_mcp: {
          ready: this.isNodeMCPReady(),
          tools: []
        },
        python_mcp: {
          ready: this.isPythonMCPReady(),
          tools: []
        }
      };

      // Получение инструментов Node.js MCP
      if (this.isNodeMCPReady()) {
        try {
          const nodeTools = await this.nodeMCPClient.listTools();
          analytics.node_mcp.tools = nodeTools.tools.map((tool: any) => tool.name);
        } catch (error) {
          this.logger.warn(`Failed to get Node.js MCP tools: ${error.message}`);
        }
      }

      // Получение инструментов Python MCP
      if (this.isPythonMCPReady()) {
        try {
          const pythonTools = await this.pythonMCPClient.listTools();
          analytics.python_mcp.tools = pythonTools.tools.map((tool: any) => tool.name);
        } catch (error) {
          this.logger.warn(`Failed to get Python MCP tools: ${error.message}`);
        }
      }

      this.logger.log('System analytics retrieved from both MCP servers');
      return analytics;
    } catch (error) {
      this.logger.error(`Failed to get system analytics: ${error.message}`);
      throw error;
    }
  }

  /**
   * ========================================
   * УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
   * ========================================
   */

  /**
   * Автоматический выбор лучшего MCP для задачи
   */
  private selectBestMCP(task: string): 'node' | 'python' | 'hybrid' {
    const nodeTasks = ['ticket_notification', 'inline_keyboard', 'webhook', 'bot_management'];
    const pythonTasks = ['chat_management', 'contact_management', 'media_download', 'group_creation'];
    
    if (nodeTasks.some(t => task.includes(t))) {
      return 'node';
    } else if (pythonTasks.some(t => task.includes(t))) {
      return 'python';
    } else {
      return 'hybrid';
    }
  }

  /**
   * Fallback механизм между MCP серверами
   */
  async executeWithFallback(
    primaryMCP: 'node' | 'python',
    task: string,
    params: any,
    fallbackTask?: string
  ) {
    try {
      if (primaryMCP === 'node' && this.isNodeMCPReady()) {
        return await this.nodeMCPClient.callTool(task, params);
      } else if (primaryMCP === 'python' && this.isPythonMCPReady()) {
        return await this.pythonMCPClient.callTool(task, params);
      }
    } catch (error) {
      this.logger.warn(`Primary MCP failed, trying fallback: ${error.message}`);
      
      // Попытка fallback
      if (fallbackTask) {
        try {
          if (primaryMCP === 'node' && this.isPythonMCPReady()) {
            return await this.pythonMCPClient.callTool(fallbackTask, params);
          } else if (primaryMCP === 'python' && this.isNodeMCPReady()) {
            return await this.nodeMCPClient.callTool(fallbackTask, params);
          }
        } catch (fallbackError) {
          this.logger.error(`Fallback also failed: ${fallbackError.message}`);
        }
      }
    }
    
    throw new Error(`No available MCP server for task: ${task}`);
  }

  /**
   * Получение статуса всех MCP клиентов
   */
  getMCPStatus() {
    return {
      node_mcp: {
        ready: this.isNodeMCPReady(),
        description: 'Mini App + Helpdesk функции'
      },
      python_mcp: {
        ready: this.isPythonMCPReady(),
        description: 'Общие Telegram функции'
      },
      hybrid: this.isNodeMCPReady() && this.isPythonMCPReady(),
      timestamp: new Date().toISOString()
    };
  }
}
