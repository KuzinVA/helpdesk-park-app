import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UserMentionService } from './user-mention.service';
import { SearchUsersDto, ChatMembersDto } from './dto/mention-user.dto';

@Controller('users/mentions')
@UseGuards(JwtAuthGuard)
export class UserMentionController {
  constructor(private readonly userMentionService: UserMentionService) {}

  /**
   * Поиск пользователей для автодополнения @mentions
   */
  @Get('search')
  async searchUsers(@Query() searchDto: SearchUsersDto) {
    return this.userMentionService.searchUsersForMention(searchDto);
  }

  /**
   * Получение участников чата
   */
  @Get('chat-members')
  async getChatMembers(@Query() chatMembersDto: ChatMembersDto) {
    return this.userMentionService.getChatMembers(chatMembersDto);
  }

  /**
   * Синхронизация пользователей из чата
   */
  @Post('sync-chat')
  async syncChatUsers(
    @Body('chatId') chatId: string,
    @CurrentUser() user: any
  ) {
    // Только админы могут синхронизировать пользователей
    if (user.role !== 'ADMIN' && user.role !== 'SERVICE_LEADER') {
      throw new Error('Insufficient permissions');
    }

    return this.userMentionService.syncChatUsers(chatId);
  }

  /**
   * Разбор упоминаний в тексте
   */
  @Post('parse')
  async parseMentions(@Body('text') text: string) {
    return this.userMentionService.parseMentionsFromText(text);
  }
}
