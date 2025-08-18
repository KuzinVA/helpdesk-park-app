import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TelegramService } from './telegram.service';

@ApiTags('Telegram Bot')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

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
                url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}`
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
