'use client';

import { useState } from 'react';
import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

export default function PayrollPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  const [bonuses, setBonuses] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: payrollData, isLoading } = useQuery({
    queryKey: ['payrollData'],
    queryFn: async () => {
      const res = await fetch('/api/hr/payroll');
      if (!res.ok) throw new Error('Failed to load payroll data');
      return res.json();
    }
  });

  const generateRunMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/hr/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to post payroll run');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrollData'] });
      setShowModal(false);
      setName('');
      setSalary('');
      setBonuses('');
      setErrorMsg('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Employee name is required.');
      return;
    }
    if (!salary || parseFloat(salary) <= 0) {
      setErrorMsg('Please enter a valid base salary.');
      return;
    }

    generateRunMutation.mutate({
      name,
      salary,
      bonuses: bonuses || '0',
      status: 'Processed'
    });
  };

  const columns = [
    { header: "Employee", accessorKey: "name" },
    { header: "Base Salary", accessorKey: "salary", cell: (item: any) => formatCurrency(item.salary) },
    { header: "Bonuses", accessorKey: "bonuses", cell: (item: any) => formatCurrency(item.bonuses) },
    { header: "Deductions (Tax)", accessorKey: "tax", cell: (item: any) => formatCurrency(item.tax) },
    { header: "Net Pay", accessorKey: "net", cell: (item: any) => <span className="font-bold text-white">{formatCurrency(item.net)}</span> },
    { header: "Status", accessorKey: "status", cell: (item: any) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
        item.status === 'Processed' ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"
      )}>{item.status}</span>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Payroll <span className="text-primary">Processing</span></h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-xl text-white font-bold text-sm cursor-pointer"
        >
          <DollarSign className="w-4 h-4" />
          <span>Generate Run</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-slate-500 text-sm py-10 font-bold uppercase tracking-widest">
          Syncing General Ledger Ledgers...
        </div>
      ) : (
        <DataTable title="Monthly Payroll Runs" description="Manage salary disbursements, tax deductions, and bonuses." columns={columns} data={payrollData || []} />
      )}

      {/* Generate Payroll Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0b0f19] border border-white/10 p-8 rounded-[32px] shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2">New Payroll Disbursement</h3>
              <p className="text-slate-400 text-xs mb-6">Process base salary, add bonuses, and auto-compute tax deductions.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employee Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base Salary ($)</label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 12000.00"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bonuses ($)</label>
                  <input
                    type="number"
                    value={bonuses}
                    onChange={(e) => setBonuses(e.target.value)}
                    placeholder="e.g. 500.00 (optional)"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold">
                    {errorMsg}
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={generateRunMutation.isPending}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
                  >
                    {generateRunMutation.isPending ? 'Generating...' : 'Generate Pay Run'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
