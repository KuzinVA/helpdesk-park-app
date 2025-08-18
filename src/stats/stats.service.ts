import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TicketStatus, TicketPriority } from '@prisma/client';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string, userRole: string, filters?: any) {
    const where: any = this.buildWhereClause(userId, userRole, filters);

    const [
      totalTickets,
      activeTickets,
      resolvedTickets,
      overdueTickets,
      ticketsByStatus,
      ticketsByPriority,
      ticketsByService,
      avgResolutionTime,
    ] = await Promise.all([
      this.getTotalTickets(where),
      this.getActiveTickets(where),
      this.getResolvedTickets(where),
      this.getOverdueTickets(where),
      this.getTicketsByStatus(where),
      this.getTicketsByPriority(where),
      this.getTicketsByService(where),
      this.getAverageResolutionTime(where),
    ]);

    return {
      totalTickets,
      activeTickets,
      resolvedTickets,
      overdueTickets,
      ticketsByStatus,
      ticketsByPriority,
      ticketsByService,
      avgResolutionTime,
      slaMetrics: await this.getSLAMetrics(where),
    };
  }

  async getSLAMetrics(where: any) {
    const now = new Date();
    const slaPolicies = await this.prisma.slaPolicy.findMany({
      include: { service: true },
    });

    const metrics = [];

    for (const policy of slaPolicies) {
      const serviceTickets = await this.prisma.ticket.findMany({
        where: {
          ...where,
          serviceId: policy.serviceId,
          status: { notIn: ['CLOSED'] },
        },
      });

      let onTimeCount = 0;
      let overdueCount = 0;
      let totalCount = serviceTickets.length;

      for (const ticket of serviceTickets) {
        if (ticket.slaDeadline) {
          if (ticket.status === 'RESOLVED' && ticket.resolvedAt && ticket.slaDeadline) {
            if (ticket.resolvedAt <= ticket.slaDeadline) {
              onTimeCount++;
            } else {
              overdueCount++;
            }
          } else if (ticket.slaDeadline < now) {
            overdueCount++;
          }
        }
      }

      metrics.push({
        serviceName: policy.service.name,
        totalTickets: totalCount,
        onTimeCount,
        overdueCount,
        onTimePercentage: totalCount > 0 ? (onTimeCount / totalCount) * 100 : 0,
        responseTimeMinutes: policy.responseTimeMinutes,
        resolveTimeMinutes: policy.resolveTimeMinutes,
      });
    }

    return metrics;
  }

  private buildWhereClause(userId: string, userRole: string, filters?: any) {
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
      const user = this.prisma.user.findUnique({
        where: { id: userId },
        select: { serviceId: true },
      });
      if (user) {
        where.serviceId = user.serviceId;
      }
    }
    // ADMIN видит все

    // Дополнительные фильтры
    if (filters?.dateFrom) {
      where.createdAt = { gte: new Date(filters.dateFrom) };
    }
    if (filters?.dateTo) {
      where.createdAt = { ...where.createdAt, lte: new Date(filters.dateTo) };
    }
    if (filters?.serviceId) {
      where.serviceId = filters.serviceId;
    }

    return where;
  }

  private async getTotalTickets(where: any) {
    return this.prisma.ticket.count({ where });
  }

  private async getActiveTickets(where: any) {
    return this.prisma.ticket.count({
      where: {
        ...where,
        status: { notIn: ['RESOLVED', 'CLOSED'] },
      },
    });
  }

  private async getResolvedTickets(where: any) {
    return this.prisma.ticket.count({
      where: {
        ...where,
        status: 'RESOLVED',
      },
    });
  }

  private async getOverdueTickets(where: any) {
    const now = new Date();
    return this.prisma.ticket.count({
      where: {
        ...where,
        slaDeadline: { lt: now },
        status: { notIn: ['RESOLVED', 'CLOSED'] },
      },
    });
  }

  private async getTicketsByStatus(where: any) {
    const result = await this.prisma.ticket.groupBy({
      by: ['status'],
      where,
      _count: { status: true },
    });

    return result.map(item => ({
      status: item.status,
      count: item._count.status,
    }));
  }

  private async getTicketsByPriority(where: any) {
    const result = await this.prisma.ticket.groupBy({
      by: ['priority'],
      where,
      _count: { priority: true },
    });

    return result.map(item => ({
      priority: item.priority,
      count: item._count.priority,
    }));
  }

  private async getTicketsByService(where: any) {
    const result = await this.prisma.ticket.groupBy({
      by: ['serviceId'],
      where,
      _count: { serviceId: true },
    });

    const services = await this.prisma.service.findMany({
      where: { id: { in: result.map(r => r.serviceId) } },
    });

    return result.map(item => ({
      serviceId: item.serviceId,
      serviceName: services.find(s => s.id === item.serviceId)?.name || 'Unknown',
      count: item._count.serviceId,
    }));
  }

  private async getAverageResolutionTime(where: any) {
    const resolvedTickets = await this.prisma.ticket.findMany({
      where: {
        ...where,
        status: 'RESOLVED',
        resolvedAt: { not: null },
        createdAt: { not: null },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
    });

    if (resolvedTickets.length === 0) return 0;

    const totalTime = resolvedTickets.reduce((sum, ticket) => {
      return sum + (ticket.resolvedAt.getTime() - ticket.createdAt.getTime());
    }, 0);

    return Math.round(totalTime / resolvedTickets.length / (1000 * 60)); // в минутах
  }
}
