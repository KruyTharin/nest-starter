import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@/prisma/prisma.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthResponseDto } from '@/common/dtos/api-response.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check overall application health' })
  @ApiResponse({ status: 200, type: HealthResponseDto })
  async check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  @ApiOperation({ summary: 'Check application liveness' })
  @ApiResponse({ status: 200, type: HealthResponseDto })
  async checkLiveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOperation({ summary: 'Check application readiness' })
  @ApiResponse({ status: 200, type: HealthResponseDto })
  async checkReadiness() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
