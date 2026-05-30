'use client';

import { 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp, 
  Activity,
  BrainCircuit
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';

export default function DashboardPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      return res.json();
    },
    refetchOnWindowFocus: false
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Ledger Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Executive <span className="text-primary">Overview</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Welcome back, Alex. Live operational data loaded dynamically from PostgreSQL.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
          >
            Force Sync
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
            Customize
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Revenue" 
          value={data.kpis.revenue.value} 
          change={data.kpis.revenue.change} 
          trend="up" 
          icon={DollarSign}
          description="vs. last quarter"
        />
        <KPICard 
          title="Active Employees" 
          value={data.kpis.employees.value.toString()} 
          change={data.kpis.employees.change} 
          trend="up" 
          icon={Users}
          description="12 new this month"
        />
        <KPICard 
          title="Inventory Value" 
          value={data.kpis.inventory.value} 
          change={data.kpis.inventory.change} 
          trend="down" 
          icon={Package}
          description="Stock optimization active"
        />
        <KPICard 
          title="Operational ROI" 
          value={data.kpis.roi.value} 
          change={data.kpis.roi.change} 
          trend="up" 
          icon={TrendingUp}
          description="Exceeding target"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Revenue Performance</h3>
              <p className="text-slate-500 text-sm mt-1">Real-time revenue tracking vs AI forecasting</p>
            </div>
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded-full bg-primary" />
                 <span className="text-xs text-slate-400">Actual</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-3 h-3 rounded-full bg-primary/30" />
                 <span className="text-xs text-slate-400">AI Forecast</span>
               </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#08080a', 
                    border: '1px solid #1e1e24', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ffffff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="glass-card p-8 rounded-3xl bg-white/[0.02] border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <BrainCircuit className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">AI Insights</h3>
          </div>
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-start justify-between">
                <p className="text-sm font-bold text-white">Demand Spike Alert</p>
                <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-bold">URGENT</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                SCM module predicts a 24% increase in SKU-902 demand in the APAC region next month.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <p className="text-sm font-bold text-white">Cost Optimization</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Cloud infrastructure spending is 12% over budget. Recommending spot instance migration.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <p className="text-sm font-bold text-white">Hiring Velocity</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Recruitment for the "Quantum Project" is lagging. Suggesting AI-assisted resume screening.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Global Activity Feed</h3>
            <button className="text-slate-400 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {data.activities.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-4">
                  <div className={cn("p-2.5 rounded-xl bg-white/5 border border-white/10", item.color)}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.user}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.action}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-600 font-medium">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Allocation */}
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-8">Resource Allocation</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.distributionData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#fff', fontSize: 12, fontWeight: 'bold' }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#08080a', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.distributionData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Headcount</p>
              <p className="text-2xl font-bold text-white mt-1">{data.kpis.employees.value}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Utilization Rate</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">94.2%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
