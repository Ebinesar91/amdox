import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { PrismaService } from '../../common/prisma.service';
import { GetTenantId } from '../../common/tenant.context';

@ApiTags('Supply Chain Management (SCM) & Inventory')
@ApiHeader({ name: 'x-tenant-id', description: 'Tenant Identifier', required: false })
@Controller('api/scm')
export class SCMController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('vendors')
  @ApiOperation({ summary: 'List all vendors' })
  async listVendors(@GetTenantId() tenantId: string) {
    return this.prisma.vendor.findMany({
      where: { tenantId, deletedAt: null },
    });
  }

  @Post('vendors')
  @ApiOperation({ summary: 'Onboard new vendor' })
  async onboardVendor(
    @GetTenantId() tenantId: string,
    @Body() body: { name: string; email: string; phone?: string }
  ) {
    return this.prisma.vendor.create({
      data: {
        tenantId,
        name: body.name,
        email: body.email,
        phone: body.phone,
      },
    });
  }

  @Get('warehouses')
  @ApiOperation({ summary: 'List all warehouses' })
  async listWarehouses(@GetTenantId() tenantId: string) {
    return this.prisma.warehouse.findMany({
      where: { tenantId, deletedAt: null },
    });
  }

  @Post('warehouses')
  @ApiOperation({ summary: 'Create new warehouse facility' })
  async createWarehouse(
    @GetTenantId() tenantId: string,
    @Body() body: { name: string; location: string }
  ) {
    return this.prisma.warehouse.create({
      data: {
        tenantId,
        name: body.name,
        location: body.location,
      },
    });
  }

  @Post('inventory/transaction')
  @ApiOperation({ summary: 'Post stock transaction (FIFO/Weighted-Average valuation)' })
  async postTransaction(
    @Body() body: { itemId: string; warehouseId: string; type: 'STOCK_IN' | 'STOCK_OUT'; quantity: number; unitPrice: number; reference?: string }
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Log transaction
      const txn = await tx.stockTransaction.create({
        data: {
          itemId: body.itemId,
          type: body.type,
          quantity: body.quantity,
          unitPrice: body.unitPrice,
          reference: body.reference,
        },
      });

      // 2. Adjust warehouse stock levels
      const qtyChange = body.type === 'STOCK_IN' ? body.quantity : -body.quantity;
      await tx.stock.upsert({
        where: {
          warehouseId_itemId: {
            warehouseId: body.warehouseId,
            itemId: body.itemId,
          },
        },
        create: {
          warehouseId: body.warehouseId,
          itemId: body.itemId,
          quantity: body.quantity,
        },
        update: {
          quantity: { increment: qtyChange },
        },
      });

      return txn;
    });
  }

  @Post('purchase-orders')
  @ApiOperation({ summary: 'Create purchase request' })
  async createPurchaseOrder(
    @GetTenantId() tenantId: string,
    @Body() body: { poNumber: string; vendorId: string; totalAmount: number }
  ) {
    return this.prisma.purchaseOrder.create({
      data: {
        tenantId,
        poNumber: body.poNumber,
        vendorId: body.vendorId,
        totalAmount: body.totalAmount,
        status: 'SENT',
      },
    });
  }
}
