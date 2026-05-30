'use client';

import { DataTable } from "@/components/shared/DataTable";
import { cn } from "@/lib/utils";
import { Key, Eye, Copy, RefreshCw } from "lucide-react";

const apiKeyData = [
  { id: '1', name: 'Production Frontend', key: 'ae_live_••••••••••••4j9x', created: '2024-01-10', status: 'Active' },
  { id: '2', name: 'Finance Integration', key: 'ae_live_••••••••••••2k8y', created: '2024-03-22', status: 'Active' },
];

export default function APIKeysPage() {
  const columns = [
    { header: "Key Name", accessorKey: "name" },
    { header: "Key Value", accessorKey: "key", cell: (item: any) => (
       <div className="flex items-center space-x-2 font-mono text-slate-500 text-xs">
         <span>{item.key}</span>
         <button className="p-1 hover:text-white transition-colors"><Copy className="w-3 h-3" /></button>
       </div>
    )},
    { header: "Created", accessorKey: "created" },
    { header: "Status", accessorKey: "status", cell: (item: any) => (
      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400">{item.status}</span>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">API <span className="text-primary">Keys</span></h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-xl text-white font-bold text-sm">
          <Key className="w-4 h-4" />
          <span>Generate Key</span>
        </button>
      </div>
      <DataTable title="Security Credentials" description="Manage access keys for third-party integrations." columns={columns} data={apiKeyData} />
    </div>
  );
}
