import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TelegramService } from '@/telegram/telegram.service';
import { MentionUserDto, SearchUsersDto, ChatMembersDto } from './dto/mention-user.dto';

@Injectable()
export class UserMentionService {
  private readonly logger = new Logger(UserMentionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  /**
   * Поиск пользователей для автодополнения @username
   */
  async searchUsersForMention(searchDto: SearchUsersDto) {
    const { query, chatIds, limit = 10 } = searchDto;

    try {
      // Ищем пользователей по username, firstName, lastName
      const users = await this.prisma.user.findMany({
        where: {
          AND: [
            {
              isActive: true,
            },
            {
              OR: [
                {
                  telegramUsername: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  firstName: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  lastName: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            },
            // Если указаны chatIds, ищем только участников этих чатов
            ...(chatIds?.length > 0 ? [{
              telegramLink: {
                chatId: {
                  in: chatIds,
                },
                isActive: true,
              },
            }] : []),
          ],
        },
        select: {
          id: true,
          telegramId: true,
          telegramUsername: true,
          firstName: true,
          lastName: true,
          role: true,
          service: {
            select: {
              name: true,
            },
          },
        },
        take: limit,
        orderBy: [
          {
            telegramUsername: 'asc',
          },
          {
            firstName: 'asc',
          },
        ],
      });

      return users.map(user => ({
        id: user.id,
        username: user.telegramUsername,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: this.formatDisplayName(user),
        role: user.role,
        service: user.service?.name,
      }));

    } catch (error) {
      this.logger.error('Error searching users for mention:', error);
      throw error;
    }
  }

  /**
   * Получение участников чата из Telegram
   */
  async getChatMembers(chatMembersDto: ChatMembersDto) {
    const { chatId, excludeUserIds = [] } = chatMembersDto;

    try {
      // Получаем участников чата через Telegram API
      const chatMembers = await this.telegramService.getChatMembers(chatId);

      // Фильтруем и обогащаем данными из БД
      const users = await Promise.all(
        chatMembers
          .filter(member => !excludeUserIds.includes(member.user.id.toString()))
          .map(async (member) => {
            const user = await this.prisma.user.findUnique({
              where: { telegramId: member.user.id.toString() },
              include: {
                service: true,
              },
            });

            return {
              telegramId: member.user.id.toString(),
              username: member.user.username,
              firstName: member.user.first_name,
              lastName: member.user.last_name,
              displayName: this.formatDisplayName({
                telegramUsername: member.user.username,
                firstName: member.user.first_name,
                lastName: member.user.last_name,
              }),
              isInSystem: !!user,
              systemUserId: user?.id,
              role: user?.role,
              service: user?.service?.name,
              status: member.status,
            };
          })
      );

      return users;

    } catch (error) {
      this.logger.error('Error getting chat members:', error);
      throw error;
    }
  }

  /**
   * Разбор упоминаний в тексте и возврат пользователей
   */
  async parseMentionsFromText(text: string): Promise<{
    mentions: Array<{
      username: string;
      user?: any;
      position: { start: number; end: number };
    }>;
    cleanText: string;
  }> {
    // Регулярное выражение для поиска @username
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const mentions: Array<{
      username: string;
      user?: any;
      position: { start: number; end: number };
    }> = [];

    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      const username = match[1];
      const start = match.index;
      const end = match.index + match[0].length;

      // Ищем пользователя в БД
      const user = await this.prisma.user.findFirst({
        where: {
          telegramUsername: username,
          isActive: true,
        },
        select: {
          id: true,
          telegramId: true,
          telegramUsername: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      mentions.push({
        username,
        user,
        position: { start, end },
      });
    }

    // Возвращаем также "чистый" текст без упоминаний для лучшего поиска
    const cleanText = text.replace(mentionRegex, '').trim();

    return { mentions, cleanText };
  }

  /**
   * Создание уведомлений для упомянутых пользователей
   */
  async notifyMentionedUsers(
    mentions: Array<{ username: string; user?: any }>,
    ticketId: string,
    context: 'ticket_creation' | 'comment' | 'assignment',
    authorId: string
  ) {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: ticketId },
        include: {
          createdBy: true,
          service: true,
          location: true,
        },
      });

      if (!ticket) return;

      const author = await this.prisma.user.findUnique({
        where: { id: authorId },
      });

      for (const mention of mentions) {
        if (mention.user && mention.user.id !== authorId) {
          // Создаем уведомление в системе
          await this.prisma.notification.create({
            data: {
              type: 'COMMENT_ADDED', // или другой подходящий тип
              title: `Вас упомянули в заявке #${ticket.id.slice(-6)}`,
              message: `${author?.firstName || 'Пользователь'} упомянул вас в ${this.getContextText(context)}`,
              userId: mention.user.id,
              ticketId,
              channels: ['TELEGRAM', 'IN_APP'],
            },
          });

          // Отправляем Telegram уведомление
          const telegramLink = await this.prisma.telegramLink.findUnique({
            where: { userId: mention.user.id },
          });

          if (telegramLink?.isActive) {
            await this.telegramService.sendMentionNotification(
              telegramLink.chatId,
              {
                ticket,
                author,
                context,
                mentionedUser: mention.user,
              }
            );
          }
        }
      }

    } catch (error) {
      this.logger.error('Error notifying mentioned users:', error);
    }
  }

  /**
   * Синхронизация пользователей из Telegram чата
   */
  async syncChatUsers(chatId: string) {
    try {
      const members = await this.getChatMembers({ chatId });

      for (const member of members) {
        if (!member.isInSystem && member.username) {
          // Создаем пользователя если его нет в системе
          await this.prisma.user.upsert({
            where: { telegramId: member.telegramId },
            update: {
              telegramUsername: member.username,
              firstName: member.firstName,
              lastName: member.lastName,
            },
            create: {
              telegramId: member.telegramId,
              telegramUsername: member.username,
              firstName: member.firstName,
              lastName: member.lastName || '',
              role: 'EMPLOYEE',
            },
          });

          // Создаем связь с Telegram
          await this.prisma.telegramLink.upsert({
            where: { userId: member.systemUserId || 'new' },
            update: {
              chatId,
              isActive: true,
            },
            create: {
              userId: member.systemUserId!,
              chatId,
              isActive: true,
            },
          });
        }
      }

      this.logger.log(`Synchronized ${members.length} users from chat ${chatId}`);
      return members;

    } catch (error) {
      this.logger.error('Error syncing chat users:', error);
      throw error;
    }
  }

  private formatDisplayName(user: {
    telegramUsername?: string;
    firstName: string;
    lastName?: string;
  }): string {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const username = user.telegramUsername ? `@${user.telegramUsername}` : '';
    
    if (fullName && username) {
      return `${fullName} (${username})`;
    }
    
    return fullName || username || 'Пользователь';
  }

  private getContextText(context: string): string {
    switch (context) {
      case 'ticket_creation': return 'заявке';
      case 'comment': return 'комментарии';
      case 'assignment': return 'назначении';
      default: return 'заявке';
    }
  }
}
