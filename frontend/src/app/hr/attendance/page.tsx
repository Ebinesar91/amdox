'use client';

import { DataTable } from "@/components/shared/DataTable";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

const attendanceData = [
  { id: '1', name: 'Sarah Jenkins', timeIn: '08:45 AM', timeOut: '05:30 PM', hours: 8.75, status: 'Present' },
  { id: '2', name: 'Robert Fox', timeIn: '09:00 AM', timeOut: '06:00 PM', hours: 9.00, status: 'Present' },
  { id: '3', name: 'Cody Fisher', timeIn: '-', timeOut: '-', hours: 0, status: 'Absent' },
];

export default function AttendancePage() {
  const columns = [
    { header: "Employee", accessorKey: "name" },
    { header: "Time In", accessorKey: "timeIn" },
    { header: "Time Out", accessorKey: "timeOut" },
    { header: "Total Hours", accessorKey: "hours" },
    { header: "Status", accessorKey: "status", cell: (item: any) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
        item.status === 'Present' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
      )}>{item.status}</span>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Daily <span className="text-primary">Attendance</span></h1>
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-sm font-bold flex items-center space-x-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>System Time: 02:15 PM</span>
        </div>
      </div>
      <DataTable title="Daily Logs" description="Track employee check-ins and check-outs." columns={columns} data={attendanceData} />
    </div>
  );
}
