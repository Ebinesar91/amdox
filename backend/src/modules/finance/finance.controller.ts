import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { PrismaService } from '../../common/prisma.service';
import { GetTenantId } from '../../common/tenant.context';

@ApiTags('Finance & General Ledger')
@ApiHeader({ name: 'x-tenant-id', description: 'Tenant Identifier', required: false })
@Controller('api/finance')
export class FinanceController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('accounts')
  @ApiOperation({ summary: 'Retrieve Chart of Accounts' })
  async getAccounts(@GetTenantId() tenantId: string) {
    return this.prisma.account.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { code: 'asc' },
    });
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Create new Ledger Account' })
  async createAccount(
    @GetTenantId() tenantId: string,
    @Body() body: { code: string; name: string; type: string }
  ) {
    return this.prisma.account.create({
      data: {
        tenantId,
        code: body.code,
        name: body.name,
        type: body.type,
      },
    });
  }

  @Post('journal-entries')
  @ApiOperation({ summary: 'Post a double-entry Journal Entry' })
  async postJournalEntry(
    @GetTenantId() tenantId: string,
    @Body() body: {
      reference: string;
      description?: string;
      lines: { accountId: string; debit: number; credit: number }[];
    }
  ) {
    // Basic double-entry checks: Sum(debit) must equal Sum(credit)
    const totalDebit = body.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = body.lines.reduce((sum, line) => sum + line.credit, 0);
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new Error('Journal Entry debits and credits must balance!');
    }

    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.journalEntry.create({
        data: {
          tenantId,
          reference: body.reference,
          description: body.description,
        },
      });

      const linesToCreate = body.lines.map(line => ({
        journalEntryId: entry.id,
        accountId: line.accountId,
        debit: line.debit,
        credit: line.credit,
      }));

      await tx.journalLine.createMany({ data: linesToCreate });

      // Update account balances
      for (const line of body.lines) {
        const netChange = line.debit - line.credit;
        await tx.account.update({
          where: { id: line.accountId },
          data: { balance: { increment: netChange } },
        });
      }

      return entry;
    });
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get Customer & Vendor Invoices' })
  async getInvoices(@GetTenantId() tenantId: string) {
    return this.prisma.invoice.findMany({
      where: { tenantId, deletedAt: null },
      include: { vendor: true },
    });
  }

  @Post('invoices')
  @ApiOperation({ summary: 'Generate Invoice (AP/AR)' })
  async createInvoice(
    @GetTenantId() tenantId: string,
    @Body() body: {
      type: 'AP' | 'AR';
      invoiceNo: string;
      amount: number;
      taxAmount: number;
      dueDate: string;
      vendorId?: string;
    }
  ) {
    return this.prisma.invoice.create({
      data: {
        tenantId,
        type: body.type,
        invoiceNo: body.invoiceNo,
        amount: body.amount,
        taxAmount: body.taxAmount,
        status: 'UNPAID',
        dueDate: new Date(body.dueDate),
        vendorId: body.vendorId,
      },
    });
  }
}
