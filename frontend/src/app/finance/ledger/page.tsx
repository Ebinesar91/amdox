'use client';

import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plus, Download, FileText, Calendar } from "lucide-react";

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  account: string;
  debit: number;
  credit: number;
  status: 'Posted' | 'Pending' | 'Draft';
}

const ledgerData: LedgerEntry[] = [
  { id: '1', date: '2024-05-01', description: 'Office Equipment Purchase', reference: 'INV-9021', account: '1010 - Cash', debit: 0, credit: 1500.00, status: 'Posted' },
  { id: '2', date: '2024-05-01', description: 'Service Revenue - Q2 Phase 1', reference: 'REC-1102', account: '4010 - Revenue', debit: 5000.00, credit: 0, status: 'Posted' },
  { id: '3', date: '2024-05-02', description: 'Monthly Cloud Subscription', reference: 'SUB-440', account: '6020 - IT Expenses', debit: 1200.00, credit: 0, status: 'Pending' },
  { id: '4', date: '2024-05-03', description: 'Payroll Disbursement - May', reference: 'PAY-001', account: '2010 - Salaries', debit: 0, credit: 45000.00, status: 'Posted' },
  { id: '5', date: '2024-05-04', description: 'Vendor Payment - Intel Corp', reference: 'VND-771', account: '2020 - Accounts Payable', debit: 2300.00, credit: 0, status: 'Draft' },
  { id: '6', date: '2024-05-05', description: 'Ad Campaign - Summer Sale', reference: 'ADV-330', account: '6030 - Marketing', debit: 8000.00, credit: 0, status: 'Posted' },
];

export default function GeneralLedgerPage() {
  const columns = [
    { header: "Date", accessorKey: "date", cell: (item: LedgerEntry) => (
      <div className="flex items-center space-x-2 text-slate-300">
        <Calendar className="w-4 h-4 text-slate-500" />
        <span className="font-medium">{item.date}</span>
      </div>
    )},
    { header: "Reference", accessorKey: "reference", cell: (item: LedgerEntry) => (
      <span className="font-mono text-xs bg-white/5 px-2 py-1 rounded border border-white/10 text-primary font-bold">
        {item.reference}
      </span>
    )},
    { header: "Description", accessorKey: "description" },
    { header: "Account", accessorKey: "account", cell: (item: LedgerEntry) => (
      <span className="text-slate-400 font-medium">{item.account}</span>
    )},
    { header: "Debit", accessorKey: "debit", cell: (item: LedgerEntry) => (
      <span className={cn("font-bold", item.debit > 0 ? "text-white" : "text-slate-600")}>
        {item.debit > 0 ? formatCurrency(item.debit) : '-'}
      </span>
    )},
    { header: "Credit", accessorKey: "credit", cell: (item: LedgerEntry) => (
      <span className={cn("font-bold", item.credit > 0 ? "text-white" : "text-slate-600")}>
        {item.credit > 0 ? formatCurrency(item.credit) : '-'}
      </span>
    )},
    { header: "Status", accessorKey: "status", cell: (item: LedgerEntry) => (
      <div className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        item.status === 'Posted' ? "bg-emerald-500/10 text-emerald-400" :
        item.status === 'Pending' ? "bg-amber-500/10 text-amber-400" :
        "bg-slate-500/10 text-slate-400"
      )}>
        {item.status}
      </div>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">General <span className="text-primary">Ledger</span></h1>
          <p className="text-slate-400 mt-1 font-medium">Detailed transaction logs for the current fiscal period.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass border-primary/20">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Debits</p>
          <p className="text-3xl font-bold text-white mt-2">{formatCurrency(17500)}</p>
        </div>
        <div className="p-6 rounded-3xl glass border-white/5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Credits</p>
          <p className="text-3xl font-bold text-white mt-2">{formatCurrency(46500)}</p>
        </div>
        <div className="p-6 rounded-3xl glass border-white/5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Net Balance</p>
          <p className="text-3xl font-bold text-rose-500 mt-2">{formatCurrency(-29000)}</p>
        </div>
      </div>

      <DataTable 
        title="Journal Transactions"
        description="Filter and manage all entries in the ledger."
        columns={columns}
        data={ledgerData}
      />
    </div>
  );
}
