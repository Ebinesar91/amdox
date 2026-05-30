'use client';

import { useState } from 'react';
import { DataTable } from "@/components/shared/DataTable";
import { ShieldCheck, AlertTriangle, FileText, Trash2, Download, CheckCircle, HelpCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AuditLog {
  id: string;
  user: string;
  action: string;
  date: string;
  severity: 'Low' | 'Medium' | 'High';
}

interface GDPRRequest {
  id: string;
  email: string;
  type: 'Export' | 'Erasure';
  status: 'Pending' | 'Completed' | 'Rejected';
  date: string;
}

export default function CompliancePage() {
  const [showGdprModal, setShowGdprModal] = useState(false);
  const [gdprEmail, setGdprEmail] = useState('');
  const [gdprType, setGdprType] = useState<'Export' | 'Erasure'>('Export');
  const [gdprReason, setGdprReason] = useState('');
  const [gdprAgreed, setGdprAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'LOG-441', user: 'Admin', action: 'Modified Tenant Billing Configs', date: '2026-05-30 10:24 AM', severity: 'Medium' },
    { id: 'LOG-442', user: 'Sarah Jenkins', action: 'Exported Financial Profit & Loss ledger', date: '2026-05-30 11:45 AM', severity: 'High' },
    { id: 'LOG-443', user: 'System', action: 'Automated Daily database backup to S3', date: '2026-05-30 12:00 PM', severity: 'Low' },
    { id: 'LOG-444', user: 'Robert Fox', action: 'Created Purchase Order #PO-8820', date: '2026-05-30 02:15 PM', severity: 'Low' },
  ]);

  const [gdprRequests, setGdprRequests] = useState<GDPRRequest[]>([
    { id: 'REQ-001', email: 'former.employee@amdox.corp', type: 'Erasure', status: 'Completed', date: '2026-05-15' },
    { id: 'REQ-002', email: 'external.auditor@gmail.com', type: 'Export', status: 'Completed', date: '2026-05-20' },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGdprSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprEmail || !gdprEmail.includes('@')) {
      setErrorMsg('Please enter a valid corporate email.');
      return;
    }
    if (!gdprAgreed) {
      setErrorMsg('You must acknowledge the data privacy terms.');
      return;
    }

    const newRequest: GDPRRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      email: gdprEmail,
      type: gdprType,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    setGdprRequests(prev => [newRequest, ...prev]);

    // Log the GDPR request submission as a system audit event
    const newAuditLog: AuditLog = {
      id: `LOG-${Math.floor(445 + Math.random() * 100)}`,
      user: 'System / Auth',
      action: `GDPR ${gdprType} Request Submitted by ${gdprEmail}`,
      date: new Date().toLocaleString(),
      severity: gdprType === 'Erasure' ? 'High' : 'Medium'
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);

    setShowGdprModal(false);
    setGdprEmail('');
    setGdprReason('');
    setGdprAgreed(false);
    setErrorMsg('');
    showToast(`GDPR ${gdprType} request submitted successfully.`);
  };

  const auditColumns = [
    { header: "Log ID", accessorKey: "id" },
    { header: "User", accessorKey: "user" },
    { header: "Action", accessorKey: "action" },
    { header: "Timestamp", accessorKey: "date" },
    { header: "Severity", accessorKey: "severity", cell: (item: any) => (
      <span className={cn(
        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
        item.severity === 'High' ? "bg-rose-500/10 text-rose-400" :
        item.severity === 'Medium' ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
      )}>{item.severity}</span>
    )},
  ];

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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Compliance & <span className="text-primary">Audit</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Verify ISO 27001 adherence, fulfill GDPR rights, and inspect immutable audit logs.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowGdprModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Fulfill GDPR Request</span>
          </button>
          <button 
            onClick={() => showToast("Exported ISO 27001 Security Audit compliance report.")}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/10 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export ISO Audit</span>
          </button>
        </div>
      </div>

      {/* Security Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card flex items-center space-x-5">
          <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Policy Violations</p>
            <p className="text-3xl font-black text-white mt-1">0</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card flex items-center space-x-5">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Security Health Score</p>
            <p className="text-3xl font-black text-white mt-1">99.8%</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card flex items-center space-x-5">
          <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Audited Frameworks</p>
            <p className="text-3xl font-black text-white mt-1">GDPR & ISO</p>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <DataTable title="Immutable Audit Logs" description="Real-time transaction logging capturing DB operations, session authentications, and data exports." columns={auditColumns} data={auditLogs} />

      {/* GDPR Data Requests Log */}
      <div className="glass-card p-8 rounded-3xl">
        <h3 className="text-xl font-bold text-white mb-2">GDPR Data Requests Queue</h3>
        <p className="text-slate-500 text-xs mb-6">Track execution of Right to Portability (Export) and Right to be Forgotten (Erasure).</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-500 font-bold uppercase tracking-widest pb-3">
                <th className="pb-3">Request ID</th>
                <th className="pb-3">Subject Email</th>
                <th className="pb-3">Request Type</th>
                <th className="pb-3">Submission Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {gdprRequests.map((req) => (
                <tr key={req.id} className="border-b border-white/5">
                  <td className="py-3 font-bold text-white">{req.id}</td>
                  <td className="py-3 text-slate-300">{req.email}</td>
                  <td className="py-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-xl text-[10px] font-black uppercase border",
                      req.type === 'Erasure' ? 'bg-rose-500/5 text-rose-400 border-rose-500/20' : 'bg-primary/5 text-primary border-primary/20'
                    )}>
                      {req.type}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{req.date}</td>
                  <td className="py-3">
                    <span className={cn(
                      "font-bold text-xs flex items-center space-x-1.5",
                      req.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", req.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500')} />
                      <span>{req.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GDPR Modal */}
      <AnimatePresence>
        {showGdprModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0b0f19] border border-white/10 p-8 rounded-[32px] shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2">GDPR Subject Request Form</h3>
              <p className="text-slate-400 text-xs mb-6">File a legal data privacy request under GDPR regulations.</p>
              
              <form onSubmit={handleGdprSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subject Email</label>
                  <input
                    type="email"
                    required
                    value={gdprEmail}
                    onChange={(e) => setGdprEmail(e.target.value)}
                    placeholder="subject@amdox.corp"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Request Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGdprType('Export')}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                        gdprType === 'Export' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-slate-400'
                      )}
                    >
                      Export (Portability)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGdprType('Erasure')}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                        gdprType === 'Erasure' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' : 'bg-white/5 border-white/10 text-slate-400'
                      )}
                    >
                      Erasure (Forgotten)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legal Justification / Reason</label>
                  <textarea
                    rows={3}
                    value={gdprReason}
                    onChange={(e) => setGdprReason(e.target.value)}
                    placeholder="Details about request context..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all resize-none"
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy-chk"
                    checked={gdprAgreed}
                    onChange={(e) => setGdprAgreed(e.target.checked)}
                    className="mt-1 accent-primary"
                  />
                  <label htmlFor="privacy-chk" className="text-[10px] text-slate-400 leading-normal select-none">
                    I verify that I have verified the identity of this data subject and am legally authorized to trigger {gdprType === 'Erasure' ? 'permanent erasure' : 'full export'} of their database records.
                  </label>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold">
                    {errorMsg}
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-8">
                  <button 
                    type="button"
                    onClick={() => setShowGdprModal(false)}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
                  >
                    Submit Request
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
