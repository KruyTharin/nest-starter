import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from '@/app.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ApiResponseDto } from '@/common/dtos/api-response.dto';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: 200,
    description: 'Return hello message.',
    type: ApiResponseDto,
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: ApiResponseDto,
  })
  async findAll() {
    return await this.prismaService.user.findMany();
  }
}
