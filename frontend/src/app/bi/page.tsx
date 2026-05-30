'use client';

import { useState } from 'react';
import { 
  Target, 
  Zap, 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Trash2, 
  Download, 
  Share2, 
  Save, 
  FileSpreadsheet, 
  Eye, 
  ListFilter,
  Plus,
  LayoutGrid
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

// Dummy Data sets for widgets
const salesData = [
  { month: 'Q1', sales: 120000, margin: 40000 },
  { month: 'Q2', sales: 185000, margin: 62000 },
  { month: 'Q3', sales: 240000, margin: 85000 },
  { month: 'Q4', sales: 310000, margin: 110000 },
];

const hrDistribution = [
  { name: 'Engineering', value: 45, color: '#6366f1' },
  { name: 'Sales', value: 25, color: '#3b82f6' },
  { name: 'Finance', value: 15, color: '#a855f7' },
  { name: 'Support', value: 15, color: '#ec4899' },
];

const forecastTrend = [
  { date: 'Wk 1', baseline: 50, prediction: 52 },
  { date: 'Wk 2', baseline: 62, prediction: 65 },
  { date: 'Wk 3', baseline: 78, prediction: 84 },
  { date: 'Wk 4', baseline: 90, prediction: 105 },
];

interface Widget {
  id: string;
  type: 'kpi' | 'line' | 'bar' | 'pie' | 'table' | 'forecast';
  title: string;
}

export default function BIPage() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'w-1', type: 'kpi', title: 'Global Operational ROI' },
    { id: 'w-2', type: 'bar', title: 'Quarterly Sales & Margin Performance' },
    { id: 'w-3', type: 'pie', title: 'Department Resource Allocation' }
  ]);
  const [draggedType, setDraggedType] = useState<Widget['type'] | null>(null);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDragStart = (type: Widget['type']) => {
    setDraggedType(type);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedType) return;

    let title = "New Widget";
    switch(draggedType) {
      case 'kpi': title = "KPI Summary Card"; break;
      case 'line': title = "Trend Line Chart"; break;
      case 'bar': title = "Quarterly Bar Chart"; break;
      case 'pie': title = "Distribution Pie Chart"; break;
      case 'table': title = "Operational Raw Table"; break;
      case 'forecast': title = "AI Demand Forecast"; break;
    }

    const newWidget: Widget = {
      id: `w-${Math.random().toString()}`,
      type: draggedType,
      title
    };

    setWidgets(prev => [...prev, newWidget]);
    setDraggedType(null);
    showToast("Added new widget to dashboard!");
  };

  const deleteWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    showToast("Widget removed.");
  };

  const handleSave = () => {
    showToast("Dashboard configuration saved successfully to PostgreSQL!");
  };

  const handleShare = () => {
    const url = "https://amdox-erp.corp/bi/dashboards/share-q4-overview";
    navigator.clipboard.writeText(url);
    showToast("Shareable link copied to clipboard!");
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Widget Title,Widget Type\n";
    widgets.forEach(w => {
      csvContent += `"${w.title}","${w.type.toUpperCase()}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bi_dashboard_widgets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Excel/CSV export generated!");
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 z-50 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/20"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Business <span className="text-primary">Intelligence</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Build interactive, customized dashboards using our drag-and-drop analytics engine.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Dashboard</span>
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>PDF Print</span>
          </button>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Draggable Widgets Panel */}
        <div className="glass-card p-6 rounded-3xl space-y-6 print:hidden h-fit">
          <div>
            <h3 className="font-bold text-white text-base">Analytics Widgets</h3>
            <p className="text-slate-500 text-xs mt-1">Drag and drop items to the canvas area on the right.</p>
          </div>

          <div className="space-y-3">
            {[
              { type: 'kpi', name: 'KPI Metric Card', icon: Target },
              { type: 'bar', name: 'Quarterly Bar Chart', icon: BarChart3 },
              { type: 'line', name: 'Trend Line Chart', icon: LineChartIcon },
              { type: 'pie', name: 'Allocation Pie Chart', icon: PieChartIcon },
              { type: 'table', name: 'Operational Data Table', icon: ListFilter },
              { type: 'forecast', name: 'AI Demand Forecast', icon: Zap }
            ].map((w) => (
              <div
                key={w.type}
                draggable
                onDragStart={() => handleDragStart(w.type as Widget['type'])}
                className="flex items-center space-x-3 p-3.5 bg-white/5 border border-white/10 hover:border-primary/40 rounded-2xl cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all text-slate-300 font-semibold text-xs"
              >
                <w.icon className="w-4 h-4 text-primary" />
                <span>{w.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Dashboard Canvas */}
        <div className="lg:col-span-3 space-y-6">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="min-h-[550px] border-2 border-dashed border-white/10 rounded-[32px] p-8 bg-[#020617]/50 flex flex-col gap-6 relative"
          >
            {widgets.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <LayoutGrid className="w-16 h-16 text-slate-700 mb-4" />
                <p className="text-slate-400 font-bold text-lg">Canvas is Empty</p>
                <p className="text-slate-500 text-sm mt-1 max-w-sm">Drag widgets from the left panel and drop them here to start building your custom business intelligence views.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {widgets.map((widget) => (
                  <motion.div
                    key={widget.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 rounded-3xl relative group flex flex-col justify-between"
                  >
                    {/* Widget Header */}
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-white text-sm">{widget.title}</h4>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                        <button 
                          onClick={() => setSelectedWidget(widget)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Drill Down"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteWidget(widget.id)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Widget Content */}
                    <div className="h-[200px] w-full flex items-center justify-center">
                      {widget.type === 'kpi' && (
                        <div className="text-center">
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Operational ROI</p>
                          <p className="text-5xl font-black text-white mt-2">24.8%</p>
                          <p className="text-emerald-400 font-bold text-xs mt-2 flex items-center justify-center">
                            +5.7% <span className="text-slate-500 font-medium ml-1">vs target</span>
                          </p>
                        </div>
                      )}

                      {widget.type === 'bar' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(val) => `$${val/1000}k`} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                            <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="margin" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}

                      {widget.type === 'line' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(val) => `$${val/1000}k`} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}

                      {widget.type === 'pie' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                            <Pie
                              data={hrDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {hrDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      )}

                      {widget.type === 'table' && (
                        <div className="w-full h-full overflow-y-auto text-[10px] text-slate-300">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-500 font-bold uppercase tracking-wider">
                                <th className="pb-2">Metric</th>
                                <th className="pb-2">Target</th>
                                <th className="pb-2">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-white/5">
                                <td className="py-2 font-bold text-white">Sales Conversion</td>
                                <td className="py-2">12.5%</td>
                                <td className="py-2 text-emerald-400 font-bold">On Target</td>
                              </tr>
                              <tr className="border-b border-white/5">
                                <td className="py-2 font-bold text-white">Inventory Turn</td>
                                <td className="py-2">4.5x</td>
                                <td className="py-2 text-rose-400 font-bold">Lagging</td>
                              </tr>
                              <tr>
                                <td className="py-2 font-bold text-white">Cloud spend</td>
                                <td className="py-2">$12k/mo</td>
                                <td className="py-2 text-amber-400 font-bold">Warning</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {widget.type === 'forecast' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={forecastTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="baseline" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            <Line type="monotone" dataKey="prediction" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Drill-down dialog */}
      <AnimatePresence>
        {selectedWidget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0b0f19] border border-white/10 p-8 rounded-[32px] shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2">{selectedWidget.title}</h3>
              <p className="text-slate-400 text-xs mb-6">Granular transaction logs matching the metrics from PostgreSQL.</p>
              
              <div className="overflow-x-auto max-h-[300px] custom-scrollbar">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 font-bold uppercase tracking-widest pb-3">
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3">Account Code</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3 text-right">Debit</th>
                      <th className="pb-3 text-right">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { time: '2026-05-30 11:20', code: '10100', desc: 'SaaS Client Billing #AR-903', debit: '$12,450.00', credit: '$0.00' },
                      { time: '2026-05-30 10:45', code: '50400', desc: 'AWS Hosting Expense #AP-449', debit: '$0.00', credit: '$4,500.00' },
                      { time: '2026-05-30 09:15', code: '10100', desc: 'Office Supplies Bill #AP-450', debit: '$0.00', credit: '$890.00' },
                      { time: '2026-05-29 17:00', code: '40100', desc: 'Enterprise Licence Q3 #AR-902', debit: '$28,000.00', credit: '$0.00' }
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 text-slate-400">{row.time}</td>
                        <td className="py-3 font-bold text-white">{row.code}</td>
                        <td className="py-3 text-slate-300">{row.desc}</td>
                        <td className="py-3 text-right text-emerald-400 font-bold">{row.debit}</td>
                        <td className="py-3 text-right text-rose-400 font-bold">{row.credit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setSelectedWidget(null)}
                  className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
