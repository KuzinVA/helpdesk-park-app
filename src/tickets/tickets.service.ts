import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus, UserRole } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTicket(createTicketDto: CreateTicketDto, userId: string) {
    const { tags, ...ticketData } = createTicketDto;

    // Создаем заявку
    const ticket = await this.prisma.ticket.create({
      data: {
        ...ticketData,
        createdById: userId,
        status: 'NEW',
      },
      include: {
        service: true,
        location: true,
        createdBy: true,
        assignedTo: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Добавляем теги если есть
    if (tags && tags.length > 0) {
      await this.addTagsToTicket(ticket.id, tags);
    }

    return ticket;
  }

  async findAll(userId: string, userRole: UserRole, filters?: any) {
    const where: any = {};

    // Фильтры по ролям
    if (userRole === 'EMPLOYEE') {
      where.OR = [
        { createdById: userId },
        { service: { users: { some: { id: userId } } } },
      ];
    } else if (userRole === 'EXECUTOR') {
      where.OR = [
        { assignedToId: userId },
        { status: { in: ['NEW', 'ASSIGNED'] } },
      ];
    } else if (userRole === 'SERVICE_LEADER') {
      where.service = { users: { some: { id: userId } } };
    }
    // ADMIN видит все

    // Дополнительные фильтры
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }
    if (filters?.serviceId) {
      where.serviceId = filters.serviceId;
    }

    return this.prisma.ticket.findMany({
      where,
      include: {
        service: true,
        location: true,
        createdBy: true,
        assignedTo: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
            attachments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        service: true,
        location: true,
        createdBy: true,
        assignedTo: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        attachments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        auditLogs: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Заявка не найдена');
    }

    // Проверяем права доступа
    if (!this.canAccessTicket(ticket, userId, userRole)) {
      throw new ForbiddenException('Нет доступа к заявке');
    }

    return ticket;
  }

  async updateStatus(
    id: string,
    status: TicketStatus,
    userId: string,
    userRole: UserRole,
    comment?: string,
  ) {
    const ticket = await this.findOne(id, userId, userRole);

    // Проверяем возможность смены статуса
    if (!this.canChangeStatus(ticket.status, status, userRole)) {
      throw new ForbiddenException('Невозможно изменить статус');
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    // Обновляем временные метки
    if (status === 'ASSIGNED') {
      updateData.assignedAt = new Date();
    } else if (status === 'IN_PROGRESS') {
      updateData.startedAt = new Date();
    } else if (status === 'RESOLVED') {
      updateData.resolvedAt = new Date();
    } else if (status === 'CLOSED') {
      updateData.closedAt = new Date();
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        service: true,
        location: true,
        createdBy: true,
        assignedTo: true,
      },
    });

    // Добавляем комментарий если есть
    if (comment) {
      await this.prisma.comment.create({
        data: {
          content: comment,
          ticketId: id,
          userId,
        },
      });
    }

    // Логируем изменение
    await this.prisma.auditLog.create({
      data: {
        action: 'STATUS_CHANGED',
        entityType: 'TICKET',
        entityId: id,
        userId,
        oldValues: { status: ticket.status },
        newValues: { status },
      },
    });

    return updatedTicket;
  }

  async assignExecutor(
    id: string,
    executorId: string,
    userId: string,
    userRole: UserRole,
  ) {
    if (!['ADMIN', 'SERVICE_LEADER'].includes(userRole)) {
      throw new ForbiddenException('Недостаточно прав для назначения исполнителя');
    }

    const ticket = await this.findOne(id, userId, userRole);

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: {
        assignedToId: executorId,
        status: 'ASSIGNED',
        assignedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        service: true,
        location: true,
        createdBy: true,
        assignedTo: true,
      },
    });

    // Логируем назначение
    await this.prisma.auditLog.create({
      data: {
        action: 'EXECUTOR_ASSIGNED',
        entityType: 'TICKET',
        entityId: id,
        userId,
        oldValues: { assignedToId: ticket.assignedToId },
        newValues: { assignedToId: executorId },
      },
    });

    return updatedTicket;
  }

  private async addTagsToTicket(ticketId: string, tagNames: string[]) {
    for (const tagName of tagNames) {
      // Находим или создаем тег
      let tag = await this.prisma.tag.findUnique({
        where: { name: tagName },
      });

      if (!tag) {
        tag = await this.prisma.tag.create({
          data: {
            name: tagName,
            color: this.generateRandomColor(),
          },
        });
      }

      // Связываем тег с заявкой
      await this.prisma.ticketTag.create({
        data: {
          ticketId,
          tagId: tag.id,
        },
      });
    }
  }

  private generateRandomColor(): string {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private canAccessTicket(ticket: any, userId: string, userRole: UserRole): boolean {
    if (userRole === 'ADMIN') return true;
    if (ticket.createdById === userId) return true;
    if (ticket.assignedToId === userId) return true;
    if (userRole === 'SERVICE_LEADER' && ticket.service.users.some(u => u.id === userId)) return true;
    if (userRole === 'EMPLOYEE' && ticket.service.users.some(u => u.id === userId)) return true;
    return false;
  }

  private canChangeStatus(currentStatus: TicketStatus, newStatus: TicketStatus, userRole: UserRole): boolean {
    const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
      NEW: ['ASSIGNED'],
      ASSIGNED: ['IN_PROGRESS', 'ON_HOLD'],
      IN_PROGRESS: ['ON_HOLD', 'RESOLVED'],
      ON_HOLD: ['IN_PROGRESS'],
      RESOLVED: ['CLOSED'],
      CLOSED: [],
    };

    return allowedTransitions[currentStatus]?.includes(newStatus) || false;
  }
}
