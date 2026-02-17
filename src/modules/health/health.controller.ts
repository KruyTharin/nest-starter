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
    const result = await this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
    return this.simplify(result);
  }

  @Get('liveness')
  @HealthCheck()
  @ApiOperation({ summary: 'Check application liveness' })
  @ApiResponse({ status: 200, type: HealthResponseDto })
  async checkLiveness() {
    const result = await this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
    return this.simplify(result);
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOperation({ summary: 'Check application readiness' })
  @ApiResponse({ status: 200, type: HealthResponseDto })
  async checkReadiness() {
    const result = await this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
    return this.simplify(result);
  }

  private simplify(result: any) {
    return {
      status: result.status,
      details: Object.keys(result.info).reduce((acc, key) => {
        acc[key] = result.info[key].status;
        return acc;
      }, {}),
    };
  }
}
