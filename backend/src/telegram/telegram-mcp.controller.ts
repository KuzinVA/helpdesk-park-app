import { Controller, Post, Get, Body, Param, Query, Logger } from '@nestjs/common';
import { TelegramMCPService } from './telegram-mcp.service';

/**
 * Контроллер для MCP интеграции с Telegram
 * Предоставляет REST API для работы с MCP инструментами
 */
@Controller('api/telegram-mcp')
export class TelegramMCPController {
  private readonly logger = new Logger(TelegramMCPController.name);

  constructor(private readonly telegramMCPService: TelegramMCPService) {}

  /**
   * Отправка сообщения через MCP
   */
  @Post('send-message')
  async sendMessage(@Body() body: {
    chat_id: string;
    message: string;
    parse_mode?: 'HTML' | 'Markdown';
    keyboard?: any;
  }) {
    this.logger.log(`Sending message to chat ${body.chat_id} via MCP`);
    
    return await this.telegramMCPService.sendMessage(
      body.chat_id,
      body.message,
      body.parse_mode || 'HTML',
      body.keyboard
    );
  }

  /**
   * Отправка уведомления о заявке через MCP
   */
  @Post('send-ticket-notification')
  async sendTicketNotification(@Body() body: {
    chat_id: string;
    ticket: any;
    notification_type: 'ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT_ADDED' | 'SLA_WARNING' | 'SLA_BREACH';
  }) {
    this.logger.log(`Sending ticket notification to chat ${body.chat_id} via MCP`);
    
    return await this.telegramMCPService.sendTicketNotification(
      body.chat_id,
      body.ticket,
      body.notification_type
    );
  }

  /**
   * Получение информации о чате через MCP
   */
  @Get('chat-info/:chatId')
  async getChatInfo(@Param('chatId') chatId: string) {
    this.logger.log(`Getting chat info for ${chatId} via MCP`);
    
    return await this.telegramMCPService.getChatInfo(chatId);
  }

  /**
   * Получение участников чата через MCP
   */
  @Get('chat-members/:chatId')
  async getChatMembers(@Param('chatId') chatId: string) {
    this.logger.log(`Getting chat members for ${chatId} via MCP`);
    
    return await this.telegramMCPService.getChatMembers(chatId);
  }

  /**
   * Установка webhook через MCP
   */
  @Post('set-webhook')
  async setWebhook(@Body() body: { url: string }) {
    this.logger.log(`Setting webhook to ${body.url} via MCP`);
    
    return await this.telegramMCPService.setWebhook(body.url);
  }

  /**
   * Удаление webhook через MCP
   */
  @Post('delete-webhook')
  async deleteWebhook() {
    this.logger.log('Deleting webhook via MCP');
    
    return await this.telegramMCPService.deleteWebhook();
  }

  /**
   * Получение информации о webhook через MCP
   */
  @Get('webhook-info')
  async getWebhookInfo() {
    this.logger.log('Getting webhook info via MCP');
    
    return await this.telegramMCPService.getWebhookInfo();
  }

  /**
   * Создание inline клавиатуры через MCP
   */
  @Post('create-keyboard')
  async createInlineKeyboard(@Body() body: {
    buttons: any[];
    rows?: number;
  }) {
    this.logger.log('Creating inline keyboard via MCP');
    
    return await this.telegramMCPService.createInlineKeyboard(
      body.buttons,
      body.rows
    );
  }

  /**
   * Получение информации о боте через MCP
   */
  @Get('bot-info')
  async getBotInfo() {
    this.logger.log('Getting bot info via MCP');
    
    return await this.telegramMCPService.getBotInfo();
  }

  /**
   * Отправка SLA предупреждения через MCP
   */
  @Post('send-sla-warning')
  async sendSLAWarning(@Body() body: {
    chat_id: string;
    ticket: any;
  }) {
    this.logger.log(`Sending SLA warning to chat ${body.chat_id} via MCP`);
    
    return await this.telegramMCPService.sendSLAWarning(
      body.chat_id,
      body.ticket
    );
  }

  /**
   * Отправка уведомления о нарушении SLA через MCP
   */
  @Post('send-sla-breach')
  async sendSLABreach(@Body() body: {
    chat_id: string;
    ticket: any;
  }) {
    this.logger.log(`Sending SLA breach notification to chat ${body.chat_id} via MCP`);
    
    return await this.telegramMCPService.sendSLABreach(
      body.chat_id,
      body.ticket
    );
  }

  /**
   * Отправка уведомления о назначении заявки через MCP
   */
  @Post('send-assignment-notification')
  async sendAssignmentNotification(@Body() body: {
    chat_id: string;
    ticket: any;
  }) {
    this.logger.log(`Sending assignment notification to chat ${body.chat_id} via MCP`);
    
    return await this.telegramMCPService.sendAssignmentNotification(
      body.chat_id,
      body.ticket
    );
  }

  /**
   * Отправка уведомления об изменении статуса через MCP
   */
  @Post('send-status-change-notification')
  async sendStatusChangeNotification(@Body() body: {
    chat_id: string;
    ticket: any;
  }) {
    this.logger.log(`Sending status change notification to chat ${body.chat_id} via MCP`);
    
    return await this.telegramMCPService.sendStatusChangeNotification(
      body.chat_id,
      body.ticket
    );
  }

  /**
   * Отправка уведомления о комментарии через MCP
   */
  @Post('send-comment-notification')
  async sendCommentNotification(@Body() body: {
    chat_id: string;
    ticket: any;
  }) {
    this.logger.log(`Sending comment notification to chat ${body.chat_id} via MCP`);
    
    return await this.telegramMCPService.sendCommentNotification(
      body.chat_id,
      body.ticket
    );
  }

  /**
   * Проверка состояния MCP клиента
   */
  @Get('status')
  async getMCPStatus() {
    const isReady = this.telegramMCPService.isMCPReady();
    
    return {
      mcp_ready: isReady,
      timestamp: new Date().toISOString(),
      status: isReady ? 'ready' : 'not_initialized'
    };
  }

  /**
   * Получение списка доступных MCP инструментов
   */
  @Get('tools')
  async getAvailableTools() {
    this.logger.log('Getting available MCP tools');
    
    return await this.telegramMCPService.getAvailableTools();
  }

  /**
   * Тестовый endpoint для проверки работы MCP
   */
  @Post('test')
  async testMCP(@Body() body: { action: string; params?: any }) {
    this.logger.log(`Testing MCP action: ${body.action}`);
    
    try {
      switch (body.action) {
        case 'send_test_message':
          return await this.telegramMCPService.sendMessage(
            body.params?.chat_id || '@test_chat',
            '🧪 Тестовое сообщение от MCP сервера',
            'HTML'
          );
        
        case 'get_bot_info':
          return await this.telegramMCPService.getBotInfo();
        
        case 'create_test_keyboard':
          return await this.telegramMCPService.createInlineKeyboard([
            {
              text: '🧪 Тест',
              callback_data: 'test_action'
            }
          ]);
        
        default:
          throw new Error(`Unknown test action: ${body.action}`);
      }
    } catch (error) {
      this.logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  }
}
