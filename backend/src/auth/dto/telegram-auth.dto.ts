import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TelegramAuthDto {
  @ApiProperty({
    description: 'Telegram WebApp initData',
    example: 'query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22John%22%2C%22last_name%22%3A%22Doe%22%2C%22username%22%3A%22johndoe%22%7D&auth_date=1234567890&hash=abc123...'
  })
  @IsString()
  @IsNotEmpty()
  initData: string;

  @ApiProperty({
    description: 'User hash для валидации',
    required: false
  })
  @IsString()
  @IsOptional()
  hash?: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT токен для аутентификации'
  })
  accessToken: string;

  @ApiProperty({
    description: 'Информация о пользователе'
  })
  user: {
    id: string;
    telegramId: string;
    firstName: string;
    lastName?: string;
    username?: string;
    role: string;
    serviceId?: string;
  };
}
