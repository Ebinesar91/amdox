const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AMDOX ERP database...');

  // 1. Clear existing data
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Tenant" CASCADE;');

  // 2. Create Default Tenant
  const tenant = await prisma.tenant.create({
    data: {
      id: 'default-tenant-uuid-001',
      name: 'Amdox Corp Global',
      domain: 'amdox.corp',
    },
  });

  // 3. Create Default Organization
  const org = await prisma.organization.create({
    data: {
      id: 'default-org-uuid-001',
      tenantId: tenant.id,
      name: 'Amdox Operations',
    },
  });

  // 4. Create Admin User
  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'alex.sterling@amdox.corp',
      name: 'Alex Sterling',
      role: 'SUPER_ADMIN',
    },
  });

  // 5. Create Chart of Accounts
  const cash = await prisma.account.create({ data: { tenantId: tenant.id, code: '10100', name: 'Cash & Cash Equivalents', type: 'ASSET', balance: 450000.00 } });
  const ar = await prisma.account.create({ data: { tenantId: tenant.id, code: '10200', name: 'Accounts Receivable', type: 'ASSET', balance: 45200.00 } });
  const ap = await prisma.account.create({ data: { tenantId: tenant.id, code: '20100', name: 'Accounts Payable', type: 'LIABILITY', balance: -17890.00 } });
  const equity = await prisma.account.create({ data: { tenantId: tenant.id, code: '30100', name: 'Retained Earnings', type: 'EQUITY', balance: 350000.00 } });
  const revenue = await prisma.account.create({ data: { tenantId: tenant.id, code: '40100', name: 'Software Licence Revenue', type: 'REVENUE', balance: 180000.00 } });
  const expense = await prisma.account.create({ data: { tenantId: tenant.id, code: '50200', name: 'Hosting & Server Expenses', type: 'EXPENSE', balance: 52690.00 } });

  // 6. Create Employees
  const sarah = await prisma.employee.create({
    data: {
      tenantId: tenant.id,
      organizationId: org.id,
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'sarah.j@amdox.corp',
      department: 'Finance',
      designation: 'CFO',
      salary: 12000.00,
      joinedAt: new Date('2024-01-15'),
      status: 'ACTIVE',
    },
  });

  const robert = await prisma.employee.create({
    data: {
      tenantId: tenant.id,
      organizationId: org.id,
      firstName: 'Robert',
      lastName: 'Fox',
      email: 'robert.f@amdox.corp',
      department: 'Engineering',
      designation: 'Dev Lead',
      salary: 8000.00,
      joinedAt: new Date('2024-02-10'),
      status: 'ACTIVE',
    },
  });

  // 7. Create Vendors
  const aws = await prisma.vendor.create({
    data: {
      tenantId: tenant.id,
      name: 'Amazon Web Services',
      email: 'billing@aws.amazon.com',
      rating: 4.8,
    },
  });

  const intel = await prisma.vendor.create({
    data: {
      tenantId: tenant.id,
      name: 'Intel Corp',
      email: 'orders@intel.com',
      rating: 4.5,
    },
  });

  // 8. Create Warehouses
  const wh = await prisma.warehouse.create({
    data: {
      tenantId: tenant.id,
      name: 'North America East',
      location: 'Ashburn, VA',
    },
  });

  // 9. Create Catalog Items
  const serverUnit = await prisma.item.create({
    data: {
      sku: 'SKU-901',
      name: 'Server Rack 2U Unit',
      price: 2500.00,
      reorderLevel: 5,
    },
  });

  // 10. Link Stock quantity
  await prisma.stock.create({
    data: {
      warehouseId: wh.id,
      itemId: serverUnit.id,
      quantity: 12,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
