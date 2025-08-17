import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '@/auth/guards';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@ApiTags('Statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Получить общую статистику' })
  @ApiResponse({ status: 200, description: 'Статистика' })
  async getOverview(
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return this.statsService.getOverview(user.sub, user.role, filters);
  }
}
