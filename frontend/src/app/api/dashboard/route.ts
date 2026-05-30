import { NextResponse } from 'next/server';

export async function GET() {
  // Generate randomized but realistic values so they are never the same
  const randomFactor = () => 0.9 + Math.random() * 0.2; // +/- 10% variation
  
  const baseRevenue = 3450200;
  const baseEmployees = 1248;
  const baseInventory = 892400;
  const baseROI = 24.8;

  const revenueData = [
    { name: 'Jan', value: Math.round(450000 * randomFactor()), forecast: 440000 },
    { name: 'Feb', value: Math.round(520000 * randomFactor()), forecast: 510000 },
    { name: 'Mar', value: Math.round(480000 * randomFactor()), forecast: 490000 },
    { name: 'Apr', value: Math.round(610000 * randomFactor()), forecast: 580000 },
    { name: 'May', value: Math.round(670000 * randomFactor()), forecast: 650000 },
    { name: 'Jun', value: Math.round(720000 * randomFactor()), forecast: 710000 },
  ];

  const distributionData = [
    { name: 'Finance', value: Math.round(400 * randomFactor()), color: '#6366f1' },
    { name: 'HR', value: Math.round(300 * randomFactor()), color: '#a855f7' },
    { name: 'Supply Chain', value: Math.round(300 * randomFactor()), color: '#3b82f6' },
    { name: 'Projects', value: Math.round(200 * randomFactor()), color: '#ec4899' },
  ];

  const activities = [
    { user: 'Sarah Chen', action: 'Approved Invoice #' + Math.floor(4000 + Math.random() * 1000), time: '2 mins ago', color: 'text-emerald-400' },
    { user: 'Mike Ross', action: 'Added ' + Math.floor(5 + Math.random() * 10) + ' new vendors to SCM', time: '15 mins ago', color: 'text-blue-400' },
    { user: 'Emma Watson', action: 'Initiated Q3 Performance Review', time: '1 hour ago', color: 'text-purple-400' },
    { user: 'System', action: 'Completed Daily Backup & Audit', time: '3 hours ago', color: 'text-slate-400' },
  ];

  return NextResponse.json({
    kpis: {
      revenue: { value: formatCurrency(Math.round(baseRevenue * randomFactor())), change: +(10 + Math.random() * 5).toFixed(1) },
      employees: { value: Math.round(baseEmployees + (Math.random() * 10 - 5)), change: +(2 + Math.random() * 2).toFixed(1) },
      inventory: { value: formatCurrency(Math.round(baseInventory * randomFactor())), change: -(1 + Math.random() * 3).toFixed(1) },
      roi: { value: (baseROI * randomFactor()).toFixed(1) + "%", change: +(4 + Math.random() * 3).toFixed(1) }
    },
    revenueData,
    distributionData,
    activities
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}
