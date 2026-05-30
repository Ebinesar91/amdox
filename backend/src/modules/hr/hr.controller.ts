import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { PrismaService } from '../../common/prisma.service';
import { GetTenantId } from '../../common/tenant.context';

@ApiTags('Human Resources & Payroll')
@ApiHeader({ name: 'x-tenant-id', description: 'Tenant Identifier', required: false })
@Controller('api/hr')
export class HRController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('employees')
  @ApiOperation({ summary: 'List all active corporate employees' })
  async listEmployees(@GetTenantId() tenantId: string) {
    return this.prisma.employee.findMany({
      where: { tenantId, deletedAt: null },
    });
  }

  @Post('employees')
  @ApiOperation({ summary: 'Onboard new employee' })
  async onboardEmployee(
    @GetTenantId() tenantId: string,
    @Body() body: {
      firstName: string;
      lastName: string;
      email: string;
      department: string;
      designation: string;
      salary: number;
      joinedAt: string;
      organizationId: string;
    }
  ) {
    return this.prisma.employee.create({
      data: {
        tenantId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        department: body.department,
        designation: body.designation,
        salary: body.salary,
        joinedAt: new Date(body.joinedAt),
        organizationId: body.organizationId,
        status: 'ACTIVE',
      },
    });
  }

  @Post('attendance/clock-in')
  @ApiOperation({ summary: 'Clock in attendance with Geo-tracking coordinates' })
  async clockIn(
    @Body() body: { employeeId: string; latitude?: number; longitude?: number }
  ) {
    return this.prisma.attendance.create({
      data: {
        employeeId: body.employeeId,
        clockIn: new Date(),
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });
  }

  @Put('attendance/clock-out/:id')
  @ApiOperation({ summary: 'Clock out attendance' })
  async clockOut(@Param('id') id: string) {
    return this.prisma.attendance.update({
      where: { id },
      data: { clockOut: new Date() },
    });
  }

  @Post('leaves')
  @ApiOperation({ summary: 'Submit Leave Request' })
  async requestLeave(
    @Body() body: { employeeId: string; type: string; startDate: string; endDate: string; reason?: string }
  ) {
    return this.prisma.leaveRequest.create({
      data: {
        employeeId: body.employeeId,
        type: body.type,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        reason: body.reason,
        status: 'PENDING',
      },
    });
  }

  @Put('leaves/approve/:id')
  @ApiOperation({ summary: 'Approve or Reject Leave request' })
  async processLeave(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED' }
  ) {
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: body.status },
    });
  }

  @Post('payroll/run')
  @ApiOperation({ summary: 'Run payroll calculations and generate payslips' })
  async generatePayslips(
    @GetTenantId() tenantId: string,
    @Body() body: { employeeIds: string[]; periodStart: string; periodEnd: string }
  ) {
    const start = new Date(body.periodStart);
    const end = new Date(body.periodEnd);

    const generatedPayslips = [];
    for (const empId of body.employeeIds) {
      const emp = await this.prisma.employee.findUnique({ where: { id: empId } });
      if (!emp) continue;

      // Base tax slabs and deductions math (simulated)
      const baseSalary = Number(emp.salary);
      const taxRate = baseSalary > 10000 ? 0.20 : 0.15;
      const deductions = baseSalary * taxRate;
      const netSalary = baseSalary - deductions;

      const slip = await this.prisma.payslip.create({
        data: {
          tenantId,
          employeeId: empId,
          periodStart: start,
          periodEnd: end,
          baseSalary,
          deductions,
          netSalary,
          status: 'APPROVED',
        },
      });
      generatedPayslips.push(slip);
    }
    return generatedPayslips;
  }
}
