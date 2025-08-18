import { Controller, Post, Get, Body, Param, Query, Logger } from '@nestjs/common';
import { HybridTelegramService } from './hybrid-telegram.service';

/**
 * Гибридный контроллер для интеграции с двумя MCP серверами
 * Предоставляет REST API для работы с Node.js и Python MCP
 */
@Controller('api/telegram-hybrid')
export class HybridTelegramController {
  private readonly logger = new Logger(HybridTelegramController.name);

  constructor(private readonly hybridTelegramService: HybridTelegramService) {}

  /**
   * Проверка статуса всех MCP клиентов
   */
  @Get('status')
  async getMCPStatus() {
    this.logger.log('Getting MCP status for hybrid system');
    return this.hybridTelegramService.getMCPStatus();
  }

  /**
   * Получение системной аналитики через оба MCP
   */
  @Get('analytics')
  async getSystemAnalytics() {
    this.logger.log('Getting system analytics from both MCP servers');
    return await this.hybridTelegramService.getSystemAnalytics();
  }

  /**
   * Отправка комплексного уведомления с использованием обоих MCP
   */
  @Post('send-complex-notification')
  async sendComplexNotification(@Body() body: {
    chat_id: string;
    ticket: any;
    notification_type: string;
    include_media?: boolean;
  }) {
    this.logger.log(`Sending complex notification to chat ${body.chat_id} via hybrid MCP`);
    
    return await this.hybridTelegramService.sendComplexNotification(
      body.chat_id,
      body.ticket,
      body.notification_type,
      body.include_media || false
    );
  }

  /**
   * Создание группы поддержки с автоматическими уведомлениями
   */
  @Post('create-support-group')
  async createSupportGroup(@Body() body: {
    title: string;
    user_ids: number[];
    initial_message: string;
  }) {
    this.logger.log(`Creating support group "${body.title}" via hybrid MCP`);
    
    return await this.hybridTelegramService.createSupportGroup(
      body.title,
      body.user_ids,
      body.initial_message
    );
  }

  /**
   * ========================================
   * NODE.JS MCP ФУНКЦИИ (через гибридный сервис)
   * ========================================
   */

  /**
   * Отправка уведомления о заявке через Node.js MCP
   */
  @Post('send-ticket-notification')
  async sendTicketNotification(@Body() body: {
    chat_id: string;
    ticket: any;
    notification_type: 'ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT_ADDED' | 'SLA_WARNING' | 'SLA_BREACH';
  }) {
    this.logger.log(`Sending ticket notification to chat ${body.chat_id} via Node.js MCP`);
    
    return await this.hybridTelegramService.sendTicketNotification(
      body.chat_id,
      body.ticket,
      body.notification_type
    );
  }

  /**
   * Создание inline клавиатуры через Node.js MCP
   */
  @Post('create-keyboard')
  async createInlineKeyboard(@Body() body: {
    buttons: any[];
    rows?: number;
  }) {
    this.logger.log('Creating inline keyboard via Node.js MCP');
    
    return await this.hybridTelegramService.createInlineKeyboard(
      body.buttons,
      body.rows
    );
  }

  /**
   * Управление webhook через Node.js MCP
   */
  @Post('set-webhook')
  async setWebhook(@Body() body: { url: string }) {
    this.logger.log(`Setting webhook to ${body.url} via Node.js MCP`);
    
    return await this.hybridTelegramService.setWebhook(body.url);
  }

  /**
   * ========================================
   * PYTHON MCP ФУНКЦИИ (через гибридный сервис)
   * ========================================
   */

  /**
   * Получение списка чатов через Python MCP
   */
  @Get('chats')
  async getChats(@Query('limit') limit: number = 20) {
    this.logger.log(`Getting ${limit} chats via Python MCP`);
    
    return await this.hybridTelegramService.getChats(limit);
  }

