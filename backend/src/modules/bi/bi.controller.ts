import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { PrismaService } from '../../common/prisma.service';
import { GetTenantId } from '../../common/tenant.context';

@ApiTags('Business Intelligence & Analytics Builder')
@ApiHeader({ name: 'x-tenant-id', description: 'Tenant Identifier', required: false })
@Controller('api/bi')
export class BIController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('dashboards')
  @ApiOperation({ summary: 'List custom dashboards' })
  async getDashboards(@GetTenantId() tenantId: string) {
    return this.prisma.dashboard.findMany({
      where: { tenantId },
      include: { widgets: true },
    });
  }

  @Post('dashboards')
  @ApiOperation({ summary: 'Save new dashboard layout configuration' })
  async createDashboard(
    @GetTenantId() tenantId: string,
    @Body() body: { name: string; description?: string; isPublic?: boolean }
  ) {
    return this.prisma.dashboard.create({
      data: {
        tenantId,
        name: body.name,
        description: body.description,
        isPublic: body.isPublic ?? false,
      },
    });
  }

  @Post('widgets')
  @ApiOperation({ summary: 'Add analytics widget to dashboard' })
  async createWidget(
    @Body() body: { dashboardId: string; title: string; type: string; x: number; y: number; w: number; h: number; queryConfig: any }
  ) {
    return this.prisma.widget.create({
      data: {
        dashboardId: body.dashboardId,
        title: body.title,
        type: body.type,
        x: body.x,
        y: body.y,
        w: body.w,
        h: body.h,
        queryConfig: body.queryConfig,
      },
    });
  }

  @Delete('widgets/:id')
  @ApiOperation({ summary: 'Remove analytics widget' })
  async removeWidget(@Param('id') id: string) {
    return this.prisma.widget.delete({
      where: { id },
    });
  }
}
