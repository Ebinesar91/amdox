'use client';

import { useState } from 'react';
import { DataTable } from "@/components/shared/DataTable";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('5.0');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: vendorsData, isLoading } = useQuery({
    queryKey: ['vendorsData'],
    queryFn: async () => {
      const res = await fetch('/api/supply-chain/vendors');
      if (!res.ok) throw new Error('Failed to load vendors');
      return res.json();
    }
  });

  const addVendorMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/supply-chain/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to onboard vendor');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorsData'] });
      setShowModal(false);
      setName('');
      setEmail('');
      setRating('5.0');
      setErrorMsg('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Vendor name is required.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid vendor contact email.');
      return;
    }

    addVendorMutation.mutate({
      name,
      email,
      rating
    });
  };

  const columns = [
    { header: "Vendor Name", accessorKey: "name" },
    { header: "Contact Email", accessorKey: "email" },
    { header: "Performance Rating", accessorKey: "rating", cell: (item: any) => `${item.rating} / 5.0` },
    { header: "Status", accessorKey: "status", cell: (item: any) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
        item.status === 'Verified' || item.status === 'Active' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
      )}>{item.status}</span>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Vendor <span className="text-primary">Management</span></h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-xl text-white font-bold text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Vendor</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-slate-500 text-sm py-10 font-bold uppercase tracking-widest">
          Syncing SCM Registries...
        </div>
      ) : (
        <DataTable title="Corporate Vendors" description="Onboard and monitor supply chain vendor ratings." columns={columns} data={vendorsData || []} />
      )}

      {/* Onboard Vendor Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0b0f19] border border-white/10 p-8 rounded-[32px] shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2">Onboard Supply Chain Vendor</h3>
              <p className="text-slate-400 text-xs mb-6">Initialize vendor profiles for purchase order processing.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vendor Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sales@vendor.corp"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Initial Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
                  >
                    <option value="5.0" className="bg-[#0b0f19]">5.0 (Excellent)</option>
                    <option value="4.0" className="bg-[#0b0f19]">4.0 (Good)</option>
                    <option value="3.0" className="bg-[#0b0f19]">3.0 (Satisfactory)</option>
                  </select>
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
                    disabled={addVendorMutation.isPending}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
                  >
                    {addVendorMutation.isPending ? 'Onboarding...' : 'Onboard Vendor'}
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
