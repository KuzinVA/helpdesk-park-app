import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HybridTelegramService } from './hybrid-telegram.service';
import { TelegramMCPService } from './telegram-mcp.service';
import { TelegramMCPController } from './telegram-mcp.controller';
import { HybridTelegramController } from './hybrid-telegram.controller';

/**
 * Гибридный модуль для интеграции с двумя MCP серверами
 * Node.js MCP (Mini App + Helpdesk) + Python MCP (общие Telegram функции)
 */
@Module({
  imports: [ConfigModule],
  controllers: [TelegramMCPController, HybridTelegramController],
  providers: [HybridTelegramService, TelegramMCPService],
  exports: [HybridTelegramService, TelegramMCPService],
})
export class HybridTelegramModule {}
