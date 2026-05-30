'use client';

import { 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  BarChart3,
  LineChart as LineChartIcon
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { motion } from "framer-motion";

const forecastData = [
  { month: 'Jan', actual: 400, forecast: 400 },
  { month: 'Feb', actual: 450, forecast: 440 },
  { month: 'Mar', actual: 500, forecast: 480 },
  { month: 'Apr', actual: 480, forecast: 510 },
  { month: 'May', actual: 520, forecast: 550 },
  { month: 'Jun', forecast: 620 },
  { month: 'Jul', forecast: 680 },
  { month: 'Aug', forecast: 710 },
  { month: 'Sep', forecast: 690 },
];

export default function AIInsightsPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Amdox Intelligence Engine</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Predictive <span className="text-primary">Forecasting</span></h1>
          <p className="text-slate-400 mt-2 font-medium">AI-driven market analysis and demand prediction models.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
            <RefreshCw className="w-4 h-4" />
            <span>Retrain Models</span>
          </button>
          <button className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <Zap className="w-4 h-4" />
            <span>Apply Insights</span>
          </button>
        </div>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
          <div className="flex items-center space-x-3 mb-4">
             <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
               <BrainCircuit className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-white">Demand Model V4</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <span className="text-xs text-slate-500 font-medium uppercase">Accuracy Score</span>
               <span className="text-xl font-bold text-emerald-400">98.2%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "98.2%" }}
                 className="h-full bg-emerald-500" 
               />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optimized for high-volatility SKU movements in regional clusters.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center space-x-3 mb-4">
             <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
               <TrendingUp className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-white">Churn Predictor</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <span className="text-xs text-slate-500 font-medium uppercase">Confidence</span>
               <span className="text-xl font-bold text-purple-400">94.5%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "94.5%" }}
                 className="h-full bg-purple-500" 
               />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzing employee sentiment and engagement metrics for retention.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border-rose-500/20">
          <div className="flex items-center space-x-3 mb-4">
             <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
               <AlertTriangle className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-white">Risk Assessment</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <span className="text-xs text-slate-500 font-medium uppercase">Anomaly Rate</span>
               <span className="text-xl font-bold text-rose-400">0.02%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 className="h-full bg-rose-500/30" 
               />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time fraud detection active across all financial transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="glass-card p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-bold text-white">Market Demand Forecast</h3>
            <p className="text-slate-500 text-sm mt-1">Multi-variable projection for the next 4 quarters.</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
             <button className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20">Linear</button>
             <button className="px-4 py-1.5 rounded-lg text-slate-500 text-xs font-bold hover:text-white transition-all">Probabilistic</button>
          </div>
        </div>

        <div className="h-[450px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={forecastData}>
               <defs>
                 <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                 </linearGradient>
                 <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
               <XAxis 
                 dataKey="month" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fill: '#64748b', fontSize: 12 }}
               />
               <YAxis 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fill: '#64748b', fontSize: 12 }}
               />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                 itemStyle={{ color: '#fff' }}
               />
               <ReferenceLine x="May" stroke="#6366f1" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#6366f1', fontSize: 10, fontWeight: 'bold' }} />
               <Area 
                 type="monotone" 
                 dataKey="actual" 
                 stroke="#3b82f6" 
                 strokeWidth={3}
                 fillOpacity={1} 
                 fill="url(#colorActual)" 
               />
               <Area 
                 type="monotone" 
                 dataKey="forecast" 
                 stroke="#6366f1" 
                 strokeWidth={3}
                 strokeDasharray="8 8"
                 fillOpacity={1} 
                 fill="url(#colorForecast)" 
               />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Model Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-6">Top Contributing Factors</h3>
          <div className="space-y-6">
            {[
              { factor: 'Market Volatility Index', weight: 42, impact: 'High' },
              { factor: 'Quarterly Inventory Turnover', weight: 28, impact: 'Medium' },
              { factor: 'Seasonal Customer Sentiment', weight: 15, impact: 'Medium' },
              { factor: 'Logistics Lead Times', weight: 10, impact: 'Low' },
              { factor: 'Global Exchange Rates', weight: 5, impact: 'Low' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                   <span className="text-sm font-medium text-slate-300">{item.factor}</span>
                   <span className="text-xs font-bold text-primary">{item.weight}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-primary/40" style={{ width: `${item.weight}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Strategic Recommendation</h3>
            <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20">
               <p className="text-sm text-slate-300 leading-relaxed italic">
                 "Based on Q3 projections, the system recommends increasing safety stock levels for North American electronics by 15% to hedge against predicted logistics delays in October."
               </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5">
            <button className="group w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all">
               <div className="flex items-center space-x-4">
                 <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <BarChart3 className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                   <p className="text-sm font-bold text-white">Full Demand Report</p>
                   <p className="text-xs text-slate-500">24 pages • PDF • 4.2 MB</p>
                 </div>
               </div>
               <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
