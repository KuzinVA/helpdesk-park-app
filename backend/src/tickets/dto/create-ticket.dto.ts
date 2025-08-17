import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketPriority } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Заголовок заявки',
    example: 'Поломка карусели "Вихрь"'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Описание проблемы',
    example: 'Карусель не запускается, слышен скрежет в механизме'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'ID службы',
    example: 'clh1234567890abcdef'
  })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({
    description: 'ID локации',
    example: 'clh1234567890abcdef'
  })
  @IsString()
  @IsNotEmpty()
  locationId: string;

  @ApiProperty({
    description: 'Приоритет заявки',
    enum: TicketPriority,
    example: 'HIGH'
  })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority = 'MEDIUM';

  @ApiProperty({
    description: 'Теги заявки',
    example: ['механика', 'срочно'],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
