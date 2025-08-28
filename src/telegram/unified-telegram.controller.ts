import { Controller, Post, Body, Get, Param, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UnifiedTelegramService } from './unified-telegram.service';

@ApiTags('Telegram Bot')
@Controller('telegram')
export class UnifiedTelegramController {
  private readonly logger = new Logger(UnifiedTelegramController.name);
  
  constructor(private readonly telegramService: UnifiedTelegramService) {}

  // ========================================
  // ОСНОВНЫЕ TELEGRAM ФУНКЦИИ
  // ========================================

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook для Telegram Bot' })
  @ApiResponse({ status: 200, description: 'Webhook обработан' })
  async handleWebhook(@Body() update: any) {
    this.logger.log('Received Telegram webhook:', update);
    
    // Обрабатываем различные типы обновлений
    if (update.message) {
      await this.handleMessage(update.message);
    } else if (update.callback_query) {
      await this.handleCallbackQuery(update.callback_query);
    }
    
    return { ok: true };
  }

  @Get('webhook/set/:url')
  @ApiOperation({ summary: 'Установить webhook' })
  @ApiResponse({ status: 200, description: 'Webhook установлен' })
  async setWebhook(@Param('url') url: string) {
    return this.telegramService.setWebhook(url);
  }

  @Get('webhook/delete')
  @ApiOperation({ summary: 'Удалить webhook' })
  @ApiResponse({ status: 200, description: 'Webhook удален' })
  async deleteWebhook() {
    return this.telegramService.deleteWebhook();
  }

  @Get('test/:chatId')
  @ApiOperation({ summary: 'Отправить тестовое сообщение' })
  @ApiResponse({ status: 200, description: 'Сообщение отправлено' })
  async sendTestMessage(@Param('chatId') chatId: string) {
    const message = '🧪 <b>Тестовое сообщение</b>\n\nЭто тестовое уведомление от Helpdesk Park App!';
    return this.telegramService.sendMessage(chatId, message);
  }

  // ========================================
  // MCP ИНТЕГРАЦИЯ
  // ========================================

  @Get('mcp/status')
  @ApiOperation({ summary: 'Статус MCP клиентов' })
  @ApiResponse({ status: 200, description: 'Статус получен' })
  async getMCPStatus() {
    return {
      nodeMCP: this.telegramService.isNodeMCPReady(),
      pythonMCP: this.telegramService.isPythonMCPReady(),
      timestamp: new Date().toISOString()
    };
  }

  @Post('mcp/node/set-client')
  @ApiOperation({ summary: 'Установить Node.js MCP клиент' })
  @ApiResponse({ status: 200, description: 'Клиент установлен' })
  async setNodeMCPClient(@Body() client: any) {
    this.telegramService.setNodeMCPClient(client);
    return { success: true, message: 'Node.js MCP client set' };
  }

  @Post('mcp/python/set-client')
  @ApiOperation({ summary: 'Установить Python MCP клиент' })
  @ApiResponse({ status: 200, description: 'Клиент установлен' })
  async setPythonMCPClient(@Body() client: any) {
    this.telegramService.setPythonMCPClient(client);
    return { success: true, message: 'Python MCP client set' };
  }

  // ========================================
  // УВЕДОМЛЕНИЯ О ЗАЯВКАХ
  // ========================================

  @Post('notifications/ticket')
  @ApiOperation({ summary: 'Отправить уведомление о заявке' })
  @ApiResponse({ status: 200, description: 'Уведомление отправлено' })
  async sendTicketNotification(
    @Body() data: { chatId: string; ticket: any; type: string }
  ) {
    return this.telegramService.sendTicketNotification(
      data.chatId,
      data.ticket,
      data.type
    );
  }

  @Post('notifications/sla-warning')
  @ApiOperation({ summary: 'Отправить SLA предупреждение' })
  @ApiResponse({ status: 200, description: 'Предупреждение отправлено' })
  async sendSLAWarning(
    @Body() data: { chatId: string; ticket: any }
  ) {
    return this.telegramService.sendSLAWarning(data.chatId, data.ticket);
  }

  @Post('notifications/sla-breach')
  @ApiOperation({ summary: 'Отправить SLA нарушение' })
  @ApiResponse({ status: 200, description: 'Уведомление отправлено' })
  async sendSLABreach(
    @Body() data: { chatId: string; ticket: any }
  ) {
    return this.telegramService.sendSLABreach(data.chatId, data.ticket);
  }

  @Post('notifications/ticket-mcp')
  @ApiOperation({ summary: 'Отправить уведомление через MCP' })
  @ApiResponse({ status: 200, description: 'Уведомление отправлено' })
  async sendTicketNotificationViaMCP(
    @Body() data: { 
      chatId: string; 
      ticket: any; 
      notificationType: 'ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT_ADDED' | 'SLA_WARNING' | 'SLA_BREACH' 
    }
  ) {
    return this.telegramService.sendTicketNotificationViaMCP(
      data.chatId,
      data.ticket,
      data.notificationType
    );
  }

  // ========================================
  // ИНФОРМАЦИЯ О БОТЕ И ЧАТАХ
  // ========================================

  @Get('bot/info')
  @ApiOperation({ summary: 'Получить информацию о боте' })
  @ApiResponse({ status: 200, description: 'Информация получена' })
  async getBotInfo() {
    return this.telegramService.getBotInfo();
  }

  @Get('chat/:chatId/info')
  @ApiOperation({ summary: 'Получить информацию о чате' })
  @ApiResponse({ status: 200, description: 'Информация получена' })
  async getChatInfo(@Param('chatId') chatId: string) {
    return this.telegramService.getChatInfo(chatId);
  }

  // ========================================
  // ПРИВАТНЫЕ МЕТОДЫ
  // ========================================

  private async handleMessage(message: any) {
    const { chat, text } = message;
    
    if (text === '/start') {
      const welcomeMessage = `🎡 <b>Добро пожаловать в Helpdesk Park!</b>\n\n` +
        `Я помогу вам управлять заявками в парке аттракционов.\n\n` +
        `📱 <b>Откройте приложение:</b>\n` +
        `Нажмите кнопку "Открыть приложение" ниже для входа в систему.`;
      
      const keyboard = {
        inline_keyboard: [
          [
            {
              text: 'Открыть приложение',
              web_app: {
                url: process.env.FRONTEND_URL || 'http://localhost:5173'
              }
            }
          ]
        ]
      };
      
      await this.telegramService.sendMessage(chat.id.toString(), welcomeMessage, keyboard);
    }
  }

  private async handleCallbackQuery(callbackQuery: any) {
    // Обработка callback query от inline кнопок
    this.logger.log('Callback query received:', callbackQuery);
  }
}
