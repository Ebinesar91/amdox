'use client';

import { DataTable } from "@/components/shared/DataTable";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

const resourceData = [
  { id: '1', name: 'Engineering Team A', capacity: 100, allocation: 85, lead: 'Mike Ross' },
  { id: '2', name: 'Finance Audit Group', capacity: 50, allocation: 20, lead: 'Sarah Jenkins' },
];

export default function ResourcesPage() {
  const columns = [
    { header: "Resource Group", accessorKey: "name" },
    { header: "Total Capacity", accessorKey: "capacity" },
    { header: "Current Allocation", accessorKey: "allocation", cell: (item: any) => (
       <div className="flex items-center space-x-4 w-48">
         <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
           <div className={cn("h-full", item.allocation > 80 ? "bg-rose-500" : "bg-emerald-500")} style={{ width: `${item.allocation}%` }} />
         </div>
         <span className="text-xs font-bold text-white">{item.allocation}%</span>
       </div>
    )},
    { header: "Team Lead", accessorKey: "lead" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Resource <span className="text-primary">Allocation</span></h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm">
          <Users className="w-4 h-4" />
          <span>Optimize</span>
        </button>
      </div>
      <DataTable title="Utilization Table" description="Manage workforce and infrastructure capacity." columns={columns} data={resourceData} />
    </div>
  );
}
