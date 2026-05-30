'use client';

import { Settings, Globe, Shield, Bell, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const sections = [
    { title: "General Settings", icon: Globe, description: "Organization name, logo, and primary contact." },
    { title: "Security & Auth", icon: Shield, description: "SSO configuration, MFA, and password policies." },
    { title: "Notifications", icon: Bell, description: "Configure system alerts and email templates." },
    { title: "Data Management", icon: Database, description: "Backup settings, audit logs retention, and exports." },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold text-white tracking-tight">System <span className="text-primary">Settings</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl hover:border-primary/40 transition-all cursor-pointer group">
            <div className="flex items-center space-x-4 mb-4">
               <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <section.icon className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-white">{section.title}</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">{section.description}</p>
            <div className="mt-6 flex items-center text-primary text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
               <span>Configure Now</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 rounded-3xl border-rose-500/20 bg-rose-500/5 mt-8">
         <h3 className="text-xl font-bold text-rose-500">Danger Zone</h3>
         <p className="text-slate-500 text-sm mt-2">Actions here are irreversible and impact the entire system.</p>
         <button className="mt-6 px-6 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all">
            Purge System Logs
         </button>
      </div>
    </div>
  );
}
