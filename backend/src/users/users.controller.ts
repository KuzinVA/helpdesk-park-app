import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard } from '@/auth/guards';
import { Roles } from '@/auth/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список пользователей' })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  async findAll(@CurrentUser() user: any) {
    return this.usersService.findAll(user.sub, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Пользователь найден' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.findOne(id, currentUser.sub, currentUser.role);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Изменить роль пользователя' })
  @ApiResponse({ status: 200, description: 'Роль изменена' })
  @Roles(UserRole.ADMIN)
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
    @CurrentUser() user: any,
  ) {
    return this.usersService.updateRole(id, role, user.sub, user.role);
  }

  @Get('me/preferences')
  @ApiOperation({ summary: 'Получить настройки пользователя' })
  @ApiResponse({ status: 200, description: 'Настройки пользователя' })
  async getPreferences(@CurrentUser() user: any) {
    return this.usersService.getUserPreferences(user.sub);
  }

  @Patch('me/preferences')
  @ApiOperation({ summary: 'Обновить настройки пользователя' })
  @ApiResponse({ status: 200, description: 'Настройки обновлены' })
  async updatePreferences(
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.usersService.updateUserPreferences(user.sub, data);
  }
}
