'use client';

import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const ordersData = [
  { id: 'PO-9001', vendor: 'Intel Corp', date: '2024-05-01', total: 150000.00, status: 'Shipped' },
  { id: 'PO-9002', vendor: 'Cisco Systems', date: '2024-05-02', total: 45000.00, status: 'Pending' },
];

export default function OrdersPage() {
  const columns = [
    { header: "Order #", accessorKey: "id" },
    { header: "Vendor", accessorKey: "vendor" },
    { header: "Date", accessorKey: "date" },
    { header: "Total Value", accessorKey: "total", cell: (item: any) => formatCurrency(item.total) },
    { header: "Status", accessorKey: "status", cell: (item: any) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
        item.status === 'Shipped' ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"
      )}>{item.status}</span>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Purchase <span className="text-primary">Orders</span></h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-xl text-white font-bold text-sm">
          <Plus className="w-4 h-4" />
          <span>Create PO</span>
        </button>
      </div>
      <DataTable title="Procurement Tracking" description="Manage and track outgoing purchase orders." columns={columns} data={ordersData} />
    </div>
  );
}
