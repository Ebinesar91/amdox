'use client';

import { Search, Bell, Menu, User, Globe, ChevronDown, Command } from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Topbar() {
  const { sidebarCollapsed } = useUIStore();
  const { user, tenant } = useAuthStore();

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 z-40 h-20 glass-darker border-b border-white/10 transition-all duration-300 flex items-center justify-between px-8",
        sidebarCollapsed ? "left-20" : "left-[280px]"
      )}
    >
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all"
            placeholder="Search records, invoices, AI insights..."
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-slate-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Tenant Switcher */}
        <button className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-300">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold">{tenant?.name}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
            <p className="text-[10px] font-medium text-primary uppercase mt-1 tracking-wider">{user?.role.replace('_', ' ')}</p>
          </div>
          <button className="relative h-10 w-10 rounded-xl overflow-hidden border-2 border-primary/20 hover:border-primary transition-all">
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
