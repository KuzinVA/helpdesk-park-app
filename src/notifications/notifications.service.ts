import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { PrismaService } from '@/common/prisma/prisma.service';
import { NotificationType, NotificationChannel } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async notifyTicketAssigned(ticketId: string, executorId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        service: true,
        createdBy: true,
        assignedTo: true,
      },
    });

    if (!ticket) return;

    // Уведомляем исполнителя
    await this.createNotification({
      type: 'ASSIGNED',
      title: `Заявка #${ticket.id.slice(-6)} назначена вам`,
      message: `Служба: ${ticket.service.name}. Приоритет: ${ticket.priority}`,
      userId: executorId,
      ticketId,
      channels: ['TELEGRAM', 'IN_APP'],
    });

    // Уведомляем создателя
    await this.createNotification({
      type: 'ASSIGNED',
      title: `Исполнитель назначен для заявки #${ticket.id.slice(-6)}`,
      message: `Исполнитель: ${ticket.assignedTo?.firstName || 'Не указан'}`,
      userId: ticket.createdById,
      ticketId,
      channels: ['IN_APP'],
    });
  }

  async notifyStatusChanged(ticketId: string, oldStatus: string, newStatus: string, userId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        service: true,
        createdBy: true,
        assignedTo: true,
      },
    });

    if (!ticket) return;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const recipients = new Set<string>();

    // Добавляем получателей в зависимости от роли
    if (ticket.createdById !== userId) {
      recipients.add(ticket.createdById);
    }
    if (ticket.assignedToId && ticket.assignedToId !== userId) {
      recipients.add(ticket.assignedToId);
    }

    // Добавляем руководителей службы
    const serviceLeaders = await this.prisma.user.findMany({
      where: {
        serviceId: ticket.serviceId,
        role: 'SERVICE_LEADER',
      },
    });

    serviceLeaders.forEach(leader => {
      if (leader.id !== userId) {
        recipients.add(leader.id);
      }
    });

    // Создаем уведомления для всех получателей
    for (const recipientId of recipients) {
      await this.createNotification({
        type: 'STATUS_CHANGED',
        title: `Статус заявки #${ticket.id.slice(-6)} изменен`,
        message: `${oldStatus} → ${newStatus} (${user?.firstName || 'Пользователь'})`,
        userId: recipientId,
        ticketId,
        channels: ['IN_APP'],
      });
    }
  }

  async notifyCommentAdded(ticketId: string, commentId: string, userId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        service: true,
        createdBy: true,
        assignedTo: true,
      },
    });

    if (!ticket) return;

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });

    if (!comment) return;

    const recipients = new Set<string>();

    // Добавляем получателей
    if (ticket.createdById !== userId) {
      recipients.add(ticket.createdById);
    }
    if (ticket.assignedToId && ticket.assignedToId !== userId) {
      recipients.add(ticket.assignedToId);
    }

    // Добавляем руководителей службы
    const serviceLeaders = await this.prisma.user.findMany({
      where: {
        serviceId: ticket.serviceId,
        role: 'SERVICE_LEADER',
      },
    });

    serviceLeaders.forEach(leader => {
      if (leader.id !== userId) {
        recipients.add(leader.id);
      }
    });

    // Создаем уведомления
    for (const recipientId of recipients) {
      await this.createNotification({
        type: 'COMMENT_ADDED',
        title: `Новый комментарий к заявке #${ticket.id.slice(-6)}`,
        message: `${comment.user.firstName}: "${comment.content.slice(0, 50)}${comment.content.length > 50 ? '...' : ''}"`,
        userId: recipientId,
        ticketId,
        channels: ['IN_APP'],
      });
    }
  }

  async checkSLAViolations() {
    const now = new Date();
    
    // Находим заявки с просроченным SLA
    const overdueTickets = await this.prisma.ticket.findMany({
      where: {
        slaDeadline: {
          lt: now,
        },
        status: {
          notIn: ['RESOLVED', 'CLOSED'],
        },
      },
      include: {
        service: true,
        assignedTo: true,
      },
    });

    for (const ticket of overdueTickets) {
      // Уведомляем исполнителя
      if (ticket.assignedToId) {
        await this.createNotification({
          type: 'SLA_BREACH',
          title: `⚠️ SLA ПРОСРОЧЕН по заявке #${ticket.id.slice(-6)}`,
          message: `Заявка просрочена на ${Math.floor((now.getTime() - ticket.slaDeadline.getTime()) / (1000 * 60))} минут`,
          userId: ticket.assignedToId,
          ticketId: ticket.id,
          channels: ['TELEGRAM', 'IN_APP'],
        });
      }

      // Уведомляем руководителей службы
      const serviceLeaders = await this.prisma.user.findMany({
        where: {
          serviceId: ticket.serviceId,
          role: 'SERVICE_LEADER',
        },
      });

      for (const leader of serviceLeaders) {
        await this.createNotification({
          type: 'SLA_BREACH',
          title: `⚠️ SLA ПРОСРОЧЕН по заявке #${ticket.id.slice(-6)}`,
          message: `Служба: ${ticket.service.name}. Исполнитель: ${ticket.assignedTo?.firstName || 'Не назначен'}`,
          userId: leader.id,
          ticketId: ticket.id,
          channels: ['TELEGRAM', 'IN_APP'],
        });
      }
    }

    // Находим заявки с предупреждением о SLA (за 10 минут до дедлайна)
    const warningTickets = await this.prisma.ticket.findMany({
      where: {
        slaDeadline: {
          gte: new Date(now.getTime() + 10 * 60 * 1000), // 10 минут
          lte: new Date(now.getTime() + 11 * 60 * 1000), // 11 минут
        },
        status: {
          notIn: ['RESOLVED', 'CLOSED'],
        },
      },
      include: {
        service: true,
        assignedTo: true,
      },
    });

    for (const ticket of warningTickets) {
      if (ticket.assignedToId) {
        await this.createNotification({
          type: 'SLA_WARNING',
          title: `⏰ Через 10 мин дедлайн SLA по заявке #${ticket.id.slice(-6)}`,
          message: `Приоритет: ${ticket.priority}. Служба: ${ticket.service.name}`,
          userId: ticket.assignedToId,
          ticketId: ticket.id,
          channels: ['TELEGRAM', 'IN_APP'],
        });
      }
    }
  }

  private async createNotification(data: {
    type: NotificationType;
    title: string;
    message: string;
    userId: string;
    ticketId?: string;
    channels: NotificationChannel[];
  }) {
    // Создаем запись в БД
    const notification = await this.prisma.notification.create({
      data: {
        type: data.type,
        title: data.title,
        message: data.message,
        userId: data.userId,
        ticketId: data.ticketId,
        channels: data.channels,
      },
    });

    // Добавляем в очередь для отправки
    await this.notificationsQueue.add('send', {
      notificationId: notification.id,
      channels: data.channels,
    });

    return notification;
  }

  async getUserNotifications(userId: string, limit = 50) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.update({
      where: {
        id: notificationId,
        userId, // Проверяем, что уведомление принадлежит пользователю
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }
}
