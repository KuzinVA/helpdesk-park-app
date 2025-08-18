import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, userRole: UserRole) {
    const where: any = {};

    // Фильтры по ролям
    if (userRole === 'SERVICE_LEADER') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { serviceId: true },
      });
      if (user?.serviceId) {
        where.serviceId = user.serviceId;
      }
    }
    // ADMIN видит всех пользователей

    return this.prisma.user.findMany({
      where,
      include: {
        service: true,
        _count: {
          select: {
            createdTickets: true,
            assignedTickets: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        service: true,
        createdTickets: {
          include: {
            service: true,
            location: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        assignedTickets: {
          include: {
            service: true,
            location: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем права доступа
    if (!this.canAccessUser(user, userId, userRole)) {
      throw new ForbiddenException('Нет доступа к информации о пользователе');
    }

    return user;
  }

  async updateRole(id: string, role: UserRole, userId: string, userRole: UserRole) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Только администратор может изменять роли');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      include: { service: true },
    });
  }

  async assignToService(id: string, serviceId: string, userId: string, userRole: UserRole) {
    if (!['ADMIN', 'SERVICE_LEADER'].includes(userRole)) {
      throw new ForbiddenException('Недостаточно прав для назначения в службу');
    }

    // Проверяем, что служба существует
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Служба не найдена');
    }

    return this.prisma.user.update({
      where: { id },
      data: { serviceId },
      include: { service: true },
    });
  }

  async getUserPreferences(userId: string) {
    let preferences = await this.prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // Создаем настройки по умолчанию
      preferences = await this.prisma.userPreferences.create({
        data: {
          userId,
          notificationChannels: ['IN_APP'],
          quietHoursStart: '22:00',
          quietHoursEnd: '07:00',
          digestFrequency: 'OFF',
          timezone: 'Europe/Moscow',
          language: 'ru',
        },
      });
    }

    return preferences;
  }

  async updateUserPreferences(userId: string, data: any) {
    return this.prisma.userPreferences.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }

  async linkTelegram(userId: string, chatId: string) {
    return this.prisma.telegramLink.upsert({
      where: { userId },
      update: { chatId, isActive: true },
      create: {
        userId,
        chatId,
        isActive: true,
      },
    });
  }

  private async canAccessUser(user: any, userId: string, userRole: UserRole): Promise<boolean> {
    if (userRole === 'ADMIN') return true;
    if (user.id === userId) return true;
    if (userRole === 'SERVICE_LEADER' && user.serviceId) {
      // Проверяем, что пользователь в той же службе
      const foundUser = await this.prisma.user.findFirst({
        where: {
          id: userId,
          serviceId: user.serviceId,
        },
      });
      return !!foundUser;
    }
    return false;
  }
}
