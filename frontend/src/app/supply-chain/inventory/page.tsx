'use client';

import { DataTable } from "@/components/shared/DataTable";
import { cn } from "@/lib/utils";
import { 
  Package, 
  AlertCircle, 
  TrendingUp, 
  Box, 
  Layers,
  ArrowRight,
  ChevronRight
} from "lucide-react";

interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  value: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const inventoryData: Product[] = [
  { sku: 'SKU-9021', name: 'Precision Logic Board v4', category: 'Electronics', stock: 1240, threshold: 200, value: 45000, status: 'In Stock' },
  { sku: 'SKU-7720', name: 'Titanium Chassis Frame', category: 'Hardware', stock: 45, threshold: 50, value: 82000, status: 'Low Stock' },
  { sku: 'SKU-1102', name: 'Optic Fiber Bundle 100m', category: 'Cables', stock: 0, threshold: 10, value: 0, status: 'Out of Stock' },
  { sku: 'SKU-4491', name: 'High-Density Battery Pack', category: 'Power', stock: 890, threshold: 100, value: 120000, status: 'In Stock' },
  { sku: 'SKU-3320', name: 'Thermal Paste Pro 50g', category: 'Consumables', stock: 12, threshold: 20, value: 350, status: 'Low Stock' },
];

export default function InventoryPage() {
  const columns = [
    { header: "Product", accessorKey: "name", cell: (item: Product) => (
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
          <Box className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">{item.name}</p>
          <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">{item.sku}</p>
        </div>
      </div>
    )},
    { header: "Category", accessorKey: "category" },
    { header: "Stock Level", accessorKey: "stock", cell: (item: Product) => (
      <div className="flex items-center space-x-4">
        <div className="flex-1 w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
           <div 
             className={cn(
               "h-full rounded-full transition-all",
               item.status === 'In Stock' ? "bg-emerald-500" :
               item.status === 'Low Stock' ? "bg-amber-500" : "bg-rose-500"
             )} 
             style={{ width: `${Math.min((item.stock / 1000) * 100, 100)}%` }} 
           />
        </div>
        <span className="text-sm font-bold text-white">{item.stock}</span>
      </div>
    )},
    { header: "Total Value", accessorKey: "value", cell: (item: Product) => (
      <span className="text-sm font-bold text-white">${item.value.toLocaleString()}</span>
    )},
    { header: "Status", accessorKey: "status", cell: (item: Product) => (
      <div className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        item.status === 'In Stock' ? "bg-emerald-500/10 text-emerald-400" :
        item.status === 'Low Stock' ? "bg-amber-500/10 text-amber-400" :
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Global <span className="text-primary">Inventory</span></h1>
          <p className="text-slate-400 mt-1 font-medium">Real-time stock tracking and warehouse management.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            Inventory Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl flex items-center space-x-6">
           <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <Layers className="w-8 h-8" />
           </div>
           <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total SKUs</p>
              <p className="text-3xl font-bold text-white mt-1">4,290</p>
           </div>
        </div>
        <div className="glass-card p-6 rounded-3xl flex items-center space-x-6">
           <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400">
              <AlertCircle className="w-8 h-8" />
           </div>
           <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-amber-400 mt-1">12</p>
           </div>
        </div>
        <div className="glass-card p-6 rounded-3xl flex items-center space-x-6">
           <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-8 h-8" />
           </div>
           <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Turnover Rate</p>
              <p className="text-3xl font-bold text-white mt-1">8.4x</p>
           </div>
        </div>
      </div>

      <DataTable 
        title="Product Catalog"
        description="Monitor stock levels across all regional warehouses."
        columns={columns}
        data={inventoryData}
      />
    </div>
  );
}
