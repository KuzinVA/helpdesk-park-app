import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '@/auth/guards';
import { RolesGuard } from '@/auth/guards';
import { Roles } from '@/auth/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UserRole, TicketStatus } from '@prisma/client';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую заявку' })
  @ApiResponse({ status: 201, description: 'Заявка создана' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.createTicket(createTicketDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список заявок' })
  @ApiResponse({ status: 200, description: 'Список заявок' })
  async findAll(
    @Query() filters: any,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.findAll(user.sub, user.role, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заявку по ID' })
  @ApiResponse({ status: 200, description: 'Заявка найдена' })
  @ApiResponse({ status: 404, description: 'Заявка не найдена' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.findOne(id, user.sub, user.role);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Изменить статус заявки' })
  @ApiResponse({ status: 200, description: 'Статус изменен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TicketStatus,
    @CurrentUser() user: any,
    @Body('comment') comment?: string,
  ) {
    return this.ticketsService.updateStatus(
      id,
      status,
      user.sub,
      user.role,
      comment,
    );
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Назначить исполнителя' })
  @ApiResponse({ status: 200, description: 'Исполнитель назначен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @Roles(UserRole.ADMIN, UserRole.SERVICE_LEADER)
  async assignExecutor(
    @Param('id') id: string,
    @Body('executorId') executorId: string,
    @CurrentUser() user: any,
  ) {
    return this.ticketsService.assignExecutor(
      id,
      executorId,
      user.sub,
      user.role,
    );
  }

  @Post(':id/attachments')
  @ApiOperation({ summary: 'Загрузить вложение' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        kind: {
          type: 'string',
          enum: ['PROBLEM_BEFORE', 'RESULT_AFTER', 'OTHER'],
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('kind') kind: string,
    @CurrentUser() user: any,
  ) {
    // TODO: Implement file upload to MinIO
    return { message: 'File upload endpoint - to be implemented' };
  }
}
