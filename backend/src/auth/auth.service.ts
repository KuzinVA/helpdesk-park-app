import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TelegramAuthDto, AuthResponseDto } from './dto/telegram-auth.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateTelegramAuth(initData: string): Promise<any> {
    try {
      // Парсим initData
      const params = new URLSearchParams(initData);
      const hash = params.get('hash');
      const dataCheckString = this.buildDataCheckString(params);
      
      // Проверяем HMAC
      const secretKey = crypto.createHmac('sha256', 'WebAppData')
        .update(process.env.TELEGRAM_BOT_TOKEN)
        .digest();
      
      const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

      if (calculatedHash !== hash) {
        throw new UnauthorizedException('Invalid Telegram hash');
      }

      // Извлекаем данные пользователя
      const userData = JSON.parse(params.get('user') || '{}');
      const telegramId = userData.id?.toString();
      const firstName = userData.first_name;
      const lastName = userData.last_name;
      const username = userData.username;

      if (!telegramId || !firstName) {
        throw new UnauthorizedException('Invalid user data');
      }

      return { telegramId, firstName, lastName, username };
    } catch (error) {
      throw new UnauthorizedException('Invalid Telegram initData');
    }
  }

  private buildDataCheckString(params: URLSearchParams): string {
    const dataCheckArray: string[] = [];
    
    for (const [key, value] of params.entries()) {
      if (key !== 'hash') {
        dataCheckArray.push(`${key}=${value}`);
      }
    }
    
    return dataCheckArray.sort().join('\n');
  }

  async authenticateUser(authDto: TelegramAuthDto): Promise<AuthResponseDto> {
    const userData = await this.validateTelegramAuth(authDto.initData);
    
    // Находим или создаем пользователя
    let user = await this.prisma.user.findUnique({
      where: { telegramId: userData.telegramId },
      include: { service: true }
    });

    if (!user) {
      // Создаем нового пользователя с ролью EMPLOYEE
      user = await this.prisma.user.create({
        data: {
          telegramId: userData.telegramId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          telegramUsername: userData.username,
          role: 'EMPLOYEE',
        },
        include: { service: true }
      });
    }

    // Генерируем JWT токен
    const payload = {
      sub: user.id,
      telegramId: user.telegramId,
      role: user.role,
      serviceId: user.serviceId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.telegramUsername,
        role: user.role,
        serviceId: user.serviceId,
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
