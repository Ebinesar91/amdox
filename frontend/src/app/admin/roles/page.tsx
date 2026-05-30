'use client';

import { DataTable } from "@/components/shared/DataTable";
import { cn } from "@/lib/utils";
import { Shield, Plus } from "lucide-react";

const roleData = [
  { id: '1', name: 'SUPER_ADMIN', permissions: 'Full System Access', users: 2 },
  { id: '2', name: 'FINANCE_MANAGER', permissions: 'Read/Write Finance, Read HR', users: 12 },
  { id: '3', name: 'EMPLOYEE', permissions: 'Self Service, Project Access', users: 1200 },
];

export default function RolesPage() {
  const columns = [
    { header: "Role Name", accessorKey: "name", cell: (item: any) => <span className="font-mono text-primary font-bold">{item.name}</span> },
    { header: "Permission Level", accessorKey: "permissions" },
    { header: "Assigned Users", accessorKey: "users" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Roles & <span className="text-primary">Permissions</span></h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-xl text-white font-bold text-sm">
          <Plus className="w-4 h-4" />
          <span>New Role</span>
        </button>
      </div>
      <DataTable title="System Roles" description="Manage access control and permission sets." columns={columns} data={roleData} />
    </div>
  );
}