  /**
   * Создание группы через Python MCP
   */
  @Post('create-group')
  async createGroup(@Body() body: {
    title: string;
    user_ids: number[];
  }) {
    this.logger.log(`Creating group "${body.title}" via Python MCP`);
    
    return await this.hybridTelegramService.createGroup(
      body.title,
      body.user_ids
    );
  }

  /**
   * Добавление контакта через Python MCP
   */
  @Post('add-contact')
  async addContact(@Body() body: {
    phone: string;
    first_name: string;
    last_name?: string;
  }) {
    this.logger.log(`Adding contact ${body.first_name} ${body.last_name || ''} via Python MCP`);
    
    return await this.hybridTelegramService.addContact(
      body.phone,
      body.first_name,
      body.last_name
    );
  }

  /**
   * Скачивание медиа через Python MCP
   */
  @Post('download-media')
  async downloadMedia(@Body() body: {
    message_id: number;
    chat_id: number;
    save_path?: string;
  }) {
    this.logger.log(`Downloading media from message ${body.message_id} via Python MCP`);
    
    return await this.hybridTelegramService.downloadMedia(
      body.message_id,
      body.chat_id,
      body.save_path
    );
  }

  /**
   * Поиск публичных чатов через Python MCP
   */
  @Get('search-public-chats')
  async searchPublicChats(@Query('query') query: string) {
    this.logger.log(`Searching public chats for query: ${query} via Python MCP`);
    
    return await this.hybridTelegramService.searchPublicChats(query);
  }

  /**
   * ========================================
   * УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
   * ========================================
   */

  /**
   * Тестирование гибридной системы
   */
  @Post('test')
  async testHybridSystem(@Body() body: { action: string; params?: any }) {
    this.logger.log(`Testing hybrid MCP system with action: ${body.action}`);
    
    try {
      switch (body.action) {
        case 'node_mcp_status':
          return {
            node_mcp_ready: this.hybridTelegramService.isNodeMCPReady(),
            description: 'Node.js MCP (Mini App + Helpdesk)'
          };
        
        case 'python_mcp_status':
          return {
            python_mcp_ready: this.hybridTelegramService.isPythonMCPReady(),
            description: 'Python MCP (Общие Telegram функции)'
          };
        
        case 'hybrid_status':
          return this.hybridTelegramService.getMCPStatus();
        
        case 'test_node_mcp':
          if (!this.hybridTelegramService.isNodeMCPReady()) {
            throw new Error('Node.js MCP not ready');
          }
          return { status: 'Node.js MCP is ready and working' };
        
        case 'test_python_mcp':
          if (!this.hybridTelegramService.isPythonMCPReady()) {
            throw new Error('Python MCP not ready');
          }
          return { status: 'Python MCP is ready and working' };
        
        default:
          throw new Error(`Unknown test action: ${body.action}`);
      }
    } catch (error) {
      this.logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получение информации о доступных инструментах
   */
  @Get('tools')
  async getAvailableTools() {
    this.logger.log('Getting available tools from both MCP servers');
    
    const analytics = await this.hybridTelegramService.getSystemAnalytics();
    
    return {
      timestamp: new Date().toISOString(),
      total_tools: (analytics.node_mcp.tools?.length || 0) + (analytics.python_mcp.tools?.length || 0),
      node_mcp: {
        ready: analytics.node_mcp.ready,
        tools_count: analytics.node_mcp.tools?.length || 0,
        tools: analytics.node_mcp.tools || []
      },
      python_mcp: {
        ready: analytics.python_mcp.ready,
        tools_count: analytics.python_mcp.tools?.length || 0,
        tools: analytics.python_mcp.tools || []
      }
    };
  }

  /**
   * Health check для гибридной системы
   */
  @Get('health')
  async healthCheck() {
    const status = this.hybridTelegramService.getMCPStatus();
    
    return {
      status: status.hybrid ? 'healthy' : 'degraded',
      hybrid: status.hybrid,
      node_mcp: status.node_mcp.ready,
      python_mcp: status.python_mcp.ready,
      timestamp: status.timestamp,
      uptime: process.uptime()
    };
  }
}
