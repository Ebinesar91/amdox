import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { PrismaService } from '../../common/prisma.service';
import { GetTenantId } from '../../common/tenant.context';

@ApiTags('Project & Lifecycle Management')
@ApiHeader({ name: 'x-tenant-id', description: 'Tenant Identifier', required: false })
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all initiatives' })
  async listProjects(@GetTenantId() tenantId: string) {
    return this.prisma.project.findMany({
      where: { tenantId, deletedAt: null },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create new project portfolio' })
  async createProject(
    @GetTenantId() tenantId: string,
    @Body() body: { name: string; description?: string; budget: number; startDate: string; endDate: string; organizationId: string }
  ) {
    return this.prisma.project.create({
      data: {
        tenantId,
        name: body.name,
        description: body.description,
        budget: body.budget,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        organizationId: body.organizationId,
        status: 'ACTIVE',
      },
    });
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Assign task to resource' })
  async createTask(
    @Body() body: { projectId: string; name: string; description?: string; assigneeId?: string; priority: string }
  ) {
    return this.prisma.task.create({
      data: {
        projectId: body.projectId,
        name: body.name,
        description: body.description,
        assigneeId: body.assigneeId,
        priority: body.priority,
        status: 'TODO',
      },
    });
  }

  @Post('allocations')
  @ApiOperation({ summary: 'Allocate employee utilization to project' })
  async allocateResource(
    @Body() body: { projectId: string; userId: string; role: string; utilization: number; startDate: string; endDate: string }
  ) {
    return this.prisma.resourceAllocation.create({
      data: {
        projectId: body.projectId,
        userId: body.userId,
        role: body.role,
        utilization: body.utilization,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });
  }
}
