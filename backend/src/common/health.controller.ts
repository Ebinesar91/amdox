import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@Controller('api/health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check system health status' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'AMDOX Cloud ERP Gateway',
    };
  }
}
