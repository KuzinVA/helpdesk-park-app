import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

export interface ConflictResolution {
  action: 'merge' | 'override' | 'reject' | 'notify';
  data?: any;
  message: string;
}

@Injectable()
export class ConflictResolutionService {
  private readonly logger = new Logger(ConflictResolutionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Обработка конфликтов при одновременном редактировании заявки
   */
  async resolveTicketConflict(
    ticketId: string,
    userId: string,
    newData: any,
    lastSeenVersion?: string
  ): Promise<ConflictResolution> {
    try {
      // Получаем текущую заявку с блокировкой
      const currentTicket = await this.prisma.$transaction(async (prisma) => {
        return prisma.ticket.findUnique({
          where: { id: ticketId },
          include: {
            createdBy: true,
            assignedTo: true,
            auditLogs: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
        });
      });

      if (!currentTicket) {
        return {
          action: 'reject',
          message: 'Заявка не найдена',
        };
      }

      // Проверяем версию для обнаружения конфликтов
      if (lastSeenVersion && currentTicket.updatedAt.toISOString() !== lastSeenVersion) {
        // Конфликт обнаружен - другой пользователь уже изменил заявку
        const lastAuditLog = currentTicket.auditLogs[0];
        
        if (lastAuditLog && lastAuditLog.userId !== userId) {
          // Определяем стратегию разрешения конфликта
          const strategy = this.determineConflictStrategy(newData, currentTicket, lastAuditLog);
          
          return {
            action: strategy.action,
            data: strategy.data,
            message: strategy.message,
          };
        }
      }

      // Нет конфликта - можно обновлять
      return {
        action: 'merge',
        data: newData,
        message: 'Изменения применены успешно',
      };

    } catch (error) {
      this.logger.error('Error resolving ticket conflict:', error);
      return {
        action: 'reject',
        message: 'Ошибка при обработке конфликта',
      };
    }
  }

  /**
   * Проверка доступности пользователя
   */
  async checkUserAvailability(userId: string): Promise<{
    isAvailable: boolean;
    lastSeen?: Date;
    status: 'online' | 'offline' | 'left_chat' | 'inactive';
    alternativeUsers?: any[];
  }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          telegramLink: true,
          service: true,
        },
      });

      if (!user || !user.isActive) {
        return {
          isAvailable: false,
          status: 'inactive',
          alternativeUsers: await this.findAlternativeUsers(user?.serviceId),
        };
      }

      // Проверяем статус в Telegram чате
      if (user.telegramLink?.isActive) {
        // Здесь можно добавить проверку через Telegram API
        // Пока возвращаем базовую информацию
        return {
          isAvailable: true,
          status: 'online',
          lastSeen: user.updatedAt,
        };
      }

      return {
        isAvailable: false,
        status: 'offline',
        lastSeen: user.updatedAt,
        alternativeUsers: await this.findAlternativeUsers(user.serviceId),
      };

    } catch (error) {
      this.logger.error('Error checking user availability:', error);
      return {
        isAvailable: false,
        status: 'offline',
      };
    }
  }

  /**
   * Обработка изменений username в Telegram
   */
  async handleUsernameChange(
    telegramId: string, 
    oldUsername: string, 
    newUsername: string
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        // Обновляем username пользователя
        await prisma.user.updateMany({
          where: { telegramId },
          data: { telegramUsername: newUsername },
        });

        // Создаем запись в логах
        await prisma.auditLog.create({
          data: {
            action: 'USERNAME_CHANGED',
            entityType: 'USER',
            entityId: telegramId,
            oldValues: oldUsername,
            newValues: newUsername,
            userId: telegramId,
          },
        });

        // Уведомляем об изменении в активных заявках
        const activeTickets = await prisma.ticket.findMany({
          where: {
            assignedTo: {
              telegramId,
            },
            status: {
              in: ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD'],
            },
          },
          include: {
            createdBy: true,
          },
        });

        // Отправляем уведомления создателям заявок
        for (const ticket of activeTickets) {
          await prisma.notification.create({
            data: {
              type: 'ASSIGNED',
              title: `Ответственный изменил username`,
              message: `Ответственный за заявку #${ticket.id.slice(-6)} изменил username с @${oldUsername} на @${newUsername}`,
              userId: ticket.createdById,
              ticketId: ticket.id,
              channels: ['IN_APP'],
            },
          });
        }
      });

      this.logger.log(`Username changed: ${oldUsername} -> ${newUsername} for ${telegramId}`);

    } catch (error) {
      this.logger.error('Error handling username change:', error);
    }
  }

  /**
   * Обработка случая когда пользователь покинул чат
   */
  async handleUserLeftChat(telegramId: string, chatId: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        // Отключаем Telegram связь
        await prisma.telegramLink.updateMany({
          where: { 
            user: { telegramId },
            chatId,
          },
          data: { isActive: false },
        });

        // Находим активные заявки этого пользователя
        const user = await prisma.user.findUnique({
          where: { telegramId },
        });

        if (user) {
          const activeTickets = await prisma.ticket.findMany({
            where: {
              assignedToId: user.id,
              status: {
                in: ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD'],
              },
            },
            include: {
              createdBy: true,
              service: true,
            },
          });

          // Переназначаем заявки или уведомляем
          for (const ticket of activeTickets) {
            const alternatives = await this.findAlternativeUsers(ticket.serviceId);
            
            if (alternatives.length > 0) {
              // Автоматически переназначаем на первого доступного
              await prisma.ticket.update({
                where: { id: ticket.id },
                data: { assignedToId: alternatives[0].id },
              });

              // Уведомляем нового ответственного
              await prisma.notification.create({
                data: {
                  type: 'ASSIGNED',
                  title: `Заявка автоматически переназначена`,
                  message: `Заявка #${ticket.id.slice(-6)} переназначена на вас, так как предыдущий ответственный покинул чат`,
                  userId: alternatives[0].id,
                  ticketId: ticket.id,
                  channels: ['TELEGRAM', 'IN_APP'],
                },
              });
            } else {
              // Меняем статус на "не назначена" и уведомляем создателя
              await prisma.ticket.update({
                where: { id: ticket.id },
                data: { 
                  assignedToId: null,
                  status: 'NEW',
                },
              });

              await prisma.notification.create({
                data: {
                  type: 'ASSIGNED',
                  title: `Заявка требует нового ответственного`,
                  message: `Ответственный за заявку #${ticket.id.slice(-6)} покинул чат. Требуется назначить нового ответственного`,
                  userId: ticket.createdById,
                  ticketId: ticket.id,
                  channels: ['TELEGRAM', 'IN_APP'],
                },
              });
            }
          }
        }
      });

    } catch (error) {
      this.logger.error('Error handling user left chat:', error);
    }
  }

  private determineConflictStrategy(
    newData: any,
    currentTicket: any,
    lastAuditLog: any
  ): ConflictResolution {
    // Простые изменения (комментарии) - можно объединять
    if (newData.description && !newData.status && !newData.assignedToId) {
      return {
        action: 'merge',
        data: newData,
        message: 'Комментарий добавлен (объединение изменений)',
      };
    }

    // Изменения статуса - требуют уведомления
    if (newData.status && newData.status !== currentTicket.status) {
      return {
        action: 'notify',
        data: {
          currentState: currentTicket,
          proposedChanges: newData,
          lastModifiedBy: lastAuditLog.userId,
        },
        message: `Заявка была изменена другим пользователем. Статус: ${currentTicket.status}`,
      };
    }

    // Критические изменения - отклоняем
    return {
      action: 'reject',
      message: `Заявка была изменена пользователем ${lastAuditLog.userId}. Обновите страницу и попробуйте снова`,
    };
  }

  private async findAlternativeUsers(serviceId?: string) {
    return this.prisma.user.findMany({
      where: {
        isActive: true,
        role: {
          in: ['EXECUTOR', 'SERVICE_LEADER'],
        },
        ...(serviceId && { serviceId }),
        telegramLink: {
          isActive: true,
        },
      },
      select: {
        id: true,
        firstName: true,
        telegramUsername: true,
        role: true,
      },
      take: 3,
    });
  }
}
