'use client';

import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plus, Filter, Calendar } from "lucide-react";

const journalData = [
  { id: 'J-101', date: '2024-05-01', memo: 'Equipment Purchase', total: 1500.00, status: 'Posted', user: 'Sarah' },
  { id: 'J-102', date: '2024-05-01', memo: 'Rent Payment', total: 2500.00, status: 'Posted', user: 'Sarah' },
  { id: 'J-103', date: '2024-05-02', memo: 'Client Invoice #901', total: 12000.00, status: 'Pending', user: 'Mike' },
  { id: 'J-104', date: '2024-05-03', memo: 'Office Supplies', total: 120.00, status: 'Draft', user: 'Sarah' },
];

export default function JournalPage() {
  const columns = [
    { header: "ID", accessorKey: "id", cell: (item: any) => <span className="font-mono text-primary font-bold">{item.id}</span> },
    { header: "Date", accessorKey: "date" },
    { header: "Memo", accessorKey: "memo" },
    { header: "Total", accessorKey: "total", cell: (item: any) => formatCurrency(item.total) },
    { header: "User", accessorKey: "user" },
    { header: "Status", accessorKey: "status", cell: (item: any) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
        item.status === 'Posted' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
      )}>{item.status}</span>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Journal <span className="text-primary">Entries</span></h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-xl text-white font-bold text-sm">
          <Plus className="w-4 h-4" />
          <span>Create Journal</span>
        </button>
      </div>
      <DataTable title="Recent Journals" description="Manage and review all system journal entries." columns={columns} data={journalData} />
    </div>
  );
}
