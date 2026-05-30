'use client';

import { useState } from 'react';
import { Briefcase, Calendar, Users, DollarSign, Plus, ArrowRight, Activity, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const budgetTrend = [
  { name: 'Jan', budget: 100000, actual: 95000 },
  { name: 'Feb', budget: 200000, actual: 210000 },
  { name: 'Mar', budget: 350000, actual: 330000 },
  { name: 'Apr', budget: 500000, actual: 490000 },
  { name: 'May', budget: 700000, actual: 720000 },
];

const ganttPhases = [
  { id: '1', name: 'Requirements & Scope', start: 'May 01', end: 'May 15', progress: 100, color: 'bg-emerald-500', dependency: 'None' },
  { id: '2', name: 'Database & Architecture Design', start: 'May 16', end: 'May 30', progress: 85, color: 'bg-emerald-500', dependency: 'Phase 1' },
  { id: '3', name: 'Core ERP Modules Build', start: 'Jun 01', end: 'Jul 15', progress: 30, color: 'bg-primary', dependency: 'Phase 2' },
  { id: '4', name: 'AI Services Integration', start: 'Jul 10', end: 'Aug 05', progress: 0, color: 'bg-purple-500', dependency: 'Phase 3' },
  { id: '5', name: 'UAT & Compliance Audit', start: 'Aug 06', end: 'Aug 30', progress: 0, color: 'bg-amber-500', dependency: 'Phase 4' },
];

const utilizationData = [
  { name: 'Sarah Jenkins', role: 'Architect', projects: 2, util: 95 },
  { name: 'Robert Fox', role: 'Dev Lead', projects: 3, util: 120 }, // Over allocated
  { name: 'Cody Fisher', role: 'Developer', projects: 1, util: 80 },
  { name: 'Jenny Wilson', role: 'QA Lead', projects: 2, util: 60 },
  { name: 'Alex Sterling', role: 'Project Manager', projects: 4, util: 100 },
];

export default function ProjectsOverviewPage() {
  const [activeTab, setActiveTab] = useState<'gantt' | 'utilization' | 'costs'>('gantt');

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Project <span className="text-primary">Portfolio</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Track operational milestones, resource utilization, and cost variances in real-time.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Launch Initiative</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Total Budgeted</span>
            <p className="text-2xl font-black text-white mt-1">$1.95M</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-primary">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Actual Cost (YTD)</span>
            <p className="text-2xl font-black text-white mt-1">$1.84M</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Cost Variance</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">-$110,000</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Overall Completion</span>
            <p className="text-2xl font-black text-white mt-1">62.8%</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-purple-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => setActiveTab('gantt')}
          className={cn(
            "px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer",
            activeTab === 'gantt' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'
          )}
        >
          Gantt Chart Timeline
        </button>
        <button 
          onClick={() => setActiveTab('utilization')}
          className={cn(
            "px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer",
            activeTab === 'utilization' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'
          )}
        >
          Resource Heatmap
        </button>
        <button 
          onClick={() => setActiveTab('costs')}
          className={cn(
            "px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer",
            activeTab === 'costs' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'
          )}
        >
          Cost & Forecast Sync
        </button>
      </div>

      {/* Tab Contents */}
      <div className="glass-card p-8 rounded-3xl">
        {activeTab === 'gantt' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white">Project Schedule</h3>
              <p className="text-slate-500 text-xs mt-1">Gantt visualization and inter-module milestones dependencies.</p>
            </div>

            <div className="space-y-6">
              {ganttPhases.map((phase) => (
                <div key={phase.id} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="md:col-span-1">
                    <h4 className="font-bold text-white text-sm">{phase.name}</h4>
                    <p className="text-slate-500 text-xs mt-1">Depends on: <span className="text-slate-400 font-semibold">{phase.dependency}</span></p>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                      <span>{phase.start}</span>
                      <span>{phase.end}</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden relative">
                      <div 
                        className={cn("h-full rounded-full transition-all", phase.color)} 
                        style={{ width: `${phase.progress}%` }} 
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1 text-right">
                    <span className="text-xs text-slate-400 font-semibold">{phase.progress}% Done</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'utilization' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white">Resource Allocation Matrix</h3>
              <p className="text-slate-500 text-xs mt-1">FTE utilization rates. Red highlights indicate potential developer burnout risk.</p>
            </div>

            <div className="space-y-4">
              {utilizationData.map((res, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div>
                    <h4 className="font-bold text-white text-sm">{res.name}</h4>
                    <p className="text-slate-500 text-xs mt-1">{res.role} • {res.projects} Active Projects</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className={cn(
                      "px-3 py-1.5 rounded-xl font-black text-xs uppercase",
                      res.util > 100 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      res.util === 100 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    )}>
                      {res.util}% Load
                    </span>
                    <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden hidden md:block">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          res.util > 100 ? 'bg-rose-500' :
                          res.util === 100 ? 'bg-primary' : 'bg-emerald-500'
                        )}
                        style={{ width: `${Math.min(res.util, 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'costs' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white">Cost Burn Rate Tracking</h3>
              <p className="text-slate-500 text-xs mt-1">Slipped budget vs actual expenditure tracking.</p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={budgetTrend}>
                  <defs>
                    <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="budget" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                  <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} fill="url(#costGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
