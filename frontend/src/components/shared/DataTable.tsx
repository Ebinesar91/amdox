'use client';

import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  description?: string;
  onSearch?: (term: string) => void;
}

export function DataTable<T>({ columns, data, title, description }: DataTableProps<T>) {
  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      {(title || description) && (
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-slate-500 text-sm mt-1">{description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
              />
            </div>
            <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              {columns.map((col, i) => (
                <th key={i} className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors">
                    <span>{col.header}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              ))}
              <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                {columns.map((col, j) => (
                  <td key={j} className="px-8 py-5 text-sm">
                    {col.cell ? col.cell(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                  </td>
                ))}
                <td className="px-8 py-5 text-right">
                  <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-white/5 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">Showing 1 to {data.length} of 1,240 results</p>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-500 hover:text-white disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1 px-4">
            <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 text-xs font-bold">2</button>
            <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 text-xs font-bold">3</button>
            <span className="text-slate-600 px-2">...</span>
            <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 text-xs font-bold">124</button>
          </div>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-500 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
