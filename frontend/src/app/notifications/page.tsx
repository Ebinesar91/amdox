'use client';

import { useState } from 'react';
import { Bell, Mail, Smartphone, Globe, Settings, Terminal, Play, CheckCircle, RefreshCw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Alert {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'System' | 'Finance' | 'Security' | 'Webhook';
  status: 'Delivered' | 'Failed' | 'Retrying';
  retries: number;
}

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', title: 'System Update', message: 'Version 2.4.1 has been successfully deployed.', time: '2h ago', type: 'System', status: 'Delivered', retries: 0 },
    { id: '2', title: 'New Invoice Approved', message: 'Invoice #INV-9021 from Amazon Web Services approved.', time: '4h ago', type: 'Finance', status: 'Delivered', retries: 0 },
    { id: '3', title: 'Security Alert', message: 'New login from unknown device in Singapore.', time: '1d ago', type: 'Security', status: 'Delivered', retries: 0 },
    { id: '4', title: 'Stripe Webhook Delivery Failed', message: 'Failed to deliver webhook payload to endpoint api/v1/stripe.', time: '3d ago', type: 'Webhook', status: 'Failed', retries: 5 },
  ]);

  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    inApp: true,
    webhooks: true,
  });

  const [dlqLog, setDlqLog] = useState<string[]>([
    "[10:32:05] Webhook stripe_payment_intent_failed failed validation after 5 retries. Sent to DLQ.",
    "[08:15:11] SMS notification to +18593029 failed due to provider route error. Sent to DLQ."
  ]);

  const triggerMockNotification = () => {
    const newAlert: Alert = {
      id: Math.random().toString(),
      title: 'Real-time ERP Event',
      message: 'Finance department generated general ledger Trial Balance report.',
      time: 'Just now',
      type: 'Finance',
      status: 'Delivered',
      retries: 0
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const retryFailedAlert = (id: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: 'Retrying', retries: a.retries + 1 };
      }
      return a;
    }));

    setTimeout(() => {
      setAlerts(prev => prev.map(a => {
        if (a.id === id) {
          return { ...a, status: 'Delivered' };
        }
        return a;
      }));
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Notification <span className="text-primary">Center</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Manage corporate alerts, webhook logs, and automated retry workers.</p>
        </div>
        <button 
          onClick={triggerMockNotification}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4" />
          <span>Simulate Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Alerts and Logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="font-bold text-white mb-6 text-lg">Active System Alerts</h3>
            
            <div className="space-y-4">
              <AnimatePresence>
                {alerts.map((n) => (
                  <motion.div 
                    key={n.id} 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-start space-x-4 hover:bg-white/[0.08] transition-all"
                  >
                    <div className={cn(
                      "p-3 rounded-xl bg-white/5 border border-white/10",
                      n.type === 'Finance' ? 'text-emerald-400' :
                      n.type === 'Security' ? 'text-rose-400' : 'text-primary'
                    )}>
                      {n.type === 'Finance' ? <Mail className="w-5 h-5" /> : 
                       n.type === 'Security' ? <Smartphone className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm">{n.title}</h4>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{n.time}</span>
                      </div>
                      <p className="text-slate-400 mt-2 text-xs leading-relaxed">{n.message}</p>
                      
                      <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <div className="flex items-center space-x-4">
                          <span className="text-slate-500">{n.type}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full",
                            n.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                            n.status === 'Failed' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                          )}>
                            {n.status}
                          </span>
                        </div>
                        {n.status === 'Failed' && (
                          <button 
                            onClick={() => retryFailedAlert(n.id)}
                            className="flex items-center space-x-1 text-primary hover:underline cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3 animate-spin-slow" />
                            <span>Retry Run ({n.retries}/5)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Queue & DLQ logs */}
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <Terminal className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-white text-lg">Dead Letter Queue (DLQ) Log</h3>
            </div>
            
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-slate-400 space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
              {dlqLog.map((log, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-rose-500">[WARN]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Preferences */}
        <div className="glass-card p-6 rounded-3xl h-fit space-y-6">
          <div>
            <h3 className="font-bold text-white text-lg">Alert Preferences</h3>
            <p className="text-slate-500 text-xs mt-1">Configure global notification routes.</p>
          </div>

          <div className="space-y-4">
            {[
              { id: 'email', name: 'Email Channels', desc: 'Notify on high value transactions.', val: preferences.email },
              { id: 'sms', name: 'SMS Notifications', desc: 'MFA logs and key infrastructure warnings.', val: preferences.sms },
              { id: 'inApp', name: 'In-App Alerts', desc: 'Display realtime notification tray banner.', val: preferences.inApp },
              { id: 'webhooks', name: 'Outgoing Webhooks', desc: 'Sync state changes with remote HTTP gateways.', val: preferences.webhooks },
            ].map((p) => (
              <div key={p.id} className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <h4 className="font-bold text-white text-xs">{p.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{p.desc}</p>
                </div>
                <button
                  onClick={() => setPreferences(prev => ({ ...prev, [p.id]: !p.val }))}
                  className={cn(
                    "w-10 h-6 rounded-full p-1 transition-all duration-300 relative cursor-pointer",
                    p.val ? 'bg-primary' : 'bg-white/10'
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white transition-all",
                    p.val ? 'translate-x-4' : 'translate-x-0'
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
