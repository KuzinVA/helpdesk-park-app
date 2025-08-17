import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TelegramAuthDto, AuthResponseDto } from './dto/telegram-auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Аутентификация через Telegram',
    description: 'Валидирует Telegram WebApp initData и возвращает JWT токен'
  })
  @ApiResponse({
    status: 200,
    description: 'Успешная аутентификация',
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Неверные данные аутентификации'
  })
  async authenticateTelegram(@Body() authDto: TelegramAuthDto): Promise<AuthResponseDto> {
    return this.authService.authenticateUser(authDto);
  }
}
