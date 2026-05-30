'use client';

import { DataTable } from "@/components/shared/DataTable";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const leaveData = [
  { id: '1', name: 'Jenny Wilson', type: 'Sick Leave', start: '2024-05-01', end: '2024-05-03', status: 'Approved' },
  { id: '2', name: 'Mike Ross', type: 'Vacation', start: '2024-06-12', end: '2024-06-20', status: 'Pending' },
];

export default function LeavePage() {
  const columns = [
    { header: "Employee", accessorKey: "name" },
    { header: "Type", accessorKey: "type" },
    { header: "Start Date", accessorKey: "start" },
    { header: "End Date", accessorKey: "end" },
    { header: "Status", accessorKey: "status", cell: (item: any) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
        item.status === 'Approved' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
      )}>{item.status}</span>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Leave <span className="text-primary">Management</span></h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-xl text-white font-bold text-sm">
          <Plus className="w-4 h-4" />
          <span>Apply Leave</span>
        </button>
      </div>
      <DataTable title="Leave Requests" description="Review and manage employee time-off requests." columns={columns} data={leaveData} />
    </div>
  );
}
