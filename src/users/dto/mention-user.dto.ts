import { IsString, IsOptional, IsArray } from 'class-validator';

export class MentionUserDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  telegramId?: string;
}

export class SearchUsersDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chatIds?: string[];

  @IsOptional()
  limit?: number = 10;
}

export class ChatMembersDto {
  @IsString()
  chatId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeUserIds?: string[];
}
