import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UnifiedTelegramService } from './unified-telegram.service';
import { UnifiedTelegramController } from './unified-telegram.controller';
import { CommonModule } from '@/common/common.module';

/**
 * Объединенный Telegram модуль
 * Заменяет telegram.module.ts, hybrid-telegram.module.ts и telegram-mcp.module.ts
 * Включает всю функциональность в одном месте
 */
@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [UnifiedTelegramController],
  providers: [UnifiedTelegramService],
  exports: [UnifiedTelegramService],
})
export class UnifiedTelegramModule {}
