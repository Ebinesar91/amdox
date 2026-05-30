'use client';

import { useState } from 'react';
import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

export default function APPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: apData, isLoading } = useQuery({
    queryKey: ['apData'],
    queryFn: async () => {
      const res = await fetch('/api/finance/ap');
      if (!res.ok) throw new Error('Failed to load AP data');
      return res.json();
    }
  });

  const addInvoiceMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/finance/ap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to add invoice');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apData'] });
      setShowModal(false);
      setVendor('');
      setAmount('');
      setDueDate('');
      setErrorMsg('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor.trim()) {
      setErrorMsg('Vendor name is required.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (!dueDate) {
      setErrorMsg('Due date is required.');
      return;
    }

    addInvoiceMutation.mutate({
      vendor,
      amount,
      dueDate
    });
  };

  const columns = [
    { header: "Invoice #", accessorKey: "id" },
    { header: "Vendor", accessorKey: "vendor" },
    { header: "Due Date", accessorKey: "dueDate" },
    { header: "Amount", accessorKey: "amount", cell: (item: any) => formatCurrency(item.amount) },
    { header: "Status", accessorKey: "status", cell: (item: any) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
        item.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400" : 
        item.status === 'Overdue' ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
      )}>{item.status}</span>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Accounts <span className="text-primary">Payable</span></h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-xl text-white font-bold text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Invoice</span>
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center text-slate-500 text-sm py-10 font-bold uppercase tracking-widest">
          Syncing Vendor Ledgers...
        </div>
      ) : (
        <DataTable title="Pending Invoices" description="Manage payments to your vendors." columns={columns} data={apData || []} />
      )}

      {/* Add Invoice Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0b0f19] border border-white/10 p-8 rounded-[32px] shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2">New AP Invoice</h3>
              <p className="text-slate-400 text-xs mb-6">Log incoming vendor bill with proper tax codes.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vendor Name</label>
                  <input
                    type="text"
                    required
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 4500.00"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
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
                    disabled={addInvoiceMutation.isPending}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
                  >
                    {addInvoiceMutation.isPending ? 'Logging...' : 'Add Invoice'}
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
