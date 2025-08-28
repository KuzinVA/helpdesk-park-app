import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsProcessor } from './notifications.processor';
import { CommonModule } from '@/common/common.module';
import { UnifiedTelegramModule } from '@/telegram/unified-telegram.module';

@Module({
  imports: [
    CommonModule,
    UnifiedTelegramModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}
