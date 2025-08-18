import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramMCPService } from './telegram-mcp.service';
import { TelegramMCPController } from './telegram-mcp.controller';

/**
 * Модуль для интеграции с MCP (Model Context Protocol) инструментами Telegram
 * Предоставляет сервисы для работы с Telegram через MCP
 */
@Module({
  imports: [ConfigModule],
  controllers: [TelegramMCPController],
  providers: [TelegramMCPService],
  exports: [TelegramMCPService],
})
export class TelegramMCPModule {}
