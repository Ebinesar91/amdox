import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');

interface LocalDb {
  apInvoices: any[];
  arInvoices: any[];
  employees: any[];
  leaveRequests: any[];
  attendanceLogs: any[];
  payrollRuns: any[];
  vendors: any[];
  inventory: any[];
  purchaseOrders: any[];
  projects: any[];
}

const defaultDb: LocalDb = {
  apInvoices: [
    { id: 'AP-449', vendor: 'Amazon Web Services', dueDate: '2026-06-15', amount: 4500.00, status: 'Unpaid' },
    { id: 'AP-450', vendor: 'Office Depot', dueDate: '2026-06-10', amount: 890.00, status: 'Overdue' },
    { id: 'AP-451', vendor: 'Intel Corp', dueDate: '2026-06-20', amount: 12500.00, status: 'Paid' },
  ],
  arInvoices: [
    { id: 'AR-901', customer: 'Nexus Tech Inc', dueDate: '2026-06-15', amount: 15400.00, status: 'Paid' },
    { id: 'AR-902', customer: 'Quantum Systems', dueDate: '2026-06-22', amount: 8900.00, status: 'Unpaid' },
  ],
  employees: [
    { id: '1', name: 'Sarah Jenkins', role: 'Chief Financial Officer', department: 'Finance', email: 'sarah.j@amdox.corp', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: '2', name: 'Robert Fox', role: 'Supply Chain Manager', department: 'Operations', email: 'robert.f@amdox.corp', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
    { id: '3', name: 'Cody Fisher', role: 'Senior Developer', department: 'Engineering', email: 'cody.f@amdox.corp', status: 'Remote', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cody' },
    { id: '4', name: 'Esther Howard', role: 'HR Director', department: 'Human Resources', email: 'esther.h@amdox.corp', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Esther' },
  ],
  leaveRequests: [
    { id: 'LV-101', employee: 'Cody Fisher', type: 'Annual Leave', startDate: '2026-06-01', endDate: '2026-06-05', status: 'Approved' },
    { id: 'LV-102', employee: 'Robert Fox', type: 'Sick Leave', startDate: '2026-05-28', endDate: '2026-05-30', status: 'Pending' },
  ],
  attendanceLogs: [
    { id: '1', name: 'Sarah Jenkins', date: '2026-05-30', clockIn: '08:55 AM', clockOut: '05:30 PM', status: 'On Time' },
    { id: '2', name: 'Cody Fisher', date: '2026-05-30', clockIn: '09:15 AM', clockOut: '06:00 PM', status: 'Late' },
  ],
  payrollRuns: [
    { id: 'PAY-001', name: 'Sarah Jenkins', salary: 12000.00, bonuses: 500.00, tax: 2400.00, net: 10100.00, status: 'Processed' },
    { id: 'PAY-002', name: 'Robert Fox', salary: 8000.00, bonuses: 0, tax: 1600.00, net: 6400.00, status: 'Draft' },
  ],
  vendors: [
    { id: 'V-001', name: 'Amazon Web Services', email: 'billing@aws.com', rating: 4.8, status: 'Verified' },
    { id: 'V-002', name: 'Office Depot', email: 'supplies@officedepot.com', rating: 4.2, status: 'Active' },
  ],
  inventory: [
    { id: 'SKU-901', name: 'Server Rack 2U Unit', sku: 'SKU-901', stock: 12, value: 30000.00, reorder: 5 },
    { id: 'SKU-902', name: 'Gigabit Switch 48-Port', sku: 'SKU-902', stock: 24, value: 21600.00, reorder: 10 },
  ],
  purchaseOrders: [
    { id: 'PO-8820', vendor: 'Amazon Web Services', items: 2, total: 4500.00, date: '2026-05-28', status: 'Approved' },
    { id: 'PO-8821', vendor: 'Office Depot', items: 1, total: 890.00, date: '2026-05-29', status: 'Pending' },
  ],
  projects: [
    { id: 'PRJ-101', name: 'Cloud Migration Phase 2', budget: 1500000, progress: 65, manager: 'Alex S.', status: 'Active' },
    { id: 'PRJ-102', name: 'ERP AI Integration', budget: 450000, progress: 24, manager: 'Sarah J.', status: 'Active' },
  ]
};

export function getDb(): LocalDb {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
      return defaultDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read db.json:', err);
    return defaultDb;
  }
}

export function saveDb(data: LocalDb) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}
