'use client';

import { DataTable } from "@/components/shared/DataTable";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  ShieldCheck, 
  Globe, 
  Zap, 
  MoreVertical,
  Key
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  plan: 'Enterprise' | 'Business' | 'Growth';
  users: number;
  region: string;
  status: 'Active' | 'Suspended' | 'Trial';
  joinedAt: string;
}

const tenantData: Tenant[] = [
  { id: 'T-1001', name: 'Global Logistics Inc', plan: 'Enterprise', users: 1450, region: 'US-East-1', status: 'Active', joinedAt: '2023-01-12' },
  { id: 'T-1002', name: 'Quantum Research Lab', plan: 'Enterprise', users: 890, region: 'EU-West-2', status: 'Active', joinedAt: '2023-04-20' },
  { id: 'T-1003', name: 'Apex Retail Solutions', plan: 'Business', users: 240, region: 'APAC-South-1', status: 'Active', joinedAt: '2023-08-05' },
  { id: 'T-1004', name: 'Stellar FinTech', plan: 'Growth', users: 12, region: 'US-West-2', status: 'Trial', joinedAt: '2024-05-01' },
  { id: 'T-1005', name: 'Heritage Bank Corp', plan: 'Enterprise', users: 5600, region: 'US-East-1', status: 'Suspended', joinedAt: '2022-11-30' },
];

export default function TenantManagementPage() {
  const columns = [
    { header: "Organization", accessorKey: "name", cell: (item: Tenant) => (
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <Building2 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">{item.name}</p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">{item.id}</p>
        </div>
      </div>
    )},
    { header: "Subscription", accessorKey: "plan", cell: (item: Tenant) => (
      <span className={cn(
        "text-xs font-bold px-2.5 py-1 rounded-lg border",
        item.plan === 'Enterprise' ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
        item.plan === 'Business' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
        "bg-slate-500/10 border-slate-500/20 text-slate-400"
      )}>
        {item.plan}
      </span>
    )},
    { header: "Region", accessorKey: "region", cell: (item: Tenant) => (
       <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
         <Globe className="w-3.5 h-3.5" />
         <span>{item.region}</span>
       </div>
    )},
    { header: "Users", accessorKey: "users", cell: (item: Tenant) => (
      <span className="text-sm font-bold text-white">{item.users.toLocaleString()}</span>
    )},
    { header: "Status", accessorKey: "status", cell: (item: Tenant) => (
      <div className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        item.status === 'Active' ? "bg-emerald-500/10 text-emerald-400" :
        item.status === 'Trial' ? "bg-blue-500/10 text-blue-400" :
        "bg-rose-500/10 text-rose-400"
      )}>
        {item.status}
      </div>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tenant <span className="text-primary">Management</span></h1>
          <p className="text-slate-400 mt-1 font-medium">Super Admin control panel for SaaS multi-tenancy.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
            <Key className="w-4 h-4" />
            <span>Master Keys</span>
          </button>
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <Zap className="w-4 h-4" />
            <span>New Provision</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl glass border-primary/20">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Tenants</p>
          <p className="text-3xl font-bold text-white mt-2">1,248</p>
        </div>
        <div className="p-6 rounded-3xl glass border-white/5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Users</p>
          <p className="text-3xl font-bold text-white mt-2">842k</p>
        </div>
        <div className="p-6 rounded-3xl glass border-white/5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Health</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">99.9%</p>
        </div>
        <div className="p-6 rounded-3xl glass border-white/5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Revenue (ARR)</p>
          <p className="text-3xl font-bold text-white mt-2">$14.2M</p>
        </div>
      </div>

      <DataTable 
        title="Tenant Registry"
        description="Monitor and manage all corporate accounts on the Amdox platform."
        columns={columns}
        data={tenantData}
      />
    </div>
  );
}
