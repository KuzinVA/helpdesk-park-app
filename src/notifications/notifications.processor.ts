import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { TelegramService } from '@/telegram/telegram.service';

@Injectable()
@Processor('notifications')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly telegramService: TelegramService,
  ) {}

  @Process('send')
  async handleSendNotification(job: Job) {
    const { notificationId, channels } = job.data;
    
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
        include: { 
          user: true,
        },
      });

      if (!notification) {
        this.logger.warn(`Notification ${notificationId} not found`);
        return;
      }

      // Отправляем уведомления по каналам
      for (const channel of channels) {
        if (channel === 'TELEGRAM') {
          await this.sendTelegramNotification(notification);
        }
        if (channel === 'IN_APP') {
          // In-app уведомления отправляются через WebSocket
          this.logger.log(`In-app notification sent for ${notification.id}`);
        }
      }

      this.logger.log(`Notification ${notificationId} processed successfully`);
    } catch (error) {
      this.logger.error(`Error processing notification ${notificationId}:`, error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkSLAViolations() {
    this.logger.log('Checking SLA violations...');
    try {
      await this.notificationsService.checkSLAViolations();
    } catch (error) {
      this.logger.error('Error checking SLA violations:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendDailyDigest() {
    this.logger.log('Sending daily digest...');
    try {
      // TODO: Implement daily digest logic
      this.logger.log('Daily digest sent');
    } catch (error) {
      this.logger.error('Error sending daily digest:', error);
    }
  }

  private async sendTelegramNotification(notification: any) {
    try {
      // Получаем связь с Telegram
      const telegramLink = await this.prisma.telegramLink.findUnique({
        where: { userId: notification.userId },
      });

      if (!telegramLink || !telegramLink.isActive) {
        this.logger.log(`No active Telegram link for user ${notification.userId}`);
        return;
      }

      // Отправляем уведомление в зависимости от типа
      if (notification.ticket) {
        switch (notification.type) {
          case 'ASSIGNED':
            await this.telegramService.sendTicketNotification(
              telegramLink.chatId,
              notification.ticket,
              'Заявка назначена'
            );
            break;
          case 'SLA_WARNING':
            await this.telegramService.sendSLAWarning(
              telegramLink.chatId,
              notification.ticket
            );
            break;
          case 'SLA_BREACH':
            await this.telegramService.sendSLABreach(
              telegramLink.chatId,
              notification.ticket
            );
            break;
          default:
            // Общее уведомление
            await this.telegramService.sendMessage(
              telegramLink.chatId,
              notification.message
            );
        }
      } else {
        // Простое текстовое уведомление
        await this.telegramService.sendMessage(
          telegramLink.chatId,
          notification.message
        );
      }
      
      this.logger.log(`Telegram notification sent to chat ${telegramLink.chatId}: ${notification.title}`);
      
    } catch (error) {
      this.logger.error(`Error sending Telegram notification:`, error);
    }
  }
}
